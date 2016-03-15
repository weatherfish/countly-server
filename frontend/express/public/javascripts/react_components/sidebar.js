var FullSidebar = React.createClass({

    mixins: [ ReactRouter.History ],

    getInitialState: function() {

        var current_location = this.props.current_location;

        current_location = current_location.split('/');

        if (current_location[2])
        {

            var selected_left = 0;

            for (var i = 0; i < this.props.navigation.length; i++)
            {

                if (current_location[1] == this.props.navigation[i]['path']) // todo: now it compare icon property, this is not right
                {
                    selected_left = i;
                    break;
                }
            }

            //var selected_left = selected_left;
            var right_selected_item = current_location[2];
            var right_closed = false;
        }
        else
        {
            var selected_left = -1;
            var right_selected_item = false;
            var right_closed = true;
        }


        return {
            selected_left : selected_left,
            in_transition : false,
            right_closed  : right_closed,
            previous_left : -1,
            top_active    : false,
            active_app    : this.props.active_app,
            right_selected_item : right_selected_item
        };
    },

    handle_top_click : function()
    {
        this.setState({
            top_active : !this.state.top_active,
        });
    },

    /*
        the select element from main menu
    */

    _handleClick: function(path){
        this.history.pushState(null, path);
    },

    handle_left_click : function(i)
    {

        if (this.state.selected_left == i) // already selected element
        {
            return true;
        }

        if (i == -1)
        {

            console.log("current:", window.location);

            if (window.location.hash != "#/")
            {

                var nav_data = {
                    fstmenu : false,
                    sndmenu : "Dashboard",
                }

                this._handleClick("/dashboard");

                //$(event_emitter).trigger('select', nav_data);

            }

            return this.handle_right_close(-1);
        }

        if (this.state.selected_left == -1 || this.state.selected_left == -2)
        {
            this.setState({
                selected_left : i,
                previous_left : false,
                in_transition : true,
                right_closed  : false
            });
        }
        else
        {
            this.setState({
                right_change   : true,
                right_change_i : i
            });
        }
    },

    /*
        right panel call this function to report opacity transition state changes, when menu items are changing
    */

    handle_right_changed : function()
    {

        if (this.state.right_change_i != -1) // second stage of transition - old hidden, new not shown yet
        {
            this.setState({
                selected_left  : this.state.right_change_i,
                in_transition  : true,
                right_change   : true,
                right_change_i : -1
            });
        }
        else // finish animation
        {
            var self = this;

            setTimeout(function(){ // hack - need to change items class name for change opacity from 0(or bigger, doesn't matter) to 1, on new elements immediately after insert to DOM. But function componentDidUpdate call early then in insert to DOM i think.
                self.setState({
                    in_transition  : false,
                    right_change   : false,
                });
            }, 10);
        }
    },

    /*
        close right part, maximize left part
    */

    handle_right_close : function(value)
    {

        if (this.state.selected_left == -1)
        {
            value = -1;
        }

        this.setState({
            previous_left : this.state.selected_left,
            selected_left : value,
            in_transition : true,
            right_closed  : true
        });
    },

    handle_right_finish_close : function()
    {
        this.setState({
            selected_left : -1,
            in_transition : false,
        });
    },

    handle_active_app_change : function(app)
    {
        this.setState({
            "active_app" : app,
            "top_active" : false
        });

        $(event_emitter).trigger("app_changed", {
            "app_id"  : app.id,
            "app_key" : app.key
        });
    },

    render : function() {

        var full_navigation = this.props.navigation;

        if (this.state.selected_left == -2)
        {

            var is_left_active = false;
            var navigation_key   = "-";
            var navigation_nodes = ["-"];
            var description      = "-";

        }
        else if (this.state.selected_left == -1)
        {
            /*
                initial state. 1st leve menu is open. nothing selected
            */

            var is_left_active = true;

            if (this.state.previous_left != -1 && this.state.previous_left != -2)
            {
                var navigation_key   = full_navigation[this.state.previous_left].key;
                var navigation_nodes = full_navigation[this.state.previous_left].items;
                var description      = full_navigation[this.state.previous_left].description;
            }
            else {
                var navigation_key   = "-";
                var navigation_nodes = ["-"];
                var description      = "-";
            }

        }
        else
        {
            var is_left_active = false;

            var i = this.state.selected_left;

            var navigation_key   = full_navigation[i].key;
            var navigation_nodes = full_navigation[i].items;
            var description      = full_navigation[i].description;
        }

        return (
            <div className="wrapper">

                <SidebarTop is_active={this.state.top_active} active_app={this.state.active_app} onClick={this.handle_top_click}/>

                <ApplicationsList
                    applications={this.props.applications}
                    active_app={this.state.active_app}
                    onAppChange={this.handle_active_app_change}
                    active={this.state.top_active}
                />

                <div id="left_part">
                    <LeftPart navigation={full_navigation} selected_i={this.state.selected_left} is_active={is_left_active} in_transition={this.state.in_transition} handleClick={this.handle_left_click}/>
                </div>
                <div id="right_part">
                    <RightPart transition={this.state.right_change}
                        change_i={this.state.right_change_i}
                        handle_changed={this.handle_right_changed}
                        nav_key={navigation_key}
                        description={description}
                        navigation={navigation_nodes}
                        is_active={!is_left_active}
                        closed={this.state.right_closed}
                        handleClose={this.handle_right_close.bind(this, -2)}
                        selected_item={this.state.right_selected_item}
                    />
                </div>

                <div id="countly_logo_side"></div>
            		<div id="countly_logo"></div>
                <div id="countly_version">Enterprise Edition 1.0.0.14</div>

            		<div id="right_part_back"></div>

            </div>
        );
    }
});
