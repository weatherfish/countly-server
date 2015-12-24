/** @jsx React.DOM */

var TopBar = React.createClass({

    getInitialState: function() {
        return {
            fstmenu : "",
            sndmenu : "Dashboard",
            user_menu_open : false
        };
    },

    componentDidMount: function(){

        $(event_emitter).on('select', function(e, data){

            this.setState({
                fstmenu : data.fstmenu,
                sndmenu : data.sndmenu,
            });

        }.bind(this));

    },
    componentWillUnmount: function () {
        $(event_emitter).off('select');
    },

    handleOpenUserMenu : function(){

        this.setState({
            "user_menu_open" : !this.state.user_menu_open
        });
    },

    render : function() {

        if (this.state.fstmenu)
        {
            var arrow_block = <div className="arrow_icon"></div>;
        }
        else
        {
            var arrow_block = "";
        }

        var sndmenu_class = "sndmenu";

        if (!this.state.fstmenu)
        {
            sndmenu_class += " dashboard";
        }

        var block_style = {
            "width" : this.props.width + "px"
        }

        var user_menu_style = {};

        if (this.state.user_menu_open){
            user_menu_style.display = "block"
        }

        return (
              <div className="navigation" style={block_style}>
                  <span className="fstmenu">{this.state.fstmenu}</span>
                  {arrow_block}
                  <span className={sndmenu_class}>{this.state.sndmenu}</span>
                  <div className="hint_icon"></div>

                  <div className="user_name_block" onClick={this.handleOpenUserMenu}><span className="name">{this.props.user_name}</span><span className="arrow"></span></div>
                  <div className="user_menu" style={user_menu_style}>
                      <span>settings</span>
                      <span>API Key</span>
                      <span>Language</span>
                      <span className="logout">Log Out</span>
                  </div>

              </div>
        );
    }
});
