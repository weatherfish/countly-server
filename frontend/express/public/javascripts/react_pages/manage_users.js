var NewUserWindow = React.createClass({

    mixins: [React.LinkedStateMixin, OutsideClickClose],

    user_data : {
        global_admin : false
    },

    getInitialState: function() {

        var apps = [];

        for (var app_id in countlyGlobal['apps'])
        {
            apps.push({
                "key" : app_id,
                "label" : countlyGlobal['apps'][app_id].name
            });
        }

        return ({
            "apps" : apps,
            "open" : false,
        });

    },

    componentWillReceiveProps : function(nextProps){

        var self = this;

        if (nextProps.open && nextProps.open != this.state.open){
            document.onclick = function(event) {

                if(self.clickedOutsideElement(event, React.findDOMNode(self).getAttribute("data-reactid")))
                {
                    document.onclick = false;
                    self.props.onClose();
                }
            }
        }

        if (nextProps.open != this.state.open){
            this.setState({
                open : nextProps.open
            });
        }
    },

    on_row_change : function(key, value){
        this.user_data[key] = value;
    },

    add : function(){

        var self = this;

        var data = {};

        data.full_name = this.user_data.fullname;
    		data.username = this.user_data.username;
    		data.email = this.user_data.email;
    		data.password = this.user_data.password;
        data.global_admin = this.user_data.global_admin;

        data.admin_of = [];
        data.user_of = [];

  			if (!this.user_data.global_admin)
        {

            this.user_data.adminof.forEach(function(app){
                data.admin_of.push(app/*.key*/);
            });

            this.user_data.userof.forEach(function(app){
                data.user_of.push(app/*.key*/);
            });

    				//data.admin_of = currUserDetails.find(".admin-apps .app-list").val().split(",");
    				//data.user_of = currUserDetails.find(".user-apps .app-list").val().split(",");
  			}

        this.setState({
            loading : true
        });

        $.ajax({
      			type: "GET",
                  url: countlyCommon.API_PARTS.users.w + '/create',
                  data: {
                      args: JSON.stringify(data),
                      api_key: countlyGlobal['member'].api_key
                  },
                  dataType: "jsonp",
      			success: function(result) {

                console.log("========= add result ============");
                console.log(result);

                self.props.onUserAdd(result);
                self.props.onClose();

                self.setState({
                    loading : false
                });
      			}
    		});
    },

    cancel : function(){

        this.props.onClose();

    },

    handleGlobalAdminChange : function(e){

        var state = e.target.checked;

        console.log("<<<<<<<<<< global_admin changed >>>>>>>>>>", state);
        this.on_row_change("global_admin", state)
    },

    render : function(){

        if (this.state.loading)
        {
            return (<Loader/>);
        }

        var new_user_block_style = {
            width : 440//get_viewport_width() - 30
        };

        if (!this.props.open) new_user_block_style.display = "none";

        return(<div className="new_user_block" style={new_user_block_style}>

            <div className="label">
                <div className="cancel_button" onClick={this.cancel}></div>
                <span>Create a new user</span>
            </div>

            <InputBlock
                label="user fullname"
                value={""}
                onChange={this.on_row_change}
                setting={["fullname"]}
            />

            <InputBlock
                label="user username"
                value={""}
                onChange={this.on_row_change}
                setting={["username"]}
            />

            <InputBlock
                label="user email"
                value={""}
                onChange={this.on_row_change}
                setting={["email"]}
            />

            <InputBlock
                label="user password"
                value={""}
                onChange={this.on_row_change}
                setting={["password"]}
            />

            <div className="setting_block">

                <div className="setting_label">Admin of apps</div>

                <MultiSelectBlock
                    label="admin of app"
                    blockWidth={240}
                    selectors={this.state.apps}
                    onChange={this.on_row_change}
                    setting="adminof"
                    className={false}
                />

            </div>

            <div className="setting_block">

                <div className="setting_label">User of apps</div>

                <MultiSelectBlock
                    label="admin of app"
                    blockWidth={240}
                    selectors={this.state.apps}
                    onChange={this.on_row_change}
                    setting="userof"
                    className={false}
                />

            </div>

            <div className="setting_block">
                <div className="setting_label">global admin</div>
                <input key="global_admin" type="checkbox" id="global_admin_checkbox" onChange={this.handleGlobalAdminChange}/>
            </div>

            <div className="buttons_block">

                <div className="add_button" onClick={this.add}>add</div>
            </div>

        </div>)
    }
});

