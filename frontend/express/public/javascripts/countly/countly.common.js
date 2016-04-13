(function (countlyCommon, $, undefined) {

    // Private Properties
    var _period = (store.get("countly_date")) ? store.get("countly_date") : "30days";

    // Public Properties
    countlyCommon.ACTIVE_APP_KEY = 0;
    countlyCommon.ACTIVE_APP_ID = 0;
    countlyCommon.BROWSER_LANG = jQuery.i18n.browserLang() || "en-US";
    countlyCommon.BROWSER_LANG_SHORT = countlyCommon.BROWSER_LANG.split("-")[0];

    countlyCommon.periodObj = getPeriodObj();

    if (store.get("countly_active_app")) {
        if (countlyGlobal['apps'][store.get("countly_active_app")]) {
            countlyCommon.ACTIVE_APP_KEY = countlyGlobal['apps'][store.get("countly_active_app")].key;
            countlyCommon.ACTIVE_APP_ID = store.get("countly_active_app");
        }
    }

    if (store.get("countly_lang")) {
        var lang = store.get("countly_lang");
        countlyCommon.BROWSER_LANG_SHORT = lang;
        countlyCommon.BROWSER_LANG = lang;
    }

    // Public Methods

    countlyCommon.setPeriod = function (period) {
        _period = period;
        countlyCommon.periodObj = getPeriodObj();
        store.set("countly_date", period);
    };

    countlyCommon.getPeriod = function () {
        return _period;
    };

    countlyCommon.getPeriodForAjax = function () {
        if (Object.prototype.toString.call(_period) === '[object Array]'){
            return JSON.stringify(_period);
        } else {
            return _period;
        }
    };

    countlyCommon.setActiveApp = function (appId) {  
        countlyCommon.ACTIVE_APP_KEY = countlyGlobal['apps'][appId].key;
        countlyCommon.ACTIVE_APP_ID = appId;
        store.set("countly_active_app", appId);
    };


    // Calculates the percent change between previous and current values.
    // Returns an object in the following format {"percent": "20%", "trend": "u"}
    countlyCommon.getPercentChange = function (previous, current) {
        var pChange = 0,
            trend = "";

        if (previous == 0) {
            pChange = "NA";
            trend = "u"; //upward
        } else if (current == 0) {
            pChange = "∞";
            trend = "d"; //downward
        } else {
            var change = (((current - previous) / previous) * 100).toFixed(1);
            pChange = countlyCommon.getShortNumber(change) + "%";

            if (change < 0) {
                trend = "d";
            } else {
                trend = "u";
            }
        }

        return {"percent":pChange, "trend":trend};
    };

    // Fetches nested property values from an obj.
    countlyCommon.getDescendantProp = function (obj, path, def) {
        for (var i = 0, path = (path + "").split('.'), len = path.length; i < len; i++) {
            if(!obj || typeof obj !== 'object') return def;
            obj = obj[path[i]];
        }

        if(obj === undefined) return def;
        return obj;
    };

    // Draws a graph with the given dataPoints to container. Used for drawing bar and pie charts.
    countlyCommon.drawGraph = function (dataPoints, container, graphType, width, height) {
        _.defer(function(){

            console.log("========== drawGraph ==========");
            console.log(dataPoints);

            var get_domain = function(data) {

                // Requires that at least one series contains some data
                var yMin = +Infinity;
            		var yMax = -Infinity;

            		data.forEach( function(d) {

            				var y = d.t;

            				if (y < yMin) yMin = y;
            				if (y > yMax) yMax = y;

            		});

            		return { y: [yMin, yMax] };
            };

            var margin = {top: 20, right: 150, bottom: 30, left: 40};
            //var height = 500 - margin.top - margin.bottom;

            var bars_margin_bottom = 40;
            var text_height = 20;

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1);

            var yold = d3.scale.linear()
                .range([height - bars_margin_bottom, 0]);


            /*var y = d3.scale.linear()
                    .range([0, 100]);*/


            //var y = d3.scale.log(10000).range([height - bars_margin_bottom, 0]);
            var y_scale_circle = d3.scale.log(10).range([0, 30]);

            //var y_scale_log = d3.scale.log().range([height - bars_margin_bottom, 0]);

            /*var y = d3.scale.log()
                .base(10)
                .domain([1, 50000])
                .range([0, 300]);*/

//console.log("============== y =================");
            //console.log(y);
            //console.log(y(10000));

            x.domain(dataPoints.map(function(d) { return d.f; }));
            //y.domain([0, d3.max(dataPoints, function(d) { return d.t; })]);
            y_scale_circle.domain([1, d3.max(dataPoints, function(d) { return d.t; })]).nice();
            //y_scale_log.domain([1, 10000, d3.max(dataPoints, function(d) { return d.t; })]).nice();
            //yold.domain([0, d3.max(dataPoints, function(d) { return d.t; })]);


            var y_scale_log = d3.scale.log()
                .domain([1, d3.max(dataPoints, function(d) { return d.t; })]).nice()
                .range([height - bars_margin_bottom, 0])
                /*.base(10)*/


            //var chart = d3.select(".chart");

            console.log("----------- this.chart --------------");
            console.log(this.chart);

            if (!this.chart)
            {
                this.chart = d3.select(container)
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            //var barWidth = width / dataPoints.length;
            var one_bar_width = 40;
            var all_bars_width = one_bar_width * dataPoints.length;
            var bar_space = (width - all_bars_width) / (dataPoints.length * 2 - 1);

            var tooltip_height = 70;
            var tooltip_width = 70;
            var tooltip_margin_bottom = 10;

            var domain = get_domain(dataPoints);

            var total_count = 0;
            dataPoints.forEach(function(element){
                total_count += element.t;
            });

            console.log("total_count:", total_count);

            var bar = this.chart.selectAll("g")
                            .data(dataPoints)
                            .enter().append("g")
                                .attr("transform", function(d, i) {
                                    return "translate(" + parseInt(i * (bar_space * 2 + one_bar_width) + bar_space) + ",0)";
                                })

            bar.append("rect")
                /*.attr("d", function(d){
                    //var xv = height - y(d.t) - bars_margin_bottom;
                    var yv = y(d.t);
                    var height = height - y(d.t) - bars_margin_bottom;
                    return rightRoundedRect(0, yv, one_bar_width, height, 6);
                })*/
                .attr("y", function(d) { return y_scale_log(d.t); })
                .attr("height", function(d) { return height - y_scale_log(d.t) - bars_margin_bottom; })
                .attr("width", one_bar_width - 1)
                .style("fill", function(d) {
                    return d.color;
                })

            var checkbox = bar.append("rect")
                .attr("transform", function(d, i) {
                    return "translate(20,310)";
                })
                .attr("height", 10)
                .attr("width", 10)
                .style("fill", function(d) {
                    return "red";
                }).on("click", function(d, i)
                {

                    console.log("---------- mouseclick ------------");

                });
/*
                bar.append("g")
                    .attr("transform", function(d, i) {
                        return "translate(20,330)";
                    })
                    .html("<g class='tick_wrp'><g class='tick'><g class='tick_img'>test</g></g></g>");*/



/*
            bar.append("circle")
                    /*.attr("d", function(d){
                        //var xv = height - y(d.t) - bars_margin_bottom;
                        var yv = y(d.t);
                        var height = height - y(d.t) - bars_margin_bottom;
                        return rightRoundedRect(0, yv, one_bar_width, height, 6);
                    })*/
      /*              .attr("y", function(d) { return 0; })
                    .attr("r", function(d) {
                        //console.log("d.t:", d.t, ", y(d.t):", ycir(d.t));
                        return y_scale_circle(d.t);
                    })
                    .attr("width", one_bar_width - 1)
                    .style("fill", function(d) {
                        return d.color;
                    })
                    .attr("transform", function(d, i) {
                        return "translate(20,330)";
                    })
*/

            bar.append("text")
                .attr("class", "bar_text")
                .attr("x", 0/*one_bar_width / 2*/)
                .attr("y", height - text_height/*function(d) { return y(d.t) + 3; }*/)
                .text(function(d) { return d.f; });
                /*.attr("dy", ".75em")*/


            bar.on("mouseover", function(d, i)
            {

                //console.log(this);

                //return false;
/*
                var tooltip = d3.select("#bar_chart")
                                  .append("div")
                                  .attr("class", "tooltip")
                                  .attr("height", tooltip_height)
                                  .attr("width", tooltip_width)
                                  .style("left", -1 * ((tooltip_width - one_bar_width) / 2))
                                  .style("top", function(d) { return y(d.t) - tooltip_height - tooltip_margin_bottom; })
*/


                tooltip = d3.select(this)
                                  .append("g")
                                  .attr("class", "tooltip")
                                  .attr("transform", function(d, i) {
                                      var xv = (-1 * ((tooltip_width - one_bar_width) / 2));
                                      var yv = y_scale_log(d.t) - tooltip_height - tooltip_margin_bottom;
                                      return "translate(" + xv + "," + yv + ")";
                                  })

                tooltip.append("rect")
                        /*.attr("x", -1 * ((tooltip_width - one_bar_width) / 2))
                        .attr("y", function(d) { return y(d.t) - tooltip_height - tooltip_margin_bottom; })*/
                        .attr("height", tooltip_height)
                        .attr("width", tooltip_width)
                        .style("fill", function(d) {
                            return "gray";
                        })

/*
                tooltip.append("div")
                        .attr("class", "triangle_bottom")
                        .attr("transform", function(d, i) {
                            return "translate(" + 20 + "," + (tooltip_height + 2) + ")";
                        })
*/

                var triangle_width = 14;
                var triangle_height = 7;

                //var points = "05,10 15,30 25,10";
                var points = "00,00 07,07 14,00";

                tooltip.append("polygon")
                      .attr("points", points)
                      .attr("transform", function(d, i) {
                          //var xv = (-1 * ((tooltip_width - one_bar_width) / 2));
                          //var yv = y(d.t) - tooltip_height - tooltip_margin_bottom;
                          var xv = (tooltip_width - triangle_width) / 2;
                          var yv = tooltip_height;
                          return "translate(" + xv + "," + yv + ")";
                      })
                      .style("fill", "gray")

                tooltip.append("text")
                        .attr("class", "count")
                        .attr("x", function(d) {
                            var x = (tooltip_width - this.getBBox().width) / 2 - (this.getBBox().width / 2);
                            return x - 30;
                        })
                        .attr("y", function(d) {
                            //var y = this.getBBox().height;
                            return 30;
                        })
                        .attr("width", tooltip_width + "px")
                        .text(function(d) { return d.t; })
                        .style("fill", "white")

                tooltip.append("text")
                        .attr("class", "percent")
                        .attr("x", function(d) {
                            var x = (tooltip_width - this.getBBox().width) / 2 - (this.getBBox().width / 2);
                            return x - 10;
                        })
                        .attr("y", 50)
                        .text(function(d) {
                            var percent = Math.round((d.t / total_count) * 100);
                            return percent + "%";
                        })
                        .style("fill", "white")


/*
                tooltip.append("div")
                        .html(function(d) {

                            var html = "<div class='count'>" + d.t + "</div>";

                            var percent = (d.t / domain.y[1]) * 100;

                            html += "<div class='percent'>" + percent + "%</div>";

                            return html;
                        })*/
                        /*.attr("dy", ".75em")*/


            })
            .on("mouseout", function(d, e)
            {
                d3.selectAll(".tooltip").remove();
            });

/*
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);
*/
            function rightRoundedRect(x, y, width, height, radius) {
                return "M" + x + "," + y
                     + "h" + (width - radius)
                     + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                     + "v" + (height - 2 * radius)
                     + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
                     + "h" + (radius - width)
                     + "z";
            }

            // --------------------- AXIS --------------------------

            var draw_y_axis = function(orientation)
            {
/*
              var x = d3.scale.log()
                  /*.base(100)*/
    /*              .domain([1, 50000])
                  .range([300, 0]);

                var xAxis = d3.svg.axis()
                  .orient("left")
                  .ticks(10, 100)
  /*                .scale(x)
                  /*.innerTickSize(1000)
                  .tickSize(6, 0);*/
/*
                var svg = chart.append("svg")
                  .attr("width", 900)
                  .attr("height", 300)
                .append("g")
                  .attr("transform", "translate(" + 100 + "," + (0) + ")");

                svg.append("g")
                  .attr("class", "x axis")
                  .call(xAxis);

                return false;
*/
                //var y_scale_log = d3.scale.log(1000).range([height - bars_margin_bottom, 0]);
                var axis = d3.svg.axis().ticks(3).tickFormat(function(d) {
                    //console.log("-- draw tick ---");
                    //console.log(d);
                    return formatValue(d).replace('0.0', '0').replace('.0', '');/* return d*/
                }).orient(orientation).scale(y_scale_log);

                //var ticks = axis.;

                console.log("============ ticks ============");
                console.log(y_scale_log.ticks());

                var ticks = y_scale_log.ticks();

                //axis.tickFormat(function(x) { return x });

                //if (this.tickValues) axis.tickValues(this.tickValues);

                if (orientation == 'left')
                {
                    var transform = 'translate(' + 10 + ', ' + 0/*(10)*/ + ')';
                }
                else
                {
                    var berth = height * 0.10;
                    var transform = 'translate(' + width + ', ' + 0/*(berth + 1)*/ + ')';
                }
    /*
                if (this.element) {
                  this.vis.selectAll('*').remove();
                }
    */
                var y_domain = Math.round(domain.y[1]);

                var first_digit = parseInt(y_domain.toString()[0]);

                //console.log("first digit:", first_digit);

                var y_domain_string = (first_digit + 1).toString();

                for (var i = 0; i < y_domain.toString().length - 1; i++)
                {
                    y_domain_string += "0";
                }

                y_domain = parseInt(y_domain_string);

                //console.log("new domain:", y_domain);

                //var y_inverted = d3.scale.linear().domain([y_domain, 0]).rangeRound([0, height - bars_margin_bottom]);
                var y_inverted = y_scale_log;

                var tick_values = [];

/*
                var ticks_count = 5;

                var tick_size = (y_domain) / ticks_count;

                for (var i = 0; i <= ticks_count; i++)
                {
                    tick_values.push(Math.round(i * tick_size));
                }
*/

                for(var i = 0; i < ticks.length; i+=5)
                {
                    tick_values.push(ticks[i]);
                }

                var formatValue = d3.format(".2s");

                chart
                    .append("svg:g")
                    .attr("class", ["y_axis"])
                    .attr("transform", transform)
                    .call(axis/*.scale(y_inverted)*//*.ticks(20, "s").tickSize(6, 0)*/.tickValues(tick_values))
                    .call(function(g){
                        g.selectAll("path").remove();
                        g.selectAll("line").remove();
                    })

                    //.call(axis/*.scale(y_inverted)*/.ticks(5)/*.tickValues(tick_values)*/.tickFormat(function(d) {
                    //    //console.log("-- draw tick ---");
                    //    //console.log(d);
                    //    return formatValue(d).replace('0.0', '0').replace('.0', '');/* return d*/
                    //}))

                  return axis;

            }

            draw_grid = function(axis) {

                var ticks = y_scale_log.ticks();

                var gridSize = width - 30;

                var y_domain = Math.round(domain.y[1]);

                var first_digit = parseInt(y_domain.toString()[0]);

                //console.log("first digit:", first_digit);

                var y_domain_string = (first_digit + 1).toString();

                for (var i = 0; i < y_domain.toString().length - 1; i++)
                {
                    y_domain_string += "0";
                }

                y_domain = parseInt(y_domain_string);

                //console.log("new domain:", y_domain);

                //var y_inverted = d3.scale.linear().domain([y_domain, 0]).rangeRound([0, height - bars_margin_bottom]);
                var y_inverted = y_scale_log;
/*
                var tick_values = [];

                var ticks_count = 5;

                var tick_size = (y_domain) / ticks_count;

                for (var i = 0; i <= ticks_count; i++)
                {
                    tick_values.push(Math.round(i * tick_size));
                }*/
/*
                d3.selection.prototype.last = function() {
                    var last = this.size() - 1;
                    return d3.select(this[0][last]);
                };
*/

                var tick_values = [];

                for(var i = 0; i < ticks.length; i+=5)
                {
                    tick_values.push(ticks[i]);
                }

                var grids = chart
                    //.append("svg:g")
                    .insert("svg:g",":first-child")
                    .attr("class", "y_grid")
                    .call(axis.scale(y_inverted).tickSize(gridSize).tickValues(tick_values)) /*.tickSubdivide(0)*/ /*.tickPadding([0])*/
                    .attr("transform", function(d) {
                         return "translate(" + (width + 10) + "," + 1 + ")"; }
                    )

                grids
                		.selectAll('text')
                		.each(function() {
                        //console.log("grid text:", this.textContent);
                        //this.parentNode.setAttribute('data-y-value', this.textContent)
                        this.remove();
                    });

/*
                grids
                    .selectAll('g')
                    .last()
                    .attr('class','tick first');
*/
                /*grids
                    .selectAll('text')
                    .each(function() {
                      //console.log("grid text:", this.textContent);
                      this.parentNode.setAttribute('data-y-value', this.textContent)
                    });*/
            }

            var axis = draw_y_axis("left");
            draw_y_axis("right");
            draw_grid(axis);

            return false;

            if ((!dataPoints.dp || !dataPoints.dp.length) || (graphType == "bar" && !dataPoints.dp[0].data[0][1] && !dataPoints.dp[0].data[1][1])) {
                $(container).hide();
                $(container).siblings(".no-data").show();
                return true;
            } else {
                $(container).show();
                $(container).siblings(".no-data").hide();
            }

            var graphProperties = {
                series:{
                    lines:{ show:true, fill:true },
                    points:{ show:true }
                },
                grid:{ hoverable:true, borderColor:"null", color:"#999", borderWidth:0, minBorderMargin:10},
                xaxis:{ minTickSize:1, tickDecimals:"number", tickLength:0},
                yaxis:{ min:0, minTickSize:1, tickDecimals:"number", position:"right" },
                legend:{ backgroundOpaset:0, margin:[20, -19] },
                colors:countlyCommon.GRAPH_COLORS
            };

            switch (graphType) {
                case "line":
                    graphProperties.series = {lines:{ show:true, fill:true }, points:{ show:true }};
                    break;
                case "bar":
                    if (dataPoints.ticks.length > 20) {
                        graphProperties.xaxis.rotateTicks = 45;
                    }

                    graphProperties.series = {stack:true, bars:{ show:true, align:"center", barWidth:0.6, tickLength:0 }};
                    graphProperties.xaxis.ticks = dataPoints.ticks;
                    break;
                case "separate-bar":
                    if (dataPoints.ticks.length > 20) {
                        graphProperties.xaxis.rotateTicks = 45;
                    }
                    graphProperties.series = {bars:{ show:true, align:"center", barWidth:0.6 }};
                    graphProperties.xaxis.ticks = dataPoints.ticks;
                    break;
                case "pie":
                    graphProperties.series = { pie:{
                        show:true,
                        lineWidth:0,
                        radius:115,
                        combine:{
                            color:'#999',
                            threshold:0.05
                        },
                        label:{
                            show:true,
                            radius:160
                        }
                    }};
                    graphProperties.legend.show = false;
                    break;
                default:
                    break;
            }

            if (inGraphProperties) {
                $.extend(true, graphProperties, inGraphProperties);
            }

            $.plot($(container), dataPoints.dp, graphProperties);

            if (graphType == "bar" || graphType == "separate-bar") {
                var previousBar;

                $(container).unbind("plothover");
                $(container).bind("plothover", function (event, pos, item) {
                    if (item) {
                        var x = item.datapoint[0].toFixed(1).replace(".0", ""),
                            y = item.datapoint[1].toFixed(1).replace(".0", "") - item.datapoint[2].toFixed(1).replace(".0", "");

                        if (previousBar != y) {
                            $("#graph-tooltip").remove();
                            showTooltip(item.pageX, item.pageY - 40, y);
                            previousBar = y;
                        }
                    } else {
                        $("#graph-tooltip").remove();
                        previousBar = null;
                    }
                });
            } else {
                $(container).unbind("plothover");
            }
        }, dataPoints, container, graphType, width/*, inGraphProperties*/);
    };

    // Draws a line graph with the given dataPoints to container.

    var chart = false;
    var _rickshaw_graph = false;
    var _state_single_graph_data = false;
    var initial_single_graph_data = false;

    countlyCommon.drawTimeGraph = function (granularity_rows, container, graph_colors, graph_width, graph_height, bucket, granularity_type, small_circles, zero_points) {
        _.defer(function(){

            if (container.indexOf("#") > -1)
            {
                var draw_element = document.getElementById(container.replace("#", ""));
            }
            else
            {
                var draw_element = document.getElementsByClassName(container.replace(".", ""));
            }

            var time_period = countlyCommon.periodObj.currentPeriodArr;

            var graphTicks = [],
                   tickObj = {};

            if (_period == "month" && !bucket) {
                tickObj = countlyCommon.getTickObj("monthly");
            } else {
                tickObj = countlyCommon.getTickObj(bucket);
            }

            graphTicks = tickObj.tickTexts;

            /*
                data formatting
            */

            if (granularity_type == "weekly" || granularity_type == "monthly")
            {

                for (var i = 0; i < granularity_rows.length; i++)
                {
                    var elem = granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1];

                    if (granularity_type == "monthly")
                    {
                        var full_days = new Date(elem[0]).monthDays();

                        var extension_days = full_days - elem[2];

                        var extension_date = new Date(elem[0]);
                        extension_date.setDate(extension_date.getDate() + extension_days);

                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][0] = extension_date.getTime();
                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][2] = full_days;

                    }
                    else
                    {
                        var full_days = 7;

                        var extension_days = full_days - elem[2];

                        var extension_date = new Date(elem[0]);
                        extension_date.setDate(extension_date.getDate() + extension_days);

                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][0] = extension_date.getTime();
                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][2] = full_days;

                    }
                }
            }

            var single_graph_data = [];

            for (var i = 0; i < granularity_rows.length; i++)
            {

                var set_data = granularity_rows[i];

                if (set_data.color)
                {
                    var color = set_data.color;
                }
                else
                {
                    var color = graph_colors[i].color;
                }

                var obj = {
                    "name"   : set_data.label,
                    "values" : [],
                    "color"  : color
                }

                for(var j = 0; j < set_data.data.length; j++){

                    var point_data = {
                        "x" : set_data.data[j][0],
                        "y" : set_data.data[j][1],
                    }

                    if (set_data.data[j][2])
                    {
                        point_data["days_count"] = set_data.data[j][2];
                    }

                    obj.values.push(point_data);
                }

                single_graph_data.push(obj);
            }

            var series = [];

            single_graph_data.forEach(function(data, i){

                series.push({
                    color : data.color, //data_items[i].color,
                    data  : data.values,
                    name  : data.name
                });
            });
            
            _rickshaw_graph = new Rickshaw.Graph({
              	element  : draw_element,
              	width    : graph_width,
              	height   : graph_height,
              	renderer : 'line',
              	series   : series,
                granularity : granularity_type,
                left_time_extension : false,
                small_circle_r : 0,
                big_circle_r : 3,
                small_circles : small_circles,
                zero_points : zero_points,
                period : _period
            });

            var scales = [];

            _ref = single_graph_data[0];

            for (_j = 0, _len = _ref.length; _j < _len; _j++) {
                point = _ref[_j];
                point.y *= point.y;
            }

            for (_k = 0, _len1 = single_graph_data.length; _k < _len1; _k++) {
                series = single_graph_data[_k];
                min = Number.MAX_VALUE;
                max = Number.MIN_VALUE;
                for (_l = 0, _len2 = series.length; _l < _len2; _l++) {
                    point = series[_l];
                    min = Math.min(min, point.y);
                    max = Math.max(max, point.y);
                }

                if (_k === 0) {
                    scales.push(d3.scale.linear().domain([min, max]).nice());
                } else {
                    scales.push(d3.scale.pow().domain([min, max]).nice());
                }
            }

            //document.getElementById('axis_left').style.height = graph_height;

            var y_axis_left = new Rickshaw.Graph.Axis.Y({
                graph: _rickshaw_graph,
                orientation: 'left',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.getElementById('axis_left'),
                pixelsPerTick : 100
            });

            var y_axis_right = new Rickshaw.Graph.Axis.Y({
                graph: _rickshaw_graph,
                orientation: 'right',
                tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
                element: document.getElementById('axis_right'),
                pixelsPerTick : 100
            });

            new Rickshaw.Graph.Axis.Time({
                graph: _rickshaw_graph,
                max_ticks_count : 10
                //tickFormat: format
            });

            _state_single_graph_data  = single_graph_data;
            initial_single_graph_data = single_graph_data;

            if (single_graph_data[1].color == "#bbbbbb") // todo: bad check
            {
                var previous_mode = true;
            }
            else
            {
                var previous_mode = false;
            }

            var hoverDetail = new Rickshaw.Graph.HoverDetail({
              	graph: _rickshaw_graph,
              	formatter: function(series, x, y, x0, y0, point, is_bottom_block, parent_element) {

                    var date = new Date(x);

                    if (this.graph.granularity == "weekly")
                    {

                        for (var i = 0; i < series.data.length; i++)
                        {
                            if (series.data[i].x == x)
                            {
                                var days_count = series.data[i].days_count;
                                break;
                            }
                        }

                        var one_week_ago = new Date(x);
                        one_week_ago.setDate(one_week_ago.getDate() - days_count + 1);

                        var date_string = d3.time.format("%d %b")(one_week_ago) + " - " + d3.time.format("%d %b %Y")(date) /*+ "  (" + d3.time.format("%a")(one_week_ago) + " - " + d3.time.format("%a")(date) + ")"*/;

                    }
                    else if (this.graph.granularity == "monthly")
                    {

                        for (var i = 0; i < series.data.length; i++)
                        {
                            if (series.data[i].x == x)
                            {
                                var days_count = series.data[i].days_count;
                                break;
                            }
                        }

                        var one_month_ago = new Date(x);
                        //one_month_ago.setMonth(one_month_ago.getMonth() - days_count + 1);
                        one_month_ago.setDate(one_month_ago.getDate() - days_count + 1);

                        var date_string = d3.time.format("%d %b")(one_month_ago) + " - " + d3.time.format("%d %b %Y")(date) /*+ "  (" + d3.time.format("%a")(one_month_ago) + " - " + d3.time.format("%a")(date) + ")"*/;

                    }
                    else
                    {
                        var date_string = d3.time.format("%d %b %Y")(date);
                    }

                    var x_label = document.createElement('div');
                		x_label.className = 'x_label';

                    parent_element.appendChild(x_label);

                    var hover_wrapper = document.createElement('div');
                		hover_wrapper.className = 'hover_wrapper';

                    x_label.appendChild(hover_wrapper);

                    var date_element = document.createElement('div');
                    date_element.className = 'date_string';

                    if (previous_mode)
                    {
                        date_element.innerHTML = series.name;
                    }
                    else
                    {
                        date_element.innerHTML = date_string;
                    }

                    hover_wrapper.appendChild(date_element);

                    var max_label_width = 0;
                    var max_value_width = 0;

                    _state_single_graph_data.forEach(function(data, sg){

                        for (var i = 0; i < data.values.length; i++)
                        {
                            if (data.values[i].x == x)
                            {
                                var value = data.values[i].y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                                var hover_element = document.createElement('div');
                                hover_element.className = 'hover_element';

                                var circle = document.createElement('div');
                                circle.className = 'circle';

                                var color = false;

                                if (graph_colors)
                                {
                                    graph_colors.every(function(element){

                                        if (element.title.toLowerCase() == data.name.toLowerCase())
                                        {
                                            color = element.color;
                                            return false;
                                        }
                                        else
                                        {
                                          return true
                                        }

                                    });
                                }
                                else
                                {
                                    color = data.color;
                                }

                                circle.style["background-color"] = color;

                                hover_element.appendChild(circle);

                                var label_element = document.createElement('div');
                                label_element.className = 'name';



                                if (previous_mode)
                                {
                                    if (sg == 0)
                                    {
                                        label_element.innerHTML = date_string;
                                    }
                                    else
                                    {
                                        label_element.innerHTML = "todo previous";
                                    }
                                }
                                else
                                {
                                    label_element.innerHTML = data.name;
                                }



                                hover_element.appendChild(label_element);

                                var value_element = document.createElement('div');
                                value_element.className = 'value';
                                value_element.innerHTML = value;

                                hover_element.appendChild(value_element);

                                //hover_element.innerHTML = "<div class='circle' style='background-color:" + data_items[sg].color + "'></div><div class='name'>" + data.name + "</div><div class='value'>" + value + "</div>";

                                hover_wrapper.appendChild(hover_element);

                                if (label_element.offsetWidth > max_label_width)
                                {
                                    max_label_width = label_element.offsetWidth;
                                }

                                if (value_element.offsetWidth > max_value_width)
                                {
                                    max_value_width = value_element.offsetWidth;
                                }

                                break;
                            }
                        }
                    });

                    /*console.log("max_value_width:", max_value_width);*/

                    var block_width = 12 + 8 + 10 + max_label_width + 10 + max_value_width + 12; // todo: variables

                    if (block_width < 180)
                    {
                        block_width = 180;
                    }

                    x_label.style.width = block_width + "px";

                    //hover_wrapper.innerHTML = "test";

                    return x_label;

              	}
            });

            _rickshaw_graph.render();

            return true;

        });
    };

    countlyCommon.updateTimeGraph = function (granularity_rows, container, data_items, bucket, granularity_type, small_circles, zero_points, __callback) {

        if (!_rickshaw_graph)
        {
            return false;
        }
/*
        if (granularity_rows[0] && granularity_rows[0].data[0][0] == 1) {
            for (var i = 0; i < granularity_rows.length; i++) {
                for (var j = 0; j < granularity_rows[i].data.length; j++) {
                    granularity_rows[i].data[j][0] -= 1;
                }
            }
        }
*/

        console.log("======== updateTimeGraph =============");
        console.log(granularity_rows);

        //return false;

        var time_period = countlyCommon.periodObj.currentPeriodArr;

        var graphTicks = [],
               tickObj = {};

        if (_period == "month" && !bucket) {
            tickObj = countlyCommon.getTickObj("monthly");
        } else {
            tickObj = countlyCommon.getTickObj(bucket);
        }

        graphTicks = tickObj.tickTexts;

        if (granularity_rows)
        {

            // add the end of the week and month in Weekly and Monthly mode

            if (granularity_type == "weekly" || granularity_type == "monthly")
            {

                for (var i = 0; i < granularity_rows.length; i++)
                {
                    var elem = granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1];

                    if (granularity_type == "monthly")
                    {
                        var full_days = new Date(elem[0]).monthDays();

                        console.log("full_days:", full_days);
                        console.log("days in period:", elem[2]);

                        var extension_days = full_days - elem[2];

                        var extension_date = new Date(elem[0]);
                        extension_date.setDate(extension_date.getDate() + extension_days);

                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][0] = extension_date.getTime();
                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][2] = full_days;

                    }
                    else
                    {
                        var full_days = 7;

                        var extension_days = full_days - elem[2];

                        var extension_date = new Date(elem[0]);
                        extension_date.setDate(extension_date.getDate() + extension_days);

                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][0] = extension_date.getTime();
                        granularity_rows[i]['data'][granularity_rows[i]['data'].length - 1][2] = full_days;

                    }
                }
            }

            var single_graph_data = [];

            for (var i = 0; i < granularity_rows.length; i++)
            {

                var set_data = granularity_rows[i];

                if (set_data.color)
                {
                    var color = set_data.color;
                }
                else
                {
                    var color = false;

                    for (var c = 0; c < initial_single_graph_data.length; c++)
                    {
                        if (initial_single_graph_data[c].name == set_data.label)
                        {
                            color = initial_single_graph_data[c].color;
                            break;
                        }
                    }
                }

                var obj = {
                    "name"   : set_data.label,
                    "values" : [],
                    "color"  : color
                }

                for(var j = 0; j < set_data.data.length; j++){

                    var point_data = {
                        "x" : set_data.data[j][0]/*.unix() * 1000*/,
                        "y" : Math.round(parseInt(set_data.data[j][1])), // todo!!! maybe inaccuracy
                    }

                    if (set_data.data[j][2])
                    {
                        point_data["days_count"] = set_data.data[j][2];
                    }

                    obj.values.push(point_data);
                }

                single_graph_data.push(obj);
            }

        }
        else
        {

            if (!time_period){

                time_period = graphTicks;

                if (_period == "month")
                {
                    var parseDate = function(date_for_parse){

                        var now = new Date();
                        var year = d3.time.year(now);

                        var formated = d3.time.format("%Y")(year) + "-" + date_for_parse + "-" + d3.time.format("%d")(year);
                        return d3.time.format("%Y-%b-%d").parse(formated);
                    }
                }
                else
                {

                    var parseDate = function(date_for_parse){

                        var now = new Date();
                        var today = d3.time.day(now);
                        date_for_parse = d3.time.format("%Y-%m-%d")(today) + "-" + date_for_parse;
                        return d3.time.format("%Y-%m-%d-%H:%M").parse(date_for_parse);
                    }
                }
            }
            else
            {
                var parseDate = d3.time.format("%Y.%m.%d").parse;
            }

            /*
                data formatting
            */

            var graph_data = [];

            for (var i = 0; i < time_period.length; i++)
            {

                var obj = {
                    "date" : parseDate(time_period[i]),
                }

                if (!obj.date)
                {
                    console.log("!obj.date", time_period[i]);
                    continue;
                }

                granularity_rows.forEach(function(set){

                    if (!set.data[i])
                    {
                        obj[set.label] = 0;
                    }
                    else
                    {
                        obj[set.label] = set.data[i][1];
                    }

                });

                graph_data.push(obj);
            }

            var color = d3.scale.category10();

            color.domain(d3.keys(graph_data[0]).filter(function(key) { return key !== "date"; }));

            var single_graph_data = color.domain().map(function(name, i) {

                  var color = false;

                  for (var c = 0; c < initial_single_graph_data.length; c++)
                  {
                      if (initial_single_graph_data[c].name == name)
                      {
                          color = initial_single_graph_data[c].color;
                          break;
                      }
                  }

                  return {
                      name: name,
                      values: graph_data.map(function(d) {
                          //return {date: d.date, value: +d[name]};
                          return {x: d.date.getTime(), y: +d[name]};
                      }),
                      color : color
                  };
            });
        }

        _state_single_graph_data = single_graph_data; // todo: remove

        /*
            add or remove graph line path element
        */

        if (_rickshaw_graph.series.length != single_graph_data.length)
        {
            var new_series = [];

            for (var i = 0; i < (_rickshaw_graph.series.length - single_graph_data.length); i++)
            {
                _rickshaw_graph.series.pop();
            }

            for (var i = 0; i < single_graph_data.length; i++)
            {
                _rickshaw_graph.series[i] = {
                    color : single_graph_data[i].color,
                    data  : single_graph_data[i].values,
                    name  : single_graph_data[i].name
                }
            }

        }
        else
        {
            for (var i = 0; i < _rickshaw_graph.series.length; i++)
            {
                _rickshaw_graph.series[i].data  = single_graph_data[i].values;
                _rickshaw_graph.series[i].color = single_graph_data[i].color;
                _rickshaw_graph.series[i].name  = single_graph_data[i].name;

            }
        }

        _rickshaw_graph.period = _period;

        _rickshaw_graph.granularity = granularity_type;

        _rickshaw_graph.zero_points = zero_points;

        if (granularity_type == "monthly")
        {
            var full_days = new Date(granularity_rows[0].data[0][0]).monthDays();
        }
        else
        {
            var full_days = 7;
        }

        _rickshaw_graph.left_time_extension = false;

        _rickshaw_graph.small_circles = small_circles;

        _rickshaw_graph.update();

        _.defer(function(){
            __callback(false, true);
        });

        return true;

    }

    countlyCommon.drawGauge = function(targetEl, value, maxValue, gaugeColor, textField) {
        var opts = {
            lines:12,
            angle:0.15,
            lineWidth:0.44,
            pointer:{
                length:0.7,
                strokeWidth:0.05,
                color:'#000000'
            },
            colorStart:gaugeColor,
            colorStop:gaugeColor,
            strokeColor:'#E0E0E0',
            generateGradient:true
        };

        var gauge  = new Gauge($(targetEl)[0]).setOptions(opts);

        if (textField) {
            gauge.setTextField($(textField)[0]);
        }

        gauge.maxValue = maxValue;
        gauge.set(1);
        gauge.set(value);
    };

    countlyCommon.extractRangeData = function (db, propertyName, rangeArray, explainRange) {

        countlyCommon.periodObj = getPeriodObj();

        var dataArr = [],
            dataArrCounter = 0,
            rangeTotal,
            total = 0;

        if (!rangeArray) {
            return dataArr;
        }

        if (countlyCommon.periodObj.uniquePeriodArr.length == 0)
        {
            countlyCommon.periodObj.uniquePeriodArr = countlyCommon.periodObj.currentPeriodArr;
            countlyCommon.periodObj.uniquePeriodCheckArr = countlyCommon.periodObj.currentPeriodArr;
            countlyCommon.periodObj.isSpecialPeriod = true;
        }

        for (var j = 0; j < rangeArray.length; j++) {

            rangeTotal = 0;

//            console.log("periodObj.isSpecialPeriod:", countlyCommon.periodObj.isSpecialPeriod);

            if (!countlyCommon.periodObj.isSpecialPeriod || countlyCommon.periodObj.activePeriod) {
                var tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.activePeriod + "." + propertyName);

                if (tmp_x && tmp_x[rangeArray[j]]) {
                    rangeTotal += tmp_x[rangeArray[j]];
                }

                if (rangeTotal != 0) {
                    dataArr[dataArrCounter] = {};
                    dataArr[dataArrCounter][propertyName] = (explainRange) ? explainRange(rangeArray[j]) : rangeArray[j];
                    dataArr[dataArrCounter]["t"] = rangeTotal;

                    total += rangeTotal;
                    dataArrCounter++;
                }
            } else {
                var tmpRangeTotal = 0;
/*
                console.log(":::::::::::::: special period :::::::::::::::");
                console.log(countlyCommon.periodObj);
*/
                for (var i = 0; i < (countlyCommon.periodObj.uniquePeriodArr.length); i++) {
                    var tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodArr[i] + "." + propertyName);

                    if (tmp_x && tmp_x[rangeArray[j]]) {
                        rangeTotal += tmp_x[rangeArray[j]];
                    }
                }

                for (var i = 0; i < (countlyCommon.periodObj.uniquePeriodCheckArr.length); i++) {
                    var tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodCheckArr[i] + "." + propertyName);

                    if (tmp_x && tmp_x[rangeArray[j]]) {
                        tmpRangeTotal += tmp_x[rangeArray[j]];
                    }
                }

                if (rangeTotal > tmpRangeTotal) {
                    rangeTotal = tmpRangeTotal;
                }

                if (rangeTotal != 0) {
                    dataArr[dataArrCounter] = {};
                    dataArr[dataArrCounter][propertyName] = (explainRange) ? explainRange(rangeArray[j]) : rangeArray[j];
                    dataArr[dataArrCounter]["t"] = rangeTotal;

                    total += rangeTotal;
                    dataArrCounter++;
                }
            }
        }

        for (var j = 0; j < dataArr.length; j++) {
            dataArr[j].percent = ((dataArr[j]["t"] / total) * 100).toFixed(1);
        }

        dataArr.sort(function (a, b) {
            return -(a["t"] - b["t"]);
        });

        return dataArr;
    };

    countlyCommon.extractChartData = function (db, clearFunction, chartData, dataProperties) {

        countlyCommon.periodObj = getPeriodObj();
/*
        console.log("================= countlyCommon.periodObj =================");
        console.log(countlyCommon.periodObj);
*/
        var periodMin = countlyCommon.periodObj.periodMin,
            periodMax = (countlyCommon.periodObj.periodMax + 1),
            dataObj = {},
            formattedDate = "",
            tableData = [],
            propertyNames = _.pluck(dataProperties, "name"),
            propertyFunctions = _.pluck(dataProperties, "func"),
            currOrPrevious = _.pluck(dataProperties, "period"),
            activeDate,
            activeDateArr;

        for (var j = 0; j < propertyNames.length; j++) {
            if (currOrPrevious[j] === "previous") {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.previousPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.previousPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.previousPeriod;
                }
            } else {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.currentPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.currentPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.activePeriod;
                }
            }

            for (var i = periodMin; i < periodMax; i++) {

                if (!countlyCommon.periodObj.isSpecialPeriod) {

                    if (countlyCommon.periodObj.periodMin == 0) {
                        formattedDate = moment((activeDate + " " + i + ":00:00").replace(/\./g, "/"));
                    } else if (("" + activeDate).indexOf(".") == -1) {
                        formattedDate = moment((activeDate + "/" + i + "/1").replace(/\./g, "/"));
                    } else {
                        formattedDate = moment((activeDate + "/" + i).replace(/\./g, "/"));
                    }

                    dataObj = countlyCommon.getDescendantProp(db, activeDate + "." + i);
                } else {
                    formattedDate = moment((activeDateArr[i]).replace(/\./g, "/"));
                    dataObj = countlyCommon.getDescendantProp(db, activeDateArr[i]);
                }
/*
                console.log('}}}}}}}}}}}}}} dataObj }}}}}}}}}}}}}}');
                console.log(dataObj);
*/
                dataObj = clearFunction(dataObj);

                if (!tableData[i]) {
                    tableData[i] = {};
                }

                tableData[i]["date"] = formattedDate.format(countlyCommon.periodObj.dateString);

                if (propertyFunctions[j]) {
                    propertyValue = propertyFunctions[j](dataObj);
                } else {
                    propertyValue = dataObj[propertyNames[j]];
                }

                chartData[j]["data"][chartData[j]["data"].length] = [i, propertyValue];
                tableData[i][propertyNames[j]] = propertyValue;
            }
        }

        var keyEvents = [];

        for (var k = 0; k < chartData.length; k++) {
            var flatChartData = _.flatten(chartData[k]["data"]);
            var chartVals = _.reject(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });
            var chartIndexes = _.filter(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });

            keyEvents[k] = {};
            keyEvents[k].min = _.min(chartVals);
            keyEvents[k].max = _.max(chartVals);
        }

        return {
            "chartDP":chartData,
            "chartData":_.compact(tableData),
            "keyEvents":keyEvents,
            "time_period" : countlyCommon.periodObj.currentPeriodArr,
            "time_format" : countlyCommon.periodObj.dateString,
            "get_current_data" : function(granularity){
                return chartData;
            }
        };
    };

    countlyCommon.extractChartData_granularity = function(db, clearFunction, chartData, dataProperties) {

        countlyCommon.periodObj = getPeriodObj();

        var hourly_granularity   = JSON.parse(JSON.stringify(chartData)); // clone
        hourly_granularity.format_date = function(timestamp){
            var date = new Date(timestamp);
            var date_string = d3.time.format("%H:%M")(date);
            return date_string;
        }

        var daily_granularity   = JSON.parse(JSON.stringify(chartData)); // clone
        daily_granularity.format_date = function(timestamp){
            var date = new Date(timestamp);
            var date_string = d3.time.format("%d %b %Y")(date);
            return date_string;
        }

        var daily_granularity   = JSON.parse(JSON.stringify(chartData)); // clone
        daily_granularity.format_date = function(timestamp){
            var date = new Date(timestamp);
            var date_string = d3.time.format("%d %b %Y")(date);
            return date_string;
        }

        var weekly_granularity  = JSON.parse(JSON.stringify(chartData));
        weekly_granularity.format_date = function(timestamp, days_in_period){
            var date = new Date(timestamp);
            var one_week_ago = new Date(timestamp);
            one_week_ago.setDate(one_week_ago.getDate() - days_in_period + 1);

            var date_string = d3.time.format("%d %b")(one_week_ago) + " - " + d3.time.format("%d %b %Y")(date) /*+ "  (" + d3.time.format("%a")(one_week_ago) + " - " + d3.time.format("%a")(date) + ")"*/;
            return date_string;
        }

        var monthly_granularity = JSON.parse(JSON.stringify(chartData));
        monthly_granularity.format_date = function(timestamp, days_in_period){
            var date = new Date(timestamp);

            var one_month_ago = new Date(timestamp);
            //one_month_ago.setMonth(one_month_ago.getMonth() - days_count + 1);
            one_month_ago.setDate(one_month_ago.getDate() - days_in_period + 1);

            var date_string = d3.time.format("%d %b")(one_month_ago) + " - " + d3.time.format("%d %b %Y")(date) /*+ "  (" + d3.time.format("%a")(one_month_ago) + " - " + d3.time.format("%a")(date) + ")"*/;
            return date_string;
        }

        var periodMin = countlyCommon.periodObj.periodMin,
            periodMax = (countlyCommon.periodObj.periodMax + 1),
            dataObj = {},
            formattedDate = "",
            tableData = [],
            propertyNames = _.pluck(dataProperties, "name"),
            propertyFunctions = _.pluck(dataProperties, "func"),
            currOrPrevious = _.pluck(dataProperties, "period"),
            activeDate,
            activeDateArr;

        for (var j = 0; j < propertyNames.length; j++) {

            if (currOrPrevious[j] === "previous") {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.previousPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.previousPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.previousPeriod;
                }
            } else {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.currentPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.currentPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.activePeriod;
                }
            }

            var week_count = 0;
            var week_days_count = 0;

            var month_count = 0;
            var month_days_count = 0;

            for (var i = periodMin; i < periodMax; i++) {

                if (!countlyCommon.periodObj.isSpecialPeriod) {

                    if (countlyCommon.periodObj.periodMin == 0) {
                        formattedDate = moment((activeDate + " " + i + ":00:00").replace(/\./g, "/"));
                    } else if (("" + activeDate).indexOf(".") == -1) {
                        formattedDate = moment((activeDate + "/" + i + "/1").replace(/\./g, "/"));
                    } else {
                        formattedDate = moment((activeDate + "/" + i).replace(/\./g, "/"));
                    }

                    dataObj = countlyCommon.getDescendantProp(db, activeDate + "." + i);
                } else {
                    formattedDate = moment((activeDateArr[i]).replace(/\./g, "/"));
                    dataObj = countlyCommon.getDescendantProp(db, activeDateArr[i]);

                    if (activeDateArr[i + 1])
                    {
                        var formattedDate_next = moment((activeDateArr[i + 1]).replace(/\./g, "/"));
                    }
                    else
                    {
                        var formattedDate_next = false;
                    }
                }

                dataObj = clearFunction(dataObj);

                if (!tableData[i]) {
                    tableData[i] = {};
                }

                tableData[i]["date"] = formattedDate.format(countlyCommon.periodObj.dateString);

                if (propertyFunctions[j]) {
                    propertyValue = propertyFunctions[j](dataObj);
                } else {
                    propertyValue = dataObj[propertyNames[j]];
                }

                chartData[j]["data"][chartData[j]["data"].length] = [i, propertyValue];
                tableData[i][propertyNames[j]] = propertyValue;

                // daily granularity

                //daily_granularity[j]["data"][daily_granularity[j]["data"].length] = [formattedDate.unix() * 1000, propertyValue];
                hourly_granularity[j]["data"].push([formattedDate.unix() * 1000, propertyValue]);
                daily_granularity[j]["data"].push([formattedDate.unix() * 1000, propertyValue]);

                // weekly granularity

                week_count += propertyValue;
                week_days_count += 1;

                var day_num = formattedDate.day(); //.format('dddd');

                if (day_num == 0) /*"Sunday"*/
                {
                    //weekly_granularity[j]["data"][weekly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, week_count, week_days_count];
                    weekly_granularity[j]["data"].push([formattedDate.unix() * 1000, week_count, week_days_count]);
                    week_count = 0;
                    week_days_count = 0;
                }

                // monthly granularity

                month_count += propertyValue;
                month_days_count += 1;

                var day_num = formattedDate.format('D');

                if (formattedDate_next && formattedDate_next.format('D') == 1)
                {
                    //monthly_granularity[j]["data"][monthly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, month_count, month_days_count];
                    monthly_granularity[j]["data"].push([formattedDate.unix() * 1000, month_count, month_days_count]);
                    month_count = 0;
                    month_days_count = 0;
                }
            }

            // add the remaining days of the week
            //weekly_granularity[j]["data"][weekly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, week_count, week_days_count];
            weekly_granularity[j]["data"].push([formattedDate.unix() * 1000, week_count, week_days_count])
            // add the remaining days of the month
            //monthly_granularity[j]["data"][monthly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, month_count, month_days_count];
            monthly_granularity[j]["data"].push([formattedDate.unix() * 1000, month_count, month_days_count])

        }

        var keyEvents = [];

        for (var k = 0; k < chartData.length; k++) {
            var flatChartData = _.flatten(chartData[k]["data"]);
            var chartVals = _.reject(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });
            var chartIndexes = _.filter(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });

            keyEvents[k] = {};
            keyEvents[k].min = _.min(chartVals);
            keyEvents[k].max = _.max(chartVals);
        }

        if (countlyCommon.previous_period_length)
        {
            var previous_period_length = countlyCommon.previous_period_length;
        }
        else
        {
            var previous_period_length = false;
        }

        countlyCommon.previous_period_length = daily_granularity[0].data.length;

        return {
            "chartDP"        : chartData,
            "hourly_granularity"  : hourly_granularity,
            "daily_granularity"   : daily_granularity,
            "weekly_granularity"  : weekly_granularity,
            "monthly_granularity" : monthly_granularity,
            "chartData"           : _.compact(tableData),
            "keyEvents"   : keyEvents,
            "time_period" : countlyCommon.periodObj.currentPeriodArr,
            "time_format" : countlyCommon.periodObj.dateString,
            "previous_period_length" : previous_period_length,
            get_current_data : function(granularity){


                if (!granularity)
                {
                    granularity = "daily"; // = _granularity // todo: "daily" is fix, which change another fix with global var
                }

                switch(granularity)
                {
                    case "hourly":
                        return hourly_granularity;
                    break;

                    case "daily":
                        return daily_granularity;
                    break;

                    case "weekly":
                        return weekly_granularity;
                    break;

                    case "monthly":
                        return monthly_granularity;
                    break;
                }
            }
        };
    };

    countlyCommon.extractChartData_granularity_custom = function(db, clearFunction, chartData, dataProperties, iso2) {

        countlyCommon.periodObj = getPeriodObj();

        var hourly_granularity   = JSON.parse(JSON.stringify(chartData)); // clone
        hourly_granularity.format_date = function(timestamp){
            var date = new Date(timestamp);
            var date_string = d3.time.format("%H:%M")(date);
            return date_string;
        }

        var daily_granularity   = JSON.parse(JSON.stringify(chartData)); // clone
        daily_granularity.format_date = function(timestamp){
            var date = new Date(timestamp);
            var date_string = d3.time.format("%d %b %Y")(date);
            return date_string;
        }

        var daily_granularity   = JSON.parse(JSON.stringify(chartData)); // clone
        daily_granularity.format_date = function(timestamp){
            var date = new Date(timestamp);
            var date_string = d3.time.format("%d %b %Y")(date);
            return date_string;
        }

        var weekly_granularity  = JSON.parse(JSON.stringify(chartData));
        weekly_granularity.format_date = function(timestamp, days_in_period){
            var date = new Date(timestamp);
            var one_week_ago = new Date(timestamp);
            one_week_ago.setDate(one_week_ago.getDate() - days_in_period + 1);

            var date_string = d3.time.format("%d %b")(one_week_ago) + " - " + d3.time.format("%d %b %Y")(date) /*+ "  (" + d3.time.format("%a")(one_week_ago) + " - " + d3.time.format("%a")(date) + ")"*/;
            return date_string;
        }

        var monthly_granularity = JSON.parse(JSON.stringify(chartData));
        monthly_granularity.format_date = function(timestamp, days_in_period){
            var date = new Date(timestamp);

            var one_month_ago = new Date(timestamp);
            //one_month_ago.setMonth(one_month_ago.getMonth() - days_count + 1);
            one_month_ago.setDate(one_month_ago.getDate() - days_in_period + 1);

            var date_string = d3.time.format("%d %b")(one_month_ago) + " - " + d3.time.format("%d %b %Y")(date) /*+ "  (" + d3.time.format("%a")(one_month_ago) + " - " + d3.time.format("%a")(date) + ")"*/;
            return date_string;
        }

        var periodMin = countlyCommon.periodObj.periodMin,
            periodMax = (countlyCommon.periodObj.periodMax + 1),
            dataObj = {},
            formattedDate = "",
            tableData = [],
            propertyNames = _.pluck(dataProperties, "name"),
            propertyFunctions = _.pluck(dataProperties, "func"),
            currOrPrevious = _.pluck(dataProperties, "period"),
            activeDate,
            activeDateArr;

        for (var j = 0; j < propertyNames.length; j++) {

            if (currOrPrevious[j] === "previous") {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.previousPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.previousPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.previousPeriod;
                }
            } else {
                if (countlyCommon.periodObj.isSpecialPeriod) {
                    periodMin = 0;
                    periodMax = countlyCommon.periodObj.currentPeriodArr.length;
                    activeDateArr = countlyCommon.periodObj.currentPeriodArr;
                } else {
                    activeDate = countlyCommon.periodObj.activePeriod;
                }
            }

            var week_count = 0;
            var week_days_count = 0;

            var month_count = 0;
            var month_days_count = 0;

            for (var i = periodMin; i < periodMax; i++) {

                if (!countlyCommon.periodObj.isSpecialPeriod) {

                    if (countlyCommon.periodObj.periodMin == 0) {
                        formattedDate = moment((activeDate + " " + i + ":00:00").replace(/\./g, "/"));
                    } else if (("" + activeDate).indexOf(".") == -1) {
                        formattedDate = moment((activeDate + "/" + i + "/1").replace(/\./g, "/"));
                    } else {
                        formattedDate = moment((activeDate + "/" + i).replace(/\./g, "/"));
                    }

                    dataObj = countlyCommon.getDescendantProp(db, activeDate + "." + i);
                } else {
                    formattedDate = moment((activeDateArr[i]).replace(/\./g, "/"));
                    dataObj = countlyCommon.getDescendantProp(db, activeDateArr[i]);

                    if (activeDateArr[i + 1])
                    {
                        var formattedDate_next = moment((activeDateArr[i + 1]).replace(/\./g, "/"));
                    }
                    else
                    {
                        var formattedDate_next = false;
                    }
                }

                dataObj = clearFunction(dataObj);

                if (!tableData[i]) {
                    tableData[i] = {};
                }

                tableData[i]["date"] = formattedDate.format(countlyCommon.periodObj.dateString);

                if (iso2)
                {
                    if (dataObj[iso2])
                    {
                        propertyValue = dataObj[iso2][propertyNames[j]];
                    }
                    else {
                        propertyValue = 0;
                    }

                }
                else if (propertyFunctions[j]) {
                    propertyValue = propertyFunctions[j](dataObj);
                } else {
                    propertyValue = dataObj[propertyNames[j]];
                }

                if (!propertyValue)
                {
                    propertyValue = 0;
                }

                chartData[j]["data"][chartData[j]["data"].length] = [i, propertyValue];
                tableData[i][propertyNames[j]] = propertyValue;

                // daily granularity

                //daily_granularity[j]["data"][daily_granularity[j]["data"].length] = [formattedDate.unix() * 1000, propertyValue];
                hourly_granularity[j]["data"].push([formattedDate.unix() * 1000, propertyValue]);
                daily_granularity[j]["data"].push([formattedDate.unix() * 1000, propertyValue]);

                // weekly granularity

                week_count += propertyValue;
                week_days_count += 1;

                var day_num = formattedDate.day(); //.format('dddd');

                if (day_num == 0) /*"Sunday"*/
                {
                    //weekly_granularity[j]["data"][weekly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, week_count, week_days_count];
                    weekly_granularity[j]["data"].push([formattedDate.unix() * 1000, week_count, week_days_count]);
                    week_count = 0;
                    week_days_count = 0;
                }

                // monthly granularity

                month_count += propertyValue;
                month_days_count += 1;

                var day_num = formattedDate.format('D');

                if (formattedDate_next && formattedDate_next.format('D') == 1)
                {
                    //monthly_granularity[j]["data"][monthly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, month_count, month_days_count];
                    monthly_granularity[j]["data"].push([formattedDate.unix() * 1000, month_count, month_days_count]);
                    month_count = 0;
                    month_days_count = 0;
                }
            }

            // add the remaining days of the week
            //weekly_granularity[j]["data"][weekly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, week_count, week_days_count];
            weekly_granularity[j]["data"].push([formattedDate.unix() * 1000, week_count, week_days_count])
            // add the remaining days of the month
            //monthly_granularity[j]["data"][monthly_granularity[j]["data"].length] = [formattedDate.unix() * 1000, month_count, month_days_count];
            monthly_granularity[j]["data"].push([formattedDate.unix() * 1000, month_count, month_days_count])

        }

        var keyEvents = [];

        for (var k = 0; k < chartData.length; k++) {
            var flatChartData = _.flatten(chartData[k]["data"]);
            var chartVals = _.reject(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });
            var chartIndexes = _.filter(flatChartData, function (context, value, index, list) {
                return value % 2 == 0;
            });

            keyEvents[k] = {};
            keyEvents[k].min = _.min(chartVals);
            keyEvents[k].max = _.max(chartVals);
        }

        if (countlyCommon.previous_period_length)
        {
            var previous_period_length = countlyCommon.previous_period_length;
        }
        else
        {
            var previous_period_length = false;
        }

        countlyCommon.previous_period_length = daily_granularity[0].data.length;

        return {
            "chartDP"        : chartData,
            "hourly_granularity"  : hourly_granularity,
            "daily_granularity"   : daily_granularity,
            "weekly_granularity"  : weekly_granularity,
            "monthly_granularity" : monthly_granularity,
            "chartData"           : _.compact(tableData),
            "keyEvents"   : keyEvents,
            "time_period" : countlyCommon.periodObj.currentPeriodArr,
            "time_format" : countlyCommon.periodObj.dateString,
            "previous_period_length" : previous_period_length,
            get_current_data : function(granularity){


                if (!granularity)
                {
                    granularity = "daily"; // = _granularity // todo: "daily" is fix, which change another fix with global var
                }

                switch(granularity)
                {
                    case "hourly":
                        return hourly_granularity;
                    break;

                    case "daily":
                        return daily_granularity;
                    break;

                    case "weekly":
                        return weekly_granularity;
                    break;

                    case "monthly":
                        return monthly_granularity;
                    break;
                }
            }
        };
    };

    countlyCommon.extractTwoLevelData = function (db, rangeArray, clearFunction, dataProperties) {

        countlyCommon.periodObj = getPeriodObj();

        if (!rangeArray) {
            return {"chartData":tableData};
        }
        var periodMin = 0,
            periodMax = 0,
            dataObj = {},
            formattedDate = "",
            tableData = [],
            chartData = [],
            propertyNames = _.pluck(dataProperties, "name"),
            propertyFunctions = _.pluck(dataProperties, "func"),
            propertyValue = 0;

        if (!countlyCommon.periodObj.isSpecialPeriod) {
            periodMin = countlyCommon.periodObj.periodMin;
            periodMax = (countlyCommon.periodObj.periodMax + 1);
        } else {
            periodMin = 0;
            periodMax = countlyCommon.periodObj.currentPeriodArr.length;
        }

        var tableCounter = 0;

        if (!countlyCommon.periodObj.isSpecialPeriod) {
            for (var j = 0; j < rangeArray.length; j++) {
                dataObj = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.activePeriod + "." + rangeArray[j]);

                if (!dataObj) {
                    continue;
                }

                dataObj = clearFunction(dataObj);

                var propertySum = 0,
                    tmpPropertyObj = {};

                for (var k = 0; k < propertyNames.length; k++) {

                    if (propertyFunctions[k]) {
                        propertyValue = propertyFunctions[k](rangeArray[j], dataObj);
                    } else {
                        propertyValue = dataObj[propertyNames[k]];
                    }

                    if (typeof propertyValue !== 'string') {
                        propertySum += propertyValue;
                    }

                    tmpPropertyObj[propertyNames[k]] = propertyValue;
                }

                if (propertySum > 0) {
                    tableData[tableCounter] = {};
                    tableData[tableCounter] = tmpPropertyObj;
                    tableCounter++;
                }
            }
        } else {

            for (var j = 0; j < rangeArray.length; j++) {

                var propertySum = 0,
                    tmpPropertyObj = {},
                    tmp_x = {};

                for (var i = periodMin; i < periodMax; i++) {
                    dataObj = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.currentPeriodArr[i] + "." + rangeArray[j]);

                    if (!dataObj) {
                        continue;
                    }

                    dataObj = clearFunction(dataObj);

                    for (var k = 0; k < propertyNames.length; k++) {

                        if (propertyNames[k] == "u") {
                            propertyValue = 0;
                        } else if (propertyFunctions[k]) {
                            propertyValue = propertyFunctions[k](rangeArray[j], dataObj);
                        } else {
                            propertyValue = dataObj[propertyNames[k]];
                        }

                        if (!tmpPropertyObj[propertyNames[k]]) {
                            tmpPropertyObj[propertyNames[k]] = 0;
                        }

                        if (typeof propertyValue === 'string') {
                            tmpPropertyObj[propertyNames[k]] = propertyValue;
                        } else {
                            propertySum += propertyValue;
                            tmpPropertyObj[propertyNames[k]] += propertyValue;
                        }
                    }
                }

                if (propertyNames.indexOf("u") !== -1 && Object.keys(tmpPropertyObj).length) {
                    var tmpUniqVal = 0,
                        tmpUniqValCheck = 0,
                        tmpCheckVal = 0;

                    for (var l = 0; l < (countlyCommon.periodObj.uniquePeriodArr.length); l++) {
                        tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodArr[l] + "." + rangeArray[j]);
                        if (!tmp_x) {
                            continue;
                        }
                        tmp_x = clearFunction(tmp_x);
                        propertyValue = tmp_x["u"];

                        if (typeof propertyValue === 'string') {
                            tmpPropertyObj["u"] = propertyValue;
                        } else {
                            propertySum += propertyValue;
                            tmpUniqVal += propertyValue;
                            tmpPropertyObj["u"] += propertyValue;
                        }
                    }

                    for (var l = 0; l < (countlyCommon.periodObj.uniquePeriodCheckArr.length); l++) {
                        tmp_x = countlyCommon.getDescendantProp(db, countlyCommon.periodObj.uniquePeriodCheckArr[l] + "." + rangeArray[j]);
                        if (!tmp_x) {
                            continue;
                        }
                        tmp_x = clearFunction(tmp_x);
                        tmpCheckVal = tmp_x["u"];

                        if (typeof tmpCheckVal !== 'string') {
                            propertySum += tmpCheckVal;
                            tmpUniqValCheck += tmpCheckVal;
                            tmpPropertyObj["u"] += tmpCheckVal;
                        }
                    }

                    if (tmpUniqVal > tmpUniqValCheck) {
                        tmpPropertyObj["u"] = tmpUniqValCheck;
                    }
                }

                //if (propertySum > 0)
                {
                    tableData[tableCounter] = {};
                    tableData[tableCounter] = tmpPropertyObj;
                    tableCounter++;
                }
            }
        }

        if (propertyNames.indexOf("u") !== -1) {
            tableData = _.sortBy(tableData, function (obj) {
                return -obj["u"];
            });
        } else if (propertyNames.indexOf("t") !== -1) {
            tableData = _.sortBy(tableData, function (obj) {
                return -obj["t"];
            });
        } else if (propertyNames.indexOf("c") !== -1) {
            tableData = _.sortBy(tableData, function (obj) {
                return -obj["c"];
            });
        }

        for (var i = 0; i < tableData.length; i++) {
            if (_.isEmpty(tableData[i])) {
                tableData[i] = null;
            }
        }

        return {"chartData":_.compact(tableData)};
    };

    countlyCommon.mergeMetricsByName = function(chartData, metric){
        var uniqueNames = {},
            data;
        for(var i = 0; i < chartData.length; i++){
            data = chartData[i];
            if(data[metric] && !uniqueNames[data[metric]]){
                uniqueNames[data[metric]] = data
            }
            else{
                for(var key in data){
                    if(typeof data[key] == "string")
                       uniqueNames[data[metric]][key] = data[key];
                    else if(typeof data[key] == "number"){
                        if(!uniqueNames[data[metric]][key])
                            uniqueNames[data[metric]][key] = 0;
                        uniqueNames[data[metric]][key] += data[key];
                    }
                }
            }
        }
        return _.values(uniqueNames);
    };

    // Extracts top three items (from rangeArray) that have the biggest total session counts from the db object.
    countlyCommon.extractBarData = function (db, rangeArray, clearFunction) {

        var rangeData = countlyCommon.extractTwoLevelData(db, rangeArray, clearFunction, [
            {
                name:"range",
                func:function (rangeArr, dataObj) {
                    return rangeArr;
                }
            },
            { "name":"t" }
        ]);

        rangeData.chartData = _.sortBy(rangeData.chartData, function(obj) { return -obj.t; });

        var rangeNames = _.pluck(rangeData.chartData, 'range'),
            rangeTotal = _.pluck(rangeData.chartData, 't'),
            barData = [],
            sum = 0,
            maxItems = 3,
            totalPercent = 0;

        rangeTotal.sort(function (a, b) {
            if (a < b) return 1;
            if (b < a) return -1;
            return 0;
        });

        if (rangeNames.length < maxItems) {
            maxItems = rangeNames.length;
        }

        for (var i = 0; i < maxItems; i++) {
            sum += rangeTotal[i];
        }

        for (var i = 0; i < maxItems; i++) {
            var percent = Math.floor((rangeTotal[i] / sum) * 100);
            totalPercent += percent;

            if (i == (maxItems - 1)) {
                percent += 100 - totalPercent;
            }

            barData[i] = { "name":rangeNames[i], "percent":percent };
        }

        return barData;
    };

	countlyCommon.extractUserChartData = function (db, label, sec) {
		var ret = {"data":[],"label":label};
        countlyCommon.periodObj = getPeriodObj();
        var periodMin, periodMax, dateob;

		if(countlyCommon.periodObj.isSpecialPeriod){
			periodMin = 0;
            periodMax = (countlyCommon.periodObj.daysInPeriod);
			var dateob1 = countlyCommon.processPeriod(countlyCommon.periodObj.currentPeriodArr[0].toString());
			var dateob2 = countlyCommon.processPeriod(countlyCommon.periodObj.currentPeriodArr[countlyCommon.periodObj.currentPeriodArr.length-1].toString());
			dateob = {timestart:dateob1.timestart, timeend:dateob2.timeend, range:"d"};
		}
		else{
			periodMin = countlyCommon.periodObj.periodMin-1;
            periodMax = countlyCommon.periodObj.periodMax;
			dateob = countlyCommon.processPeriod(countlyCommon.periodObj.activePeriod.toString());
		}
		var res = [],
			ts;
		//get all timestamps in that period
		for(var i = 0, l = db.length; i < l; i++){
			ts = db[i];
			if(sec)
				ts.ts = ts.ts*1000;
			if(ts.ts > dateob.timestart && ts.ts <= dateob.timeend){
				res.push(ts);
			}
		}
		var lastStart,
			lastEnd = dateob.timestart,
			total,
			ts,
			data = ret.data;
		for(var i = periodMin; i < periodMax; i++){
			total = 0;
			lastStart = lastEnd;
			lastEnd = moment(lastStart).add(moment.duration(1, dateob.range)).valueOf();
			for(var j = 0, l = res.length; j < l; j++){
				ts = res[j];
				if(ts.ts > lastStart && ts.ts <= lastEnd)
					if(ts.c)
						total += ts.c;
					else
						total++;
			}
			data.push([i, total]);
		}
        return ret;
    };

	countlyCommon.processPeriod = function(period){
		var date = period.split(".");
		var range,
			timestart,
			timeend;
		if(date.length == 1){
			range = "M";
			timestart = moment(period, "YYYY").valueOf();
			timeend = moment(period, "YYYY").add(moment.duration(1, "y")).valueOf();
		}
		else if(date.length == 2){
			range = "d";
			timestart = moment(period, "YYYY.MM").valueOf();
			timeend = moment(period, "YYYY.MM").add(moment.duration(1, "M")).valueOf();
		}
		else if(date.length == 3){
			range = "h";
			timestart = moment(period, "YYYY.MM.DD").valueOf();
			timeend = moment(period, "YYYY.MM.DD").add(moment.duration(1, "d")).valueOf();
		}
		return {timestart:timestart, timeend:timeend, range:range};
	}

    // Shortens the given number by adding K (thousand) or M (million) postfix.
    // K is added only if the number is bigger than 10000.
    countlyCommon.getShortNumber = function (number) {

        var tmpNumber = "";

        if (number >= 1000000 || number <= -1000000) {
            tmpNumber = ((number / 1000000).toFixed(1).replace(".0", "")) + "M";
        } else if (number >= 10000 || number <= -10000) {
            tmpNumber = ((number / 1000).toFixed(1).replace(".0", "")) + "K";
        } else {
            number += "";
            tmpNumber = number.replace(".0", "");
        }

        return tmpNumber;
    };

    // Function for getting the date range shown on the dashboard like 1 Aug - 30 Aug.
    // countlyCommon.periodObj holds a dateString property which holds the date format.
    countlyCommon.getDateRange = function () {

        countlyCommon.periodObj = getPeriodObj();

        if (!countlyCommon.periodObj.isSpecialPeriod) {
            if (countlyCommon.periodObj.dateString == "HH:mm") {
                formattedDateStart = moment(countlyCommon.periodObj.activePeriod + " " + countlyCommon.periodObj.periodMin + ":00", "YYYY.M.D HH:mm");
                formattedDateEnd = moment(countlyCommon.periodObj.activePeriod + " " + countlyCommon.periodObj.periodMax + ":00", "YYYY.M.D HH:mm");

                var nowMin = moment().format("mm");
                formattedDateEnd.add("minutes", nowMin);

            } else if (countlyCommon.periodObj.dateString == "D MMM, HH:mm") {
                formattedDateStart = moment(countlyCommon.periodObj.activePeriod, "YYYY.M.D");
                formattedDateEnd = moment(countlyCommon.periodObj.activePeriod, "YYYY.M.D").add("hours", 23).add("minutes", 59);
            } else {
                formattedDateStart = moment(countlyCommon.periodObj.activePeriod + "." + countlyCommon.periodObj.periodMin, "YYYY.M.D");
                formattedDateEnd = moment(countlyCommon.periodObj.activePeriod + "." + countlyCommon.periodObj.periodMax, "YYYY.M.D");
            }
        } else {
            formattedDateStart = moment(countlyCommon.periodObj.currentPeriodArr[0], "YYYY.M.D");
            formattedDateEnd = moment(countlyCommon.periodObj.currentPeriodArr[(countlyCommon.periodObj.currentPeriodArr.length - 1)], "YYYY.M.D");
        }

        var fromStr = formattedDateStart.format(countlyCommon.periodObj.dateString),
            toStr = formattedDateEnd.format(countlyCommon.periodObj.dateString);

        if (fromStr == toStr) {
            return fromStr;
        } else {
            return fromStr + " - " + toStr;
        }
    };

    // Function for merging updateObj object to dbObj.
    // Used for merging the received data for today to the existing data while updating the dashboard.
    countlyCommon.extendDbObj = function (dbObj, updateObj) {
        var now = moment(),
            year = now.year(),
            month = (now.month() + 1),
            day = now.date(),
            weekly = Math.ceil(now.format("DDD") / 7),
            intRegex = /^\d+$/,
            tmpUpdateObj = {},
            tmpOldObj = {};

        if (updateObj[year] && updateObj[year][month] && updateObj[year][month][day]) {
            if (!dbObj[year]) {
                dbObj[year] = {};
            }
            if (!dbObj[year][month]) {
                dbObj[year][month] = {};
            }
            if (!dbObj[year][month][day]) {
                dbObj[year][month][day] = {};
            }
            if (!dbObj[year]["w" + weekly]) {
                dbObj[year]["w" + weekly] = {};
            }

            tmpUpdateObj = updateObj[year][month][day];
            tmpOldObj = dbObj[year][month][day];

            dbObj[year][month][day] = updateObj[year][month][day];
        }

        if (updateObj["meta"]) {
            if (!dbObj["meta"]) {
                dbObj["meta"] = {};
            }

            dbObj["meta"] = updateObj["meta"];
        }

        for (var level1 in tmpUpdateObj) {
            if (!tmpUpdateObj.hasOwnProperty(level1)) {
                continue;
            }

            if (intRegex.test(level1)) {
                continue;
            }

            if (_.isObject(tmpUpdateObj[level1])) {
                if (!dbObj[year][level1]) {
                    dbObj[year][level1] = {};
                }

                if (!dbObj[year][month][level1]) {
                    dbObj[year][month][level1] = {};
                }

                if (!dbObj[year]["w" + weekly][level1]) {
                    dbObj[year]["w" + weekly][level1] = {};
                }
            } else {
                if (dbObj[year][level1]) {
                    if (tmpOldObj[level1]) {
                        dbObj[year][level1] += (tmpUpdateObj[level1] - tmpOldObj[level1]);
                    } else {
                        dbObj[year][level1] += tmpUpdateObj[level1];
                    }
                } else {
                    dbObj[year][level1] = tmpUpdateObj[level1];
                }

                if (dbObj[year][month][level1]) {
                    if (tmpOldObj[level1]) {
                        dbObj[year][month][level1] += (tmpUpdateObj[level1] - tmpOldObj[level1]);
                    } else {
                        dbObj[year][month][level1] += tmpUpdateObj[level1];
                    }
                } else {
                    dbObj[year][month][level1] = tmpUpdateObj[level1];
                }

                if (dbObj[year]["w" + weekly][level1]) {
                    if (tmpOldObj[level1]) {
                        dbObj[year]["w" + weekly][level1] += (tmpUpdateObj[level1] - tmpOldObj[level1]);
                    } else {
                        dbObj[year]["w" + weekly][level1] += tmpUpdateObj[level1];
                    }
                } else {
                    dbObj[year]["w" + weekly][level1] = tmpUpdateObj[level1];
                }
            }

            if (tmpUpdateObj[level1]) {
                for (var level2 in tmpUpdateObj[level1]) {
                    if (!tmpUpdateObj[level1].hasOwnProperty(level2)) {
                        continue;
                    }

                    if (dbObj[year][level1][level2]) {
                        if (tmpOldObj[level1] && tmpOldObj[level1][level2]) {
                            dbObj[year][level1][level2] += (tmpUpdateObj[level1][level2] - tmpOldObj[level1][level2]);
                        } else {
                            dbObj[year][level1][level2] += tmpUpdateObj[level1][level2];
                        }
                    } else {
                        dbObj[year][level1][level2] = tmpUpdateObj[level1][level2];
                    }

                    if (dbObj[year][month][level1][level2]) {
                        if (tmpOldObj[level1] && tmpOldObj[level1][level2]) {
                            dbObj[year][month][level1][level2] += (tmpUpdateObj[level1][level2] - tmpOldObj[level1][level2]);
                        } else {
                            dbObj[year][month][level1][level2] += tmpUpdateObj[level1][level2];
                        }
                    } else {
                        dbObj[year][month][level1][level2] = tmpUpdateObj[level1][level2];
                    }

                    if (dbObj[year]["w" + weekly][level1][level2]) {
                        if (tmpOldObj[level1] && tmpOldObj[level1][level2]) {
                            dbObj[year]["w" + weekly][level1][level2] += (tmpUpdateObj[level1][level2] - tmpOldObj[level1][level2]);
                        } else {
                            dbObj[year]["w" + weekly][level1][level2] += tmpUpdateObj[level1][level2];
                        }
                    } else {
                        dbObj[year]["w" + weekly][level1][level2] = tmpUpdateObj[level1][level2];
                    }
                }
            }
        }

        // Fix update of total user count

        if (updateObj[year]) {
            if (updateObj[year]["u"]) {
                if (!dbObj[year]) {
                    dbObj[year] = {};
                }

                dbObj[year]["u"] = updateObj[year]["u"];
            }

            if (updateObj[year][month] && updateObj[year][month]["u"]) {
                if (!dbObj[year]) {
                    dbObj[year] = {};
                }

                if (!dbObj[year][month]) {
                    dbObj[year][month] = {};
                }

                dbObj[year][month]["u"] = updateObj[year][month]["u"];
            }

            if (updateObj[year]["w" + weekly] && updateObj[year]["w" + weekly]["u"]) {
                if (!dbObj[year]) {
                    dbObj[year] = {};
                }

                if (!dbObj[year]["w" + weekly]) {
                    dbObj[year]["w" + weekly] = {};
                }

                dbObj[year]["w" + weekly]["u"] = updateObj[year]["w" + weekly]["u"];
            }
        }
    };

    countlyCommon.toFirstUpper = function(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    countlyCommon.divide = function (val1, val2) {
        var temp = val1 / val2;

        if (!temp || temp == Number.POSITIVE_INFINITY) {
            temp = 0;
        }

        return temp;
    };

    countlyCommon.getTickObj = function(bucket) {
        var days = parseInt(countlyCommon.periodObj.numberOfDays, 10),
            ticks = [],
            tickTexts = [],
            skipReduction = false,
            limitAdjustment = 0;

        if ((days == 1 && _period != "month" && _period != "day") || (days == 1 && bucket == "hourly")) {
            for (var i = 0; i < 24; i++) {
                ticks.push([i, (i + ":00")]);
                tickTexts.push((i + ":00"));
            }

            skipReduction = true;
        } else {
            var start = moment().subtract('days', days);
            if (Object.prototype.toString.call(countlyCommon.getPeriod()) === '[object Array]'){
                start = moment(countlyCommon.periodObj.currentPeriodArr[countlyCommon.periodObj.currentPeriodArr.length - 1], "YYYY.MM.DD").subtract('days',days);
            }
            if (bucket == "monthly") {
                var allMonths = [];

                for (var i = 0; i < days; i++) {
                    start.add('days', 1);
                    allMonths.push(start.format("MMM"));
                }

                allMonths = _.uniq(allMonths);

                for (var i = 0; i < allMonths.length; i++) {
                    ticks.push([i, allMonths[i]]);
                    tickTexts[i] = allMonths[i];
                }
            } else if (bucket == "weekly") {
                var allWeeks = [];

                for (var i = 0; i < days; i++) {
                    start.add('days', 1);
                    allWeeks.push(start.isoweek());
                }

                allWeeks = _.uniq(allWeeks);

                for (var i = 0; i < allWeeks.length; i++) {
                    ticks.push([i, "W" + allWeeks[i]]);

                    var weekText = moment().isoweek(allWeeks[i]).isoday(1).format(", MMM D");
                    tickTexts[i] = "W" + allWeeks[i] + weekText;
                }
            } else if (bucket == "hourly") {
                for (var i = 0; i < days; i++) {
                    start.add('days', 1);

                    for (var j = 0; j < 24; j++) {
                        if (j == 0) {
                            ticks.push([((24 * i) + j), start.format("D MMM") + " 0:00"]);
                        }

                        tickTexts.push(start.format("D MMM, ") + j + ":00");
                    }
                }
            } else {
                for (var i = 0; i < days; i++) {
                    start.add('days', 1);
                    ticks.push([i, start.format("D MMM")]);
                    tickTexts[i] = start.format("D MMM");
                }
            }

            ticks = _.compact(ticks);
            tickTexts = _.compact(tickTexts);
        }

        if (ticks.length <= 2) {
            limitAdjustment = 0.02;
            var tmpTicks = [],
                tmpTickTexts = [];

            tmpTickTexts[0] = "";
            tmpTicks[0] = [-0.02, ""];

            for (var i = 0; i < ticks.length; i++) {
                tmpTicks[i + 1] = [i, ticks[i][1]];
                tmpTickTexts[i + 1] = tickTexts[i];
            }

            tmpTickTexts.push("");
            tmpTicks.push([tmpTicks.length - 1 - 0.98, ""]);

            ticks = tmpTicks;
            tickTexts = tmpTickTexts;
        } else if (!skipReduction && ticks.length > 10) {
            var reducedTicks = [],
                step = (Math.floor(ticks.length / 10) < 1)? 1 : Math.floor(ticks.length / 10),
                pickStartIndex = (Math.floor(ticks.length / 30) < 1)? 1 : Math.floor(ticks.length / 30);

            for (var i = pickStartIndex; i < (ticks.length - 1); i = i + step) {
                reducedTicks.push(ticks[i]);
            }

            ticks = reducedTicks;
        } else {
            ticks[0] = null;

            // Hourly ticks already contain 23 empty slots at the end
            if (!(bucket == "hourly" && days != 1)) {
                ticks[ticks.length - 1] = null;
            }
        }

        return {
            min: 0 - limitAdjustment,
            max: (limitAdjustment)? tickTexts.length - 3 + limitAdjustment : tickTexts.length - 1,
            tickTexts: tickTexts,
            ticks: _.compact(ticks)
        };
    };

    countlyCommon.union = function(x, y) {
        if (!x) {
            return y;
        } else if (!y) {
            return x;
        }

        var needUnion = false;

        for (var i = 0; i < y.length; i++) {
            if (x.indexOf(y[i]) === -1) {
                needUnion = true;
                break;
            }
        }

        if (!needUnion) {
            return x;
        }

        var obj = {};
        for (var i = x.length-1; i >= 0; -- i) {
            obj[x[i]] = x[i];
        }

        for (var i = y.length-1; i >= 0; -- i) {
            obj[y[i]] = y[i];
        }

        var res = [];

        for (var k in obj) {
            res.push(obj[k]);
        }

        return res;
    };

    countlyCommon.formatNumber = function(x) {
        x = parseFloat(parseFloat(x).toFixed(2));
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };

	countlyCommon.pad = function(n, width, z){
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	};

    countlyCommon.getNoteDateIds = function(bucket) {
        var _periodObj = countlyCommon.periodObj,
            dateIds = [],
            dotSplit = [],
            tmpDateStr = "";

        if (!_periodObj.isSpecialPeriod && !bucket) {
            for (var i = _periodObj.periodMin; i < (_periodObj.periodMax + 1); i++) {
                dotSplit = (_periodObj.activePeriod + "." + i).split(".");
                tmpDateStr = "";

                for (var j = 0; j < dotSplit.length; j++) {
                    if (dotSplit[j].length == 1) {
                        tmpDateStr += "0" + dotSplit[j];
                    } else {
                        tmpDateStr += dotSplit[j];
                    }
                }

                dateIds.push(tmpDateStr);
            }
        } else {
            if (!_periodObj.currentPeriodArr && bucket == "daily") {
                var tmpDate = new Date();
                _periodObj.currentPeriodArr = [];

                if (countlyCommon.getPeriod() == "month") {
                    for (var i = 0; i < (tmpDate.getMonth() + 1); i++) {
                        var daysInMonth = moment().month(i).daysInMonth();

                        for (var j = 0; j < daysInMonth; j++) {
                            _periodObj.currentPeriodArr.push(_periodObj.activePeriod + "." + (i + 1) + "." + (j + 1));

                            // If current day of current month, just break
                            if ((i == tmpDate.getMonth()) && (j == (tmpDate.getDate() - 1))) {
                                break;
                            }
                        }
                    }
                } else if(countlyCommon.getPeriod() == "day") {
                    for (var i = 0; i < tmpDate.getDate(); i++) {
                        _periodObj.currentPeriodArr.push(_periodObj.activePeriod + "." + (i + 1));
                    }
                } else{
                    _periodObj.currentPeriodArr.push(_periodObj.activePeriod);
                }
            }

            for (var i = 0; i < (_periodObj.currentPeriodArr.length); i++) {
                dotSplit = _periodObj.currentPeriodArr[i].split(".");
                tmpDateStr = "";

                for (var j = 0; j < dotSplit.length; j++) {
                    if (dotSplit[j].length == 1) {
                        tmpDateStr += "0" + dotSplit[j];
                    } else {
                        tmpDateStr += dotSplit[j];
                    }
                }

                dateIds.push(tmpDateStr);
            }
        }

        switch (bucket) {
            case "hourly":
                var tmpDateIds = [];

                for (var i = 0; i < 25; i++) {
                    tmpDateIds.push(dateIds[0] + ((i < 10)? "0" + i : i))
                }

                dateIds = tmpDateIds;
                break;
            case "monthly":
                var tmpDateIds = [];

                for (var i = 0; i < dateIds.length; i++) {
                    countlyCommon.arrayAddUniq(tmpDateIds, moment(dateIds[i], "YYYYMMDD").format("YYYYMM"))
                }

                dateIds = tmpDateIds;
                break;
        }

        return dateIds;
    };

    countlyCommon.getNotesForDateId = function(dateId) {
        var ret = [];

        if (countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID] && countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes) {
            for (var date in countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes) {
                if (date.indexOf(dateId) === 0) {
                    ret = ret.concat(countlyGlobal.apps[countlyCommon.ACTIVE_APP_ID].notes[date]);
                }
            }
        }

        return ret.join("===");
    };

    countlyCommon.arrayAddUniq = function (arr, item) {
        if (!arr) {
            arr = [];
        }

        if (toString.call(item) === "[object Array]") {
            for (var i = 0; i < item.length; i++) {
                if (arr.indexOf(item[i]) === -1) {
                    arr[arr.length] = item[i];
                }
            }
        } else {
            if (arr.indexOf(item) === -1) {
                arr[arr.length] = item;
            }
        }
    };

	countlyCommon.formatTimeAgo = function(timestamp) {
		var target = new Date(timestamp*1000);
		var now = new Date();
		var diff = Math.floor((now - target) / 1000);
		if (diff <= 1) {return "<span style='color:#50C354;'>just now</span>";}
		if (diff < 20) {return "<span style='color:#50C354;'>" + diff + " seconds ago</span>";}
		if (diff < 40) {return "<span style='color:#50C354;'>half a minute ago</span>";}
		if (diff < 60) {return "<span style='color:#50C354;'>less than a minute ago</span>";}
		if (diff <= 90) {return "one minute ago";}
		if (diff <= 3540) {return Math.round(diff / 60) + " minutes ago";}
		if (diff <= 5400) {return "1 hour ago";}
		if (diff <= 86400) {return Math.round(diff / 3600) + " hours ago";}
		if (diff <= 129600) {return "1 day ago";}
		if (diff < 604800) {return Math.round(diff / 86400) + " days ago";}
		if (diff <= 777600) {return "1 week ago";}
		return "on " + target.toString().split(" GMT")[0];
	};

	countlyCommon.formatTime = function(timestamp) {
		var str = "";
		var seconds = timestamp % 60;
		str = str+leadingZero(seconds);
		timestamp -= seconds;
		var minutes = timestamp % (60*60);
		str = leadingZero(minutes/60)+":"+str;
		timestamp -= minutes;
		var hours = timestamp % (60*60*24);
		str = leadingZero(hours/(60*60))+":"+str;
		timestamp -= hours;
		if(timestamp > 0){
			var days = timestamp % (60*60*24*365);
			str = (days/(60*60*24))+" day(s) "+str;
			timestamp -= days;
			if(timestamp > 0){
				str = (timestamp/(60*60*24*365))+" year(s) "+str;
			}
		}
		return str;
	};

    countlyCommon.timeString = function(timespent){
        var timeSpentString = (timespent.toFixed(1)) + " " + jQuery.i18n.map["common.minute.abrv"];

        if (timespent >= 142560) {
            timeSpentString = (timespent / 525600).toFixed(1) + " " + jQuery.i18n.map["common.year.abrv"];
        } else if (timespent >= 1440) {
            timeSpentString = (timespent / 1440).toFixed(1) + " " + jQuery.i18n.map["common.day.abrv"];
        } else if (timespent >= 60) {
            timeSpentString = (timespent / 60).toFixed(1) + " " + jQuery.i18n.map["common.hour.abrv"];
        }
        return timeSpentString;


        /*var timeSpentString = "";
        if(timespent > 1){
            timeSpentString = Math.floor(timespent) + " " + jQuery.i18n.map["common.minute.abrv"]+" ";
            var left = Math.floor((timespent - Math.floor(timespent))*60);
            if(left > 0)
                timeSpentString += left + " s";
        }
        else
            timeSpentString += Math.floor((timespent - Math.floor(timespent))*60) + " s";

        if (timespent >= 142560) {
            timeSpentString = Math.floor(timespent / 525600) + " " + jQuery.i18n.map["common.year.abrv"];
            var left = Math.floor((timespent - Math.floor(timespent / 525600)*525600)/1440);
            if(left > 0)
                timeSpentString += " "+left + " " + jQuery.i18n.map["common.day.abrv"];
        } else if (timespent >= 1440) {
            timeSpentString = Math.floor(timespent / 1440) + " " + jQuery.i18n.map["common.day.abrv"];
            var left = Math.floor((timespent - Math.floor(timespent / 1440)*1440)/60);
            if(left > 0)
                timeSpentString += " "+left + " " + jQuery.i18n.map["common.hour.abrv"];
        } else if (timespent >= 60) {
            timeSpentString = Math.floor(timespent / 60) + " " + jQuery.i18n.map["common.hour.abrv"];
            var left = Math.floor(timespent - Math.floor(timespent / 60)*60)
            if(left > 0)
                timeSpentString += " "+left + " " + jQuery.i18n.map["common.minute.abrv"];
        }
        return timeSpentString;*/
    };

	countlyCommon.getDate = function(timestamp) {
		var d = new Date(timestamp*1000);
		return leadingZero(d.getDate())+"."+leadingZero(d.getMonth()+1)+"."+d.getFullYear();
	}

	countlyCommon.getTime = function(timestamp) {
		var d = new Date(timestamp*1000);
		return leadingZero(d.getHours())+":"+leadingZero(d.getMinutes());
	}

	function leadingZero(value){
		if(value > 9)
			return value
		return "0"+value;
	}

    countlyCommon.round = function(num, digits) {
        digits = Math.pow(10, digits || 0);
        return Math.round(num * digits) / digits;
    };

    countlyCommon.getTimeZones = function(){
        return { "AF":{"n":"Afghanistan","z":[{"(GMT+04:30) Kabul":"Asia/Kabul"}]}, "AL":{"n":"Albania","z":[{"(GMT+01:00) Tirane":"Europe/Tirane"}]}, "DZ":{"n":"Algeria","z":[{"(GMT+01:00) Algiers":"Africa/Algiers"}]}, "AS":{"n":"American Samoa","z":[{"(GMT-11:00) Pago Pago":"Pacific/Pago_Pago"}]}, "AD":{"n":"Andorra","z":[{"(GMT+01:00) Andorra":"Europe/Andorra"}]}, "AO":{"n":"Angola","z":[{"(GMT+01:00) Luanda":"Africa/Luanda"}]}, "AI":{"n":"Anguilla","z":[{"(GMT-04:00) Anguilla":"America/Anguilla"}]}, "AQ":{"n":"Antarctica","z":[{"(GMT-04:00) Palmer":"Antarctica/Palmer"},{"(GMT-03:00) Rothera":"Antarctica/Rothera"},{"(GMT+03:00) Syowa":"Antarctica/Syowa"},{"(GMT+05:00) Mawson":"Antarctica/Mawson"},{"(GMT+06:00) Vostok":"Antarctica/Vostok"},{"(GMT+07:00) Davis":"Antarctica/Davis"},{"(GMT+08:00) Casey":"Antarctica/Casey"},{"(GMT+10:00) Dumont D'Urville":"Antarctica/DumontDUrville"}]}, "AG":{"n":"Antigua and Barbuda","z":[{"(GMT-04:00) Antigua":"America/Antigua"}]}, "AR":{"n":"Argentina","z":[{"(GMT-03:00) Buenos Aires":"America/Buenos_Aires"}]}, "AM":{"n":"Armenia","z":[{"(GMT+04:00) Yerevan":"Asia/Yerevan"}]}, "AW":{"n":"Aruba","z":[{"(GMT-04:00) Aruba":"America/Aruba"}]}, "AU":{"n":"Australia","z":[{"(GMT+08:00) Western Time - Perth":"Australia/Perth"},{"(GMT+09:30) Central Time - Adelaide":"Australia/Adelaide"},{"(GMT+09:30) Central Time - Darwin":"Australia/Darwin"},{"(GMT+10:00) Eastern Time - Brisbane":"Australia/Brisbane"},{"(GMT+10:00) Eastern Time - Hobart":"Australia/Hobart"},{"(GMT+10:00) Eastern Time - Melbourne, Sydney":"Australia/Sydney"}]}, "AT":{"n":"Austria","z":[{"(GMT+01:00) Vienna":"Europe/Vienna"}]}, "AZ":{"n":"Azerbaijan","z":[{"(GMT+04:00) Baku":"Asia/Baku"}]}, "BS":{"n":"Bahamas","z":[{"(GMT-05:00) Nassau":"America/Nassau"}]}, "BH":{"n":"Bahrain","z":[{"(GMT+03:00) Bahrain":"Asia/Bahrain"}]}, "BD":{"n":"Bangladesh","z":[{"(GMT+06:00) Dhaka":"Asia/Dhaka"}]}, "BB":{"n":"Barbados","z":[{"(GMT-04:00) Barbados":"America/Barbados"}]}, "BY":{"n":"Belarus","z":[{"(GMT+03:00) Minsk":"Europe/Minsk"}]}, "BE":{"n":"Belgium","z":[{"(GMT+01:00) Brussels":"Europe/Brussels"}]}, "BZ":{"n":"Belize","z":[{"(GMT-06:00) Belize":"America/Belize"}]}, "BJ":{"n":"Benin","z":[{"(GMT+01:00) Porto-Novo":"Africa/Porto-Novo"}]}, "BM":{"n":"Bermuda","z":[{"(GMT-04:00) Bermuda":"Atlantic/Bermuda"}]}, "BT":{"n":"Bhutan","z":[{"(GMT+06:00) Thimphu":"Asia/Thimphu"}]}, "BO":{"n":"Bolivia","z":[{"(GMT-04:00) La Paz":"America/La_Paz"}]}, "BA":{"n":"Bosnia and Herzegovina","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Sarajevo"}]}, "BW":{"n":"Botswana","z":[{"(GMT+02:00) Gaborone":"Africa/Gaborone"}]}, "BR":{"n":"Brazil","z":[{"(GMT-04:00) Boa Vista":"America/Boa_Vista"},{"(GMT-04:00) Campo Grande":"America/Campo_Grande"},{"(GMT-04:00) Cuiaba":"America/Cuiaba"},{"(GMT-04:00) Manaus":"America/Manaus"},{"(GMT-04:00) Porto Velho":"America/Porto_Velho"},{"(GMT-04:00) Rio Branco":"America/Rio_Branco"},{"(GMT-03:00) Araguaina":"America/Araguaina"},{"(GMT-03:00) Belem":"America/Belem"},{"(GMT-03:00) Fortaleza":"America/Fortaleza"},{"(GMT-03:00) Maceio":"America/Maceio"},{"(GMT-03:00) Recife":"America/Recife"},{"(GMT-03:00) Salvador":"America/Bahia"},{"(GMT-03:00) Sao Paulo":"America/Sao_Paulo"},{"(GMT-02:00) Noronha":"America/Noronha"}]}, "IO":{"n":"British Indian Ocean Territory","z":[{"(GMT+06:00) Chagos":"Indian/Chagos"}]}, "VG":{"n":"British Virgin Islands","z":[{"(GMT-04:00) Tortola":"America/Tortola"}]}, "BN":{"n":"Brunei","z":[{"(GMT+08:00) Brunei":"Asia/Brunei"}]}, "BG":{"n":"Bulgaria","z":[{"(GMT+02:00) Sofia":"Europe/Sofia"}]}, "BF":{"n":"Burkina Faso","z":[{"(GMT+00:00) Ouagadougou":"Africa/Ouagadougou"}]}, "BI":{"n":"Burundi","z":[{"(GMT+02:00) Bujumbura":"Africa/Bujumbura"}]}, "KH":{"n":"Cambodia","z":[{"(GMT+07:00) Phnom Penh":"Asia/Phnom_Penh"}]}, "CM":{"n":"Cameroon","z":[{"(GMT+01:00) Douala":"Africa/Douala"}]}, "CA":{"n":"Canada","z":[{"(GMT-07:00) Mountain Time - Dawson Creek":"America/Dawson_Creek"},{"(GMT-08:00) Pacific Time - Vancouver":"America/Vancouver"},{"(GMT-08:00) Pacific Time - Whitehorse":"America/Whitehorse"},{"(GMT-06:00) Central Time - Regina":"America/Regina"},{"(GMT-07:00) Mountain Time - Edmonton":"America/Edmonton"},{"(GMT-07:00) Mountain Time - Yellowknife":"America/Yellowknife"},{"(GMT-06:00) Central Time - Winnipeg":"America/Winnipeg"},{"(GMT-05:00) Eastern Time - Iqaluit":"America/Iqaluit"},{"(GMT-05:00) Eastern Time - Montreal":"America/Montreal"},{"(GMT-05:00) Eastern Time - Toronto":"America/Toronto"},{"(GMT-04:00) Atlantic Time - Halifax":"America/Halifax"},{"(GMT-03:30) Newfoundland Time - St. Johns":"America/St_Johns"}]}, "CV":{"n":"Cape Verde","z":[{"(GMT-01:00) Cape Verde":"Atlantic/Cape_Verde"}]}, "KY":{"n":"Cayman Islands","z":[{"(GMT-05:00) Cayman":"America/Cayman"}]}, "CF":{"n":"Central African Republic","z":[{"(GMT+01:00) Bangui":"Africa/Bangui"}]}, "TD":{"n":"Chad","z":[{"(GMT+01:00) Ndjamena":"Africa/Ndjamena"}]}, "CL":{"n":"Chile","z":[{"(GMT-06:00) Easter Island":"Pacific/Easter"},{"(GMT-04:00) Santiago":"America/Santiago"}]}, "CN":{"n":"China","z":[{"(GMT+08:00) China Time - Beijing":"Asia/Shanghai"}]}, "CX":{"n":"Christmas Island","z":[{"(GMT+07:00) Christmas":"Indian/Christmas"}]}, "CC":{"n":"Cocos [Keeling] Islands","z":[{"(GMT+06:30) Cocos":"Indian/Cocos"}]}, "CO":{"n":"Colombia","z":[{"(GMT-05:00) Bogota":"America/Bogota"}]}, "KM":{"n":"Comoros","z":[{"(GMT+03:00) Comoro":"Indian/Comoro"}]}, "CD":{"n":"Congo [DRC]","z":[{"(GMT+01:00) Kinshasa":"Africa/Kinshasa"},{"(GMT+02:00) Lubumbashi":"Africa/Lubumbashi"}]}, "CG":{"n":"Congo [Republic]","z":[{"(GMT+01:00) Brazzaville":"Africa/Brazzaville"}]}, "CK":{"n":"Cook Islands","z":[{"(GMT-10:00) Rarotonga":"Pacific/Rarotonga"}]}, "CR":{"n":"Costa Rica","z":[{"(GMT-06:00) Costa Rica":"America/Costa_Rica"}]}, "CI":{"n":"Côte d’Ivoire","z":[{"(GMT+00:00) Abidjan":"Africa/Abidjan"}]}, "HR":{"n":"Croatia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Zagreb"}]}, "CU":{"n":"Cuba","z":[{"(GMT-05:00) Havana":"America/Havana"}]}, "CW":{"n":"Curaçao","z":[{"(GMT-04:00) Curacao":"America/Curacao"}]}, "CY":{"n":"Cyprus","z":[{"(GMT+02:00) Nicosia":"Asia/Nicosia"}]}, "CZ":{"n":"Czech Republic","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Prague"}]}, "DK":{"n":"Denmark","z":[{"(GMT+01:00) Copenhagen":"Europe/Copenhagen"}]}, "DJ":{"n":"Djibouti","z":[{"(GMT+03:00) Djibouti":"Africa/Djibouti"}]}, "DM":{"n":"Dominica","z":[{"(GMT-04:00) Dominica":"America/Dominica"}]}, "DO":{"n":"Dominican Republic","z":[{"(GMT-04:00) Santo Domingo":"America/Santo_Domingo"}]}, "EC":{"n":"Ecuador","z":[{"(GMT-06:00) Galapagos":"Pacific/Galapagos"},{"(GMT-05:00) Guayaquil":"America/Guayaquil"}]}, "EG":{"n":"Egypt","z":[{"(GMT+02:00) Cairo":"Africa/Cairo"}]}, "SV":{"n":"El Salvador","z":[{"(GMT-06:00) El Salvador":"America/El_Salvador"}]}, "GQ":{"n":"Equatorial Guinea","z":[{"(GMT+01:00) Malabo":"Africa/Malabo"}]}, "ER":{"n":"Eritrea","z":[{"(GMT+03:00) Asmera":"Africa/Asmera"}]}, "EE":{"n":"Estonia","z":[{"(GMT+02:00) Tallinn":"Europe/Tallinn"}]}, "ET":{"n":"Ethiopia","z":[{"(GMT+03:00) Addis Ababa":"Africa/Addis_Ababa"}]}, "FK":{"n":"Falkland Islands [Islas Malvinas]","z":[{"(GMT-03:00) Stanley":"Atlantic/Stanley"}]}, "FO":{"n":"Faroe Islands","z":[{"(GMT+00:00) Faeroe":"Atlantic/Faeroe"}]}, "FJ":{"n":"Fiji","z":[{"(GMT+12:00) Fiji":"Pacific/Fiji"}]}, "FI":{"n":"Finland","z":[{"(GMT+02:00) Helsinki":"Europe/Helsinki"}]}, "FR":{"n":"France","z":[{"(GMT+01:00) Paris":"Europe/Paris"}]}, "GF":{"n":"French Guiana","z":[{"(GMT-03:00) Cayenne":"America/Cayenne"}]}, "PF":{"n":"French Polynesia","z":[{"(GMT-10:00) Tahiti":"Pacific/Tahiti"},{"(GMT-09:30) Marquesas":"Pacific/Marquesas"},{"(GMT-09:00) Gambier":"Pacific/Gambier"}]}, "TF":{"n":"French Southern Territories","z":[{"(GMT+05:00) Kerguelen":"Indian/Kerguelen"}]}, "GA":{"n":"Gabon","z":[{"(GMT+01:00) Libreville":"Africa/Libreville"}]}, "GM":{"n":"Gambia","z":[{"(GMT+00:00) Banjul":"Africa/Banjul"}]}, "GE":{"n":"Georgia","z":[{"(GMT+04:00) Tbilisi":"Asia/Tbilisi"}]}, "DE":{"n":"Germany","z":[{"(GMT+01:00) Berlin":"Europe/Berlin"}]}, "GH":{"n":"Ghana","z":[{"(GMT+00:00) Accra":"Africa/Accra"}]}, "GI":{"n":"Gibraltar","z":[{"(GMT+01:00) Gibraltar":"Europe/Gibraltar"}]}, "GR":{"n":"Greece","z":[{"(GMT+02:00) Athens":"Europe/Athens"}]}, "GL":{"n":"Greenland","z":[{"(GMT-04:00) Thule":"America/Thule"},{"(GMT-03:00) Godthab":"America/Godthab"},{"(GMT-01:00) Scoresbysund":"America/Scoresbysund"},{"(GMT+00:00) Danmarkshavn":"America/Danmarkshavn"}]}, "GD":{"n":"Grenada","z":[{"(GMT-04:00) Grenada":"America/Grenada"}]}, "GP":{"n":"Guadeloupe","z":[{"(GMT-04:00) Guadeloupe":"America/Guadeloupe"}]}, "GU":{"n":"Guam","z":[{"(GMT+10:00) Guam":"Pacific/Guam"}]}, "GT":{"n":"Guatemala","z":[{"(GMT-06:00) Guatemala":"America/Guatemala"}]}, "GN":{"n":"Guinea","z":[{"(GMT+00:00) Conakry":"Africa/Conakry"}]}, "GW":{"n":"Guinea-Bissau","z":[{"(GMT+00:00) Bissau":"Africa/Bissau"}]}, "GY":{"n":"Guyana","z":[{"(GMT-04:00) Guyana":"America/Guyana"}]}, "HT":{"n":"Haiti","z":[{"(GMT-05:00) Port-au-Prince":"America/Port-au-Prince"}]}, "HN":{"n":"Honduras","z":[{"(GMT-06:00) Central Time - Tegucigalpa":"America/Tegucigalpa"}]}, "HK":{"n":"Hong Kong","z":[{"(GMT+08:00) Hong Kong":"Asia/Hong_Kong"}]}, "HU":{"n":"Hungary","z":[{"(GMT+01:00) Budapest":"Europe/Budapest"}]}, "IS":{"n":"Iceland","z":[{"(GMT+00:00) Reykjavik":"Atlantic/Reykjavik"}]}, "IN":{"n":"India","z":[{"(GMT+05:30) India Standard Time":"Asia/Calcutta"}]}, "ID":{"n":"Indonesia","z":[{"(GMT+07:00) Jakarta":"Asia/Jakarta"},{"(GMT+08:00) Makassar":"Asia/Makassar"},{"(GMT+09:00) Jayapura":"Asia/Jayapura"}]}, "IR":{"n":"Iran","z":[{"(GMT+03:30) Tehran":"Asia/Tehran"}]}, "IQ":{"n":"Iraq","z":[{"(GMT+03:00) Baghdad":"Asia/Baghdad"}]}, "IE":{"n":"Ireland","z":[{"(GMT+00:00) Dublin":"Europe/Dublin"}]}, "IL":{"n":"Israel","z":[{"(GMT+02:00) Jerusalem":"Asia/Jerusalem"}]}, "IT":{"n":"Italy","z":[{"(GMT+01:00) Rome":"Europe/Rome"}]}, "JM":{"n":"Jamaica","z":[{"(GMT-05:00) Jamaica":"America/Jamaica"}]}, "JP":{"n":"Japan","z":[{"(GMT+09:00) Tokyo":"Asia/Tokyo"}]}, "JO":{"n":"Jordan","z":[{"(GMT+02:00) Amman":"Asia/Amman"}]}, "KZ":{"n":"Kazakhstan","z":[{"(GMT+05:00) Aqtau":"Asia/Aqtau"},{"(GMT+05:00) Aqtobe":"Asia/Aqtobe"},{"(GMT+06:00) Almaty":"Asia/Almaty"}]}, "KE":{"n":"Kenya","z":[{"(GMT+03:00) Nairobi":"Africa/Nairobi"}]}, "KI":{"n":"Kiribati","z":[{"(GMT+12:00) Tarawa":"Pacific/Tarawa"},{"(GMT+13:00) Enderbury":"Pacific/Enderbury"},{"(GMT+14:00) Kiritimati":"Pacific/Kiritimati"}]}, "KW":{"n":"Kuwait","z":[{"(GMT+03:00) Kuwait":"Asia/Kuwait"}]}, "KG":{"n":"Kyrgyzstan","z":[{"(GMT+06:00) Bishkek":"Asia/Bishkek"}]}, "LA":{"n":"Laos","z":[{"(GMT+07:00) Vientiane":"Asia/Vientiane"}]}, "LV":{"n":"Latvia","z":[{"(GMT+02:00) Riga":"Europe/Riga"}]}, "LB":{"n":"Lebanon","z":[{"(GMT+02:00) Beirut":"Asia/Beirut"}]}, "LS":{"n":"Lesotho","z":[{"(GMT+02:00) Maseru":"Africa/Maseru"}]}, "LR":{"n":"Liberia","z":[{"(GMT+00:00) Monrovia":"Africa/Monrovia"}]}, "LY":{"n":"Libya","z":[{"(GMT+02:00) Tripoli":"Africa/Tripoli"}]}, "LI":{"n":"Liechtenstein","z":[{"(GMT+01:00) Vaduz":"Europe/Vaduz"}]}, "LT":{"n":"Lithuania","z":[{"(GMT+02:00) Vilnius":"Europe/Vilnius"}]}, "LU":{"n":"Luxembourg","z":[{"(GMT+01:00) Luxembourg":"Europe/Luxembourg"}]}, "MO":{"n":"Macau","z":[{"(GMT+08:00) Macau":"Asia/Macau"}]}, "MK":{"n":"Macedonia [FYROM]","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Skopje"}]}, "MG":{"n":"Madagascar","z":[{"(GMT+03:00) Antananarivo":"Indian/Antananarivo"}]}, "MW":{"n":"Malawi","z":[{"(GMT+02:00) Blantyre":"Africa/Blantyre"}]}, "MY":{"n":"Malaysia","z":[{"(GMT+08:00) Kuala Lumpur":"Asia/Kuala_Lumpur"}]}, "MV":{"n":"Maldives","z":[{"(GMT+05:00) Maldives":"Indian/Maldives"}]}, "ML":{"n":"Mali","z":[{"(GMT+00:00) Bamako":"Africa/Bamako"}]}, "MT":{"n":"Malta","z":[{"(GMT+01:00) Malta":"Europe/Malta"}]}, "MH":{"n":"Marshall Islands","z":[{"(GMT+12:00) Kwajalein":"Pacific/Kwajalein"},{"(GMT+12:00) Majuro":"Pacific/Majuro"}]}, "MQ":{"n":"Martinique","z":[{"(GMT-04:00) Martinique":"America/Martinique"}]}, "MR":{"n":"Mauritania","z":[{"(GMT+00:00) Nouakchott":"Africa/Nouakchott"}]}, "MU":{"n":"Mauritius","z":[{"(GMT+04:00) Mauritius":"Indian/Mauritius"}]}, "YT":{"n":"Mayotte","z":[{"(GMT+03:00) Mayotte":"Indian/Mayotte"}]}, "MX":{"n":"Mexico","z":[{"(GMT-07:00) Mountain Time - Hermosillo":"America/Hermosillo"},{"(GMT-08:00) Pacific Time - Tijuana":"America/Tijuana"},{"(GMT-07:00) Mountain Time - Chihuahua, Mazatlan":"America/Mazatlan"},{"(GMT-06:00) Central Time - Mexico City":"America/Mexico_City"}]}, "FM":{"n":"Micronesia","z":[{"(GMT+10:00) Truk":"Pacific/Truk"},{"(GMT+11:00) Kosrae":"Pacific/Kosrae"},{"(GMT+11:00) Ponape":"Pacific/Ponape"}]}, "MD":{"n":"Moldova","z":[{"(GMT+02:00) Chisinau":"Europe/Chisinau"}]}, "MC":{"n":"Monaco","z":[{"(GMT+01:00) Monaco":"Europe/Monaco"}]}, "MN":{"n":"Mongolia","z":[{"(GMT+07:00) Hovd":"Asia/Hovd"},{"(GMT+08:00) Choibalsan":"Asia/Choibalsan"},{"(GMT+08:00) Ulaanbaatar":"Asia/Ulaanbaatar"}]}, "MS":{"n":"Montserrat","z":[{"(GMT-04:00) Montserrat":"America/Montserrat"}]}, "MA":{"n":"Morocco","z":[{"(GMT+00:00) Casablanca":"Africa/Casablanca"}]}, "MZ":{"n":"Mozambique","z":[{"(GMT+02:00) Maputo":"Africa/Maputo"}]}, "MM":{"n":"Myanmar [Burma]","z":[{"(GMT+06:30) Rangoon":"Asia/Rangoon"}]}, "NA":{"n":"Namibia","z":[{"(GMT+01:00) Windhoek":"Africa/Windhoek"}]}, "NR":{"n":"Nauru","z":[{"(GMT+12:00) Nauru":"Pacific/Nauru"}]}, "NP":{"n":"Nepal","z":[{"(GMT+05:45) Katmandu":"Asia/Katmandu"}]}, "NL":{"n":"Netherlands","z":[{"(GMT+01:00) Amsterdam":"Europe/Amsterdam"}]}, "NC":{"n":"New Caledonia","z":[{"(GMT+11:00) Noumea":"Pacific/Noumea"}]}, "NZ":{"n":"New Zealand","z":[{"(GMT+12:00) Auckland":"Pacific/Auckland"}]}, "NI":{"n":"Nicaragua","z":[{"(GMT-06:00) Managua":"America/Managua"}]}, "NE":{"n":"Niger","z":[{"(GMT+01:00) Niamey":"Africa/Niamey"}]}, "NG":{"n":"Nigeria","z":[{"(GMT+01:00) Lagos":"Africa/Lagos"}]}, "NU":{"n":"Niue","z":[{"(GMT-11:00) Niue":"Pacific/Niue"}]}, "NF":{"n":"Norfolk Island","z":[{"(GMT+11:30) Norfolk":"Pacific/Norfolk"}]}, "KP":{"n":"North Korea","z":[{"(GMT+09:00) Pyongyang":"Asia/Pyongyang"}]}, "MP":{"n":"Northern Mariana Islands","z":[{"(GMT+10:00) Saipan":"Pacific/Saipan"}]}, "NO":{"n":"Norway","z":[{"(GMT+01:00) Oslo":"Europe/Oslo"}]}, "OM":{"n":"Oman","z":[{"(GMT+04:00) Muscat":"Asia/Muscat"}]}, "PK":{"n":"Pakistan","z":[{"(GMT+05:00) Karachi":"Asia/Karachi"}]}, "PW":{"n":"Palau","z":[{"(GMT+09:00) Palau":"Pacific/Palau"}]}, "PS":{"n":"Palestinian Territories","z":[{"(GMT+02:00) Gaza":"Asia/Gaza"}]}, "PA":{"n":"Panama","z":[{"(GMT-05:00) Panama":"America/Panama"}]}, "PG":{"n":"Papua New Guinea","z":[{"(GMT+10:00) Port Moresby":"Pacific/Port_Moresby"}]}, "PY":{"n":"Paraguay","z":[{"(GMT-04:00) Asuncion":"America/Asuncion"}]}, "PE":{"n":"Peru","z":[{"(GMT-05:00) Lima":"America/Lima"}]}, "PH":{"n":"Philippines","z":[{"(GMT+08:00) Manila":"Asia/Manila"}]}, "PN":{"n":"Pitcairn Islands","z":[{"(GMT-08:00) Pitcairn":"Pacific/Pitcairn"}]}, "PL":{"n":"Poland","z":[{"(GMT+01:00) Warsaw":"Europe/Warsaw"}]}, "PT":{"n":"Portugal","z":[{"(GMT-01:00) Azores":"Atlantic/Azores"},{"(GMT+00:00) Lisbon":"Europe/Lisbon"}]}, "PR":{"n":"Puerto Rico","z":[{"(GMT-04:00) Puerto Rico":"America/Puerto_Rico"}]}, "QA":{"n":"Qatar","z":[{"(GMT+03:00) Qatar":"Asia/Qatar"}]}, "RE":{"n":"Réunion","z":[{"(GMT+04:00) Reunion":"Indian/Reunion"}]}, "RO":{"n":"Romania","z":[{"(GMT+02:00) Bucharest":"Europe/Bucharest"}]}, "RU":{"n":"Russia","z":[{"(GMT+03:00) Moscow-01 - Kaliningrad":"Europe/Kaliningrad"},{"(GMT+04:00) Moscow+00":"Europe/Moscow"},{"(GMT+04:00) Moscow+00 - Samara":"Europe/Samara"},{"(GMT+06:00) Moscow+02 - Yekaterinburg":"Asia/Yekaterinburg"},{"(GMT+07:00) Moscow+03 - Omsk, Novosibirsk":"Asia/Omsk"},{"(GMT+08:00) Moscow+04 - Krasnoyarsk":"Asia/Krasnoyarsk"},{"(GMT+09:00) Moscow+05 - Irkutsk":"Asia/Irkutsk"},{"(GMT+10:00) Moscow+06 - Yakutsk":"Asia/Yakutsk"},{"(GMT+11:00) Moscow+07 - Yuzhno-Sakhalinsk":"Asia/Vladivostok"},{"(GMT+12:00) Moscow+08 - Magadan":"Asia/Magadan"},{"(GMT+12:00) Moscow+08 - Petropavlovsk-Kamchatskiy":"Asia/Kamchatka"}]}, "RW":{"n":"Rwanda","z":[{"(GMT+02:00) Kigali":"Africa/Kigali"}]}, "SH":{"n":"Saint Helena","z":[{"(GMT+00:00) St Helena":"Atlantic/St_Helena"}]}, "KN":{"n":"Saint Kitts and Nevis","z":[{"(GMT-04:00) St. Kitts":"America/St_Kitts"}]}, "LC":{"n":"Saint Lucia","z":[{"(GMT-04:00) St. Lucia":"America/St_Lucia"}]}, "PM":{"n":"Saint Pierre and Miquelon","z":[{"(GMT-03:00) Miquelon":"America/Miquelon"}]}, "VC":{"n":"Saint Vincent and the Grenadines","z":[{"(GMT-04:00) St. Vincent":"America/St_Vincent"}]}, "WS":{"n":"Samoa","z":[{"(GMT+13:00) Apia":"Pacific/Apia"}]}, "SM":{"n":"San Marino","z":[{"(GMT+01:00) Rome":"Europe/San_Marino"}]}, "ST":{"n":"São Tomé and Príncipe","z":[{"(GMT+00:00) Sao Tome":"Africa/Sao_Tome"}]}, "SA":{"n":"Saudi Arabia","z":[{"(GMT+03:00) Riyadh":"Asia/Riyadh"}]}, "SN":{"n":"Senegal","z":[{"(GMT+00:00) Dakar":"Africa/Dakar"}]}, "RS":{"n":"Serbia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Belgrade"}]}, "SC":{"n":"Seychelles","z":[{"(GMT+04:00) Mahe":"Indian/Mahe"}]}, "SL":{"n":"Sierra Leone","z":[{"(GMT+00:00) Freetown":"Africa/Freetown"}]}, "SG":{"n":"Singapore","z":[{"(GMT+08:00) Singapore":"Asia/Singapore"}]}, "SK":{"n":"Slovakia","z":[{"(GMT+01:00) Central European Time - Prague":"Europe/Bratislava"}]}, "SI":{"n":"Slovenia","z":[{"(GMT+01:00) Central European Time - Belgrade":"Europe/Ljubljana"}]}, "SB":{"n":"Solomon Islands","z":[{"(GMT+11:00) Guadalcanal":"Pacific/Guadalcanal"}]}, "SO":{"n":"Somalia","z":[{"(GMT+03:00) Mogadishu":"Africa/Mogadishu"}]}, "ZA":{"n":"South Africa","z":[{"(GMT+02:00) Johannesburg":"Africa/Johannesburg"}]}, "GS":{"n":"South Georgia and the South Sandwich Islands","z":[{"(GMT-02:00) South Georgia":"Atlantic/South_Georgia"}]}, "KR":{"n":"South Korea","z":[{"(GMT+09:00) Seoul":"Asia/Seoul"}]}, "ES":{"n":"Spain","z":[{"(GMT+00:00) Canary Islands":"Atlantic/Canary"},{"(GMT+01:00) Ceuta":"Africa/Ceuta"},{"(GMT+01:00) Madrid":"Europe/Madrid"}]}, "LK":{"n":"Sri Lanka","z":[{"(GMT+05:30) Colombo":"Asia/Colombo"}]}, "SD":{"n":"Sudan","z":[{"(GMT+03:00) Khartoum":"Africa/Khartoum"}]}, "SR":{"n":"Suriname","z":[{"(GMT-03:00) Paramaribo":"America/Paramaribo"}]}, "SJ":{"n":"Svalbard and Jan Mayen","z":[{"(GMT+01:00) Oslo":"Arctic/Longyearbyen"}]}, "SZ":{"n":"Swaziland","z":[{"(GMT+02:00) Mbabane":"Africa/Mbabane"}]}, "SE":{"n":"Sweden","z":[{"(GMT+01:00) Stockholm":"Europe/Stockholm"}]}, "CH":{"n":"Switzerland","z":[{"(GMT+01:00) Zurich":"Europe/Zurich"}]}, "SY":{"n":"Syria","z":[{"(GMT+02:00) Damascus":"Asia/Damascus"}]}, "TW":{"n":"Taiwan","z":[{"(GMT+08:00) Taipei":"Asia/Taipei"}]}, "TJ":{"n":"Tajikistan","z":[{"(GMT+05:00) Dushanbe":"Asia/Dushanbe"}]}, "TZ":{"n":"Tanzania","z":[{"(GMT+03:00) Dar es Salaam":"Africa/Dar_es_Salaam"}]}, "TH":{"n":"Thailand","z":[{"(GMT+07:00) Bangkok":"Asia/Bangkok"}]}, "TL":{"n":"Timor-Leste","z":[{"(GMT+09:00) Dili":"Asia/Dili"}]}, "TG":{"n":"Togo","z":[{"(GMT+00:00) Lome":"Africa/Lome"}]}, "TK":{"n":"Tokelau","z":[{"(GMT+14:00) Fakaofo":"Pacific/Fakaofo"}]}, "TO":{"n":"Tonga","z":[{"(GMT+13:00) Tongatapu":"Pacific/Tongatapu"}]}, "TT":{"n":"Trinidad and Tobago","z":[{"(GMT-04:00) Port of Spain":"America/Port_of_Spain"}]}, "TN":{"n":"Tunisia","z":[{"(GMT+01:00) Tunis":"Africa/Tunis"}]}, "TR":{"n":"Turkey","z":[{"(GMT+02:00) Istanbul":"Europe/Istanbul"}]}, "TM":{"n":"Turkmenistan","z":[{"(GMT+05:00) Ashgabat":"Asia/Ashgabat"}]}, "TC":{"n":"Turks and Caicos Islands","z":[{"(GMT-05:00) Grand Turk":"America/Grand_Turk"}]}, "TV":{"n":"Tuvalu","z":[{"(GMT+12:00) Funafuti":"Pacific/Funafuti"}]}, "UM":{"n":"U.S. Minor Outlying Islands","z":[{"(GMT-11:00) Midway":"Pacific/Midway"},{"(GMT-10:00) Johnston":"Pacific/Johnston"},{"(GMT+12:00) Wake":"Pacific/Wake"}]}, "VI":{"n":"U.S. Virgin Islands","z":[{"(GMT-04:00) St. Thomas":"America/St_Thomas"}]}, "UG":{"n":"Uganda","z":[{"(GMT+03:00) Kampala":"Africa/Kampala"}]}, "UA":{"n":"Ukraine","z":[{"(GMT+02:00) Kiev":"Europe/Kiev"}]}, "AE":{"n":"United Arab Emirates","z":[{"(GMT+04:00) Dubai":"Asia/Dubai"}]}, "GB":{"n":"United Kingdom","z":[{"(GMT+00:00) GMT (no daylight saving)":"Etc/GMT"},{"(GMT+00:00) London":"Europe/London"}]}, "US":{"n":"United States","z":[{"(GMT-10:00) Hawaii Time":"Pacific/Honolulu"},{"(GMT-09:00) Alaska Time":"America/Anchorage"},{"(GMT-07:00) Mountain Time - Arizona":"America/Phoenix"},{"(GMT-08:00) Pacific Time":"America/Los_Angeles"},{"(GMT-07:00) Mountain Time":"America/Denver"},{"(GMT-06:00) Central Time":"America/Chicago"},{"(GMT-05:00) Eastern Time":"America/New_York"}]}, "UY":{"n":"Uruguay","z":[{"(GMT-03:00) Montevideo":"America/Montevideo"}]}, "UZ":{"n":"Uzbekistan","z":[{"(GMT+05:00) Tashkent":"Asia/Tashkent"}]}, "VU":{"n":"Vanuatu","z":[{"(GMT+11:00) Efate":"Pacific/Efate"}]}, "VA":{"n":"Vatican City","z":[{"(GMT+01:00) Rome":"Europe/Vatican"}]}, "VE":{"n":"Venezuela","z":[{"(GMT-04:30) Caracas":"America/Caracas"}]}, "VN":{"n":"Vietnam","z":[{"(GMT+07:00) Hanoi":"Asia/Saigon"}]}, "WF":{"n":"Wallis and Futuna","z":[{"(GMT+12:00) Wallis":"Pacific/Wallis"}]}, "EH":{"n":"Western Sahara","z":[{"(GMT+00:00) El Aaiun":"Africa/El_Aaiun"}]}, "YE":{"n":"Yemen","z":[{"(GMT+03:00) Aden":"Asia/Aden"}]}, "ZM":{"n":"Zambia","z":[{"(GMT+02:00) Lusaka":"Africa/Lusaka"}]}, "ZW":{"n":"Zimbabwe","z":[{"(GMT+02:00) Harare":"Africa/Harare"}]} };
    },

    countlyCommon.getAppCategories = function(){
        return { 1:jQuery.i18n.map["application-category.books"], 2:jQuery.i18n.map["application-category.business"], 3:jQuery.i18n.map["application-category.education"], 4:jQuery.i18n.map["application-category.entertainment"], 5:jQuery.i18n.map["application-category.finance"], 6:jQuery.i18n.map["application-category.games"], 7:jQuery.i18n.map["application-category.health-fitness"], 8:jQuery.i18n.map["application-category.lifestyle"], 9:jQuery.i18n.map["application-category.medical"], 10:jQuery.i18n.map["application-category.music"], 11:jQuery.i18n.map["application-category.navigation"], 12:jQuery.i18n.map["application-category.news"], 13:jQuery.i18n.map["application-category.photography"], 14:jQuery.i18n.map["application-category.productivity"], 15:jQuery.i18n.map["application-category.reference"], 16:jQuery.i18n.map["application-category.social-networking"], 17:jQuery.i18n.map["application-category.sports"], 18:jQuery.i18n.map["application-category.travel"], 19:jQuery.i18n.map["application-category.utilities"], 20:jQuery.i18n.map["application-category.weather"]};
    },

    countlyCommon.getDashboardData = function(data, properties, _periodObj){
        function clearObject(obj){
            if (obj) {
                for(var i = 0; i < properties.length; i++){
                    if (!obj[properties[i]]) obj[properties[i]] = 0;
                }
            }
            else {
                obj = {}
                for(var i = 0; i < properties.length; i++){
                    obj[properties[i]] = 0;
                }
            }

            return obj;
        };

        var dataArr = {},
            tmp_x,
            tmp_y,
            current = {},
            previous = {},
            change = {};

            for(var i = 0; i < properties.length; i++){
                current[properties[i]] = 0;
                previous[properties[i]] = 0;
            }

        if (_periodObj.isSpecialPeriod) {

            for (var j = 0; j < (_periodObj.currentPeriodArr.length); j++) {
                tmp_x = countlyCommon.getDescendantProp(data, _periodObj.currentPeriodArr[j]);
                tmp_x = clearObject(tmp_x);
                for(var i = 0; i < properties.length; i++){
                    current[properties[i]] += tmp_x[properties[i]];
                }
            }

            for (var j = 0; j < (_periodObj.previousPeriodArr.length); j++) {
                tmp_y = countlyCommon.getDescendantProp(data, _periodObj.previousPeriodArr[j]);
                tmp_y = clearObject(tmp_y);
                for(var i = 0; i < properties.length; i++){
                    previous[properties[i]] += tmp_y[properties[i]];
                }
            }
        } else {
            tmp_x = countlyCommon.getDescendantProp(data, _periodObj.activePeriod);
            tmp_y = countlyCommon.getDescendantProp(data, _periodObj.previousPeriod);
            tmp_x = clearObject(tmp_x);
            tmp_y = clearObject(tmp_y);

            for(var i = 0; i < properties.length; i++){
                current[properties[i]] = tmp_x[properties[i]];
                previous[properties[i]] = tmp_y[properties[i]];
            }
        }

        for(var i = 0; i < properties.length; i++){
            change[properties[i]] = countlyCommon.getPercentChange(previous[properties[i]], current[properties[i]]);
            dataArr[properties[i]] = {
                "total":current[properties[i]],
                "change":change[properties[i]].percent,
                "trend":change[properties[i]].trend,
            };
        }

        return dataArr;
    }


    // Private Methods

    function getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    function getDOY() {
        var onejan = new Date((new Date()).getFullYear(),0,1);
        return Math.ceil(((new Date()) - onejan) / 86400000);
    }

    // Returns a period object used by all time related data calculation functions.
    function getPeriodObj() {

        var now = moment(),
            year = now.year(),
            month = (now.month() + 1),
            day = now.date(),
            hour = (now.hours()),
            activePeriod,
            previousPeriod,
            periodMax,
            periodMin,
            periodObj = {},
            isSpecialPeriod = false,
            daysInPeriod = 0,
            numberOfDays = 0,
            rangeEndDay = null,
            dateString,
            uniquePeriodsCheck = [],
            previousUniquePeriodsCheck = [];

        switch (_period) {
            case "month":
                /*activePeriod = year;
                previousPeriod = year - 1;
                periodMax = month;
                periodMin = 1;
                dateString = "MMM";
                numberOfDays = getDOY();*/

                var now = new Date();
                var start = new Date(now.getFullYear(), 0, 0);
                var diff = now - start;
                var oneDay = 1000 * 60 * 60 * 24;
                var day = Math.floor(diff / oneDay);

                numberOfDays = daysInPeriod = day;

                break;
            case "day":
                activePeriod = year + "." + month;

                var previousDate = moment().subtract('days', day),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth;
                periodMax = day;
                periodMin = 1;
                dateString = "D MMM";
                numberOfDays = moment().format("D");
                break;
            case "yesterday":
                var yesterday = moment().subtract('days', 1),
                    year = yesterday.year(),
                    month = (yesterday.month() + 1),
                    day = yesterday.date();

                activePeriod = year + "." + month + "." + day;
                var previousDate = moment().subtract('days', 2),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth + "." + previousDay;
                periodMax = 23;
                periodMin = 0;
                dateString = "D MMM, HH:mm";
                numberOfDays = 1;
                break;
            case "hour":
                activePeriod = year + "." + month + "." + day;
                var previousDate = moment().subtract('days', 1),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth + "." + previousDay;
                periodMax = hour;
                periodMin = 0;
                dateString = "HH:mm";
                numberOfDays = 1;
                break;
            case "7days":
                numberOfDays = daysInPeriod = 7;
                break;
            case "30days":
                numberOfDays = daysInPeriod = 30;
                break;
            case "60days":
                numberOfDays = daysInPeriod = 60;
                break;
            case "90days":
                numberOfDays = daysInPeriod = 90;
                break;
            default:
                break;
        }

        if (!_period[0])
        {
            _period[0] = _period[1] - (60 * 60 * 24 * 1000); // todo: fast fix !
        }

        // Check whether period object is array
        if (Object.prototype.toString.call(_period) === '[object Array]' && _period.length == 2) {
            var tmpDate = new Date (_period[1]);
            tmpDate.setHours(0,0,0,0);
            _period[1]= tmpDate.getTime();
            // One day is selected from the datepicker
            if (_period[0] == _period[1]) {
                var selectedDate = moment(_period[0]),
                    selectedYear = selectedDate.year(),
                    selectedMonth = (selectedDate.month() + 1),
                    selectedDay = selectedDate.date(),
                    selectedHour = (selectedDate.hours());

                activePeriod = selectedYear + "." + selectedMonth + "." + selectedDay;

                var previousDate = selectedDate.subtract('days', 1),
                    previousYear = previousDate.year(),
                    previousMonth = (previousDate.month() + 1),
                    previousDay = previousDate.date();

                previousPeriod = previousYear + "." + previousMonth + "." + previousDay;
                periodMax = 23;
                periodMin = 0;
                dateString = "D MMM, HH:mm";
                numberOfDays = 1;
            } else {
                var a = moment(_period[0]),
                    b = moment(_period[1]);

                numberOfDays = daysInPeriod = b.diff(a, 'days') + 1;
                rangeEndDay = _period[1];
            }
        }

        if (daysInPeriod != 0) {
            var yearChanged = false,
                currentYear = 0,
                currWeeksArr = [],
                currWeekCounts = {},
                currMonthsArr = [],
                currMonthCounts = {},
                currPeriodArr = [],
                prevWeeksArr = [],
                prevWeekCounts = {},
                prevMonthsArr = [],
                prevMonthCounts = {},
                prevPeriodArr = [];

            for (var i = (daysInPeriod - 1); i > -1; i--) {
                var currIndex = (!rangeEndDay) ? moment().subtract('days', i) : moment(rangeEndDay).subtract('days', i),
                    currIndexYear = currIndex.year(),
                    prevIndex = (!rangeEndDay) ? moment().subtract('days', (daysInPeriod + i)) : moment(rangeEndDay).subtract('days', (daysInPeriod + i)),
                    prevYear = prevIndex.year();

                if (i != (daysInPeriod - 1) && currentYear != currIndexYear) {
                    yearChanged = true;
                }
                currentYear = currIndexYear;

                // Current period variables

                var currWeek = currentYear + "." + "w" + Math.ceil(currIndex.format("DDD") / 7);
                currWeeksArr[currWeeksArr.length] = currWeek;
                currWeekCounts[currWeek] = (currWeekCounts[currWeek]) ? (currWeekCounts[currWeek] + 1) : 1;

                var currMonth = currIndex.format("YYYY.M");
                currMonthsArr[currMonthsArr.length] = currMonth;
                currMonthCounts[currMonth] = (currMonthCounts[currMonth]) ? (currMonthCounts[currMonth] + 1) : 1;

                currPeriodArr[currPeriodArr.length] = currIndex.format("YYYY.M.D");

                // Previous period variables

                var prevWeek = prevYear + "." + "w" + Math.ceil(prevIndex.format("DDD") / 7);
                prevWeeksArr[prevWeeksArr.length] = prevWeek;
                prevWeekCounts[prevWeek] = (prevWeekCounts[prevWeek]) ? (prevWeekCounts[prevWeek] + 1) : 1;

                var prevMonth = prevIndex.format("YYYY.M");
                prevMonthsArr[prevMonthsArr.length] = prevMonth;
                prevMonthCounts[prevMonth] = (prevMonthCounts[prevMonth]) ? (prevMonthCounts[prevMonth] + 1) : 1;

                prevPeriodArr[prevPeriodArr.length] = prevIndex.format("YYYY.M.D");
            }

            dateString = (yearChanged) ? "D MMM, YYYY" : "D MMM";
            isSpecialPeriod = true;
        }

        periodObj = {
            "activePeriod":activePeriod,
            "periodMax":periodMax,
            "periodMin":periodMin,
            "previousPeriod":previousPeriod,
            "currentPeriodArr":currPeriodArr,
            "previousPeriodArr":prevPeriodArr,
            "isSpecialPeriod":isSpecialPeriod,
            "dateString":dateString,
            "daysInPeriod":daysInPeriod,
            "numberOfDays":numberOfDays,
            "uniquePeriodArr":getUniqArray(currWeeksArr, currWeekCounts, currMonthsArr, currMonthCounts, currPeriodArr),
            "uniquePeriodCheckArr":getUniqCheckArray(currWeeksArr, currWeekCounts, currMonthsArr, currMonthCounts),
            "previousUniquePeriodArr":getUniqArray(prevWeeksArr, prevWeekCounts, prevMonthsArr, prevMonthCounts, prevPeriodArr),
            "previousUniquePeriodCheckArr":getUniqCheckArray(prevWeeksArr, prevWeekCounts, prevMonthsArr, prevMonthCounts)
        };

        return periodObj;
    }

    function getUniqArray(weeksArray, weekCounts, monthsArray, monthCounts, periodArr) {

        if (_period == "month" || _period == "day" || _period == "yesterday" || _period == "hour") {
            return [];
        }

        if (Object.prototype.toString.call(_period) === '[object Array]' && _period.length == 2) {
            if (_period[0] == _period[1]) {
                return [];
            }
        }

        var weeksArray = clone(weeksArray),
            weekCounts = clone(weekCounts),
            monthsArray = clone(monthsArray),
            monthCounts = clone(monthCounts),
            periodArr = clone(periodArr);

        var uniquePeriods = [],
            tmpDaysInMonth = -1,
            tmpPrevKey = -1,
            rejectedWeeks = [],
            rejectedWeekDayCounts = {};

        for (var key in weekCounts) {

            // If this is the current week we can use it
            if (key === moment().format("YYYY.\\w w").replace(" ", "")) {
                continue;
            }

            if (weekCounts[key] < 7) {
                for (var i = 0; i < weeksArray.length; i++) {
                    weeksArray[i] = weeksArray[i].replace(key, 0);
                }
            }
        }

        for (var key in monthCounts) {
            if (tmpPrevKey != key) {
                if (moment().format("YYYY.M") === key) {
                    tmpDaysInMonth = moment().format("D");
                } else {
                    tmpDaysInMonth = moment(key, "YYYY.M").daysInMonth();
                }

                tmpPrevKey = key;
            }

            if (monthCounts[key] < tmpDaysInMonth) {
                for (var i = 0; i < monthsArray.length; i++) {
                    monthsArray[i] = monthsArray[i].replace(key, 0);
                }
            }
        }

        for (var i = 0; i < monthsArray.length; i++) {
            if (monthsArray[i] == 0) {
                if (weeksArray[i] == 0 || (rejectedWeeks.indexOf(weeksArray[i]) != -1)) {
                    uniquePeriods[i] = periodArr[i];
                } else {
                    uniquePeriods[i] = weeksArray[i];
                }
            } else {
                rejectedWeeks[rejectedWeeks.length] = weeksArray[i];
                uniquePeriods[i] = monthsArray[i];

                if (rejectedWeekDayCounts[weeksArray[i]]) {
                    rejectedWeekDayCounts[weeksArray[i]].count++;
                } else {
                    rejectedWeekDayCounts[weeksArray[i]] = {
                        count:1,
                        index:i
                    };
                }
            }
        }

        var totalWeekCounts = _.countBy(weeksArray, function (per) {
            return per;
        });

        for (var weekDayCount in rejectedWeekDayCounts) {

            // If the whole week is rejected continue
            if (rejectedWeekDayCounts[weekDayCount].count == 7) {
                continue;
            }

            // If its the current week continue
            if (moment().format("YYYY.\\w w").replace(" ", "") == weekDayCount && totalWeekCounts[weekDayCount] == rejectedWeekDayCounts[weekDayCount].count) {
                continue;
            }

            // If only some part of the week is rejected we should add back daily buckets

            var startIndex = rejectedWeekDayCounts[weekDayCount].index - (totalWeekCounts[weekDayCount] - rejectedWeekDayCounts[weekDayCount].count),
                limit = startIndex + (totalWeekCounts[weekDayCount] - rejectedWeekDayCounts[weekDayCount].count);

            for (var i = startIndex; i < limit; i++) {
                // If there isn't already a monthly bucket for that day
                if (monthsArray[i] == 0) {
                    uniquePeriods[i] = periodArr[i];
                }
            }
        }

        rejectedWeeks = _.uniq(rejectedWeeks);
        uniquePeriods = _.uniq(_.difference(uniquePeriods, rejectedWeeks));

        return uniquePeriods;
    }

    function getUniqCheckArray(weeksArray, weekCounts, monthsArray, monthCounts) {

        if (_period == "month" || _period == "day" || _period == "yesterday" || _period == "hour") {
            return [];
        }

        if (Object.prototype.toString.call(_period) === '[object Array]' && _period.length == 2) {
            if (_period[0] == _period[1]) {
                return [];
            }
        }

        var weeksArray = clone(weeksArray),
            weekCounts = clone(weekCounts),
            monthsArray = clone(monthsArray),
            monthCounts = clone(monthCounts);

        var uniquePeriods = [],
            tmpDaysInMonth = -1,
            tmpPrevKey = -1;

        for (var key in weekCounts) {
            if (key === moment().format("YYYY.\\w w").replace(" ", "")) {
                continue;
            }

            if (weekCounts[key] < 1) {
                for (var i = 0; i < weeksArray.length; i++) {
                    weeksArray[i] = weeksArray[i].replace(key, 0);
                }
            }
        }

        for (var key in monthCounts) {
            if (tmpPrevKey != key) {
                if (moment().format("YYYY.M") === key) {
                    tmpDaysInMonth = moment().format("D");
                } else {
                    tmpDaysInMonth = moment(key, "YYYY.M").daysInMonth();
                }

                tmpPrevKey = key;
            }

            if (monthCounts[key] < (tmpDaysInMonth * 0.5)) {
                for (var i = 0; i < monthsArray.length; i++) {
                    monthsArray[i] = monthsArray[i].replace(key, 0);
                }
            }
        }

        for (var i = 0; i < monthsArray.length; i++) {
            if (monthsArray[i] == 0) {
                if (weeksArray[i] == 0) {

                } else {
                    uniquePeriods[i] = weeksArray[i];
                }
            } else {
                uniquePeriods[i] = monthsArray[i];
            }
        }

        uniquePeriods = _.uniq(uniquePeriods);

        return uniquePeriods;
    }

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;

        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = clone(obj[i]);
            }
            return copy;
        }

        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
            }
            return copy;
        }
    }

    // Function to show the tooltip when any data point in the graph is hovered on.
    function showTooltip(x, y, contents, title) {
        var tooltip = "";

        if (title) {
            var tooltipTitle = '<span id="graph-tooltip-title">' + title + '</span>';
            tooltip = '<div id="graph-tooltip">' + tooltipTitle + contents + '</div>'
        } else {
            tooltip = '<div id="graph-tooltip">' + contents + '</div>'
        }

        $("#content").append("<div id='tooltip-calc'>" + tooltip + "</div>");
        var widthVal = $("#graph-tooltip").outerWidth();
        $("#tooltip-calc").remove();

        var newLeft = (x - (widthVal / 2)),
            xReach = (x + (widthVal / 2));

        if (xReach > $(window).width()) {
            newLeft = (x - widthVal);
        } else if (xReach < 340) {
            newLeft = x;
        }

        $(tooltip).css({
            top:y,
            left:newLeft
        }).appendTo("body").fadeIn(200);
    }

    function flattenObjUntilLastProp(ob) {
        var toReturn = flattenObj(ob);

        for (var i in toReturn) {
            var n = i.lastIndexOf('.');

            if (n !== -1) {
                toReturn[i.substring(0, n)] = toReturn[i];
                delete toReturn[i];
            }
        }

        return toReturn
    }

    function flattenObj(ob) {
        var toReturn = {};

        for (var i in ob) {
            if ((typeof ob[i]) == 'object') {
                var flatObject = flattenObj(ob[i]);
                for (var x in flatObject) {
                    toReturn[i + '.' + x] = flatObject[x];
                }
            } else {
                toReturn[i] = ob;
            }
        }

        return toReturn;
    }

}(window.countlyCommon = window.countlyCommon || {}, jQuery));
