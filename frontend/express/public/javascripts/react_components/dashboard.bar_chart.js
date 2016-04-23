var DashboardBarChart = React.createClass({

    getInitialState: function() {
        return {
            period : false
        };
    },
/*
    componentWillMount: function() {

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change

            this.setState({
                period : period
            });


        }.bind(this));

        $(event_emitter).on('data_changed', function(e, data){


        }.bind(this));

    },
*/
    componentWillReceiveProps: function(nextProps) {

        this.draw("#horizontal_chart"); // todo: !!!!!!!!!!!!

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
        var bar_blocks_top_margin = 45;
        var bar_height = 34;
        var bar_margin_bottom = 15;
        var bar_margin_right = 40;

        var data = this.props.data;

        var data_key_label = "name";

        //var domain = this.get_domain(data);

        width = Math.round(width / data.length) - bar_margin_right;

        var horizontal_scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, width])

        var text_check_style = "normal 15px Lato-Regular";

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
                        return data[di].title.toLowerCase();
                    })
            }
        }

        data.every(function(element){

            var text_width = self.getTextWidth(element.title, text_check_style);

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

                // --- exit ---

            bar_block.exit()
                .transition()
                .duration(750)
                .style("opacity", 0)
                .remove();


        }

        return false;

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
