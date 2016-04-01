var HorizontalBarInteractive = React.createClass({

    //colors : ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"],

    getInitialState: function() {

        var data = [];

        this.props.labels_mapping.forEach(function(column){

            data.push({
                "label" : column.title,
                "data" : column.data.chartData,
                "label_key" : column.label_key,
                "colors" : column.colors,
                "color" : column.color,
                "active_bars" : column.active_bars,
                "active" : column.active,
                "active_bar_id" : column.active_bar_id
            })

        });

        return {
            data : data,
            fully_opened : false
        };

        return false;

    },

    componentWillReceiveProps: function(nextProps) {

        //return false;

        /*if (nextProps.date != this.props.date) // todo !!!!!!!!!!!!!!!!!!!!!!
        {*/

            var data = [];

            nextProps.labels_mapping.forEach(function(column){

                data.push({
                    "label" : column.title,
                    "data" : column.data.chartData,
                    "label_key" : column.label_key,
                    "colors" : column.colors,
                    "color" : column.color,
                    "active_bars" : column.active_bars,
                    "active" : column.active,
                    "active_bar_id" : column.active_bar_id
                })

            });

            this.setState({
                data : data
            });

            return false;

        //}

    },

    draw : function(container)
    {

        var self = this;

        var bar_height = this.props.bar_height;

        var data = this.state.data;

        var bar_width = Math.round((this.props.width - self.props.margins.left) / data.length - self.props.margins.right);
        var width = Math.round(this.props.width - self.props.margins.left - self.props.margins.right);

        var horizontal_scale = d3.scale.linear()
            .domain([0, 100])
            .range([0, bar_width])

        if (self.state.fully_opened)
        {
            var height = ((bar_height + self.props.margins.bar_bottom) * 12) + self.props.margins.bar_bottom * 2;
        }
        else
        {
            var height = (bar_height + self.props.margins.bar_bottom) * 8;
        }


        if (!this.chart)
        {
            this.chart = d3.select(container)
                .attr("width", this.props.width - self.props.margins.left - self.props.margins.right)
                .attr("height", /*bar_height + self.props.margins.bar_bottom) * 4)*/height + "px") // todo : 4 !!!
                .append("div")
                    .style("position",  "absolute")
                    .style("left",  self.props.margins.left + "px")
                    //.style("top", self.props.margins.top + "px")


            //for (var di = 0; di < data.length; di++)
            /*for (var k = 0; k < data.length; k++)
            {



            }*/

        }
        else
        {
            d3.select(container)
                .attr("height", height)
        }

/*
        return false;

        var keys = [];
        var data_key_label = this.props.label_key;

        for (var key in data[0])
        {
            if (key.length == 1 && this.props.labels_mapping[key])
            {
                keys.push(key);
            }
        }
*/
        //width = Math.round(width / keys.length) - self.props.margins.right;

        // --------------------------------------------------------

        var data_key = "t";

        this.chart.selectAll('.bar_block, .blocks_box, .block_label').remove();

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

        //var current_data = data.slice(0, bars_count);


        for (var di = 0; di < data.length; di++)
        {

            var column = data[di];

            var block_class = "blocks_box";

            if (column.active)
            {
                block_class += " active";
            }

            var block_width = bar_width + 30 + 15;

            var box_height = height/* + 300*/;

            //var test = 0;

            var block_label_class = "block_label";

            var block_box = this.chart.append("div")
                .attr("class", block_class)
                .style("position",  "absolute")
                .style("left",  ((di * (block_width /*+ self.props.margins.right*/)) - 30) + "px")
                .style("width", (block_width) + "px")
                .style("height", (box_height) + "px")
                //.style("border-left", "1px solid red")

            if (data[0].active && di == 1)
            {
                block_box.style("border-left", "1px solid #eeeeee");
            }
            else if (data[1].active && di == 0)
            {
                block_box.style("border-right", "1px solid #eeeeee");
            }

            if ((data[0].active && di == 0) || (data[1].active && di == 1))
            {
                block_label_class += " active";
            }

            if (!column.active)
            {

                block_box.on("click", function(event_data, i) {
                    console.log("---- click event ---", i);
                    console.log(0);
                    self.props.onBoxClick(0);
                })

            }

            this.labels = this.chart.append("div")
                  .attr("class", block_label_class)
                  .style("position",  "absolute")
                  .style("top", "22px")
                  .style("left",  (di * (bar_width + self.props.margins.right)) + "px")
                  //.style("width",  bar_width + "px")
                  .html(function(d, i){
                      return data[di].label.toLowerCase();
                  })

            var total = 0;
            var other_total = 0;
            var other_percent = 0;
  /*
            var key = "_os";
            var data_key_label = "_os";
  */
            column.data.forEach(function(elem){
                total += elem[data_key];
            });

            console.log("-------column ---------------------------");
            console.log(column);

            var column_data = column.data.slice(0, bars_count); // todo!!!!!!!!!!!!!!!!

            var other_data = column.data.slice(bars_count, column.data.length);

            other_data.forEach(function(elem){
                other_total += elem[data_key];
                other_percent += Math.round((elem[data_key] / total) * 100);
            });

            console.log("---- column data ---");
            console.log(column_data);

            if (column.data.length > 6)
            {

                  var other_block = { };

                  other_block[column.label_key] = "Other";

                  other_block[data_key] = other_total;

                  console.log(":::: create other ::::::");
                  console.log(other_block);

                  //var combined_data = current_data.concat([/*other_block*/  /*   ]); // todo

                  column_data.push(other_block);

            }

            var bar_block = this.chart.selectAll("div.bar_block_" + di)
                                  .data(column_data/*, function(d){
                                      return d._os;
                                  }*/)

            // --- enter ---

            var skip_width = 0;

            var block_classes = "bar_block bar_block_" + di;

            if (column.active_bars)
            {
                block_classes += " active_bars";
            }

            var enter_blocks = bar_block.enter().append("div")
                  //.attr("class", block_classes)
                  .style("left", function(d, i){

                      //return false;

                      if (i < (50 + 1) || self.state.fully_opened)
                      {
                          //return "translate(" + (k * (width + self.props.margins.right)) + ", " + (parseInt(i * (self.props.margins.bar_bottom + bar_height)) + self.props.margins.top) + ")";
                          var left = di * (bar_width + self.props.margins.right);
                      }
                      else {

                          var percent = Math.round((d[column.label_key] / total) * 100);
                          var rect_width = Math.round(horizontal_scale(percent));

                          var x = (di * (bar_width + self.props.margins.right)) + skip_width;
                          //var y = parseInt(5 * (self.props.margins.bar_bottom + bar_height)) + self.props.margins.top;

                          skip_width += rect_width;

                          var left = x;
                      }

                      return left  + "px";
              })
              .style("top", function(d, i)
              {

                    //return false;

                  if (i < (50 + 1) || self.state.fully_opened)
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

              enter_blocks.attr("class", function(d, eb){

                  if (eb == column.active_bar_id)
                  {
                      return block_classes + " active_block";
                  }
                  else
                  {
                      return block_classes;
                  }

              });


              var bar_outer_class = "bar-outer";

              if (column.active)
              {
                  var bar_outer_color = "#F5F5F5";
                  bar_outer_class += " active";
              }
              else
              {
                  var bar_outer_color = "#fbfbfb";
              }

              var bar_outer = enter_blocks.append("div")
                      .attr("class", bar_outer_class)
                      .style("height", bar_height + "px")
                      .style("width", function(d, i){

                          if (i < (50 + 1) || self.state.fully_opened) // +1 - first rect in set
                          {
                              return bar_width + "px";
                          }
                          else
                          {

                              var percent = Math.round((d[data_key] / total) * 100);
                              var rect_width = Math.round(horizontal_scale(percent));
                              return rect_width + "px";

                              //return "20px";
                          }

                      })
/*
            bar_outer.attr("class", function(d, bo){

                if (bo == column.active_bar_id)
                {
                    return bar_outer_class + " active_bar";
                }
                else
                {
                    return bar_outer_class;
                }

            });
*/
            if (column.active_bars)
            {

                bar_outer.style("background-color", function(d, i) {

                    if (i == column.active_bar_id)
                    {
                        if (column.active)
                        {
                            return "#d9d9d9";
                        }
                        else {
                            return "#ffffff";
                        }
                    }
                    else
                    {
                        return bar_outer_color;
                    }

                })

            }
            else
            {
                bar_outer.style("background-color", function(d) {
                    return bar_outer_color;
                })
            }

            if (column.active_bars)
            {

                  bar_outer.on("click", function(event_data, i) {

                      console.log("------ mouseclick -------", i);
                      console.log(this);
                      console.log(event_data);

                      var key = false;

                      for (var k in event_data)
                      {
                          if (k.length > 1) // Object {os_: "Windows Phone", t: 947, u: 2005, n: 947}
                          {
                              key = k;
                              break;
                          }
                      }

                      self.props.onClick(event_data[key], i);

                  })

            }

            bar_outer.append("span")
                      .attr("class", "label bar-outer-text")
                      .style("z-index", 100)
                      .style("height", bar_height + "px")
                      .style("line-height", bar_height + "px")
                      .style("top", 0)
                      .html(function(d, i) {
                          if (i < 50 || self.state.fully_opened)
                          {
                              return d[column.label_key];
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

                        if (i < (50 + 1) || self.state.fully_opened)
                        {
                            var percent = Math.round((d[data_key] / total) * 100);
                            return (percent) + "%";
                        }
                        else
                        {
                            return "100%";
                        }

                    })
                    .style("height", bar_height + "px")
                    .style("line-height", bar_height + "px")
                    .style("background-color", function(d, i){

                        if (i > 4 && (i == column_data.length - 1))
                        {
                            return "#cccccc";
                        }
                        else
                        {

                            if (column.colors)
                            {
                                return column.colors[i];
                            }
                            else
                            {
                                return column.color;
                            }

                        }

                    })
                    .append("span")
                        .attr("class", "bar-inner-text")
                        .style("line-height", bar_height + "px")
                        .html(function(d, i) {

                            if (i < 50 || self.state.fully_opened)
                            {
                                return d[column.label_key];
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

                      if (i < (50) || self.state.fully_opened)
                      {
                          var percent = Math.round((d[data_key] / total) * 100);

                          return (percent) + "%";
                      }
                      else if (i == (50))
                      {
                          return other_percent + "%";
                      }
                      else {
                         return "---";
                      }


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

    load_more : function(){

        this.setState({
            "fully_opened" : true
        });

    },

    render : function(){

        if (this.state.fully_opened)
        {
            var height = ((this.props.bar_height + this.props.margins.bar_bottom) * 12) + this.props.margins.bar_bottom * 2;
        }
        else
        {
            var height = ((this.props.bar_height + this.props.margins.bar_bottom) * 8);
        }

        //var wrapper_height

        var wrapper_style = {
            /*height : height + "px"*/
        }

        var chart_style = {
            width : this.props.width,
            height : height + "px"
        }

        var load_more_style = {};

        if (this.state.fully_opened)
        {
            load_more_style.display = "none";
        }
        else {
            load_more_style.display = "block";
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

                <div style={nodata_block_style} className="nodata_block">No data</div>

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
