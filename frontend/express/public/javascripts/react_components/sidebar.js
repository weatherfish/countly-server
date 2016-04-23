var FullSidebar = React.createClass({

    mixins: [ ReactRouter.History ],

    getInitialState: function() {

        var current_location = this.props.current_location;

        current_location = current_location.split('/');

        var left_full = false;

        if (current_location[2])
        {

            var selected_left = 0;

            for (var i = 0; i < this.props.navigation.length; i++)
            {

                if (current_location[1] == this.props.navigation[i]['path'])
                {
                    selected_left = i;
                    break;
                }
            }

            var right_selected_item = current_location[2];
            var right_closed = false;
        }
        else
        {
            var selected_left = -1;

            for (var i = 0; i < this.props.navigation.length; i++)
            {

                if (current_location[1] == this.props.navigation[i]['path']) // todo: now it compare icon property, this is not right
                {
                    selected_left = i;
                    left_full = true;   
                    break;
                }
            }
            
            if (selected_left > -1)
            {
                this.props.onChange(false, this.props.navigation[i]['key'].toLowerCase());
            }
            /*else
            {
                this.props.onChange(false, jQuery.i18n.map["sidebar.dashboard"]);
            }*/

            var right_selected_item = false;
            var right_closed = true;
        }

        var top_active = false;

        if (Object.keys(countlyGlobal['apps']).length === 0 && JSON.stringify(countlyGlobal['apps']) === JSON.stringify({})){
            top_active = true;
        }

        return {
            selected_left : selected_left,
            in_transition : false,
            right_closed  : right_closed,
            previous_left : -1,
            top_active    : top_active,
            active_app    : this.props.active_app,
            right_selected_item : right_selected_item,
            apps_list_hash : JSON.stringify(countlyGlobal['apps']).hashCode(),
            icons_ready : false,
            left_full : left_full,
            language : this.props.language,
            current_location : this.props.current_location
        };
    },

    componentWillMount : function()
    {

        var self = this;

        var icons = ['sidebar.svg',
                     'sidebar_hover.svg',
                     'sidebar_active.svg',
                     'sidebar/dashboard.svg',
                     'sidebar/dashboard_hover.svg',
                     'sidebar/dashboard_active.svg',                     
                     'events_hover.svg', // todo : combine svg files
                     'events_active.svg']

        var loaded = 0;

        icons.forEach(function(img){
              var icon_src = "../../images/" + img;

              $(new Image()).attr('src', icon_src).load(function() {

                  loaded++;

                  if (loaded == icons.length)
                  {
                      self.setState({
                          "icons_ready" : true
                      });
                  }
              });
          });
    },

    componentWillReceiveProps: function(nextProps) {

/*
        if (nextProps.current_location != this.state.current_location)
        {
            console.log("{{{{{{{{{{{{{{ update }}}}}}}}}}}");
            console.log()
            
            var current_location = nextProps.current_location;

            current_location = current_location.split('/');
    
            var left_full = false;
    
            if (current_location[2])
            {
    
                var selected_left = 0;
    
                for (var i = 0; i < this.props.navigation.length; i++)
                {
    
                    if (current_location[1] == this.props.navigation[i]['path'])
                    {
                        selected_left = i;
                        break;
                    }
                }
    
                var right_selected_item = current_location[2];
                var right_closed = false;
            }
            else
            {
                var selected_left = -1;
    
                for (var i = 0; i < this.props.navigation.length; i++)
                {
    
                    if (current_location[1] == this.props.navigation[i]['path']) // todo: now it compare icon property, this is not right
                    {
                        selected_left = i;
                        left_full = true;
                        break;
                    }
                }
    
                var right_selected_item = false;
                var right_closed = true;
            }
            
            return this.setState({
                current_location : nextProps.current_location,   
                selected_left : selected_left,                
                right_closed  : right_closed,
                previous_left : this.state.selected_left,                
                right_selected_item : right_selected_item,                
                left_full : left_full,
                right_change   : true,
                right_change_i : right_selected_item,
                in_transition : true
            });
        }
*/
        if (nextProps.language != this.state.language)
        {            
            return this.setState({
                language : nextProps.language
            });
        }

        if (this.state.apps_list_hash == JSON.stringify(countlyGlobal['apps']).hashCode())
        {
            return false;
        }
        /*
        var active_app = countlyGlobal['apps'][app_id];
        
        this.setState({
          active_app : active_app,
          apps_list_hash : JSON.stringify(countlyGlobal['apps']).hashCode()
        });
        */
        
        //return false;

        if (Object.keys(countlyGlobal['apps']).length === 0 && JSON.stringify(countlyGlobal['apps']) === JSON.stringify({})){

            return this.setState({
                top_active : true
            });
        }

        // add first

        if (!this.state.active_app && !(Object.keys(countlyGlobal['apps']).length === 0 && JSON.stringify(countlyGlobal['apps']) === JSON.stringify({})))
        {

            for (var app_id in countlyGlobal['apps'])
            {
                var active_app = countlyGlobal['apps'][app_id];
                break;
            }

            this.setState({
                active_app : active_app,
                apps_list_hash : JSON.stringify(countlyGlobal['apps']).hashCode(),
                top_active : false
            });

            return true;
        }

        return false;

        // reneme active
/*
        var active_app = this.state.active_app;

        var active_found = false;

        for (var app_id in countlyGlobal['apps']){

            if (app_id == this.state.active_app.id)
            {
                active_app.name = countlyGlobal['apps'][app_id].name;
                active_found = true;
                break;
            }

        }

        var active_app = false;

        if (!active_found){

            for(var id in countlyGlobal['apps'])
            {
                active_app = countlyGlobal['apps'][id];
                break;
            }

        }

        this.setState({
          active_app : active_app,
          apps_list_hash : JSON.stringify(countlyGlobal['apps']).hashCode()
        });
        
        */
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

    handle_left_click : function(i, href)
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
                    sndmenu : jQuery.i18n.map["sidebar.dashboard"],
                }

                this._handleClick("/dashboard");

                //$(event_emitter).trigger('select', nav_data);

                this.props.onChange(nav_data.fstmenu, nav_data.sndmenu);

            }

            return this.handle_right_close(-1);

        }
        else if (href == false)
        {
            if (this.state.selected_left == -1 || this.state.selected_left == -2 || this.state.left_full)
            {
                this.setState({
                    selected_left : i,
                    previous_left : false,
                    in_transition : true,
                    right_closed  : false,
                    left_full : false,
                });
            }
            else
            {
                this.setState({
                    right_change   : true,
                    right_change_i : i,
                    left_full : false,
                });
            }
        }
        else
        {
            this._handleClick(href);

            this.props.onChange(false, href.replace("/", ""));

            this.setState({
                selected_left : i,
                left_full : true,
                previous_left : false,
                right_closed  : true
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
            //"active_app" : app,
            "top_active" : false
        });
        
        this.props.on_active_app_change(app);
/*
        $(event_emitter).trigger("app_changed", {
            "app_id"  : app.id,
            "app_key" : app.key
        });*/
    },

    render : function() {

        if (!this.state.icons_ready)
        {
            return false;
        }

        var full_navigation = this.props.navigation;
        
        console.log("- full navigation --");
        console.log(full_navigation);

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
                var navigation_key   = full_navigation[this.state.previous_left].path;
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

            var navigation_key   = full_navigation[i].path;
            var navigation_nodes = full_navigation[i].items;
            var description      = full_navigation[i].description;
        }

        if (this.state.left_full)
        {
            is_left_active = true;
        }

        return (
            <div className="wrapper">

                <SidebarTop
                    is_active={this.state.top_active}
                    active_app={this.props.active_app}
                    onClick={this.handle_top_click}
                    language={this.props.language}/>

                <ApplicationsList
                    applications={this.props.applications}
                    active_app={this.props.active_app}
                    onAppChange={this.handle_active_app_change}
                    active={this.state.top_active}
                    language={this.props.language}
                />

                <div id="left_part">
                    <LeftPart
                        navigation={full_navigation}
                        selected_i={this.state.selected_left}
                        is_active={is_left_active}
                        in_transition={this.state.in_transition}
                        handleClick={this.handle_left_click}
                        language={this.props.language}
                    />
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
                        onChange={this.props.onChange}
                        language={this.props.language}
                    />
                </div>

                <div id="countly_logo_side"></div>
                <div id="countly_logo"></div>
                <div id="countly_version">{this.props.countly_version}</div>

                <div id="right_part_back"></div>

            </div>
        );
    }
});
