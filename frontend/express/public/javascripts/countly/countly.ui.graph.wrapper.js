var GraphWrapper = React.createClass({

    getInitialState() {

        var sessionDP = this.props.data_function();

        if (countlyCommon.getPeriod() == "hour")
        {
            var granularity = "hourly";
        }
        else if ((sessionDP.daily_granularity[0].data.length / 30) > 6) // more then 6 months
        {
            var granularity = "monthly";
        }
        else if (sessionDP.daily_granularity[0].data.length * (_circle_radius * 2) * 2 > this.props.graph_width) // todo: combine with block from update
        {
            var granularity = "weekly";
        }
        else
        {
            var granularity = "daily";
        }

        if (granularity == "hourly")
        {
            var granularity_rows = sessionDP.hourly_granularity;
        }
        else if (granularity == "weekly")
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

        countlyCommon.drawTimeGraph(granularity_rows, "#dashboard-graph", this.props.big_numbers, (this.props.graph_width - 60),this.props.height, false, granularity, false, zero_points);

        return {
            big_numbers : this.props.big_numbers,
            active : true,
            session_dp : sessionDP,
            granularity_type : granularity
        };
    },

    componentWillMount: function() {

        $(event_emitter).on('granularity', function(e, granularity_type){

            this.update(-1, granularity_type);

        }.bind(this));

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change

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

    update : function(id, new_granularity){

        var big_numbers = this.state.big_numbers;

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

        var sessionDP = this.props.data_function();

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
            else if ((sessionDP.daily_granularity[0].data.length * _circle_radius * 2 * 2) > this.props.graph_width)
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

            if ((sessionDP.daily_granularity[0].data.length * _circle_radius * 2 * 2) > this.props.graph_width)
            {
                var small_circles = true;
            }
            else
            {
                var small_circles = false;
            }
        }
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

        _granularity = new_granularity; // todo: remove global variable

        this.props.update_graph_function(active_array, "#dashboard-graph", big_numbers, false, new_granularity, small_circles, zero_points, function(error, result){

            console.log("------- graph updated --------");
            console.log("------- graph updated --------");
            console.log("------- graph updated --------");
            console.log("------- graph updated --------");

            $(event_emitter).trigger('granularity_data', {
                "session_dp" : sessionDP,
                "new_granularity" : new_granularity,
                "period" : countlyCommon.getPeriod()
            });
        });

        this.setState({
            big_numbers : big_numbers,
            active : active,
            granularity_type : new_granularity
        });

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

                <div className="big-numbers-container">{this.big_number_render()}</div>

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

    hasClass : function(el, cls) {
        return el.className.baseVal && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className.baseVal);
    },

});
