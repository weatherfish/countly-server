var granularity = React.createClass({

    getInitialState: function() {

        var self = this;

        this.last_y = 0;

        var list = [ { name : "Daily", active : this.props.type == "daily" ? true : false } ];

        var weekly = { name : "Weekly", active : this.props.type == "weekly" ? true : false };

        if (this.props.data.weekly_granularity[0].data[0][2] < 7)
        {
            weekly.incomplete_left = true;
            weekly.incomplete_left_days = 7 - this.props.data.weekly_granularity[0].data[0][2];
        }

        list.push(weekly);

        var monthly = { name : "Monthly", active : false };

        var days_in_month = new Date(self.props.data.monthly_granularity[0].data[0][0]).monthDays();

        if (this.props.data.monthly_granularity[0].data[0][2] < days_in_month) // todo : 31
        {
            monthly.incomplete_left = true;
            monthly.incomplete_left_days = days_in_month - this.props.data.monthly_granularity[0].data[0][2];
        }

        list.push(monthly);

        return {
            "list"      : list,
            "info_open" : false,
            "period"    : this.props.period
        };
    },

    componentDidMount : function(){

        var self = this;

        $(event_emitter).on('granularity_data', function(e, data){

            console.log("event new_granularity:", new_granularity);

            var session_dp      = data.session_dp;
            var new_granularity = data.new_granularity;
            var period          = data.period;

            var list = [ { name : "Daily", active : (new_granularity == "daily" ? true : false) /*self.state.list[0].active*/ } ];

            var weekly = { name : "Weekly", active : (new_granularity == "weekly" ? true : false) /*self.state.list[1].active*/ };

            if (session_dp.weekly_granularity[0].data[0][2] < 7)
            {
                weekly.incomplete_left = true;
                weekly.incomplete_left_days = 7 - session_dp.weekly_granularity[0].data[0][2];
            }

            list.push(weekly);

            //list.push({ name : "Monthly", active : this.state.list[2].active });

            var monthly = { name : "Monthly", active : (new_granularity == "monthly" ? true : false) /* self.state.list[2].active*/ };

            var days_in_month = new Date(session_dp.monthly_granularity[0].data[0][0]).monthDays();

            if (session_dp.monthly_granularity[0].data[0][2] < days_in_month) // todo : 31
            {
                monthly.incomplete_left = true;
                monthly.incomplete_left_days = days_in_month - session_dp.monthly_granularity[0].data[0][2];
            }

            list.push(monthly);

            self.setState({
                list : list,
                period : period
            });

        }.bind(this));
    },

    componentWillUpdate: function(nextProps, nextState){
        return true;
    },

    handleClick : function(granularity){

        console.log("granularity click:", granularity);

        $(event_emitter).trigger('granularity', granularity);

        var new_list = [];

        for (var i = 0; i < this.state.list.length; i++)
        {
            var elem = {
                name   : this.state.list[i].name,
                active : false,
                incomplete_left : this.state.list[i].incomplete_left,
                incomplete_left_days : this.state.list[i].incomplete_left_days
            }

            if (this.state.list[i].name.toLowerCase() == granularity)
            {
                elem.active = true;
            }

            new_list.push(elem);
        }

        this.setState({
            list : new_list
        });

    },

    onhover : function()
    {
        this.setState({
            info_open : true
        });
    },

    onhoverend : function(event)
    {/*
        console.log("--------- hover end ---------", this.mouse_move_direction);
        console.log(event);
*/
        /*if (this.mouse_move_direction == "down")
        {
            this.setState({
                info_open : false
            });
        }*/

    },

    onmousemove : function(event, event2)
    {
        //console.log("--------- onmousemove ---------");
        //console.log(event.pageY);
        //console.log(event2);

        if (event.pageY < this.last_y && this.last_y)
        {
            this.mouse_move_direction = "up";
        }
        else
        {
            this.mouse_move_direction = "down";
        }

        this.last_y = event.pageY;

        //console.log("direction:", this.mouse_move_direction);

        /*this.setState({
            info_open : false
        });*/
    },

    onhover_all_block : function(event)
    {
        if (!this.hover_start_y)
        {
            this.hover_start_y = event.pageY - 10;
        }

    },

    onhoverend_all_block : function(event)
    {
        if (event.pageY > this.hover_start_y || event.pageY + 40 < this.hover_start_y) // todo: 40 is offset that indicate that hoverend was on tooltip
        {
            this.setState({
                info_open : false
            });

            this.hover_start_y = false;
        }

        /*
        if (this.mouse_move_direction == "down")
        {
            this.setState({
                info_open : false
            });
        }*/

    },

    extend_click : function(element)
    {
        this.setState({
            info_open : false
        });

        $(event_emitter).trigger("date_extend", { "days_extend" : element.incomplete_left_days } );
    },

    render: function() {

        var self = this;

        if (self.state.info_open && self.state.list[1].active)
        {
            var weekly_info_block_style = {
                "display" : "block"
            }
        }

        if (self.state.info_open && self.state.list[2].active)
        {
            var monthly_info_block_style = {
                "display" : "block"
            }
        }

        if (this.state.period == "hour")
        {
            /*var block_style = {
                "display" : "none"
            }*/
            var block_class_name = "hidden";
        }
        else {
            /*var block_style = {
                "display" : "block"
            }*/
            var block_class_name = "";
        }

        return (
            <div className={block_class_name} onMouseEnter={self.onhover_all_block} onMouseMove={self.onmousemove} onMouseLeave={self.onhoverend_all_block}>
                {this.state.list.map(function(element) {

                    var class_name = "";

                    if (element.active)
                    {
                        class_name += " active";
                    }

                    if (typeof element.incomplete_left == 'undefined' || element.incomplete_left == false)
                    {
                        return <span className={class_name} onClick={self.handleClick.bind(self, element.name.toLowerCase())}>{element.name}</span>
                    }
                    else
                    {

                        if (element.name.toLowerCase() == "weekly")
                        {

                            var star_class_name = "incomplete_star"

                            if (element.active)
                            {
                                star_class_name += " active";
                            }

                            return <span className={class_name} onMouseEnter={self.onhover} onMouseLeave={self.onhoverend}>
                                      <span onClick={self.handleClick.bind(self, element.name.toLowerCase())}>{element.name}</span>
                                      <div className={star_class_name}></div>

                                      <div id='info_hover_block' style={weekly_info_block_style}>
                                          <span className='big'>Time range contains an Incomplete week</span>
                                          <a className='small' onClick={self.extend_click.bind(self, element)}>Click to extent to full weeks</a>
                                          <div className="bottom_arrow">
                                          </div>
                                      </div>
                                    </span>
                        }
                        else
                        {

                            var star_class_name = "incomplete_star"

                            if (element.active)
                            {
                                star_class_name += " active";
                            }

                            return <span className={class_name} onMouseEnter={self.onhover} onMouseLeave={self.onhoverend}>
                                      <span onClick={self.handleClick.bind(self, element.name.toLowerCase())}>{element.name}</span>
                                      <div className={star_class_name}></div>

                                      <div id='info_hover_block' style={monthly_info_block_style}>
                                          <span className='big'>Time range contains an Incomplete month</span>
                                          <a className='small' onClick={self.extend_click.bind(self, element)}>Click to extent to full months</a>
                                          <div className="bottom_arrow">
                                          </div>
                                      </div>
                                    </span>
                        }
                    }
                })}
            </div>

        );
    }

/*
{(() => {

    if (self.state.info_open && self.state.list[1].active)
    {
        return (

        );
    }

})()}
*/

});
