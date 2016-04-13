var SidebarTop = React.createClass({

    /*getInitialState: function() {
        return {
            pushed : false,
        };
    },*/

    handleClick : function(){
        //this.setState({ pushed : !this.state.pushed });

        if (Object.keys(countlyGlobal['apps']).length === 0 && JSON.stringify(countlyGlobal['apps']) === JSON.stringify({})){
            return false;
        }

        this.props.onClick();
    },
    render: function() {

        console.log("---- top render ----------");
        console.log(this.props.active_app);

        var class_name = "";

        //if (this.state.pushed)
        if (this.props.is_active)
        {
            class_name += " pushed";
        }
        else {
            class_name += " closed";
        }

        if (this.props.active_app)
        {
            var logo_src = "/appimages/" + this.props.active_app.logo + "?v=" + this.props.active_app.icon_version;
            var app_name = this.props.active_app.name;
        }
        else
        {
            var logo_src = "/appimages/undefined";
            var app_name = false;
        }

        return (
            <div id="sidebar_top" className={class_name} onClick={this.handleClick}>
                <img id="app_logo" src={logo_src}/>
                <div className="app_data">
                    <span className="name">{app_name}</span>
                    <span className="type">APPLICATION</span>
                </div>
                <span className="down_arrow">
                    <span className="left_part"></span>
                    <span className="right_part"></span>
                </span>
            </div>
        );
    }
});
