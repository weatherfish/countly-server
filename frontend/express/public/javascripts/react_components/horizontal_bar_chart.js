var HorizontalBarChart = React.createClass({

    colors : ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"],

    getInitialState: function() {

        var data = this.props.data_function();

        data = data.chartData;
        
        console.log("[[[[[[[[ HorizontalBarChart  data ]]]]]]]]]]]]]");
        console.log(data);

        //var test_data = [];

        if (!data[0] || !data[0]["t"]) // todo: t change to a key
        {
            data = false;
        }        

        return {
            data : data,
            fully_opened : false
        };
    },

    componentWillReceiveProps: function(nextProps) {

        /*if (nextProps.date != this.props.date) // todo !!!!!!!!!!!!!!!!!!!!!!
        {*/

            console.log("[[[[[[[[ update HorizontalBarChart  data ]]]]]]]]]]]]]");
            console.log(data);

            var data = this.props.data_function();

            data = data.chartData;

            if (!data[0] || !data[0]["t"]) // todo: t change to key
            {
                data = false;
            }
           
            this.setState({
                data : data
            });

        //}

    },

    draw : function(container)
    {

        var self = this;

        var bar_height = this.props.bar_height;

        var data = this.state.data;

        var keys = [];
        var data_key_label = this.props.label_key;

        for (var key in data[0])
        {
            if (key.length == 1 && this.props.labels_mapping[key])
            {
                keys.push(key);
            }
        }

        //width = Math.round(width / keys.length) - self.props.margins.right;

        var bar_width = Math.round((this.props.width - self.props.margins.left) / keys.length - self.props.margins.right);
        var width = Math.round(this.props.width - self.props.margins.left - self.props.margins.right);

        var horizontal_scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, bar_width])

        if (!this.chart)
        {
            this.chart = d3.select(container)
                .attr("width", this.props.width - self.props.margins.left - self.props.margins.right)
                .attr("height", ((bar_height + self.props.margins.bar_bottom) * 4) + "px")
                .append("div")
                    .style("position",  "absolute")
                    .style("left",  self.props.margins.left + "px")
                    //.style("top", self.props.margins.top + "px")


            //for (var di = 0; di < data.length; di++)
            for (var k = 0; k < keys.length; k++)
            {

                this.labels = this.chart.append("div")
                    .attr("class", "block_label")
                    .style("position",  "absolute")
                    .style("left",  (k * (bar_width + self.props.margins.right)) + "px")
                    .style("width",  bar_width + "px")
                    .html(function(d, i){
                        return self.props.labels_mapping[keys[k]].toLowerCase();
                    })
            }

        }
        else
        {

            if (self.state.fully_opened)
            {
                var height = (bar_height + self.props.margins.bar_bottom) * 11;
            }
            else
            {
                var height = (bar_height + self.props.margins.bar_bottom) * 6;
            }


            d3.select(container)
                .attr("height", height)
        }

        this.chart.selectAll('.bar_block').remove();

        if (!data)
        {
            return false;
        }

        if (self.state.fully_opened)
        {
            var bars_count = 10;
        }
        else
        {
            var bars_count = 5;
        }

        for (var k = 0; k < keys.length; k++)
        {

            //var sort_data = data;

            data.sort(function(a, b) {                
                return b[keys[k]] - a[keys[k]];
            });
            
            console.log("{{{{{{{{ sort data }}}}}}}}}}}}");
            console.log(data);

            var shown_data = data.slice(0, bars_count);
            var other_data = data.slice(bars_count, data.length);

            var key = keys[k];

            var total = 0;
            var other_total = 0;
            //var other_percent = 0;

            data.forEach(function(elem){
                total += elem[key];
            });

            other_data.forEach(function(elem){
                other_total += elem[key];
            });

            var other_percent = Math.round((other_total / total) * 100);

            if (other_data.length == 1)
            {
                shown_data.push(other_data[0]);
            }
            else if (data.length > shown_data.length)
            {
                var other_block = { };

                other_block[data_key_label] = "Other";

                other_block[key] = other_total;

                shown_data.push(other_block);
            }

            var bar_block = this.chart.selectAll("div.bar_block_" + k)
                                .data(shown_data, function(d){
                                    var key = d[data_key_label].replace(new RegExp(" ", 'g'), '');
                                    return key;
                                })

            // --- enter ---

            var skip_width = 0;

            var enter_blocks = bar_block.enter().append("div")
                .attr("class", "bar_block bar_block_" + k)
                .style("left", function(d, i){

                    //return "translate(" + (k * (width + self.props.margins.right)) + ", " + (parseInt(i * (self.props.margins.bar_bottom + bar_height)) + self.props.margins.top) + ")";
                    var left = k * (bar_width + self.props.margins.right);
                    
                    return left  + "px";
              })
              .style("top", function(d, i){

                  if (i < 50 || self.state.fully_opened)
                  {
                      var top = (parseInt(i * (self.props.margins.bar_bottom + bar_height)) + self.props.margins.top) + self.props.margins.label_bottom;
                  }
                  else
                  {
                      var y = parseInt(5 * (self.props.margins.bar_bottom + bar_height)) + self.props.margins.top;
                      var top = y + self.props.margins.label_bottom;
                  }

                  return top + "px";

              })
              /*.style("opacity", 0)

            enter_blocks
                    .transition()
                    .duration(750)
                    .style("opacity", 1)*/

            var bar_outer = enter_blocks.append("div")
                    .attr("class", "bar-outer")
                    .style("height", bar_height + "px")
                    .style("width", function(d, i){                    
                        return bar_width + "px";                   
                    })
                    .style("background-color", function(d) {
                        return "#F5F5F5";
                    })

            bar_outer.append("span")
                    .attr("class", "label bar-outer-text")
                    .style("z-index", 100)
                    .style("height", bar_height + "px")
                    .style("line-height", bar_height + "px")
                    .style("top", 0)
                    .html(function(d, i) {
                        if (i < 50 || self.state.fully_opened)
                        {
                            return d[data_key_label];
                        }
                        else if (i == data.length - 1)
                        {
                            return "Other";
                        }
                        else
                        {
                            return "";
                        }
                    })

            bar_outer.append("div")
                .attr("class", "bar-inner")
                .style("width", function(d, i){
                    
                    if (d[key])
                    {                    
                        var percent = Math.round((d[key] / total) * 100);
                        return (percent) + "%";   
                    }
                    else
                    {
                        return "0px";
                    }                    
                     
                })
                .style("height", bar_height + "px")
                .style("line-height", bar_height + "px")
                .style("background-color", function(d, i){

                    if ((i == shown_data.length - 1) && (data.length > shown_data.length))
                    {
                        return "#cccccc";
                    }
                    else
                    {
                        return self.colors[k];
                    }

                })
                .append("span")
                    .attr("class", "bar-inner-text")
                    .style("line-height", bar_height + "px")
                    .html(function(d, i) {

                        if (i < 50 || self.state.fully_opened)
                        {
                            return d[data_key_label];
                        }
                        else if (i == data.length - 1)
                        {
                            return "Other";
                        }
                        else
                        {
                            return "";
                        }
                    })

            enter_blocks.append("div")
                .attr("class", "percent")
                .html(function(d, i) {

                    if (d[key])
                    {
                        var percent = Math.round((d[key] / total) * 100);
                    }
                    else
                    {
                        var percent = 0;
                    }                    

                    return (percent) + "%";                 

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

    load_more : function(){

        this.setState({
            "fully_opened" : true
        });

    },

    render : function(){

        var wrapper_height

        var wrapper_style = {
            /*width : this.props.width,*/
        }

        var load_more_style = {};

        if (this.state.fully_opened || this.state.data.length < 7)
        {
            load_more_style.display = "none";
        }
        else {
            load_more_style.display = "block";
        }

        if (this.state.fully_opened)
        {

            if (this.state.data.length > 10)
            {
                var height = ((this.props.bar_height + this.props.margins.bar_bottom) * 12);
            }
            else
            {
                var height = ((this.props.bar_height + this.props.margins.bar_bottom) * (this.state.data.length + 2));
            }

        }
        else
        {
            if (load_more_style.display == "block")
            {
                var height = ((this.props.bar_height + this.props.margins.bar_bottom) * 8);
            }
            else
            {
                var height = ((this.props.bar_height + this.props.margins.bar_bottom) * 7);
            }

        }

        var chart_style = {
            width : this.props.width,
            height : height + "px"
        }

        var nodata_block_style = {
            width : this.props.width
        };

        if (this.state.data == false)
        {
            nodata_block_style.display = "block";
            load_more_style.display = "none";
        }
        else
        {
            nodata_block_style.display = "none";
            //load_more_style.display = "block";
        }

        // <div style={nodata_block_style} className="nodata_block">No data</div>

        return (
            <div className="horizontal_chart_wrapper" style={wrapper_style}>
                <div className="chart_label">{this.props.graph_label.toUpperCase()}</div>
                <div className="horizontal_chart" style={chart_style} id="horizontal_chart">
                </div>
                <div onClick={this.load_more} style={load_more_style} className="load_more">
                    <span>
                        Load More
                    </span>
                </div>

                <NoDataBlock display={nodata_block_style.display} width={this.props.width}/>

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

    getRandomInt : function(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});
