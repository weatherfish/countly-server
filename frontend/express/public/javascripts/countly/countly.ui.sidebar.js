/** @jsx React.DOM */

/* icons pre-load */
applications.forEach(function(app){
    var icon_src = "./images/" + app.icon;
    $(new Image()).attr('src', icon_src).load(function() { });
});



var FullSidebar = React.createClass({

    getInitialState: function() {
        return {
            selected_left : -1,
            in_transition : false,
            right_closed  : true,
            previous_left : -1,
            top_active    : false
        };
    },

    handle_top_click : function()
    {
        this.setState({
            top_active : !this.state.top_active
        });
    },

    /*
        the select element from main menu
    */

    handle_left_click : function(i)
    {

        if (this.state.selected_left == i) // already selected element
        {
            return true;
        }

        if (i == -1)
        {
            return this.handle_right_close();
        }

        if (this.state.selected_left == -1)
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

            console.log("second stage:", this.state.right_change_i);

            this.setState({
                selected_left  : this.state.right_change_i,
                in_transition  : true,
                right_change   : true,
                right_change_i : -1
            });
        }
        else // finish animation
        {
            console.log("finish st 2:");

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

    handle_right_close : function()
    {
        this.setState({
            previous_left : this.state.selected_left,
            selected_left : -1,
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

    render: function() {

        var full_navigation = this.props.navigation;

        if (this.state.selected_left == -1)
        {
            /*
                initial state. 1st leve menu is open. nothing selected
            */

            var is_left_active = true;

            if (this.state.previous_left != -1)
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

                <SidebarTop onClick={this.handle_top_click}/>

                <ApplicationsList active={this.state.top_active}/>

                <div id="left_part">
                    <LeftPart navigation={full_navigation} selected_i={this.state.selected_left} is_active={is_left_active} in_transition={this.state.in_transition} handleClick={this.handle_left_click}/>
                </div>
                <div id="right_part">
                    <RightPart transition={this.state.right_change} change_i={this.state.right_change_i} handle_changed={this.handle_right_changed} nav_key={navigation_key} description={description} navigation={navigation_nodes} is_active={!is_left_active} closed={this.state.right_closed} handleClose={this.handle_right_close} />
                </div>

                <div id="countly_logo_side"></div>
            		<div id="countly_logo"></div>
                <div id="countly_version">Enterprise Edition 1.0.0.14</div>

            		<div id="right_part_back"></div>

            </div>
        );
    }
});

['user.svg',
'user_hover.svg',
'user_active.svg',
'metrics_hover.svg',
'metrics_active.svg',
'messaging.svg',
'funnels_hover.svg',
'funnels_active.svg',
'funnels.svg',
'drill.svg',
'crashes_hover.svg',
'crashes_active.svg',
'crashes.svg',
'cross_2ndlevel_hover.svg',
'cross_2ndlevel_inactive.svg',
].forEach(function(img){
    var icon_src = "./images/sidebar/" + img;
    $(new Image()).attr('src', icon_src).load(function() { });
});

//$(new Image()).attr('src', './images/icon2_active.png').load(function() {

    React.render(
        <FullSidebar navigation={navigation} />,
        document.getElementById("sidebar")
    );

//});
