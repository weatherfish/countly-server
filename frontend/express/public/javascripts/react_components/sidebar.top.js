var SidebarTop = React.createClass({

    /*getInitialState: function() {
        return {
            pushed : false,
        };
    },*/

    handleClick : function(){
        //this.setState({ pushed : !this.state.pushed });
        this.props.onClick();
    },
    render: function() {

        console.log("===== rendr sidebar top ");

        var class_name = "";

        //if (this.state.pushed)
        if (this.props.is_active)
        {
            class_name += " pushed";
        }
        else {
            class_name += " closed";
        }

        var logo_src = "/appimages/" + this.props.active_app.logo + "?v=" + this.props.active_app.icon_version;

        return (
            <div id="sidebar_top" className={class_name} onClick={this.handleClick}>
                <img id="app_logo" src={logo_src}/>
                <div className="app_data">
                    <span className="name">{this.props.active_app.name}</span>
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