var ManageUsersPage = React.createClass({

    emails_blocks_width : [],

    blocks_height : [],

    getInitialState: function() {

        var apps = [];

        for (var app_id in countlyGlobal['apps'])
        {
            apps.push({
                "key" : app_id,
                "label" : countlyGlobal['apps'][app_id].name
            });
        }

        return({
            new_user_open : false,
            apps : apps,
            email_max_width : false,
            max_block_height : false,
            selected_user : false
        });

    },

    componentWillMount : function()
    {

        var self = this;

        $.ajax({
            url:countlyCommon.API_PARTS.users.r + '/all',
            data:{
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"jsonp",
            success:function (users_object) {

                var users_data = [];

                for (var user in users_object){
                    users_data.push(users_object[user]);
                };

                for(var i = 0; i < users_data.length; i++)
                {
                    if (users_data[i].admin_of.length == 0)
                    {
                        users_data[i].admin_of[0] = false
                    }

                    if (users_data[i].user_of.length == 0)
                    {
                        users_data[i].user_of[0] = false
                    }
                }

                self.setState({
                    "users_data" : users_data
                })

              /*
                $('#content').html(self.template({
                    users:users,
                    apps:countlyGlobal['apps'],
                    is_global_admin: (countlyGlobal["member"].global_admin) ? true : false
                }));*/
            }
        });

    },

    new_user_click : function(){

        this.setState({
            new_user_open : !this.state.new_user_open
        })
    },

    new_user_close : function()
    {
        this.setState({
            new_user_open : false
        })
    },

    on_user_add : function(new_user)
    {
        var users_data = this.state.users_data;

        users_data.push(new_user);

        this.setState({
            "users_data" : users_data
        });

    },

    on_user_delete : function(user_id)
    {

        console.log("will delete user:", user_id);

        var users_data = this.state.users_data;

        var array_id = false;

        for (var i = 0; i < users_data.length; i++)
        {
            if (users_data[i]["_id"] == user_id)
            {
                array_id = i;
                break;
            }
        }

        users_data.splice(array_id, 1);

        this.setState({
            "users_data" : users_data
        });
    },

    email_width_changed : function(email, new_width){

        console.log("changed >> ", email, " :: ", new_width);

        this.emails_blocks_width[email] = new_width;

        var max_width = 0;

        for (var key in  this.emails_blocks_width)
        {
            if (this.emails_blocks_width[key] > max_width)
            {
                max_width = this.emails_blocks_width[key];
            }
        }

        console.log("max_width:", max_width);

        if (max_width != this.state.email_max_width)
        {

            this.setState({
                email_max_width : max_width
            });
        }

    },

    block_height_changed : function(type, key, height){

        if (!this.blocks_height[type]) this.blocks_height[type] = [];

        this.blocks_height[type][key] = height;

        var max_height = 0;

        for (var type in this.blocks_height)
        {
            var column = this.blocks_height[type];

            var max_in_type = 0;

            for (var key in column)
            {
                if (column[key] > max_in_type)
                {
                    max_in_type = column[key];
                }
            }

            if (max_in_type > max_height)
            {
                max_height = max_in_type;
            }

        }

        this.setState({
            max_block_height : max_height
        })

    },

    open_edit : function(id){

        console.log(">> open >>>");

        this.setState({
            selected_user : id
        })

    },

    close_edit : function(id){

        this.setState({
            "selected_user" : false
        })

    },

    render : function(){

        var self = this;

        var elements_width = get_viewport_width();

        var page_style = {
            width : elements_width
        }

        var manage_block_width = elements_width - 30 * 2; // todo: tmp variable, look this.refs.svg.getDOMNode().offsetWidth

        var email_header_style = {};
        var adminof_header_style = {};
        var userof_header_style = {};

        if (this.state.selected_user !== false)
        {
            var email_header_width = this.state.email_max_width + 100;

            email_header_style.width = email_header_width + "px";
            adminof_header_style.width = Math.floor((manage_block_width - email_header_width) / 2) - 1 + "px";
            userof_header_style.width = Math.floor((manage_block_width - email_header_width) / 2) - 2 + "px";

            var cells_email_width = this.state.email_max_width + 60;

        }
        else if (this.state.email_max_width)
        {

            var email_header_width = this.state.email_max_width + 40;

            email_header_style.width = email_header_width + "px";
            adminof_header_style.width = Math.floor((manage_block_width - email_header_width) / 2) - 1 + "px";
            userof_header_style.width = Math.floor((manage_block_width - email_header_width) / 2) - 2 + "px";

            var cells_email_width = this.state.email_max_width;

        }

        return (
            <div id="manage_users_page" style={page_style}>

                <div className="top_block">
                    <span className="sign">USER ROLES MANAGEMENT</span>
                    <div className="new_user_button" onClick={this.new_user_click}>Add New User</div>
                </div>

                <NewUserWindow open={this.state.new_user_open} onClose={this.new_user_close} onUserAdd={this.on_user_add}/>

                <div className="wrapper">

                    <div className="sign">ADDED USERS</div>

                    <div className="users_table">
                              <div className="users_table_header">
                                  <div className="email" style={email_header_style}>User E-mail</div>
                                  <div className="admin_of" style={adminof_header_style}>Admin of</div>
                                  <div className="user_of" style={userof_header_style}>User of</div>
                              </div>
                              {
                                  _.map(self.state.users_data, function(user, i){

                                      if (self.state.selected_user !== false && self.state.selected_user === i)
                                      {
                                          var edit_active = true;
                                      }
                                      else
                                      {
                                          var edit_active = false;
                                      }

                                      return (<ManageUserBlock
                                                  user={user}
                                                  email={user.email}
                                                  admin_of={user.admin_of}
                                                  user_of={user.user_of}
                                                  global_admin={user.global_admin}
                                                  apps={self.state.apps}
                                                  width={manage_block_width}
                                                  email_max_width={cells_email_width}
                                                  email_width_changed={self.email_width_changed}
                                                  max_block_height={self.state.max_block_height}
                                                  block_height_changed={self.block_height_changed}
                                                  edit_click={self.open_edit.bind(self, i)}
                                                  close_click={self.close_edit.bind(self)}
                                                  edit_active={edit_active}
                                                  on_delete={self.on_user_delete}
                                              />)

                                  })
                              }

                    </div>

                </div>

            </div>
        );
    }
});
