var DashboardBarChart = React.createClass({

    getInitialState: function() {
        return {
            period : false
        };
    },

    componentWillMount: function() {

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change

            this.setState({
                period : period
            });


        }.bind(this));

        $(event_emitter).on('data_changed', function(e, data){


        }.bind(this));

    },

    draw : function(container)
    {

        var self = this;

        var margin = {
            top    : 0,
            right  : 150,
            bottom : 30,
            left   : 40
        };

        //var height = 750 - margin.top - margin.bottom;

        var colors = ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"];

        var height = this.props.height;
        var width = this.props.width;
        var bar_blocks_top_margin = 30;
        var bar_height = 34;
        var bar_margin_bottom = 15;
        var bar_margin_right = 40;

        var data = this.props.data;

/*
        var keys = [];
        var data_key_label = this.props.label_key;

        for (var key in data[0])
        {
            if (key.length == 1 && this.props.labels_mapping[key])
            {
                keys.push(key);
            }
            /*else if (key.length > 1){
                data_key_label = key;
            }*/
  /*      }

        console.log("=== keys ===");
        console.log(keys);
*/

        var data_key_label = "name";

        //var domain = this.get_domain(data);

        width = Math.round(width / data.length) - bar_margin_right;

        var horizontal_scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, width])

        var text_check_style = "normal 15pt Lato-Regular"; // toto: non-english languages will have another font-family

        var long_text_flag = false;

        if (!this.chart)
        {
            this.chart = d3.select(container)
                .attr("width", width/* + margin.left + margin.right*/)
                .attr("height", (bar_height + bar_margin_bottom) * 3)
                .append("div")
                    .style("position",  "absolute")
                    .style("left",  margin.left + "px")
                    .style("top", margin.top + "px")


            for (var di = 0; di < data.length; di++)
            {
                this.labels = this.chart.append("div")
                    .attr("class", "block_label")
                    .style("position",  "absolute")
                    .style("left",  (di * (width + bar_margin_right)) + "px")
                    .style("width",  width + "px")
                    .html(function(d, i){
                        return data[di].title.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
                    })
            }
        }

        data.every(function(element){

            var text_width = self.getTextWidth(element.title, text_check_style); // toto: non-english languages will have another font-family

            console.log("text_width check:", text_width);

            if (text_width > width)
            {
                long_text_flag = true;
                return false;
            }

            return true;
        })

        if (long_text_flag)
        {
            bar_blocks_top_margin += 15;
        }

        for (var di = 0; di < data.length; di++)
        {

            var block_data = data[di].data_function();

            var bar_block = this.chart.selectAll("div.bar_block_" + di)
                                .data(block_data, function(d){
                                    return d[data_key_label];
                                })

            // --- update ---

            bar_block
                .transition()
                .duration(750)

            bar_block/*.selectAll(".bar_block")*/
                .style("left", function(d, i){
                    return ((di * (width + bar_margin_right))  + "px");
                })
                .style("top", function(d, i){
                    return ((parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + "px");
                })

            var update_bar_outer = bar_block.selectAll(".bar-outer")

            update_bar_outer.selectAll(".bar-inner")
                .style("width", function(d, i){

                    return (d.percent) + "%";

                })

            bar_block.selectAll(".percent")
                    .html(function(d, i) {
                        return (d.percent) + "%";
                    })

            // --- enter ---

            var skip_width = 0;

            var enter_blocks = bar_block.enter().append("div")
                .attr("class", "bar_block bar_block_" + di)
                .style("left", function(d, i){
                    return ((di * (width + bar_margin_right))  + "px");
                })
                .style("top", function(d, i){
                    return ((parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + "px");
                })
                /*.attr("transform", function(d, i) {

                    return "translate(" + (di * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                    //return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                })*/

            var bar_outer = enter_blocks.append("div")
                .attr("class", "bar-outer")
                .style("height", bar_height + "px")
                .style("width", width + "px")
                .style("background-color", function(d) {
                    return "#F5F5F5";
                })

            bar_outer.append("div")
                .attr("class", "bar-inner")
                /*.style("left", "10px")*/
                .style("width", function(d, i){

                    return (d.percent - 15) + "%"; // todo: remove -10 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                })
                .style("height", bar_height + "px")
                .style("line-height", bar_height + "px")
                .style("background-color", colors[di])
                .append("span")
                    .attr("class", "bar-inner-text")
                    .style("line-height", bar_height + "px")
                    .html(function(d, i) {
                        return d.name;
                    })

            bar_outer.append("span")
                .attr("class", "label bar-outer-text")
                .style("z-index", 100)
                .style("height", bar_height + "px")
                .style("line-height", bar_height + "px")
                .style("top", 0)
                .html(function(d, i) {
                    return d.name;
                })

            enter_blocks.append("div")
                .attr("class", "percent")
                .html(function(d, i) {
                    return (d.percent - 15) + "%";
                })
                .style("height", bar_height + "px")
                .style("line-height", bar_height + "px")
                /*.style("left", function(d, i){
                    return Math.round(width - this.getBBox().width) - 20  + "px";
                })
                .style("top", function(d, i){
                    return bar_height / 2 + this.getBBox().height / 3 + "px");
                })*/

                /*
                .style("fill", "black")
                .attr("transform", function(d, i) {

                    var x = Math.round(width - this.getBBox().width) - 20;
                    //var y = Math.round(this.getBBox().height / 2 + bar_height / 3);
                    var y = bar_height / 2 + this.getBBox().height / 3;

                    return "translate(" + x + ", " + y + ")";

                })*/

                // --- exit ---

            bar_block.exit()
                .transition()
                .duration(750)
                .style("opacity", 0)
                .remove();


/*
            enter_blocks.append("div")
                .attr("class", "back_rect")
                .style("background-color", function(d) {
                    return "#F5F5F5";
                })
                .style("left", 0)
                .style("top", 0)
                .style("height", bar_height + "px")
                .style("width", width + "px")

            enter_blocks.append("div")
                .attr("class", "bar_rect")
                .style("background-color", colors[di])
                .style("height", bar_height + "px")
                .style("width", function(d, i){

                    var bar_width = Math.round(horizontal_scale(d.percent));

                    return bar_width + "px";
*/
                    //var round_corner = true;

                    //var rect = self.rounded_rect(0, 0, bar_width, bar_height, 2, round_corner, false, round_corner, false);

                    //return rect;
/*                })
                .style("left", 0)
                .style("top", 0)*/
/*
            enter_blocks.append("div")
                .attr("class", "label")
                .style("height", bar_height + "px")
                .style("line-height", bar_height + "px")
                .style("width", 200 + "px")
                .style("font-size", "13px")
                .style("color", "black")
                .style("z-index", 100)
                .style("left", "10px")
                .style("top", 0)

                .html(function(d, i) {
                    return d.name;
                })
*/
                /*
                .append("text")
                        .attr("class", "bar_label")
                        .style("font-size", "13px")
                        .attr("width", 10)
                        //.style("fill", "url(#half_grad)")
                        .style("fill", "black")
                        .text(function(d, i) {
                            return d.name;
                        })
                        .attr("x", 10)
                        .attr("y", function(d) {
                            var y = bar_height / 2 + this.getBBox().height / 3;
                            return y;
                })*/

/*
            enter_blocks.append("g")
                .attr("class", "label_wrapper")
                .style("height", bar_height)
                .style("width", 20)
                .attr("width", 20)
                .append("text")
                    .attr("class", "bar_label")
                    .style("font-size", "13px")
                    .attr("width", 10)
                    //.style("fill", "url(#half_grad)")
                    .style("fill", "black")
                    .text(function(d, i) {
                        return d.name;
                    })
                    .attr("x", 10)
                    .attr("y", function(d) {
                        var y = bar_height / 2 + this.getBBox().height / 3;
                        return y;
                    })*/
/*
                    enter_blocks.append("text")
                        .attr("class", "percent")
                        .style("font-size", "13px")
                        .text(function(d, i) {

                            return d.percent + "%";
                        })
                        .style("fill", "black")
                        .attr("transform", function(d, i) {
/*
                            var x = Math.round(width - this.getBBox().width) - 20;
                            var y = Math.round(this.getBBox().height / 2 + bar_height / 3);

                            return "translate(" + x + ", " + y + ")";
*/
/*
                            var x = Math.round(width - this.getBBox().width) - 20;
                            //var y = Math.round(this.getBBox().height / 2 + bar_height / 3);
                            var y = bar_height / 2 + this.getBBox().height / 3;

                            return "translate(" + x + ", " + y + ")";

                        })*/


        }

        return false;

/*
        var current_data = data.slice(0, 10);
        var other_data = data.slice(5, 11);

        console.log("========= current_data =========", data.length, " > ", current_data.length);
        console.log(current_data);
        console.log("========= other_data =========", other_data.length);
        console.log(other_data);*/

        //current_data = data.slice(0, 5);

        /* --- Top labels --- */

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

            /*var other_block = { "device" : "other" };

            other_block[key] = other_total;*/

            //current_data.push(other_block);

            var combined_data = current_data.concat([/*other_block*/]);

            var bar_block = this.chart.selectAll("g.bar_block_" + k)
                                .data(combined_data, function(d){
                                    return d[data_key_label];
                                })

            // --- update ---

            bar_block
                .transition()
                .duration(750)
                .attr("transform", function(d, i) {

                    if (i < 5 || self.state.fully_opened)
                    {
                        //console.log("k 1:", k, " ->>", width, "-->",  bar_margin_right);
                        return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                    }
                    else {

                        var nk = i - 5;

                        var x = 10 * nk;
                        var y = parseInt(7 * (bar_margin_bottom + bar_height));

                        //console.log("k 2:", (nk * (width + bar_margin_right)));

                        return "translate(" + (nk * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + bar_blocks_top_margin) + ")";
                    }

                })

            bar_block.selectAll(".back_rect")
                .transition()
                .delay(750)
                .duration(750)
                .attr("width", function(d, i) {

                      if (i < (6 + 1) || self.state.fully_opened) // +1 - first rect in set
                      {
                          return width;
                      }
                      else {

                          var percent = Math.round((d[key] / total) * 100);
                          var rect_width = Math.round(horizontal_scale(percent));
                          return rect_width;
                      }                            //return "translate(" + (k * (width + bar_margin_right)) + ", " + (parseInt(i * (bar_margin_bottom + bar_height)) + 10) + ")";
                })


            var i = 0;

            bar_block.selectAll(".bar_rect")
                      .transition()
                      .duration(750)
                      .style("fill", function(d, i){

                          if (i < (5) || self.state.fully_opened)
                          {
                              return colors[k];
                          }
                          else
                          {

                              return "#cccccc";
                          }

                      })
                      .attr("d", function(d){

                            var d = data[i]; // todo: FIX - not actual data in default  "d"
                            i++;

                            var percent = Math.round((d[key] / total) * 100);
                            var bar_width = Math.round(horizontal_scale(percent));

                            if (i < (6 + 1) /*|| self.state.fully_opened*/)
                            {
                                var round_corner = true;
                            }
                            else {

                                var round_corner = false;
                            }

                            var rect = self.rounded_rect(0, 0, bar_width, bar_height, 2, round_corner, false, round_corner, false);

                            return rect;
                    })




            var bar_labels = bar_block.selectAll(".bar_label")
                .transition()
                .duration(750)
                      .text(function(d, i) {

                                if (i < 5 || self.state.fully_opened)
                                {
                                    return d[data_key_label];
                                }
                                else if (i == data.length - 1)
                                {
                                    return "Other";
                                }
                                return
                                {

                                    return "";
                                }

                            })
                            .attr("y", function(d) {
                                var y = this.getBBox().height / 2 + bar_height / 2;
                                return y;
                            }).style("opacity", function(d, i) {

                                      if (i < 5)
                                      {
                                          return 1;
                                      }
                                      else
                                      {
                                          return 0;
                                      }


                                  })

                    bar_labels
                            .filter(function(d, i){

                                if (i < 5) return false;

                                return true;

                            })
                            .delay(750)
                            .transition()
                            .duration(750)
                            .style("opacity", 1)


            var p = 0;
            var pi = 0;
            var last_text_width = 0;

            console.log("---------- exist percent ----------");
            console.log(bar_block.selectAll(".percent"));

            bar_block.selectAll(".percent")
                .style("display", function(d, i){

                    if (i > 5 && self.state.fully_opened == false)
                    {
                        return "none";
                    }
                    else
                    {
                        return "block";
                    }

                })
                .transition()
                .duration(750)
                .attr("transform", function(d, i) {

                    var text_width = width - this.getBBox().width;
/*
                    if (this.getBBox().width != 0)
                    {
                        last_text_width = text_width; // last_text_width - fix. text_width = 0 to appear text blocks
                    }
                    else {
                        text_width = last_text_width;
                    }
*/
                    var x = Math.round(text_width) - 20;
                    var y = Math.round(this.getBBox().height / 2 + bar_height / 3);

                    //console.log(pi, "::", text_width, " -> translate(" + x + ", " + y + ")");

                    pi++;

                    return "translate(" + x + ", " + y + ")";

                })
                /*.text(function(d) {

                    var d = data[p]; // todo: FIX - not actual data in default  "d"
                    p++;

                    if (!d[key])
                    {
                          var percent = 0;
                    }
                    else
                    {
                          var percent = Math.round((d[key] / total) * 100);
                    }

                    return percent + "%";
                })*/

                /*.attr("x", function(d) {

                    var d = data[pi]; // todo: FIX - not actual data in default  "d"
                    pi++;

                    var x = Math.round(width - this.getBBox().width) - 20;

                    console.log("update x:", x, ", width:", this.getBBox().width);

                    return x;
                })
                .attr("y", function(d) {
                        var y = this.getBBox().height / 2 + bar_height / 2;

                        console.log("update y:", y);

                        return y;
                })*/
                /*.text(function(d, i) {

                    var d = data[p]; // todo: FIX - not actual data in default  "d"
                    p++;

                    if (i > (6) || self.state.fully_opened)
                    {
                        return "";
                    }

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
              */

            // --- enter ---



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
            width : this.props.width,
            /*height : this.props.height*/
        }

        return (
            <div className="horizontal_chart_wrapper">
                <div className="horizontal_chart" style={style} id="horizontal_chart">
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
    },

    getTextWidth : function(text, font) {
        // re-use canvas object for better performance
        var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

});
