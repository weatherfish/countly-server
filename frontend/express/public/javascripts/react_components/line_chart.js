//_circle_radius = 4;

var GraphWrapper = React.createClass({

    circle_radius : 4,

    getInitialState() {

        var data_points = this.props.data_function();

        if (this.props.with_granularity)
        {

            if (countlyCommon.getPeriod() == "hour")
            {
                var granularity = "hourly";
            }
            else if ((data_points.daily_granularity[0].data.length / 30) > 6) // more then 6 months
            {
                var granularity = "monthly";
            }
            else if (data_points.daily_granularity[0].data.length * (this.circle_radius * 2) * 2 > this.props.graph_width) // todo: combine with block from update
            {
                var granularity = "weekly";
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
                var granularity_rows = data_points.weekly_granularity;
            }
            else if (_granularity == "monthly")
            {
                var granularity_rows = data_points.monthly_granularity;
            }
            else
            {
                var granularity_rows = data_points.daily_granularity;
            }

            var zero_points = true;

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
            for (var i = 0; i < granularity_rows[1].data.length; i++)
            {
                granularity_rows[0].data[i][0] = granularity_rows[1].data[i][0];
            }
        }

        if (this.props.tmp_colors)
        {
            var tmp_colors = this.props.tmp_colors;
        }
        else
        {
            var tmp_colors = this.props.big_numbers;
        }

        console.log("======== data_points ========");
        console.log(data_points);
        console.log("============= granularity_rows =============");
        console.log(granularity_rows);

        console.log("draw graph height:", this.props.height);

        countlyCommon.drawTimeGraph(granularity_rows, "#dashboard-graph", tmp_colors, this.props.graph_width, this.props.height, false, granularity, false, zero_points);

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

        console.log("=========================== tmp_colors ==================");
        console.log(tmp_colors);

        return {
            big_numbers : tmp_colors,
            active : true,
            session_dp : data_points,
            granularity_type : granularity,
            lines_descriptions : lines_descriptions
        };
    },

    componentWillMount: function() {

        $(event_emitter).off('granularity');
        //$(event_emitter).off('date_choise');

        $(event_emitter).on('granularity', function(e, granularity_type){

            console.log("}}}}}}}}}}}}}}}}}}}}}} granularity }}}}}}}}}}}}}}}}}}}}}}");

            this.update(-1, granularity_type);

        }.bind(this));

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change

            console.log("---------------------- date_choise >>>>>>>>>>>>>>>>>>>>>>>>>>>>");

            if (period.period == "hour")
            {
                var updated_data = this.update(-1, "hourly");
            }
            else
            {
                var updated_data = this.update(-1, false);
            }

/*
            var rows = updated_data.rows;
            var granularity = updated_data.new_granularity;
*/
        }.bind(this));

        $(event_emitter).on('data_changed', function(e, data){

            this.update(-1, this.state.granularity_type);

        }.bind(this));

    },

    big_number_render : function() {

        var self = this;

        return _.map(this.state.big_numbers, function(item, id) {

            console.log("====== render big number ============");
            console.log(item);

            return <BigNumber
                      title={item.title}
                      value={item.total}
                      color={item.color}
                      active={item.active}
                      hover={item.hover}
                      on_click={self.update}
                      on_hover={self.big_number_hover}
                      id={id} />
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

        console.log("============= update big_numbers ===============");
        console.log(big_numbers);

        if (id > -1)
        {
            big_numbers[id].active = !big_numbers[id].active;
        }

        var active = false;
        var no_data = true;

        for (var i = 0; i < big_numbers.length; i++)
        {
            if (big_numbers[i].active)
            {
                active = true;
                no_data = false;
                break;
            }
        }

        console.log("<<<<<< sessionDP >>>>>>>>>>>");
        console.log(sessionDP);

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

            console.log("new_granularity:", new_granularity, "->", time_range_difference);

            if ((!new_granularity/* && id == -1*/ && (time_range_difference < 0.5 || time_range_difference > 2)) || this.state.granularity_type == "hourly") // if previous period is hourly
            {

                /*
                    auto granularity is active, event from date selection
                */

                console.log("... auto granularity ...");
                console.log();

                if ((sessionDP.daily_granularity[0].data.length / 30) > 6) // more then 6 months
                {
                    var new_granularity = "monthly";
                }
                else if ((sessionDP.daily_granularity[0].data.length * this.circle_radius * 2 * 2) > this.props.graph_width)
                {
                    var new_granularity = "weekly";
                }
                else {
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

                console.log("compare:", granularity_rows[0].data.length, ' --- ', (granularity_rows[0].data.length * this.circle_radius * 2 * 2),  " ::: ", this.props.graph_width);

                if ((granularity_rows[0].data.length * this.circle_radius * 2 * 2) > this.props.graph_width)
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
            console.log(">> fix >>");
        }

        console.log(":::::::::: granularity_rows ::::::::::");
        console.log(granularity_rows);


/*
        $(event_emitter).trigger('granularity_data', {
            "session_dp" : sessionDP,
            "new_granularity" : new_granularity,
            "period" : countlyCommon.getPeriod()
        });
*/
        var zero_points = true;

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
                    if (big_numbers[i].short == granularity_rows[j].short){
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

            console.log("{{{{{{{{{{{{{{{{{{[ active_array ]}}}}}}}}}}}}}}}}}}");
            console.log(active_array);

            granularity_rows = active_array;

        }


/*
        var single_graph_data = [];

        for (var i = 0; i < granularity_rows.length; i++)
        {

            var set_data = granularity_rows[i];

            var obj = {
                "name"   : set_data.label,
                "values" : [],
                "color"  : big_numbers[i].color
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

        console.log("///////////////// single_graph_data ///////////////");
        console.log(single_graph_data);

        var series = [];

        single_graph_data.forEach(function(data, i){

            series.push({
                color : data.color, //data_items[i].color,
                data  : data.values,
                name  : data.name
            });
        });
*/
        // ---------------

        console.log("<<<<<<<<<<<< granularity_rows >>>>>>>>>>>>>..", new_granularity, " > small > ", without_circles);
        console.log(granularity_rows);

        /*
          todo: here is 11 colors. 11 not using
        */

        /*
            todo !!! remove array indexes below
        */

        if (granularity_rows[0] && granularity_rows[0].mode == "ghost") // todo: fix for previous time ranges
        {
            for (var i = 0; i < granularity_rows[1].data.length; i++)
            {

                if (!granularity_rows[0].data[i]) // previous time range in "month granularity mode" can be less then current
                {
                    continue;
                }

                granularity_rows[0].data[i][0] = granularity_rows[1].data[i][0];
            }
        }

        //return false;

        _granularity = new_granularity; // todo: remove global variable

        this.props.update_graph_function(granularity_rows, "#dashboard-graph", big_numbers, false, new_granularity, without_circles, zero_points, function(error, result){
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

        var graph_style = {
            "width"       : this.props.width + "px",
            "height"      : this.props.height + "px",
            "margin-left" : this.props.margin_left + "px"
        }

        var axis_right_style = {
            "left" : this.props.graph_width + "px"
        }

        var nodata_block_style = {
    /*        "height"      : "100px", // todo: move above
            "padding-top" : "140px"*/
        }

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
            description_blocks.reverse();
        }

        return (
            <div id="line_chart_wrapper">

                {(() => {

                    if (this.props.trend_sign){
                        return(<div className="trend_name">{this.props.trend_sign}</div>)
                    }

                })()}

                <Granularity
                    class_name={granularity_class_name}
                    data={this.state.session_dp}
                    graph_width={this.props.graph_width}
                    type={this.state.granularity_type}
                    period={this.props.period} />

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

                    if (this.props.big_numbers){
                        return(<div className="big-numbers-container">{this.big_number_render()}</div>)
                    }

                })()}

            </div>
        )
    },

    componentDidMount : function()
    {
        if (this.props.mount_callback)
        {
            this.props.mount_callback({
                granularity : this.state.granularity_type
            });
        }
    },

    componentDidUpdate : function()
    {
        console.log("[[[[[[[[[[[[[[[[[[[ did update ]]]]]]]]]]]]]]]]]]]");
        var updated_data = this.update(-1, this.state.granularity_type, true);
    },


    componentWillReceiveProps: function(nextProps) {

        console.log("--------------- receive props ------------");

        if (this.props.lines_descriptions)
        {

            var granularity_rows = nextProps.data_function().get_current_data();

            console.log(">>>> granular >>>");
            console.log(granularity_rows);

            var lines_descriptions = this.props.lines_descriptions;

            for (var i = 0; i < lines_descriptions.length; i++)
            {
                lines_descriptions[i]['color'] = granularity_rows[i].color;
            }

            this.setState({
                lines_descriptions : lines_descriptions
            });
        }

    },

    hasClass : function(el, cls) {
        return el.className.baseVal && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className.baseVal);
    },

});
