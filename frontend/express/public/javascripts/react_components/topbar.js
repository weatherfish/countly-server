var SettingsBlock = React.createClass({

    getInitialState : function() {

        return ({
            //"confirmation_waiting" : false
            "confirmation_waiting" : true,
            "confirmation_sign" : jQuery.i18n.map["management-applications.delete-confirm"],
            "confirmation_function" : false
        });

    },

    render : function() {

        if (this.state.loading)
        {
            return (<Loader/>);
        }

        var new_app_block_style = {
            width : 440/*get_viewport_width()*/
        };

        if (!this.props.open) new_app_block_style.display = "none";

        return(
            <div className="new_app_block" style={new_app_block_style}>

                <div className="label">
                    <div className="cancel_button" onClick={this.cancel}></div>
                    <span>CREATE A NEW APPLICATION</span>
                </div>

                <InputBlock
                    label="app name"
                    value={""}
                    onChange={this.on_setting_change}
                    setting={["name"]}
                />

                <SelectBlock
                    label="Country"
                    selectors={this.countries}
                    active_selector_key={this.countries[0]}
                    onChange={this.on_setting_change}
                    setting={["country"]}
                    width={240}
                />

                <SelectBlock
                    label="Category"
                    selectors={this.categories}
                    active_selector_key={this.categories[0]}
                    onChange={this.on_setting_change}
                    setting={["category"]}
                    width={240}
                />

                <div className="setting_block upload_icon_block">
                    <div className="setting_label">Icon</div>
                    <div className="upload_block">

                        <form ref="uploadForm" enctype="multipart/form-data" id="add-app-image-form">
                            <input ref="file" type="file" id="app_image" name="app_image"  onChange={this.handleIconAdd}/>
                        </form>

                    </div>
                </div>

                <div className="buttons_block">
                    <div className="add_button" onClick={this.add}>add</div>
                </div>
          </div>);
    }
});

var TopBar = React.createClass({

    getInitialState: function() {
        return {
            fstmenu : "",
            sndmenu : "Dashboard",
            user_menu_open : false
        };
    },

    componentWillReceiveProps : function(nextProps) {

        this.setState({
            fstmenu : nextProps.first,
            sndmenu : nextProps.second
        })

    },
/*
    componentDidMount: function(){

        $(event_emitter).on('select', function(e, data){

            console.log("======= topbar event ==========");
            console.log(data);

            this.setState({
                fstmenu : data.fstmenu,
                sndmenu : data.sndmenu,
            });

        }.bind(this));

    },

    componentWillUnmount: function () {
        $(event_emitter).off('select');
    },
*/
    handleOpenUserMenu : function(){

        if (this.state.user_menu_open == false)
        {
            var self = this;

            document.onclick = function(event) {

                if(self.clickedOutsideElement(event, 'top_bar'))
                {

                    document.onclick = false;

                    console.log("===== click outside =============");

                    self.setState({
                        "user_menu_open" : false
                    });
                }
            }
        }

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

                      <div className="top_arrow"></div>

                      <span>Settings</span>
                      <span>API Key</span>
                      <span>Language</span>
                      <span className="logout">Log Out</span>
                  </div>

              </div>
        );
    },

    clickedOutsideElement : function(event, elemId) {

        if (!event)
        {
            return false;
        }

        var theElem = this.getEventTarget(event);
        while(theElem != null) {
          if(theElem.id == elemId)
            return false;
          theElem = theElem.offsetParent;
        }
        return true;
    },

    getEventTarget : function(evt) {
        var targ = (evt.target) ? evt.target : evt.srcElement;
        if(targ != null) {
          if(targ.nodeType == 3)
            targ = targ.parentNode;
        }
        return targ;
    },
});
