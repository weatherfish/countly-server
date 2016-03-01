var ManageUsersPage = React.createClass({

    getInitialState: function() {

        console.log("====== UsersPage ===========");

        var self = this;

        $.ajax({
            url:countlyCommon.API_PARTS.users.r + '/all',
            data:{
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"jsonp",
            success:function (users_object) {

                console.log("============== success render =============");
                console.log(users_object);

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

                console.log("--------- users_data --------------");
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

        return({

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
                    <div className="new_user_button">Add New User</div>
                </div>

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
