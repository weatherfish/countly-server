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
                <div className="search_icon"></div>
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
                var class_name = "app search_result";
            }
            else if (self.props.app_filter_text === false)
            {
                var class_name = "app ";
            }
            else
            {
                var class_name = "app search_result";
            }

            var icon_src = "./images/" + app.icon;

            return (
                <div className={class_name}>
                    <img src={icon_src}/>
                    <span>{app.name}</span>
                </div>
            );
        });
/*
        var covers = Array.apply(null, Array(10)).map(function (x, i) {
            return (
                <div className="cover"></div>
            );
        })
*/
        return (
            <div className="app_list">
                {app_list}
            </div>
        );
    }
});

var ApplicationsList = React.createClass({

    getInitialState: function() {
        return {
            app_filter_text : false,
            active         : false,
            showen          : 0
        };
    },
    app_filter: function(filter) {
        console.log("app_filter:", filter);
        this.setState({
            app_filter_text : filter
        });
    },

    componentDidMount : function()
    {

        // todo: one time:
        var screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var list_height = (screen_height - 60 - 50) + "px";

        document.getElementById('app_info').style.height = list_height;

        var initial_top = 'translate3d(0,-' + ((screen_height - 60 - 50 - 60)) + 'px,0)';

        document.getElementById('app_info').style.webkitTransform = initial_top;
        document.getElementById('app_info').style.MozTransform    = initial_top;
        document.getElementById('app_info').style.msTransform     = initial_top;
        document.getElementById('app_info').style.OTransform      = initial_top;
        document.getElementById('app_info').style.transform       = initial_top;
    },

    componentDidUpdate: function() {

        if (this.props.active && !this.state.active && this.state.showen == 0)
        {
            this.setState({
                active : true,
                showen  : 1
            });
        }
    },

    render: function() {

        var class_name = "";

        if (this.state.active && this.props.active)
        {
            class_name += " active";
        }

/*
        var inline_style = {
            height : list_height
        };
*/
        return (
            <div id="app_info" className={class_name}>
                <AppListSearch app_filter={this.app_filter}/>
                <AppList applications={applications} app_filter_text={this.state.app_filter_text}/>
            </div>
        );

        /*return (
            <div id="app_info" className={class_name}>
                <AppListSearch app_filter={this.app_filter}/>
                <AppList applications={applications} app_filter_text={this.state.app_filter_text}/>
            </div>
        );*/
    }
});
