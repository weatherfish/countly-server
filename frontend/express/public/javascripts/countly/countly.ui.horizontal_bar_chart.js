var HorizontalBarChart = React.createClass({

    getInitialState: function() {

        var data = this.props.data_function();

        console.log("====== init data ========");
        console.log(data);

        data = data.chartData;

        //var test_data = [];

        var rand = getRandomInt(1, (data[0]["t"] / (data.length + 2)));

        var last_value = false;

        for (var i = 0; i < data.length; i++)
        {
            for (var key in data[i])
            {

                if (key.length != 1) continue;

                if (!last_value)
                {
                    last_value = data[i][key];
                }
                else
                {
                    last_value = Math.round(last_value - (last_value / 100 * getRandomInt(4, 15)));
                }

                data[i][key] = last_value;

            }
        }

        console.log("====== converted data ========");
        console.log(data);

        function getRandomInt(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

/*
        data = data.chartDPTotal.dp;

        var formatted_data = [];

        for (var i = 0; i < data.length; i++)
        {
            formatted_data.push({ label : data[i]['label'], value: data[i]["data"][0][1] })
        }
*/
        return {
            data : data
        };
    },

    componentWillMount: function() {

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change

            var data = this.props.data_function();

            data = data.chartData;

            //var test_data = [];

            var rand = getRandomInt(1, (data[0]["t"] / (data.length + 2)));

            var last_value = false;

            for (var i = 0; i < data.length; i++)
            {
                for (var key in data[i])
                {

                    if (key.length != 1) continue;

                    if (!last_value)
                    {
                        last_value = data[i][key];
                    }
                    else
                    {
                        last_value = Math.round(last_value - (last_value / 100 * getRandomInt(4, 15)));
                    }

                    console.log("last_value:", last_value, ", minus:", (last_value / 100 * getRandomInt(10, 40)));

                    data[i][key] = last_value;

                }
            }

            console.log("====== converted data ========");
            console.log(data);

            function getRandomInt(min, max)
            {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            this.setState({
                data : data
            });


        }.bind(this));

        $(event_emitter).on('data_changed', function(e, data){



        }.bind(this));

    },

    get_domain : function(data) {

        // Requires that at least one series contains some data
        var yMin = +Infinity;
        var yMax = -Infinity;

        data.forEach( function(d) {

            if (!d.active)
            {
                return false;
            }

            var y = d.t;

            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;

        });

        return { y: [yMin, yMax] };

    },

    draw : function(container)
    {

        console.log("<<<<<<<<<<<<<<< draw >>>>>>>>>>>>>>>>");
        console.log(container);

        var self = this;

        var margin = {
            top    : 20,
            right  : 150,
            bottom : 30,
            left   : 40
        };

        //var height = 750 - margin.top - margin.bottom;

        var colors = ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"];

        var height = this.props.height;
        var width = this.props.width;
        var bar_height = 30;
        var bar_margin_bottom = 20;
        var bar_margin_right = 20;

        var data = this.state.data;

        console.log("========== data =========");
        console.log(data);

        var keys = [];

        for (var key in data[0])
        {
            if (key.length == 1)
            {
                keys.push(key);
            }
        }

        console.log("=== keys ===");
        console.log(keys);

        //var domain = this.get_domain(data);

        width = Math.round(width / keys.length) - bar_margin_right;

        var horizontal_scale = d3.scale.linear()
            .domain([0, 100/* d3.max(data, function(d) {
                return d.t;
            })*/])
            .range([0, width])


        if (!this.chart)
        {
            this.chart = d3.select(container)
                .attr("width", width + margin.left + margin.right)
                .attr("height", (bar_height + bar_margin_bottom) * 5)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        var current_data = data.slice(0, 4);
        var other_data = data.slice(4, data.length);
/*
        console.log("========= current_data =========", data.length, " > ", current_data.length);
        console.log(current_data);
        console.log("========= other_data =========", other_data.length);
        console.log(other_data);
*/

        if (!this.labels)
        {

              for (var k = 0; k < keys.length; k++)
              {

                  var key = keys[k];

                  this.labels = this.chart.append("text")
                      .attr("class", "label")
                      .text(function(d) {
                          return self.props.labels_mapping[key];
                      })
                      .style("fill", "black")
                      .attr("transform", function(d, i) {
                          return "translate(" + (k * (width + bar_margin_right)) + ", 0)";
                      })

              }
        }

        for (var k = 0; k < keys.length; k++)
        {

            var key = keys[k];

            var total = 0;

            data.forEach(function(elem){

                total += elem[key];

            });

            var other_total = 0;

            other_data.forEach(function(elem){

                other_total += elem[key];

            });

            var other_block = { "device" : "other" };

            other_block[key] = other_total;

            //current_data.push(other_block);

            var combined_data = current_data.concat([other_block]);


                        console.log("====== combined_data =======");
                        console.log(combined_data);


            var bar_block = this.chart.selectAll("g.bar_block_" + k)
                                .data(combined_data, function(d){
                                    return d.device;
                                })

            // --- update ---

            bar_block
                .transition()
                .duration(750)
                .attr("transform", function(d, i) {
                    return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + 10) + ")";
                })

            var i = 0;

            bar_block.selectAll(".bar_rect")
                      .transition()
                      .duration(750)
                      .attr("d", function(d/*, i*/){

                            console.log('===================== update =---------');

                            var d = data[i]; // todo: FIX - not actual data in default  "d"
                            i++;

                            var percent = Math.round((d[key] / total) * 100);
                            var width = Math.round(horizontal_scale(percent));

                            var rect = self.rounded_rect(0, 0, width, bar_height, 2, true, false, true, false);

                            return rect;
                    })

            // --- enter ---

            var enter_blocks = bar_block.enter().append("g")
                    .attr("class", "bar_block_" + k)
                    .attr("transform", function(d, i) {
                        return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + 10) + ")";
                    })
                    /*.style("opacity", 0)

            enter_blocks
                    .transition()
                    .duration(750)
                    .style("opacity", 1)*/

            enter_blocks.append("rect")
                    .attr("class", "back_rect")
                    .style("fill", function(d) {
                          return "#eeeeee";
                    })
                    .attr("x", 0 /*one_bar_width / 2*/)
                    .attr("y", 0 /*height - text_height/*function(d) { return y(d.t) + 3; }*/)
                    .attr("height", bar_height)
                    .attr("width", width)
                    .attr("rx", 2)
                    .attr("ry", 2)

            enter_blocks.append("path")
                    .attr("class", "bar_rect")
                    .style("fill", colors[k])
                    .attr("d", function(d/*, i*/){

                        var percent = Math.round((d[key] / total) * 100);
                        var width = Math.round(horizontal_scale(percent));

                        console.log("key:", key, " -> ", percent, " - width -> ", width);

                        var rect = self.rounded_rect(0, 0, width, bar_height, 2, true, false, true, false);

                        return rect;
                    })
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("rx", 2)
                    .attr("ry", 2)

            enter_blocks.append("text")
                    .attr("class", "bar_text")
                    .text(function(d) { return d.device; })
                    .style("fill", "white")
                    .attr("x", 10)
                    .attr("y", function(d) {
                        var y = this.getBBox().height / 2 + bar_height / 2;
                        return y;
                    })

            enter_blocks.append("text")
                    .attr("class", "percent")
                    .text(function(d) {

                        if (!d[key])
                        {
                            var percent = 0;
                        }
                        else
                        {
                            var percent = Math.round((d[key] / total) * 100);
                        }

                        return percent + "%";
                    })
                    .style("fill", "black")
                    .attr("x", function(d) {
                          var x = width - this.getBBox().width - 20;
                          return x;
                    })
                    .attr("y", function(d) {
                          var y = this.getBBox().height / 2 + bar_height / 2;
                          return y;
                    })

            // --- exit ---

            bar_block.exit()
                .transition()
                .duration(750)
                .style("opacity", 0)
                .remove();



        }

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

    render : function(){

        var style = {
            width : this.props.width + 104,
            /*height : this.props.height*/
        }
        return (
            <div className="horizontal_chart_wrapper">
                <svg className="horizontal_chart" style={style} id="horizontal_chart">
                </svg>
                <div className="load_more">
                    Load More
                </div>
            </div>
        );
    },

    componentDidMount : function()
    {
        this.draw("#horizontal_chart");
    },

    componentDidUpdate : function()
    {
        this.draw("#horizontal_chart");
    }

});
