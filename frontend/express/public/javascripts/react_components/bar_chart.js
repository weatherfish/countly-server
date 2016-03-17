var Chart = React.createClass({

    y_scale_log : false,

    colors : ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575", "#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"],

    getInitialState: function() {

        var data = this.props.data_function();

        console.log("<<<<<<<<<<<<<<<< CHART data >>>>>>>>>>>>>>>>>>>");
        console.log(data);

        data = data.chartData;

        for (var i = 0; i < data.length; i++)
        {
            data[i].color = this.colors[i];
        }

        for (var i = 0; i < data.length; i++)
        {
            data[i].active = true;
        }

        return {
            data : data,
            tooltip_is_active : false
        };
    },

    componentWillReceiveProps: function(nextProps) {

        /*if (nextProps.date != this.props.date) // todo !!!!!!!!!!!!!!!!!!!!!!
        {*/

            console.log("{{{{{{{{{{{ receive props }}}}}}}}}}}");
            console.log(nextProps);

            var data = this.props.data_function();

            data = data.chartData;

            for (var i = 0; i < data.length; i++)
            {
                data[i].color = this.colors[i];
            }

            for (var i = 0; i < data.length; i++)
            {

                var found = false;

                for (var j = 0; j < this.state.data.length; j++)
                {

                    if (data[i].color == this.state.data[j].color)
                    {
                        data[i].active = this.state.data[j].active;
                        found = true;
                        break;
                    }

                }

                if (!found)
                {
                    data[i].active = true;
                }

            }

            this.setState({
                data : data
            });
        //}
    },
/*
    componentWillMount: function() {

        $(event_emitter).on('data_changed', function(e, data){

        }.bind(this));

    },
*/
    get_domain : function(data) {

        var self = this;

        // Requires that at least one series contains some data
        var yMin = +Infinity;
        var yMax = -Infinity;

        data.forEach( function(d) {

            if (!d.active)
            {
                return false;
            }

            var y = d[self.props.headers[1]["short"]];

            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;

        });

        return { y: [yMin, yMax] };

    },

    tick_click : function(d, i){

        var data = this.state.data;

        data[i].active = !data[i].active;

        this.setState({
            "data" : data
        });

    },

    draw_tooltip : function(element, d, i, total_count, react_element)
    {

        var self = this;

        var tooltip_height = 44;
        var tooltip_width = 60;
        var tooltip_margin_bottom = 10;
        var bar_width = 40;

        var bars_margin_bottom = 40;
        var text_height = 20;

        var data = react_element.state.data;

        /*var y_scale_log = d3.scale.linear()
            .domain([1, d3.max(data, function(d) { return d.t; })]).nice()
            .range([react_element.props.height - bars_margin_bottom, 0])*/

        var tooltip = d3.select(element)
                          .append("g")
                          .attr("class", "tooltip")
                          .attr("transform", function(d, i) {
                              var xv = (-1 * ((/*this.props.*/tooltip_width - /*this.props.*/bar_width) / 2));
                              var yv = self.y_scale_log(d[self.props.headers[1]["short"]]) - /*this.props.*/tooltip_height - tooltip_margin_bottom;
                              return "translate(" + xv + "," + yv + ")";
                          })

        tooltip.append("rect")
                /*.attr("x", -1 * ((tooltip_width - self.props.bar_width) / 2))
                .attr("y", function(d) { return y(d.t) - tooltip_height - tooltip_margin_bottom; })*/
                .attr("height", tooltip_height)
                .attr("width", tooltip_width)
                .attr("rx", 2)
                .attr("ry", 2)
                .style("fill", function(d) {
                    return "gray";
                })

        var triangle_width = 14;
        var triangle_height = 7;

        var points = "00,00 07,07 14,00";

        tooltip.append("polygon")
              .attr("points", points)
              .attr("transform", function(d, i) {
                  var xv = (tooltip_width - triangle_width) / 2;
                  var yv = tooltip_height - 1;
                  return "translate(" + xv + "," + yv + ")";
              })
              .style("fill", "gray")

        tooltip.append("text")
                .attr("class", "count")
                .text(function(d) {
                    var value = d[self.props.headers[1]["short"]].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return value;
                })
                .attr("x", function(d) {
                    var x = (tooltip_width - this.getBBox().width) / 2/* - (this.getBBox().width / 2)*/;
                    return x;
                })
                .attr("y", function(d) {
                    //var y = this.getBBox().height;
                    return 20;
                })
                .attr("width", tooltip_width + "px")
                .style("fill", "white")

        tooltip.append("text")
                .attr("class", "percent")
                .text(function(d) {
                    var percent = Math.round((d[self.props.headers[1]["short"]] / total_count) * 100);
                    return percent + "%";
                })
                .attr("x", function(d) {
                    var x = (tooltip_width - this.getBBox().width) / 2 /*- (this.getBBox().width * 2)*/;
                    return x;
                })
                .attr("y", 35)
                .style("fill", "white")


    },

    draw_bars : function(container)
    {

        var self = this;

        var data = this.state.data;

        var margin = {
            top    : 20,
            right  : 150,
            bottom : 30,
            left   : 40
        };

        var bars_margin_bottom = 40;
        var text_height = 20;

        var height = this.props.height;
        var width = this.svg_style.width;

        //var barWidth = width / this.state.data.length;
        //var one_bar_width = 40;

        var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width], .1);

        x.domain(data.map(function(d) { return d.f; }));
/*
        var y_scale_circle = d3.scale.log(10).range([0, 30]);
        y_scale_circle.domain([1, d3.max(data, function(d) { return d.t; })]).nice();
*/
        this.y_scale_log = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
                if (!d.active) return 0;
                //return d.t;
                return d[self.props.headers[1]["short"]];
            })]).nice()
            .range([height - bars_margin_bottom, 0])
            /*.base(10)*/

        //var chart = d3.select(".chart");

        if (!this.chart)
        {
            this.chart = d3.select(container)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        this.domain = this.get_domain(data);

        var total_count = 0;
        data.forEach(function(element){
            if (element.active) total_count += element.t;
        });

        var axis = this.draw_y_axis("left");
        this.draw_y_axis("right");
        this.draw_grid(axis)

        var all_bars_width = self.props.bar_width * data.length;
        var bar_space = (width - all_bars_width - (self.axis_width * 2)) / (data.length * 2/* - 1*/);

        var bar_block = this.chart.selectAll("g.bar_block")
                        .data(data, function(d){
                            return d.color;
                        })


        bar_block.transition()
          .duration(750)
          .attr("transform", function(d, i) {
                            return "translate(" + parseInt(i * (bar_space * 2 + self.props.bar_width) + bar_space + self.axis_width) + ",0)";
                        })


        bar_block.attr("y", function(d) {

            if (!d.active){
                return height - 2;
            }

            return self.y_scale_log(d[self.props.headers[1]["short"]]);
        })

        var i = 0;
        var ij = 0;

        bar_block.selectAll(".bar_rect")
            .transition()
            .duration(750)
            .attr("d", function(d/*, i*/){
                //var xv = height - y(d.t) - bars_margin_bottom;

                var d = data[i]; // todo: FIX - not actual data in default  "d"
                i++;

                if (!d.active){
                    var yv = self.y_scale_log(0);
                    var h = 2;
                    var r = 0;
                }
                else
                {
                    var yv = self.y_scale_log(d[self.props.headers[1]["short"]]);
                    var h = height - self.y_scale_log(d[self.props.headers[1]["short"]]) - bars_margin_bottom;
                    var r = 2;
                }

                var rect = self.rounded_rect(0, yv, self.props.bar_width, h, r, true, true, false, false);

                return rect;
            })
            .style("fill", function(d) {

                var d = data[ij]; // todo: FIX - not actual data in default  "d"
                ij++;

                if (!d.active){
                    return "gray";
                }

                return d.color;
            })


        var i = 0;
        var ij = 0;

        bar_block.selectAll(".checkbox_rect")
            .transition()
            .duration(750)
            .style("fill", function(d) {

                var d = data[i]; // todo: FIX - not actual data in default  "d"
                i++;

                if (!d.active)
                {
                    return "white";
                }

                return d.color;
            })
            .attr("stroke", function(d) {

                var d = data[ij]; // todo: FIX - not actual data in default  "d"
                ij++;

                if (!d.active)
                {
                    return "black";
                }

                return d.color;
            })

        // creating blocks

        var enter = bar_block.enter().append("g")
            .attr("class", "bar_block")
            .attr("transform", function(d, i) {
                return "translate(" + parseInt(i * (bar_space * 2 + self.props.bar_width) + bar_space + self.axis_width) + ",0)";
            })
            .style("opacity", 0)

        enter.transition()
            .duration(750)
            .style("opacity", 1)


        var bar_rect = enter.append("path")
            .attr("class", "bar_rect")
            .style("fill", function(d) {
                return d.color;
            })
            .attr("d", function(d){

                var yv = self.y_scale_log(d[self.props.headers[1]["short"]]);
                var h = height - self.y_scale_log(d[self.props.headers[1]["short"]]) - bars_margin_bottom;
                var rect = self.rounded_rect(0, yv, self.props.bar_width, h, 2, true, true, false, false);

                return rect;
            })

        var enter_checkbox = enter.append("rect")
            .attr("class", "checkbox_rect")
            .attr("transform", function(d, i) {
                return "translate(20,310)";
            })
            .attr("height", 15)
            .attr("width", 15)
            .attr("x", -7)
            .style("fill", function(d) {
                return d.color;
            })
            .on("click", this.tick_click)
            .attr("rx", 1)
            .attr("ry", 1)
            .attr("stroke-width", 1)
            .attr("stroke", function(d) {
                return d.color;
            })

        enter.append("image")
            .attr("transform", function(d, i) {
                return "translate(14,310)";
            })
            .attr("height", 13)
            .attr("width", 13)
            .attr("xlink:href", "../images/tick.svg")
            .on("click", this.tick_click)

        var label = enter.append("text")
            .attr("class", "bar_text")
            //.attr("x", 0/*self.props.bar_width / 2*/)
            .attr("y", height - text_height/*function(d) { return y(d.t) + 3; }*/)
            .text(function(d) {
                return d[self.props.headers[0]["short"]];//d.f;
            })
            .attr("x", function(d) {

                var x = (self.props.bar_width - this.getBBox().width) / 2;

                //var x = (tooltip_width - this.getBBox().width) / 2 - (this.getBBox().width / 2);
                return x/* - 30*/;
            })
            /*.attr("dy", ".75em")*/

        bar_block.exit()
            .transition()
            .duration(750)
            .style("opacity", 0)
            .remove();

        bar_rect.on("mouseover", function(d, e)
            {
                self.draw_tooltip(this.parentNode, d, e, total_count, self);

                self.setState({
                    tooltip_is_active : true
                });

            })
            .on("mouseout", function(d, e)
            {
                d3.selectAll(".tooltip").remove();

                self.setState({
                    tooltip_is_active : false
                });

            });

    },

    rounded_rect : function (x, y, w, h, r, tl, tr, bl, br) {
        var retval;
        retval  = "M" + (x + r) + "," + y;
        retval += "h" + (w - 2*r);
        if (tr) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + r; }
        else { retval += "h" + r; retval += "v" + r; }
        retval += "v" + (h - 2*r);
        if (br) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + r; }
        else { retval += "v" + r; retval += "h" + -r; }
        retval += "h" + (2*r - w);
        if (bl) { retval += "a" + r + "," + r + " 0 0 1 " + -r + "," + -r; }
        else { retval += "h" + -r; retval += "v" + -r; }
        retval += "v" + (2*r - h);
        if (tl) { retval += "a" + r + "," + r + " 0 0 1 " + r + "," + -r; }
        else { retval += "v" + -r; retval += "h" + r; }
        retval += "z";
        return retval;
    },

    draw_y_axis : function(orientation)
    {

        //var this.y_scale_log = d3.scale.log(1000).range([height - bars_margin_bottom, 0]);
        var axis = d3.svg.axis().ticks(10).tickFormat(function(d) {
            //console.log("-- draw tick ---");
            //console.log(d);
            return formatValue(d).replace('0.0', '0').replace('.0', '');/* return d*/
        }).orient(orientation).scale(this.y_scale_log);

        //var ticks = axis.;

        var ticks = this.y_scale_log.ticks();

        //axis.tickFormat(function(x) { return x });

        //if (this.tickValues) axis.tickValues(this.tickValues);

        this.axis_width = 35;

        if (orientation == 'left')
        {
            var transform = 'translate(' + this.axis_width + ', ' + 0 + ')'; // todo: calculate 35
        }
        else
        {
            //var berth = this.props.height * 0.10;
            var transform = 'translate(' + (this.svg_style.width - this.axis_width) + ', ' + 0 + ')';
        }
/*
        if (this.element) {
          this.vis.selectAll('*').remove();
        }
*/

        var y_domain = Math.round(this.domain.y[1]);

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
        var y_inverted = this.y_scale_log;

        var tick_values = [];

/*
        var ticks_count = 5;

        var tick_size = (y_domain) / ticks_count;

        for (var i = 0; i <= ticks_count; i++)
        {
            tick_values.push(Math.round(i * tick_size));
        }
*/

        for(var i = 0; i < ticks.length; i+=1)
        {
            tick_values.push(ticks[i]);
        }

        var formatValue = d3.format(".2s");

        if ((orientation == "left" && this.axis_left_inited) || (orientation == "right" && this.axis_right_inited))
        {

            var svg = d3.select("body").transition();

            svg.select(".y_axis." + orientation)
                .duration(750)
                .call(axis.tickValues(tick_values))
        }
        else
        {
            this.chart
                .append("svg:g")
                .attr("class", "y_axis " + orientation)
                .attr("transform", transform)
                .call(axis/*.scale(y_inverted)*//*.ticks(20, "s").tickSize(6, 0)*/.tickValues(tick_values))
                .call(function(g){
                    g.selectAll("path").remove();
                    g.selectAll("line").remove();
                })

            if (orientation == "left")
            {
                this.axis_left_inited = true;
            }
            else
            {
                this.axis_right_inited = true;
            }

                //.call(axis/*.scale(y_inverted)*/.ticks(5)/*.tickValues(tick_values)*/.tickFormat(function(d) {
                //    //console.log("-- draw tick ---");
                //    //console.log(d);
                //    return formatValue(d).replace('0.0', '0').replace('.0', '');/* return d*/
                //}))
        }

        return axis;

    },

    draw_grid : function(axis) {

        var self = this;

        var ticks = this.y_scale_log.ticks();

        var gridSize = this.svg_style.width - this.axis_width * 2; //todo: var

        var y_domain = Math.round(this.domain.y[1]);

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
        var y_inverted = this.y_scale_log;

        var tick_values = [];

        for(var i = 0; i < ticks.length; i+=1)
        {
            tick_values.push(ticks[i]);
        }

        if (!this.grid_inited)
        {

            this.chart
                .append("svg:g")
                .attr("class", "y_grid")
                .call(axis.tickSize(gridSize).tickValues(tick_values))
                .attr("transform", function(d) {
                    return "translate(" + (self.props.width /*- self.axis_width*/ - 100) + "," + 0 + ")"; // todo: x position
                })

                this.grid_inited = true;

        }
        else
        {
            //var svg = d3.select("body").transition();

            var svg = d3.select("body").transition();

            svg.select(".y_grid")
                .duration(750)
                .call(axis.tickSize(gridSize).tickValues(tick_values));

        }

    },

    render : function(){

        this.svg_style = {
            width : this.props.width - this.props.side_margin * 2,
            left : this.props.side_margin
        }

        if (this.state.tooltip_is_active)
        {
            this.svg_style.overflow = "visible";
        }
        else
        {
            this.svg_style.overflow = "hidden";
        }

        //this.svg_style = svg_style;

        var nodata_block_style = {
            width : this.props.width
        };

        if (this.state.data.length > 0)
        {
            nodata_block_style.display = "none";
        }
        else
        {
            nodata_block_style.display = "block";
        }

        return (
            <div className="bar_chart_wrapper">

                {(() => {

                    if (this.props.headline_sign){
                        return(<div className="headline_sign">{this.props.headline_sign}</div>)
                    }

                })()}

                <svg className="bar_chart" style={this.svg_style} id="bar_chart">
                </svg>

                <div style={nodata_block_style} className="nodata_block">No data</div>

            </div>
        );
    },

    componentDidMount : function()
    {
        this.draw_bars("#bar_chart"); // todo: genarate unuque elements id
    },

    componentDidUpdate : function()
    {
        this.draw_bars("#bar_chart");
    },

});
