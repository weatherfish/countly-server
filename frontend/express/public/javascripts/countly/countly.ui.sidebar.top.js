var SidebarTop = React.createClass({

    getInitialState: function() {
        return {
            pushed : false,
        };
    },
    handleClick : function(){
        this.setState({ pushed : !this.state.pushed });
        this.props.onClick();
    },
    render: function() {

        var class_name = "";

        if (this.state.pushed)
        {
            class_name += " pushed";
        }
        else {
            class_name += " closed";
        }

        return (
            <div id="sidebar_top" className={class_name} onClick={this.handleClick}>
                <img id="app_logo" src="images/app_logo.png"/>
                <div className="app_data">
                    <span className="name">Hearthstone</span>
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
