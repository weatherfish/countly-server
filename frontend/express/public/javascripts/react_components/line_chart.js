var LineChart = React.createClass({

    circle_radius : 4,

    getInitialState : function() {

        return {
            active : true,
            graph_ready : false
        };
    },
    
    componentDidMount : function()
    {            
             
        var data_points = this.props.data_function();
              
        var line_chart_width = this.props.width - (this.props.sides_padding * 2);

        if (data_points.daily_granularity[0].mode == "ghost") // if previous time range in 0 index
        {
            var daily_data = data_points.daily_granularity[0].data;
        }
        else
        {
            var daily_data = data_points.daily_granularity[1].data;
        }

        if (this.props.with_granularity)
        {

            if (countlyCommon.getPeriod() == "hour")
            {
                var granularity = "hourly";
            }
            else if ((daily_data.length / 30) > 6) // more than 6 months
            {
                var granularity = "monthly";
            }
            else if (daily_data.length * (this.circle_radius * 2) * 2 > line_chart_width) // todo: combine with block from update
            {
                var granularity = "weekly";
            }
            else if (countlyCommon.getPeriod() == "hour")
            {
                var granularity = "hourly";
            }
            else
            {
                var granularity = "daily";
            }

            if (granularity == "hourly")
            {
                var granularity_rows = data_points.hourly_granularity;
            }
            else if (granularity == "weekly")
            {
                var granularity_rows = JSON.parse(JSON.stringify(data_points.weekly_granularity));
            }
            else if (granularity == "monthly")
            {
                var granularity_rows = data_points.monthly_granularity;
            }
            else
            {
                var granularity_rows = data_points.daily_granularity;
/*
                if ((granularity_rows[0].data.length * this.circle_radius * 2 * 2) > line_chart_width)
                {
                    var without_circles = true;
                }
                else
                {
                    var without_circles = false;
                }
*/
            }

            var zero_points = true; // all points value = 0

            /*
                Check if all points have 0 values
            */

            granularity_rows.every(function(datapath){

                datapath.data.every(function(datapoint){

                    var value = datapoint[1];

                    if (value > 0)
                    {
                        zero_points = false;
                        return false;
                    }

                    return true;
                });

                if (!zero_points)
                {
                    return false;
                }

                return true;

            });

        }
        else
        {
            var granularity_rows = this.props.data_function().get_current_data();
            var granularity = "daily";
        }
        
        if (granularity_rows[0] && granularity_rows[0].mode == "ghost") // todo: fix for previous time ranges
        {
            for (var i = 0; i < granularity_rows[0].data.length; i++)
            {
                if (granularity_rows[1].data[i])
                {
                    granularity_rows[0].data[i][3] = granularity_rows[0].data[i][0]; // pass for previous date in tooltip 
                    granularity_rows[0].data[i][0] = granularity_rows[1].data[i][0]; // projection of previous time range on current time range
                }
            }
        }
        
        if (this.props.reverse_dp)
        {
            granularity_rows.reverse();
        }
        
        countlyCommon.drawTimeGraph(JSON.parse(JSON.stringify(granularity_rows)), "#dashboard-graph", this.props.big_numbers/*tmp_colors*/, line_chart_width - 40 - 40, this.props.height, false, granularity, false, zero_points);

        if (this.props.lines_descriptions)
        {
            var lines_descriptions = this.props.lines_descriptions;

            for (var i = 0; i < lines_descriptions.length; i++)
            {
                lines_descriptions[i]['color'] = granularity_rows[i].color;
            }
        }
        else
        {
            lines_descriptions = false;
        }
                
        if (this.props.mount_callback)
        {
            this.props.mount_callback({
                granularity : granularity
            });
        }
        
        this.setState({
            big_numbers : this.props.big_numbers,            
            session_dp : data_points,
            granularity_type : granularity,
            lines_descriptions : lines_descriptions,
            line_chart_width : line_chart_width,
            graph_ready : true
        })
    },

    componentDidUpdate : function()
    {
        if (countlyCommon.getPeriod() == "hour")
        {
            var granularity_type = "hourly";
        }
        else
        {
            var granularity_type = this.state.granularity_type;
        }

        var updated_data = this.update(-1, granularity_type, true);
    },

    componentWillReceiveProps : function(nextProps) {
        
        if (!this.state.graph_ready)
        {
            return false;
        }

        var self = this;

        var period = nextProps.date;

        var new_state = {};

        if (this.props.lines_descriptions) // update colors
        {

            var granularity_rows = nextProps.data_function().get_current_data();

            if (self.props.reverse_dp)
            {
                granularity_rows.reverse();
            }

            var lines_descriptions = this.props.lines_descriptions;

            for (var i = 0; i < lines_descriptions.length; i++)
            {
                lines_descriptions[i]['color'] = granularity_rows[i].color;
            }
/*
            this.setState({
                lines_descriptions : lines_descriptions
            });
*/
            new_state.lines_descriptions = lines_descriptions;
        }
        
        new_state.big_numbers = nextProps.big_numbers;
        
        this.setState(new_state)

    },

    onGranularityChange : function(granularity){
        
        this.update(-1, granularity);
        
        if (this.props.onGranularityChange)
        {
            this.props.onGranularityChange(granularity);
        }                  
    },

    big_number_render : function() {

        var self = this;

        var width = Math.round(100 / this.state.big_numbers.length) + "%";

        return _.map(this.state.big_numbers, function(item, id) {

            return <BigNumber
                      title={item.title}
                      value={item.total}
                      color={item.color}
                      active={item.active}
                      hover={item.hover}
                      on_click={self.update}
                      on_hover={self.big_number_hover}
                      id={id}
                      width={width}
                    />
        });
    },

    big_number_hover : function(data) {

        if (data.hover)
        {
            var class_name = "path_" + data.color.replace("#", "");

            for (var i = 0; i < document.getElementsByClassName("graph_path").length; i++)
            {
                document.getElementsByClassName("graph_path")[i].style["stroke-opacity"] = 0.2;
            }

            document.getElementsByClassName(class_name)[0].style["stroke-opacity"] = 1;

            // --- dots ---

            var dots_class_name = "dot_" + data.color.replace("#", "");

            for (var i = 0; i < document.getElementsByClassName("one_dot").length; i++)
            {
                if (this.hasClass(document.getElementsByClassName("one_dot")[i], dots_class_name)){
                    document.getElementsByClassName("one_dot")[i].style.opacity = 1;
                }
                else
                {
                    document.getElementsByClassName("one_dot")[i].style.opacity = 0.2;
                }
            }
        }
        else
        {

            for (var i = 0; i < document.getElementsByClassName("graph_path").length; i++)
            {
                document.getElementsByClassName("graph_path")[i].style["stroke-opacity"] = 1;
            }

            for (var i = 0; i < document.getElementsByClassName("one_dot").length; i++)
            {
                document.getElementsByClassName("one_dot")[i].style.opacity = 1;
            }
        }
    },

    update : function(id, new_granularity, auto_update){

        var sessionDP = this.props.data_function();
        var big_numbers = this.state.big_numbers;
        
        if (id > -1)
        {
            big_numbers[id].active = !big_numbers[id].active;
        }

        var active = false;
        var no_data = true;

        var zero_points = true;

        if (big_numbers)
        {
            for (var i = 0; i < big_numbers.length; i++)
            {
                if (big_numbers[i].active)
                {
                    active = true;
                    no_data = false;
                    break;
                }
            }
        }
        else
        {
            active = true;
            no_data = false;
        }

        if (sessionDP.daily_granularity)
        {

            /*
                disable or enable auto granularity
            */

            var time_range_difference = sessionDP.previous_period_length / sessionDP.daily_granularity[0].data.length;

            if (id != -1)
            {
                new_granularity = this.state.granularity_type;
            }

            if (sessionDP.daily_granularity[0].mode == "ghost") // if previous time range in 0 index
            {
                var daily_data = sessionDP.daily_granularity[0].data;
            }
            else
            {
                var daily_data = sessionDP.daily_granularity[1].data;
            }

            if ((!new_granularity/* && id == -1*/ && (time_range_difference < 0.5 || time_range_difference > 2)) || this.state.granularity_type == "hourly") // if previous period is hourly
            {

                /*
                    auto granularity is active, event from date selection
                */

                if ((daily_data.length / 30) > 6) // more then 6 months
                {
                    var new_granularity = "monthly";
                }
                else if ((daily_data.length * this.circle_radius * 2 * 2) > this.state.line_chart_width)
                {
                    var new_granularity = "weekly";
                }
                else if (countlyCommon.getPeriod() == "hour")
                {
                    var new_granularity = "hourly";
                }
                else
                {
                    var new_granularity = "daily";
                }
            }

            if (new_granularity == "weekly")
            {
                var granularity_rows = sessionDP.weekly_granularity;
            }
            else if (new_granularity == "monthly")
            {
                var granularity_rows = sessionDP.monthly_granularity;
            }
            else if (new_granularity == "hourly")
            {
                var granularity_rows = sessionDP.hourly_granularity;
            }
            else
            {
                var granularity_rows = sessionDP.daily_granularity;

                if ((granularity_rows[0].data.length * this.circle_radius * 2 * 2) > this.state.line_chart_width)
                {
                    var without_circles = true;
                }
                else
                {
                    var without_circles = false;
                }
            }
        }
        else // todo: this is a fix for refactoring
        {
            var granularity_rows = this.props.data_function().get_current_data();
        }
        
        granularity_rows.every(function(datapath){

            datapath.data.every(function(datapoint){

                var value = datapoint[1];
                
                if (value > 0)
                {
                    zero_points = false;
                    return false;
                }

                return true;
            });

            if (!zero_points)
            {
                return false;
            }

            return true;

        });

        if (no_data)
        {
            zero_points = true;
        }

        if (this.props.big_numbers)
        {

            var active_array = [];

            for (var i = 0; i < big_numbers.length; i++)
            {
                for (var j = 0; j < granularity_rows.length; j++)
                {

                    var is_found = false;

                    /*//if (big_numbers[i]['title'].toLowerCase() == granularity_rows[j].label.toLowerCase()){*/
                    if (((big_numbers[i].short && granularity_rows[j].short) && (big_numbers[i].short == granularity_rows[j].short)) || (big_numbers[i]['title'].toLowerCase() == granularity_rows[j].label.toLowerCase())){
                        if (big_numbers[i].active)
                        {
                            granularity_rows[j].color = big_numbers[i].color;
                            active_array.push(granularity_rows[j]);
                        }

                        is_found = true;
                        break;
                    }

                    if (is_found)
                    {
                        break;
                    }
                }
            }

            granularity_rows = active_array;

        }

        /*
            todo !!! remove array indexes below
        */
        
        if (granularity_rows[0] && granularity_rows[0].mode == "ghost") // todo: fix for previous time ranges
        {
            for (var i = 0; i < granularity_rows[1].data.length; i++)
            {

                if (!granularity_rows[0].data[i])
                {
                    console.log("!!! error here !!!");
                    continue;
                }

                granularity_rows[0].data[i][3] = granularity_rows[0].data[i][0]; // pass real date for previous date in tooltip 
                granularity_rows[0].data[i][0] = granularity_rows[1].data[i][0]; // projection of previous time range on current time range
                
            }
        }

        if (this.props.reverse_dp)
        {            
            granularity_rows.reverse();
        }

        countlyCommon.updateTimeGraph(granularity_rows, "#dashboard-graph", big_numbers, false, new_granularity, without_circles, zero_points, function(error, result){
            $(event_emitter).trigger('granularity_data', {
                "session_dp" : sessionDP,
                "new_granularity" : new_granularity,
                "period" : countlyCommon.getPeriod()
            });
        });

        if (!auto_update)
        {
            this.setState({
                big_numbers : big_numbers,
                active : active,
                granularity_type : new_granularity
            });
        }

        return {
            rows : granularity_rows,
            granularity : new_granularity
        }

    },

    render() {

        var axis_width = 40;

        var graph_style = {
            "width"       : (this.state.line_chart_width) + "px",
            "height"      : this.props.height + "px",
            "margin-left" : this.props.sides_padding/*this.props.margin_left*/ + "px"
        }

        var axis_right_style = {
            "left" : (this.state.line_chart_width - axis_width) + "px"
        }

        var nodata_block_style = { };

        if (this.state.active)
        {
            nodata_block_style.display = "none";
            var granularity_class_name = "granularity";
        }
        else
        {
            nodata_block_style.display = "block";
            var granularity_class_name = "granularity hidden";
        }

        if (this.state.lines_descriptions)
        {
            var description_blocks = JSON.parse(JSON.stringify(this.state.lines_descriptions));            
        }

        // graph_width={this.props.width}

        return (
            <div id="line_chart_wrapper">

                {(() => {

                    if (this.props.trend_sign){
                        return(<div className="trend_name">{this.props.trend_sign}</div>)
                    }

                })()}
                
                {(() => {

                    if (this.state.graph_ready){
                        return(<Granularity
                                    class_name={granularity_class_name}
                                    data={this.state.session_dp}
                                    type={this.state.granularity_type}
                                    period={this.props.period}
                                    disable_hover={this.props.disable_hover}
                                    onChange={this.onGranularityChange}
                                />)
                    }

                })()}

                <div id="dashboard-graph" style={graph_style}>

                    <div id="axis_left"></div>
                    <div id="axis_right" style={axis_right_style}></div>

                    <div id="no_data_wrapper" style={nodata_block_style}>
                        <div className="big_sign">You need to choose data to visualize it</div>
                        <div className="small_sign">Use checkboxes below to visualize data you want.</div>
                    </div>

                </div>

                {(() => {

                    if (description_blocks){

                      return (<div className="color_description">
                          {
                              _.map(description_blocks, function(description, i) {

                                  var style = {
                                      "background-color" : description.color
                                  }

                                  return(
                                          <div className={"current"}>
                                              <div className={"circle"} style={style}></div>
                                              <div className={"sign"}>{description.label}</div>
                                          </div>
                                        )
                              })
                          }

                      </div>)

                    }

                    if (this.props.big_numbers && this.state.big_numbers){
                        return(<div className="big-numbers-container">{this.big_number_render()}</div>)
                    }

                })()}

            </div>
        )
    },

    hasClass : function(el, cls) {
        return el.className.baseVal && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className.baseVal);
    },

});
