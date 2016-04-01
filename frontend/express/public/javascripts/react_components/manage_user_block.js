var EmailLabel = React.createClass({

    width : false,

    getInitialState: function() {

        return ({
            width : false,
            //email_key : this.props.email
        })
    },

    componentDidMount : function(){

        var width = React.findDOMNode(this).offsetWidth;

        this.width = width;

        this.props.onWidthChange(width);

    },

    componentDidUpdate : function(){

        var width = React.findDOMNode(this).offsetWidth;

        if (width != this.width)
        {
            this.width = width;
            this.props.onWidthChange(width);
        }

    },

    render : function(){

        return(
            <span>
                {this.props.email}
            </span>
        )
    }

});

var AppUserList = React.createClass({

    height : false,
/*
    handle_height : function(height){
        // height from <ReactHeight/> is "undefined"
        var height = React.findDOMNode(this).offsetHeight;
    },
*/

    getInitialState: function() {
        return ({

        });
    },

    componentDidMount : function(){

        var height = React.findDOMNode(this).offsetHeight;

        this.height = height;

        this.props.onHeightChange(height);

        if (height < this.props.max_block_height)
        {
            this.setState({
                offset_top : ((this.props.max_block_height - height) / 2)
            })
        }

    },

    componentDidUpdate : function(){

        var height = React.findDOMNode(this).offsetHeight;

        if (height != this.height)
        {
            this.height = height;
            this.props.onHeightChange(height);
        }

    },

    componentWillReceiveProps : function(nextProps){
/*
        if (this.height < nextProps.max_block_height)
        {
            this.setState({
                offset_top : ((nextProps.max_block_height - this.height) / 2)
            })
        }*/

    },

    render : function(){

        var self = this;

        var block = [];

        this.props.apps_array.map(function(app_id, i) {

            if (app_id == false)
            {
                //admin_of_block.push(<span>globaladm</span>)
                return false;
            }

            if (!countlyGlobal['apps'][app_id])
            {
                console.log("error here");
                return false
            }

            if (i == self.props.apps_array.length - 1)
            {
                var comma = "";
            }
            else
            {
                var comma = ", ";
            }

            block.push(<span key={i}>
                {countlyGlobal['apps'][app_id].name + comma}
            </span>);

        })

        var block_style = {
      /*      "position" : "relative",
            "top" : this.state.offset_top ? this.state.offset_top + "px" : false*/
        }

        return(
            <div style={block_style}>
                {block}
            </div>
        )
    }
})

var ChangePasswordBlock = React.createClass({

    getInitialState : function() {

        return({
            "value" : ""
        });
    },

    change_input : function(event)
    {

        var value = event.target.value;

        if (event.target.value.toString().length > 0) this.props.onChange(this.props.setting, event.target.value);

        this.setState({ value: event.target.value });
    },

    render : function(){

        var style = {};

        if (this.props.width)
        {
            style.width = this.props.width;
        }

        return(
            <div className="password_change_block">
                <span className="label">Change Password</span>
                <input type="text" value={this.state.value} onChange={this.change_input} style={style}/>

                <div className="change_passord_button">Change</div>
            </div>
        )
    },

});

