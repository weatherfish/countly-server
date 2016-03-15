var NewUserWindow = React.createClass({

    mixins: [React.LinkedStateMixin],

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
            apps : apps
        });

    },

    on_row_change : function(key, value){
        this.user_data[key] = value;
    },

    add : function(){

        var self = this;

        console.log("------------ add ----------");
        console.log(this.user_data);

        var data = {};

        data.full_name = this.user_data.fullname;
    		data.username = this.user_data.username;
    		data.email = this.user_data.email;
    		data.password = this.user_data.password;
        data.global_admin = this.user_data.global_admin;

  			if (!this.user_data.global_admin)
        {

            data.admin_of = [];
            data.user_of = [];

            this.user_data.adminof.forEach(function(app){
                data.admin_of.push(app.key);
            });

            this.user_data.userof.forEach(function(app){
                data.user_of.push(app.key);
            });

    				//data.admin_of = currUserDetails.find(".admin-apps .app-list").val().split(",");
    				//data.user_of = currUserDetails.find(".user-apps .app-list").val().split(",");
  			}

        console.log("<<<<<<<<<<<<< data >>>>>>>>>>>>>>>>");
        console.log(data);

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
                console.log("---ajax result ---");
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

    render : function(){

        if (this.state.loading)
        {
            return (<Loader/>);
        }

        var new_user_block_style = {
            width : get_viewport_width()
        };

        if (!this.props.open) new_user_block_style.display = "none";

        return(<div className="new_user_block" style={new_user_block_style}>

            <div className="label">Create a new user</div>

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
                    selectors={this.state.apps}
                    onChange={this.on_row_change}
                    setting="userof"
                    className={false}
                />

            </div>

            <div className="buttons_block">
                <div className="cancel_button" onClick={this.cancel}>cancel</div>
                <div className="add_button" onClick={this.add}>add</div>
            </div>

        </div>)
    }
});

/*

*/

var ManageUsersPage = React.createClass({

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
            apps : apps
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

                console.log("{{{{{{{{{{ loaded user data }}}}}}}}}}");
                console.log(users_data);

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

        console.log("this.state.new_user_open:", this.state.new_user_open);

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

    on_new_user_add : function(new_user)
    {
        var users_data = this.state.users_data;

        users_data.push(new_user);

        this.setState({
            "users_data" : users_data
        });

    },

    render : function(){

        var self = this;

        var elements_width = get_viewport_width();

        var page_style = {
            width : elements_width
        }

        return (
            <div id="manage_users_page" style={page_style}>

                <div className="top_block">
                    <span className="sign">USER ROLES MANAGEMENT</span>
                    <div className="new_user_button" onClick={this.new_user_click}>Add New User</div>
                </div>

                <NewUserWindow open={this.state.new_user_open} onClose={this.new_user_close} onUserAdd={this.on_new_user_add}/>

                <div className="sign">ADDED USERS</div>

                {(() => {

                    if (self.state.users_data){

                        return (<div className="users_table">
                                  <div className="users_table_header">
                                      <div className="email">User E-mail</div>
                                      <div className="admin_of">Admin of</div>
                                      <div className="user_of">User of</div>
                                  </div>
                            {
                                _.map(self.state.users_data, function(user){

                                    return (<ManageUserBlock
                                        user={user}
                                        email={user.email}
                                        admin_of={user.admin_of}
                                        user_of={user.user_of}
                                        apps={self.state.apps}
                                        />)

                                })
                            }

                        </div>)
                    }

                })()}

            </div>
        );
    }
});
