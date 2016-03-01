var ManageUserBlock = React.createClass({

    getInitialState: function() {

        console.log("============ ManageUserBlock ============");
        console.log(this.props.user);

        return({
            edit_open : false,
            user : this.props.user
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

        this.setState({
            edit_open : true
        })

    },

    save : function() {
/*
        console.log("--- save ----");
        console.log(this);

        this.props.on_save(this.props, this.state);
*/
        this.setState({
            "edit_open" : false
        })

    },

    cancel : function() {

        this.setState({
            edit_open : false,
      /*      value : this.state.prev_value,
            value_key : this.state.prev_value_key        */
        })

    },

    add_admin_app : function(app_id) {

        var user_id = this.props.user._id;

        console.log("{{{{{{{{{{ app_id }}}}}}}}}}");
        console.log(app_id, user_id);

        var user = this.state.user;

        if (user.admin_of.indexOf(app_id) > -1)
        {
            user.admin_of.splice(user.admin_of.indexOf(app_id), 1);
        }
        else
        {
            user.admin_of.push(app_id);
        }

        this.setState({
            //edit_open : false,
            user : user
        });

        this.save_user();

    },

    add_user_app : function(app_id) {

        var user_id = this.props.user._id;

        console.log("{{{{{{{{{{ app_id }}}}}}}}}}");
        console.log(app_id, user_id);

        var user = this.state.user;

        if (user.user_of.indexOf(app_id) > -1)
        {
            user.user_of.splice(user.user_of.indexOf(app_id), 1);
        }
        else
        {
            user.user_of.push(app_id);
        }

        this.setState({
            //edit_open : false,
            user : user
        });

        this.save_user();

    },

    save_user : function(){

        console.log("====== save user ==========");
        console.log(this.state.user);

        $.ajax({
            type: "GET",
                url: countlyCommon.API_PARTS.users.w + '/update',
                data: {
                    args: JSON.stringify(this.state.user),
                    api_key: countlyGlobal['member'].api_key
                },
                dataType: "jsonp",
            success: function(error, result) {

                console.log("============ save user result ===========");
                console.log(error);
                console.log(result);

            }
        });

    },

    render : function() {

        var self = this;

        var save_block_style = {};
        var edit_button_style = {};

        if(this.state.edit_open)
        {
            var admin_of_block = [];
            var user_of_block = [];

            console.log("===== countlyGlobal['apps'] ====");
            console.log(countlyGlobal['apps']);

            for (var app_id in countlyGlobal['apps']){

                var class_name = "app";

                if (this.state.user.admin_of.indexOf(app_id) > -1)
                {
                    class_name += " selected";
                }

                var app = countlyGlobal['apps'][app_id];

                admin_of_block.push(<div className={class_name} onClick={self.add_admin_app.bind(self, app_id)}>{app.name}</div>);

                var class_name = "app";

                if (this.state.user.user_of.indexOf(app_id) > -1)
                {
                    class_name += " selected";
                }

                var app = countlyGlobal['apps'][app_id];

                user_of_block.push(<div className={class_name} onClick={self.add_user_app.bind(self, app_id)}>{app.name}</div>);

            }

            edit_button_style.display = "none";
            save_block_style.display = "block";

        }
        else
        {

            var admin_of_block = [];
            var user_of_block = [];

            this.state.user.admin_of.map(function(app_id, i) {

                if (app_id == false)
                {
                    admin_of_block.push(<span>globaladm</span>)
                    return false;
                }

                if (i == self.state.user.admin_of.length - 1)
                {
                    var comma = "";
                }
                else
                {
                    var comma = ", ";
                }

                admin_of_block.push(<span key={i}>
                    {countlyGlobal['apps'][app_id].name + comma}
                </span>);

            })

            this.state.user.user_of.map(function(app_id, i) {

                if (app_id == false)
                {
                    user_of_block.push(<span>globaladm</span>)
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

            })
        }

        console.log("============ edit_button_style =========");
        console.log(edit_button_style);

        return(
                <div className="user_info">

                    <div className="email">{this.state.user.email}</div>

                    <div className="admin_of">
                        {admin_of_block}
                    </div>

                    <div className="user_of">
                        {user_of_block}
                    </div>

                    <div className="edit_button" onClick={self.edit_click.bind(self)} style={edit_button_style}>
                        Click to Edit
                    </div>

                    <span className="save_block" style={save_block_style}>
                        <span className="save" onClick={self.save}>Save</span>
                        <span className="cancel" onClick={self.cancel.bind(self)}>Cancel</span>
                    </span>
              </div>
        )
    }
})
