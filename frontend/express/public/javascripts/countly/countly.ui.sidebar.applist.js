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
