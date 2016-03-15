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
                <input type="search" placeholder="Search Apps" onKeyUp={this.change_input}/>
                <div className="search_icon"></div>
            </div>
        );
    }
});

var AppList = React.createClass({

    render: function() {

        var self = this;

        //var app_list = this.props.applications.map(function (app, i) {

        var app_list = [];

        for (var app_id in countlyGlobal['apps']){

            var app = countlyGlobal['apps'][app_id];

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

            if (self.props.active_app.id == app._id)
            {
                class_name += " active";
            }

            var logo_src = "/appimages/" + app.logo;

            app_list.push(<div className={class_name} onClick={self.props.onAppChange.bind(self, app)}>
                <img src={logo_src}/>
                <span>{app.name}</span>
            </div>)

/*
            return (
                <div className={class_name} onClick={self.props.onAppChange.bind(self, app/*.key, app.id*/ /*)}>
                    <img src={logo_src}/>
                    <span>{app.name}</span>
                </div>
            );*/
        //});
        }

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
            active          : false,
            showen          : 0
        };
    },

    app_filter: function(filter) {
        this.setState({
            app_filter_text : filter
        });
    },

    componentDidMount : function()
    {

        // todo: one time:
        var screen_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var list_height = (screen_height - 60 - 50) + "px"; // todo: change values to variables

        document.getElementById('app_info').style.height = list_height;

        var initial_top = 'translate3d(0,-' + ((screen_height - 60 - 50 - 60)) + 'px,0)';

        document.getElementById('app_info').style.webkitTransform = initial_top;
        document.getElementById('app_info').style.MozTransform    = initial_top;
        document.getElementById('app_info').style.msTransform     = initial_top;
        document.getElementById('app_info').style.OTransform      = initial_top;
        document.getElementById('app_info').style.transform       = initial_top;
/*
        $(event_emitter).on('app_renamed', function(e, data){

            this.setState({
                "applications" : applications
            });

        }.bind(this));*/
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

        return (
            <div id="app_info" className={class_name}>
                <AppListSearch app_filter={this.app_filter}/>
                <AppList applications={this.props.applications} active_app={this.props.active_app} onAppChange={this.props.onAppChange} app_filter_text={this.state.app_filter_text}/>
            </div>
        );
    }
});