var ManageUserBlock = React.createClass({

    blocks_height : [],

    getInitialState: function() {

        return({
            edit_open : false,
            user : this.props.user,
            row_height : 40,
            global_admin : this.props.global_admin,
            email_key : this.props.user.email,
            additional_open : false
        });

    },

    componentDidMount : function(){

        var height = React.findDOMNode(this).offsetHeight;

        this.setState({
            height : height
        })

    },

    componentDidUpdate : function(){

        var height = React.findDOMNode(this).offsetHeight;

        if (height != this.state.height)
        {
            this.setState({
                height : height
            })
        }
    },
/*
    edit_click : function() {

        if (this.props.edit_active) return false;

        this.setState({
            edit_open : true
        })

    },
*/
    save : function() {

        this.props.close_click();

        var user = this.state.user;
        user["user_id"] = this.state.user["_id"];

        console.log("-------- will save user ----------");
        console.log(user);

        $.ajax({
            type: "GET",
                url: countlyCommon.API_PARTS.users.w + '/update',
                data: {
                    args: JSON.stringify(user),
                    api_key: countlyGlobal['member'].api_key
                },
                dataType: "jsonp",
            success: function(result) {
                console.log("- success --");
                console.log(result);
            },
            error : function(error){
                console.log("-- erro --");
                console.log(error);
            }
        });
    },

    cancel : function() {

        this.props.close_click();
    },

    delete : function() {

        console.log("=========== delete =========");

        console.log("========== this.state.user =========");
        console.log(this.state.user);

        this.props.on_delete(this.state.user._id);

        var data = {
                  user_ids: [this.state.user._id]
              };

        $.ajax({
            type: "GET",
                    url: countlyCommon.API_PARTS.users.w + '/delete',
                    data: {
                        args: JSON.stringify(data),
                        api_key: countlyGlobal['member'].api_key
                    },
                    dataType: "jsonp",
            success: function(result) {

                console.log("============success result ===============");
                console.log(result);

            }
        });

    },

    set_admin_app : function(apps) {

        var user = this.state.user;

        user.admin_of = apps;

/*
        if (user.admin_of.indexOf(app_id) > -1)
        {
            user.admin_of.splice(user.admin_of.indexOf(app_id), 1);
        }
        else
        {
            user.admin_of.push(app_id);
        }
*/
        this.setState({
            //edit_open : false,
            user : user
        });



    },

    set_user_app : function(apps) {

        var user = this.state.user;

        user.user_of = apps;

        this.setState({
            user : user
        });

    },

    onHeightChange : function(label, new_height){

        this.blocks_height[label] = new_height;

        var max_height = 0;

        for (var label in  this.blocks_height)
        {
            if (this.blocks_height[label] > max_height)
            {
                max_height = this.blocks_height[label];
            }
        }

        if (this.state.row_height != max_height)
        {
            this.setState({
                row_height : max_height
            });
        }

        /*
        if (new_height > this.max_height[label])
        {
            this.max_height[label]
        }
*/

    },

    handleGlobalAdminChange : function(e){

        var state = e.target.checked;

        var user = this.state.user;
        user.global_admin = !user.global_admin;

        this.setState({
            user : user,//state,
            //row_height : 40
        });

        return true;

        //return e.preventDefault();

    },

    email_changed : function(key, value){

        var user = this.state.user;

        user.email = value;

        this.setState({
            user : user
        });

    },

    __email_width_changed : function(width)
    {
        this.props.email_width_changed(this.state.email_key, width);
    },

    __admin_block_height_changed : function(height)
    {
        this.props.block_height_changed("admin", this.state.email_key, height);
    },

    __user_block_height_changed : function(height)
    {
        this.props.block_height_changed("user", this.state.email_key, height);
    },

    additional_click : function()
    {
        this.setState({
            additional_open : !this.state.additional_open
        })
    },

    render : function() {

        var self = this;

        var save_block_style = {};
        var edit_button_style = {};

        var user_email_style = { }
        var user_info_style = { };

        console.log("render this.props.max_block_height:", this.props.max_block_height);

        if (this.props.max_block_height)
        {
            user_email_style.lineHeight = this.props.max_block_height + /*(10 * 2) +*/ "px";
            user_email_style.height = this.props.max_block_height +/* (10 * 2) +*/ "px";

            if(!this.props.edit_active) user_info_style.height = this.props.max_block_height + (10 * 2) + "px";

            var block_height = this.props.max_block_height + (10 * 2);
        }
        else
        {
            user_email_style.lineHeight = this.state.row_height + "px";
            user_email_style.height = this.state.row_height + "px";

            var block_height = this.state.row_height;
        }

        var block_class_name = "user_info";

        var admin_of_block_style = {};
        var user_of_block_style = {};

        if(this.props.edit_active) // show multi sellect
        {

            //block_class_name += " edit";

            user_email_style.lineHeight = 40 + "px";
            user_email_style.height = 40 + "px";

            user_info_style["background-color"] = "white";
            user_info_style["min-height"] = "120px";

            user_email_style.float = "left";
            user_of_block_style.float = "right";

            user_email_style.width = this.props.email_max_width + 30;

            if (user_email_style.width < 200)
            {
                user_email_style.width = 200; // todo: var
            }

            var adminof_width = Math.floor((this.props.width - user_email_style.width) / 2) - 4 - 30; // todo: var
            var userof_width = Math.floor((this.props.width - user_email_style.width) / 2) - 4 - 30; // todo: var

            var input_right_margin = 20; // todo ??

            edit_button_style.display = "none";
            save_block_style.display = "block";

            var global_admin_style = {
                display : "block"
            }

            if (this.state.user.global_admin)
            {
                //var checkbox = <input key="global_admin" type="checkbox" id="global_admin_checkbox" onChange={this.handleGlobalAdminChange}/>;
                var checkbox = <input type="checkbox" checked onChange={this.handleGlobalAdminChange}/>;
            }
            else
            {
                //var checkbox = <input key="global_admin" type="checkbox" checked id="global_admin_checkbox" onChange={this.handleGlobalAdminChange}/>;
                var checkbox = <input type="checkbox" onChange={this.handleGlobalAdminChange}/>;
            }

            var additional_style = {
                width : adminof_width + userof_width + "px"
            };

            var additional_selector_style = {};
            var additional_selector_class = "additional_selector";

            if (this.state.additional_open)
            {
                additional_style.display = "inline-block";
                additional_style.height = (this.state.height - 18) + "px";
                user_of_block_style.display = "none";
                admin_of_block_style.display = "none";
                additional_selector_class += " active"
            }
            else
            {
                additional_style.display = "none";
            }

            var left_block_style = {
                height : (this.state.height - 12) + "px"
            }

            var left_block = <div className="left_block" style={left_block_style}>

                                  <span className="global_admin_block" style={global_admin_style}>
                                      {checkbox}
                                      <span>global admin</span>
                                  </span>

                                  <div className="email" style={user_email_style}>
                                      <InputBlock
                                            label={false}
                                            value={this.state.user.email}
                                            onChange={this.email_changed}
                                            width={user_email_style.width - input_right_margin}
                                      />
                                  </div>

                                  <div>
                                      <span className="cancel" onClick={this.cancel}></span>
                                      <span className="save" onClick={this.save}>Save</span>

                                      <span className={additional_selector_class} onClick={this.additional_click}>
                                          <span className="label">Additional</span>
                                          <span className="arrow"></span>
                                      </span>


                                  </div>
                              </div>

            var additional_block = <div className="additional_block" style={additional_style}>

                                        <ChangePasswordBlock />

                                        <span className="delete" onClick={this.delete}>Delete User</span>

                                    </div>

            if (this.state.user.global_admin)
            {
                var admin_of_block=<div className="user_of_empty"/>;
                var user_of_block=<div className="user_of_empty"/>
            }
            else
            {

                //admin_of_block_style.width = Math.floor((this.props.width - user_email_style.width) / 2) - 10 + "px";
                //user_of_block_style.width =  Math.floor((this.props.width - user_email_style.width) / 2) - 10 + "px";

                var admin_of_block =
                    <MultiSelectBlock
                        label="admin of apps"
                        selectors={this.props.apps}
                        active_selectors_keys={this.state.user.admin_of}
                        onChange={this.set_admin_app}
                        className={false}
                        blockWidth={adminof_width}
                        onHeightChange={this.onHeightChange}
                        parent_height={this.state.row_height}
                        padding={0}
                    />

                var user_of_block =
                    <MultiSelectBlock
                        label="user of apps"
                        selectors={this.props.apps}
                        active_selectors_keys={this.state.user.user_of}
                        onChange={this.set_user_app}
                        className={false}
                        blockWidth={userof_width}
                        onHeightChange={this.onHeightChange}
                        parent_height={this.state.row_height}
                        padding={0}
                    />
            }

        }
        else
        {

            user_info_style.cursor = "pointer";

            var global_admin_style = {
                display : "none"
            }
            /*
            <div className="email" style={user_email_style}>
                                  <span>{this.state.user.email}</span>
                              </div>
                  */

            if (this.props.email_max_width) // todo: should be allways exist
            {
                user_email_style.width = this.props.email_max_width + 40;
            }

            var left_block = <div className="email" style={user_email_style} key={this.state.email_key}>
                                  <EmailLabel
                                      onWidthChange={this.__email_width_changed}
                                      email={this.state.user.email}
                                  />
                              </div>

            admin_of_block_style.width = Math.floor((this.props.width - user_email_style.width) / 2) - 1 + "px";
            user_of_block_style.width =  Math.floor((this.props.width - user_email_style.width) / 2) - 2 - 70 + "px";

            if (this.state.user.global_admin)
            {
                var admin_of_block=<span>global</span>;
                var user_of_block=<span>global</span>;
            }
            else
            {

                if (this.state.user.admin_of.length > 0)
                {
                    var admin_of_block = <AppUserList
                                              apps_array={this.state.user.admin_of}
                                              width={admin_of_block_style.width}
                                              onHeightChange={this.__admin_block_height_changed}
                                              max_block_height={this.props.max_block_height}
                                          />
                }
                else
                {
                    var admin_of_block = <span style={admin_of_block_style}>-</span>;;
                }

                if (this.state.user.user_of.length > 0)
                {

                    var user_of_block = <AppUserList
                                              apps_array={this.state.user.user_of}
                                              width={user_of_block_style.width}
                                              onHeightChange={this.__user_block_height_changed}
                                              max_block_height={this.props.max_block_height}
                                        />

                }
                else
                {
                    var user_of_block = "-";
                }
            }

        }

        return(
                <div className={block_class_name} style={user_info_style} onClick={function(){ if (!self.props.edit_active) self.props.edit_click.call() }}>

                    {left_block}

                    {additional_block}

                    <div className="admin_of" style={admin_of_block_style}>
                        {admin_of_block}
                    </div>

                    <div className="user_of" style={user_of_block_style}>
                        {user_of_block}
                    </div>

                    <div className="edit_button" style={edit_button_style}>
                        Click to Edit
                    </div>

              </div>
        )
    },

    validateEmail : function(email) {
        var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        return re.test(email);
    }
})
