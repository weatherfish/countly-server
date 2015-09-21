/** @jsx React.DOM */

var navigation = [
    {
        key         : 'Metrics',
        icon        : 'app2',
        description : 'Metrics offer you a wide overwiew about your apps performance',
        items       : ["App versions", "Carriers", "Sessions", "Countries", "Users", "Devices", "Resolutions", "Browsers", "Settings"]
    },
    {
        key: 'User profiles',
        icon        : 'app2',
        description : 'User profiles offer you a wide overwiew about your User profiles',
        items       : ["Users", "Sessions", "Resolutions", "App versions", "Carriers", "Platforms", "Languages", "Browsers", "Settings"]
    },
    {
        key: 'Management',
        icon        : 'app2',
        description : 'Management offer you a wide overwiew about your apps Management',
        items       : ["Users", "Sessions", "Countries", "Devices"]
    },
    {
        key: 'Funnels',
        icon        : 'app2',
        description : 'Funnels offer you a wide overwiew about Funnels',
        items       : ["Users", "Sessions", "Countries", "Devices"]
    },
    {
        key: 'Crashes',
        icon        : 'app2',
        description : 'Crashes offer you a wide overwiew about your apps Crashes',
        items       : ["Users", "Sessions", "Countries", "Devices"]
    }
];

var applications = [
    {
        name : "Countly App",
        icon : "appi1.png"
    },
    {
        name : "Nuvi TV",
        icon : "appi2.png"
    },
    {
        name : "Bubble shooter saga",
        icon : "appi3.png"
    }
]

/* icons preload */

applications.forEach(function(app){

    var icon_src = "./images/" + app.icon;
    $(new Image()).attr('src', icon_src).load(function() { });
});

var RightPart = React.createClass({

    render: function() {

        var nav_nodes = false;
        var head_node = false;

        var class_name = "navitem";

        if (this.props.navigation)
        {
            var nav_nodes = this.props.navigation.map(function (nav_item, i) {

                return (
                    <div className="menu_element">
                        <a className="item">
                            {nav_item}
                        </a>
                    </div>
                );
            });

            class_name += " active";

        }

        if (this.props.nav_key)
        {
            var head_node = <div className="head">
                                <span className="sign">{this.props.nav_key}</span>
                                <span className="close_icon" onClick={this.props.left_part.handleClick.bind(this.props.left_part, -1)}></span>
                            </div>
        }

        return (
            <div className={class_name}>
                {head_node}
                {nav_nodes}
                <div className="description"><span>{this.props.description}</span></div>
            </div>
        );
    }
});


var LeftPart = React.createClass({

    getInitialState: function() {
        return {
            selected    : -1,
            maximized   : true,
            max_transit : false
        };
    },

    handleClick: function(i) {

        var self = this;

        var selected = this.state.selected;
        var selected_i = this.state.selected_i;

        /*
            select left panel item
        */

        if (i >= 0)
        {

            var nav_key     = this.props.navigation[i].key;
            var nav_nodes   = this.props.navigation[i].items;
            var description = this.props.navigation[i].description

            React.render(
                <RightPart nav_key={nav_key} description={description} navigation={nav_nodes} left_part={this}/>,
                document.getElementById("right_part")
            )

            this.setState({
                selected    : nav_key,
                max_transit : true,
            });

            $("#right_part .navitem").addClass("active");

        }
        else
        {
            $("#right_part .navitem").removeClass("active");
            //document.getElementById("sidebar_top").className = document.getElementById("sidebar_top").className.replace(/\bactive\b/,'');
        }

        /*
            minimize full left menu
            open right menu part
            @selected previous state is -1
        */

        if (selected < 0)
        {
            self.setState({ maximized : false });
        }
        else
        {
            /*
                maximize left part
                close right part
            */

            if (i == -1)
            {
                this.setState({
                    maximized   : true,
                    max_transit : true,
                    selected    : -1
                });
            }
        }
    },

    render: function() {

        var self = this;

        var selected    = this.state.selected;
        var maximized   = this.state.maximized;
        var max_transit = this.state.max_transit;

        var sign = false;

        var full_classname = "navitem";

        var navNodes = this.props.navigation.map(function (nav_item, i) {

            var class_name = "item_wrap hoverable";
            var icon_class_name = "icon";
            var sign_class_name = "menu_sign";

            if (nav_item.key == selected)
            {
                icon_class_name += " active " + nav_item.icon + "_active";
                class_name += " active";
            }
            else
            {
                icon_class_name += " " + nav_item.icon;
            }

            if (max_transit)
            {
                sign_class_name += " max_transit";
            }

            var icon = <div className={icon_class_name}></div>;

            var sign = <span className={sign_class_name}><span>{nav_item.key}</span></span>;

            return (
                <div className={class_name} onClick={self.handleClick.bind(self, i)}>
                    {icon}{sign}
                </div>
            );
        });

        if (maximized)
        {
            full_classname += " maximized";
        }

        var dashboard_sign_class = "item_wrap visible dashboard_sign";

        if (selected < 0)
        {
            dashboard_sign_class += " selected";
        }

        var menu_sign_class = "menu_sign";

        if (max_transit)
        {
            menu_sign_class += " max_transit";
        }

        return (
            <div className={full_classname}>
                <div className={dashboard_sign_class}>
                    <div className="icon app1"  onClick={this.handleClick.bind(this, -1)}></div>
                    <span className={menu_sign_class}><span>Dashboard</span></span>
                </div>
                {navNodes}
            </div>
        );
    }
});

