var Granularity = React.createClass({

    getInitialState: function() {

        var self = this;

        this.last_y = 0;

        var list = [ { name : "Daily", active : this.props.type == "daily" ? true : false } ];

        var weekly = { name : "Weekly", active : this.props.type == "weekly" ? true : false };

        if (this.props.data.weekly_granularity[0].mode == "ghost") // if previous time range in 0 position
        {
            var data_index = 1;
        }
        else
        {
            var data_index = 0;
        }


        if (this.props.data.weekly_granularity[data_index].data[0][2] < 7)
        {
            weekly.incomplete_left = true;
            weekly.incomplete_left_days = 7 - this.props.data.weekly_granularity[data_index].data[0][2];
        }

        list.push(weekly);

        var monthly = { name : "Monthly", active : this.props.type == "monthly" ? true : false };

        if (this.props.data.monthly_granularity[0].mode == "ghost") // if previous time range in 0 position
        {
            var data_index = 1;
        }
        else
        {
            var data_index = 0;
        }

        var days_in_month = new Date(self.props.data.monthly_granularity[data_index].data[0][0]).monthDays();

        if (this.props.data.monthly_granularity[data_index].data[0][2] < days_in_month) // todo : 31
        {
            monthly.incomplete_left = true;
            monthly.incomplete_left_days = days_in_month - this.props.data.monthly_granularity[data_index].data[0][2];
        }

        list.push(monthly);

        /*
            detect click and direction of mouse movement
        */

        document.getElementById("weekly_extend_block").getElementsByClassName("small")[0].addEventListener("click", function(){
            self.extend_click(self.state.list[1]);
        });

        document.getElementById("weekly_extend_block").addEventListener("mousemove", this.onmousemove);
        document.getElementById("weekly_extend_block").addEventListener("mouseleave", this.onhoverend_extension_block);

        document.getElementById("monthly_extend_block").getElementsByClassName("small")[0].addEventListener("click", function(){
            self.extend_click(self.state.list[2]);
        });

        document.getElementById("monthly_extend_block").addEventListener("mousemove", this.onmousemove);
        document.getElementById("monthly_extend_block").addEventListener("mouseleave", this.onhoverend_extension_block);

        return {
            "list"      : list,
            "info_open" : false,
            "period"    : this.props.period
        };
    },

    componentWillMount : function(){

        var self = this;

        $(event_emitter).on('granularity_data', function(e, data){

            var session_dp      = data.session_dp;
            var new_granularity = data.new_granularity;
            var period          = data.period;

            var list = [ { name : "Daily", active : (new_granularity == "daily" ? true : false) /*self.state.list[0].active*/ } ];

            var weekly = { name : "Weekly", active : (new_granularity == "weekly" ? true : false) /*self.state.list[1].active*/ };

            if (session_dp.weekly_granularity[0].mode == "ghost") // if previous time range in 0 position
            {
                var data_index = 1;
            }
            else
            {
                var data_index = 0;
            }

            if (session_dp.weekly_granularity[data_index].data[0][2] < 7)
            {
                weekly.incomplete_left = true;
                weekly.incomplete_left_days = 7 - session_dp.weekly_granularity[data_index].data[0][2];
            }

            list.push(weekly);

            var monthly = { name : "Monthly", active : (new_granularity == "monthly" ? true : false) /* self.state.list[2].active*/ };

            if (session_dp.monthly_granularity[0].mode == "ghost") // if previous time range in 0 position
            {
                var data_index = 1;
            }
            else
            {
                var data_index = 0;
            }

            var days_in_month = new Date(session_dp.monthly_granularity[data_index].data[0][0]).monthDays();

            if (session_dp.monthly_granularity[data_index].data[0][2] < days_in_month) // todo : 31
            {
                monthly.incomplete_left = true;
                monthly.incomplete_left_days = days_in_month - session_dp.monthly_granularity[data_index].data[0][2];
            }

            list.push(monthly);

            self.setState({
                list : list,
                period : period
            });

        }.bind(this));
    },
/*
    componentWillUpdate: function(nextProps, nextState){
        return true;
    },
*/
    handleClick : function(granularity){

        console.log("granularity click:", granularity);

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

        $(event_emitter).trigger('granularity', granularity);

    },

    onhover : function()
    {

        if (this.props.disable_hover)
        {
            return false;
        }

        this.setState({
            info_open : true
        });
    },

    onhoverend : function(event)
    {
        if (this.mouse_move_direction == "down")
        {
            this.setState({
                info_open : false
            });
        }
    },

    onmousemove : function(event)
    {

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
        if (event.pageY > this.hover_start_y || event.pageY + 60 < this.hover_start_y) // todo: 40 is offset that indicate that hoverend was on tooltip
        {
            this.setState({
                info_open : false
            });

            this.hover_start_y = false;
        }
    },

    onhoverend_extension_block : function(event)
    {

        if (this.mouse_move_direction != "down")
        {
            this.setState({
                info_open : false
            });
        }

    },

    extend_click : function(element)
    {
        this.setState({
            info_open : false
        });
        
        console.log("::::::::::: extension click ::::::::::::");
        console.log(element)

        $(event_emitter).trigger("date_extend", { "days_extend" : element.incomplete_left_days } );
    },

    find_top_position : function(id) {

        var node = document.getElementById(id);

        if (!node)
        {
            return false;
        }

        var curtop = 0;
        var curtopscroll = 0;
        if (node.offsetParent) {
            do {
                curtop += node.offsetTop;
                curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;

            } while (node = node.offsetParent);
            return (curtop - curtopscroll)
        }
    },

    find_left_position : function(id) {
        var node = document.getElementById(id);

        if (!node)
        {
            return false;
        }

        var curleft = 0;
        //var curtopscroll = 0;
        if (node.offsetParent) {
            do {
                curleft += node.offsetLeft;
                //curtopscroll += node.offsetParent ? node.offsetParent.scrollTop : 0;

            } while (node = node.offsetParent);
            return (curleft)
        }
    },

    getScrollTop : function (){
        if(typeof pageYOffset!= 'undefined'){
            //most browsers except IE before #9
            return pageYOffset;
        }
        else{
            var B= document.body; //IE 'quirks'
            var D= document.documentElement; //IE with doctype
            D= (D.clientHeight)? D: B;
            return D.scrollTop;
        }
    },

    position_element : function(parent_element, child_element) {

        //console.log("parent_element:", parent_element, ", child_element : ", child_element);

        var left_position = this.find_left_position(parent_element) - 50;
        var top_position = this.find_top_position(parent_element) - 70 + this.getScrollTop();

        if (!left_position || !top_position)
        {
            return false;
        }

        //console.log("left_position : ", left_position);
        //console.log("top_position: ", top_position);

        document.getElementById(child_element).style.left = left_position + "px";
        document.getElementById(child_element).style.top = top_position + "px";

    },

    render: function() {

        var self = this;

        if (self.state.info_open && self.state.list[1].active)
        {
            this.position_element("weekly_granularity_selection", "weekly_extend_block");
            document.getElementById("weekly_extend_block").style.display = "block";
        }
        else
        {
            document.getElementById("weekly_extend_block").style.display = "none";
        }

        if (self.state.info_open && self.state.list[2].active)
        {
            this.position_element("monthly_granularity_selection", "monthly_extend_block");
            document.getElementById("monthly_extend_block").style.display = "block";
        }
        else
        {
            document.getElementById("monthly_extend_block").style.display = "none";
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
            <div className={this.props.class_name}>
            <div className={block_class_name} onMouseEnter={self.onhover_all_block} onMouseMove={self.onmousemove} onMouseLeave={self.onhoverend_all_block}>
                {this.state.list.map(function(element) {

                    var element_id = element.name.toLowerCase() + "_granularity_selection";
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

                            return <span id={element_id} className={class_name} onClick={self.handleClick.bind(self, element.name.toLowerCase())} onMouseEnter={self.onhover} onMouseLeave={self.onhoverend}>
                                      <span>{element.name}</span>
                                      <div className={star_class_name}></div>
                                    </span>
                        }
                        else
                        {

                            var star_class_name = "incomplete_star"

                            if (element.active)
                            {
                                star_class_name += " active";
                            }

                            return <span id={element_id} className={class_name} onClick={self.handleClick.bind(self, element.name.toLowerCase())} onMouseEnter={self.onhover} onMouseLeave={self.onhoverend}>
                                      <span>{element.name}</span>
                                      <div className={star_class_name}></div>
                                    </span>
                        }
                    }
                })}
            </div>
            </div>

        );
    }

});
