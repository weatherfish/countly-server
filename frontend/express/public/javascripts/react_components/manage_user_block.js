var ManageUserBlock = React.createClass({

    getInitialState: function() {

        return({
            edit_open : false,
            user : this.props.user,
            row_height : 40
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

    add_admin_app : function(apps) {

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

        this.save_user();

    },

    add_user_app : function(apps) {

        var user = this.state.user;

        user.admin_of = apps;

        this.setState({
            //edit_open : false,
            user : user
        });

        this.save_user();

    },

    save_user : function(){

        $.ajax({
            type: "GET",
                url: countlyCommon.API_PARTS.users.w + '/update',
                data: {
                    args: JSON.stringify(this.state.user),
                    api_key: countlyGlobal['member'].api_key
                },
                dataType: "jsonp",
            success: function(result) {

                //console.log("============ save user result ===========");
                //console.log(result);

            },
            error : function(error){
                //console.log("========= error save =========");
                //console.log(error);
            }
        });
    },

    onHeightChange : function(label, new_height){

        ///console.log("================== onHeightChange =========================");
        //console.log(new_height);

        if (new_height > this.state.row_height)
        {
            this.setState({
                row_height : new_height
            });
        }
        /*
        if (new_height > this.max_height[label])
        {
            this.max_height[label]
        }
*/

    },

    render : function() {

        var self = this;

        var save_block_style = {};
        var edit_button_style = {};

        var user_email_style = {
            "height" : this.state.row_height + "px",
            "line-height" : this.state.row_height + "px",
        }

        var user_info_style = { };

        var user_of_style = { };

        if(this.state.edit_open) // show multi sellect
        {

            user_info_style["background-color"] = "white";

            var adminof_width = this.props.width / 100 * 30;
            var userof_width = this.props.width / 100 * 40;

            var admin_of_block =
                <MultiSelectBlock
                    label="admin of apps"
                    selectors={this.props.apps}
                    active_selectors_keys={this.state.user.admin_of}
                    onChange={this.add_admin_app}
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
                    onChange={this.add_user_app}
                    className={false}
                    blockWidth={userof_width}
                    onHeightChange={this.onHeightChange}
                    parent_height={this.state.row_height}
                />

            user_email_style.float = "left";
            user_of_style.float = "right";

          /*
            var admin_of_block = [];
            var user_of_block = [];

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
*/
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

        return(
                <div className="user_info" style={user_info_style}>

                    <div className="email" style={user_email_style}>{this.state.user.email}</div>

                    <div className="admin_of">
                        {admin_of_block}
                    </div>

                    <div className="user_of" style={user_of_style}>
                        {user_of_block}
                    </div>

                    <div className="edit_button" onClick={this.edit_click} style={edit_button_style}>
                        Click to Edit
                    </div>

                    <span className="save_block" style={save_block_style}>
                        <span className="save" onClick={this.save}>Save</span>
                        <span className="cancel" onClick={this.cancel}>Cancel</span>
                    </span>
              </div>
        )
    }
})
