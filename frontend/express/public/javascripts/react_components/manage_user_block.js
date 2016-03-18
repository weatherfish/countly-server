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

    handle_height : function(height){
        // height from <ReactHeight/> is "undefined"
        var height = React.findDOMNode(this).offsetHeight;
    },

    componentDidMount : function(){

        var height = React.findDOMNode(this).offsetHeight;

        this.height = height;

        this.props.onHeightChange(height);

    },

    componentDidUpdate : function(){

        var height = React.findDOMNode(this).offsetHeight;

        if (height != this.height)
        {
            this.height = height;
            this.props.onHeightChange(height);
        }

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

            if (i == self.props.apps_array - 1)
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

        return(
            <div>
                {block}
            </div>
        )
    }
})

var ManageUserBlock = React.createClass({

    blocks_height : [],

    getInitialState: function() {

        return({
            edit_open : false,
            user : this.props.user,
            row_height : 40,
            global_admin : this.props.global_admin,
            email_key : this.props.user.email
        });

    },
/*
    componentWillReceiveProps: function(nextProps) {

        if (this.props.options_values)
        {
            var value_key = nextProps.value;
            var value = this.props.options_values[value_key];
        }
        else {
            var value = nextProps.value;
            var value_key = false;
        }

        this.setState({
            value: value,
            value_key : value_key
        });

    },
*/
    edit_click : function() {

        if (this.state.edit_open) return false;

        this.setState({
            edit_open : true
        })

    },

    save : function() {

        this.setState({
            "edit_open" : false
        });

        this.save_user();

    },

    save_user : function(){

        var user = this.state.user;
        user["user_id"] = this.state.user["_id"];

        $.ajax({
            type: "GET",
                url: countlyCommon.API_PARTS.users.w + '/update',
                data: {
                    args: JSON.stringify(user),
                    api_key: countlyGlobal['member'].api_key
                },
                dataType: "jsonp",
            success: function(result) {

            },
            error : function(error){

            }
        });
    },

    cancel : function() {

        this.setState({
            edit_open : false,
      /*      value : this.state.prev_value,
            value_key : this.state.prev_value_key        */
        })

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

        user.admin_of = apps;

        this.setState({
            //edit_open : false,
            user : user
        });

        //this.save_user();

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

        this.setState({
            global_admin : state,
            row_height : 40
        });

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

    render : function() {

        var self = this;

        var save_block_style = {};
        var edit_button_style = {};

        var user_email_style = { }
        var user_info_style = { };

        if (this.props.max_block_height)
        {
            user_email_style.lineHeight = this.props.max_block_height + /*(10 * 2) +*/ "px";
            user_email_style.height = this.props.max_block_height +/* (10 * 2) +*/ "px";

            if(!this.state.edit_open) user_info_style.height = this.props.max_block_height + (10 * 2) + "px";
        }
        else
        {
            user_email_style.lineHeight = this.state.row_height + "px";
            user_email_style.height = this.state.row_height + "px";
        }

        var block_class_name = "user_info";

        var admin_of_block_style = {};
        var user_of_block_style = {};

        if(this.state.edit_open) // show multi sellect
        {

            //block_class_name += " edit";

            user_info_style["background-color"] = "white";

            user_email_style.float = "left";
            user_of_block_style.float = "right";

            edit_button_style.display = "none";
            save_block_style.display = "block";

            var global_admin_style = {
                display : "block"
            }

            var email_block = <div className="email" style={user_email_style}>
                                  <InputBlock
                                      label={false}
                                      value={this.state.user.email}
                                      onChange={this.email_changed}
                                  />
                              </div>

            if (this.state.global_admin)
            {
                var admin_of_block=<div className="user_of_empty"/>;
                var user_of_block=<div className="user_of_empty"/>
            }
            else
            {

                var adminof_width = this.props.width / 100 * 30;
                var userof_width = this.props.width / 100 * 40;

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

            if (this.props.email_max_width)
            {
                user_email_style.width = this.props.email_max_width + 40;
            }

            var email_block = <div className="email" style={user_email_style} key={this.state.email_key}>
                                  <EmailLabel
                                      onWidthChange={this.__email_width_changed}
                                      email={this.state.user.email}
                                  />
                              </div>

            admin_of_block_style.width = Math.floor((this.props.width - user_email_style.width) / 2) - 10;
            user_of_block_style.width =  Math.floor((this.props.width - user_email_style.width) / 2) - 10;

            if (this.state.global_admin)
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
                                        />

/*
                    var user_of_block = [];

                    this.state.user.user_of.map(function(app_id, i) {

                        if (app_id == false)
                        {
                            //user_of_block.push(<span>globaladm</span>)
                            return false;
                        }

                        if (i == self.state.user.user_of.length - 1)
                        {
                            var comma = "";
                        }
                        else
                        {
                            var comma = ", ";
                        }

                        user_of_block.push(<span key={i}>
                            {countlyGlobal['apps'][app_id].name + comma}
                        </span>);

                    })*/
                }
                else
                {
                    var user_of_block = "-";
                }
            }

        }

        return(
                <div className={block_class_name} style={user_info_style} onClick={this.edit_click}>

                    {email_block}

                    <div className="admin_of" style={admin_of_block_style}>
                        {admin_of_block}
                    </div>

                    <div className="user_of" style={user_of_block_style}>
                        {user_of_block}
                    </div>

                    <div className="edit_button" style={edit_button_style}>
                        Click to Edit
                    </div>

                    <span className="save_block" style={save_block_style}>
                        <span className="global_admin_block" style={global_admin_style}>
                            <input type="checkbox" id="global_admin_checkbox" onChange={this.handleGlobalAdminChange}/>
                            <span>global admin</span>
                        </span>
                        <span className="save" onClick={this.save}>Save</span>
                        <span className="cancel" onClick={this.cancel}>Cancel</span>
                    </span>
              </div>
        )
    }
})
