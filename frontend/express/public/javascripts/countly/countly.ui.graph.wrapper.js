var GraphWrapper = React.createClass({

    getInitialState() {

        return {
            big_numbers : this.props.big_numbers,
            active : true
        };
    },

    big_number_render : function() {

        var self = this;

        return _.map(this.state.big_numbers, function(item, id) {

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

            //console.log("path class_name:", class_name);

            for (var i = 0; i < document.getElementsByClassName("graph_path").length; i++)
            {
                document.getElementsByClassName("graph_path")[i].style["stroke-opacity"] = 0.2;
            }

            document.getElementsByClassName(class_name)[0].style["stroke-opacity"] = 1;

            // --- dots ---

            var dots_class_name = "dot_" + data.color.replace("#", "");

            //console.log("dots_class_name:", dots_class_name);

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
/*
            for (var i = 0; i < document.getElementsByClassName(dots_class_name).length; i++)
            {
                //document.getElementsByClassName(dots_class_name)[i].style.opacity = "1 !important";
                document.getElementsByClassName(dots_class_name)[i].style.fill = "red";
            }
*/
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

    hasClass : function(el, cls) {
        return el.className.baseVal && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className.baseVal);
    },

    update : function(id, granularity_changed){

        var big_numbers = this.state.big_numbers;

        console.log("--->>> update --->>>", id);
        console.log(big_numbers);

        if (id > -1)
        {

            big_numbers[id].active = !big_numbers[id].active;

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
        }

        var sessionDP = this.props.session_data_function();//  countlySession.getSessionDP();

        /*
            disable or enable auto granularity
        */

        var time_range_difference = sessionDP.previous_period_length / sessionDP.daily_granularity[0].data.length;

        if (!granularity_changed && id == -1 && (time_range_difference < 0.5 || time_range_difference > 2)) // auto granularity is active, event from date selection
        {

            if ((sessionDP.daily_granularity[0].data.length / 30) > 6) // more then 6 months
            {
                _granularity = "monthly";
            }
            else if ((sessionDP.daily_granularity[0].data.length * _circle_radius * 2 * 2) > this.props.graph_width)
            {
                _granularity = "weekly";
            }
            else {
                _granularity = "daily";
            }
        }
        else if (_granularity == "daily")
        {
            if ((sessionDP.daily_granularity[0].data.length * _circle_radius * 2 * 2) > this.props.graph_width)
            {
                var small_circles = true;
            }
            else
            {
                var small_circles = false;
            }
        }

        if (_granularity == "weekly")
        {
            var granularity_rows = sessionDP.weekly_granularity;
        }
        else if (_granularity == "monthly")
        {
            var granularity_rows = sessionDP.monthly_granularity;
        }
        else
        {
            var granularity_rows = sessionDP.daily_granularity;
        }

        console.log("[[[[[[[[[[[[[[[ granularity_rows ]]]]]]]]]]]]]]]");
        console.log(granularity_rows);

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

        if (no_data) // todo: what is "no_data" ?
        {
            zero_points = true;
        }

        var active_array = [];

        for (var i = 0; i < big_numbers.length; i++)
        {
            for (var j = 0; j < granularity_rows.length; j++)
            {

                var is_found = false;

                //if (big_numbers[i]['title'].toLowerCase() == granularity_rows[j].label.toLowerCase()){
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

        console.log("+++++++++++++++ active_array +++++++++++++++");
        console.log(active_array);

        //countlyCommon.updateTimeGraph(active_array, "#dashboard-graph", big_numbers, false, _granularity, small_circles, zero_points);
        this.props.update_graph_function(active_array, "#dashboard-graph", big_numbers, false, _granularity, small_circles, zero_points);

        this.setState({
            big_numbers : big_numbers,
            active : active
        });

    },

    render() {

        var graph_style = {
            "width"       : this.props.width + "px",
            "height"      : this.props.height + "px",
            "margin-left" : this.props.margin_left + "px"
        }

        var axis_right_style = {
            "left" : (this.props.graph_width - 60) + "px"
        }

        var nodata_block_style = {
            "height"      : "100px", // todo: move above
            "padding-top" : "140px"
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

        return (
            <div>
                <div className="trend_name">{this.props.trend_sign}</div>
                <granularity
                    className={granularity_class_name}
                    data={this.props.data}
                    graph_width={this.props.graph_width}
                    type={this.props.granularity}
                    period={this.props.period} />

                <div id="dashboard-graph" style={graph_style}>

                    <div id="axis_left"></div>
                    <div id="axis_right" style={axis_right_style}></div>

                    <div id="no_data_wrapper" style={nodata_block_style}>
                        <div className="big_sign">You need to choose data to visualize it</div>
                        <div className="small_sign">Use checkboxes below to visualize data you want.</div>
                    </div>

                </div>

                <div className="big-numbers-container">{this.big_number_render()}</div>

            </div>
        )
    },

});

console.log(">>> finish load GraphWrapper  >>>");