React.render(
    <LeftPart path="#" name="test" navigation={navigation}/>,
    document.getElementById("left_part")
)

/* APP LIST */

var AppListSearch = React.createClass({

    getInitialState: function() {
        return { value : "Search Project" };
    },
    change_input: function(event) {
        var value = event.target.value;
        this.props.app_filter(value);
        this.setState({ value : value });
    },
    render: function() {
        var value = this.state.value;
        return (
            <div className="search">
                <input type="search" placeholder="Search Project" onKeyUp={this.change_input}/>
            </div>
        );
    }
});

var AppList = React.createClass({

    render: function() {

        var self = this;

        var app_list = this.props.applications.map(function (app, i) {

            if (self.props.app_filter_text != "" && app.name.toLowerCase().indexOf(self.props.app_filter_text) == -1)
            {
                return false;
            }
            else if (self.props.app_filter_text != "")
            {
                var class_name = "search_result";
            }
            else if (self.props.app_filter_text === false)
            {
                var class_name = "";
            }
            else
            {
                var class_name = "search_result";
            }

            var icon_src = "./images/" + app.icon;

            console.log("icon_src:", icon_src);

            return (
                <div className={class_name}>
                    <img src={icon_src}/>
                    <span>{app.name}</span>
                </div>
            );
        });

        var covers = Array.apply(null, Array(10)).map(function (x, i) {
            return (
                <div className="cover"></div>
            );
        })

        return (
            <div className="app_list">
                {app_list}
                {covers}
            </div>
        );
    }
});

var SidebarTransparent = React.createClass({

    render: function() {

        var transparent = this.props.applications.map(function (app, i) {
            return (<div></div>);
        });

        return (
            <div className="transparent">
                {transparent}
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
});

var ApplicationsList = React.createClass({

    getInitialState: function() {
        return {
            app_filter_text : false
        };
    },
    app_filter: function(filter) {
        console.log("app_filter:", filter);
        this.setState({
            app_filter_text : filter
        });
    },
    render: function() {
        return (
            <div className="wrapper">
                <AppListSearch app_filter={this.app_filter}/>
                <SidebarTransparent applications={applications}/>
                <AppList applications={applications} app_filter_text={this.state.app_filter_text}/>
            </div>
        );
    }
});

var is_top_active = false;

$("#sidebar_top").on("click", function(){

    var period = 500;

    if (is_top_active)
    {

        var total = $("#app_info .transparent").children('div').length;

        $("#app_info .transparent").children('div').each(function (n, elem) {
            var delay = (total - n) * (period - 400);
            $(elem).delay(delay).fadeTo(period, 0);
        });

        $("#app_info .app_list").children('div').each(function (n, elem) {
            var delay = (total - n - 1) * (period - 400);
            $(elem).delay(delay).fadeOut(period);
        });

        setTimeout(function(){
            $("#app_info .search").fadeOut(period);
            $("#app_info").hide();
        }, (total + 1) * period);

        document.getElementById("sidebar_top").className = document.getElementById("sidebar_top").className.replace(/\bactive\b/,'');

        is_top_active = false;
        return false;
    }

    React.render(
        <ApplicationsList/>,
        document.getElementById("app_info"), function(){

            var window_height = $(window).height();

            var total = $("#app_info .transparent").children('div').length;

            $("#app_info").show();

            $("#app_info").animate({
                height: window_height
            }, 0, function() {

            });

            $("#app_info .search").fadeIn();

            $("#app_info .app_list").children('div').each(function (n, elem) {
                var delay = (n + 1) * (period - 400);
                $(elem).delay(delay).fadeIn(period);
            });

            $("#app_info .transparent").children('div').each(function (n, elem) {

                var delay = n * (period - 400);

                if (total -1 == n)
                {
                    $(elem).delay(delay).fadeTo(period, 0.9);
                }
                else
                {
                    $(elem).delay(delay).fadeTo(period, 0.9, function(){
                        $("#left_part").css("top", $("#left_part").css("top") - 50);
                    });
                }
            });

            is_top_active = true;
        });
});
