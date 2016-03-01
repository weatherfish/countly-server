var SettingsPage = React.createClass({

    getInitialState: function() {

        var app_id = countlyCommon.ACTIVE_APP_ID;

        this.app_categories = this.getAppCategories();
        var timezones = this.getTimeZones();

        console.log("------------------ app_categories ------------------");
        console.log(this.app_categories);
        console.log("------------------ timezones ------------------");
        console.log(timezones);

        this.timezones_options = [];

        for (var key in timezones)
        {
            var timezone = timezones[key].z[0];

            //var timezone = value.z[0];

            var timezone_key = false;
            var timezone_value = false;

            for (var key in timezone)
            {
                timezone_key = timezone[key];//key;
                timezone_value = key;//timezone[key];
                break; // it is only one value
            }

            this.timezones_options[timezone_key] = timezone_value;

/*
            this.timezones_options.push({
                "key" : timezone_key,
                "value" : timezone_value
            })*/
        }

        this.app_categories_options = [];

        for (var key in this.app_categories)
        {
            var value = this.app_categories[key];

            /*this.app_categories_options.push({
                "key" : key,
                "value" : value
            })*/

            this.app_categories_options[key] = value;
        }

        console.log("<<<<<<<<<<<<<<<<<<< options timezones_options >>>>>>>>>>>>>>>>");
        console.log(this.timezones_options);

        var current_app = countlyGlobal['apps'][app_id];
        console.log(":::::::::::::: current app :::::::::::::::");
        console.log(current_app);

        console.log("{{{{{{{{{{{ this.timezones_options }}}}}}}}}}}");
        console.log(this.timezones_options);

        return({
            current_app : current_app,
            current_app_id : app_id,
            app_list_is_open : false,
            actions_list_is_open : false
        });

        /*
        {
            for (var app in countlyGlobal['apps'])
            {
                return (<div>{app.name}</div>)
            }
        }
        */

    },

    appListClick : function(){

        this.setState({
            app_list_is_open : !this.state.app_list_is_open
        })

    },

    actionsListClick : function(){

        this.setState({
            actions_list_is_open : !this.state.actions_list_is_open
        })

    },

    selectAppClick : function(i){

        var current_app = countlyGlobal['apps'][i];

        console.log("{{{{{{{{{{{ current app }}}}}}}}}}}");
        console.log(current_app);

        this.setState({
            current_app : current_app,
            current_app_id : current_app._id,
            app_list_is_open : false
        });

    },

    saveApp : function(props, state){

        console.log("========== current_app ===========");
        console.log(this.state.current_app);
        console.log("==== click state ============");
        console.log(state);
        console.log("==== click props ============");
        console.log(props);

        var updated_app = this.state.current_app;

        if (state.value_key)
        {
            updated_app[props.save_key] = state.value_key;
        }
        else {
            updated_app[props.save_key] = state.value;
        }

        console.log("=========== updated_app ===============");
        console.log(updated_app);

/*
        $("#save-app-edit").click(function () {
            if ($(this).hasClass("disabled")) {
                return false;
            }

            var appId = $("#app-edit-id").val(),
                appName = $("#app-edit-name .edit input").val();

            $(".required").fadeOut().remove();
            var reqSpan = $("<span>").addClass("required").text("*");

            if (!appName) {
                $("#app-edit-name .edit input").after(reqSpan.clone());
            }

            if ($(".required").length) {
                $(".required").fadeIn();
                return false;
            }

            var ext = $('#add-edit-image-form').find("#app_image").val().split('.').pop().toLowerCase();
            if (ext && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                return false;
            }

            $(this).addClass("disabled");
*/

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/update',
                data:{
                    args:JSON.stringify({
                        app_id : updated_app._id,
                        name : updated_app.name,
                        category : updated_app.category,
                        timezone : updated_app.timezone,
                        country : "CN" // todo!!!!!!!!!!!!!!!!!!
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function (data) {

                    console.log("========= saved ==============");
                    console.log(data);

                    initAppManagement(updated_app._id);

                    $(event_emitter).trigger("app_renamed", {
                        "updated_app" : updated_app
                    });

                  /*
                    for (var modAttr in data) {
                        countlyGlobal['apps'][appId][modAttr] = data[modAttr];
                        countlyGlobal['admin_apps'][appId][modAttr] = data[modAttr];
                    }

                    if (!ext) {
                        $("#save-app-edit").removeClass("disabled");
                        initAppManagement(appId);
                        hideEdit();
                        $(".app-container").filter(function () {
                            return $(this).data("id") && $(this).data("id") == appId;
                        }).find(".name").text(appName);

                        var sidebarLogo = $("#sidebar-app-select .logo").attr("style");
                        if (sidebarLogo.indexOf(appId) !== -1) {
                            $("#sidebar-app-select .text").text(appName);
                        }
                        return true;
                    }

                    $('#add-edit-image-form').find("#app_image_id").val(appId);
                    $('#add-edit-image-form').ajaxSubmit({
                        resetForm:true,
                        beforeSubmit:function (formData, jqForm, options) {
                            formData.push({ name:'_csrf', value:countlyGlobal['csrf_token'] });
                        },
                        success:function (file) {
                            $("#save-app-edit").removeClass("disabled");
                            var updatedApp = $(".app-container").filter(function () {
                                return $(this).data("id") && $(this).data("id") == appId;
                            });

                            if (!file) {
                                CountlyHelpers.alert(jQuery.i18n.map["management-applications.icon-error"], "red");
                            } else {
                                updatedApp.find(".logo").css({
                                    "background-image":"url(" + file + "?v" + (new Date().getTime()) + ")"
                                });
                                $("#sidebar-app-select .logo").css("background-image", $("#sidebar-app-select .logo").css("background-image").replace(")","") + "?v" + (new Date().getTime()) + ")");
                            }

                            initAppManagement(appId);
                            hideEdit();
                            updatedApp.find(".name").text(appName);
                        }
                    });

                    */
                }
            });

        /*});
*/
    },

    clearData : function(){

        var current_app = this.state.current_app;

        return false;

        CountlyHelpers.confirm(jQuery.i18n.map["management-applications.clear-confirm"], "red", function (result) {
            if (!result) {
                return true;
            }

            var appId = current_app._id;

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/reset',
                data:{
                    args:JSON.stringify({
                        app_id:appId,
                        period:period
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function (result) {

                    if (!result) {
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-admin"], "red");
                        return false;
                    } /*else {
                        if(period == "all"){
                            countlySession.reset();
                            countlyLocation.reset();
                            countlyCity.reset();
                            countlyUser.reset();
                            countlyDevice.reset();
                            countlyCarrier.reset();
                            countlyDeviceDetails.reset();
                            countlyAppVersion.reset();
                            countlyEvent.reset();
                        }
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-success"], "black");
                    }*/
                }
            });
        });
    },

    render : function(){

        var self = this;

        var sidebar_width = 240;
        var margin_left   = 40;
        var margin_right  = 30;

        var page_width = window.innerWidth - sidebar_width - margin_left - margin_right;

        var page_style = {
            width : page_width
        }

        var app_list_style = {}

        if (this.state.app_list_is_open)
        {
            app_list_style.display = "block";
        }
        else {
            app_list_style.display = "none";
        }

        var actions_list_style = {};

        if (this.state.actions_list_is_open)
        {
            actions_list_style.display = "block";
        }
        else {
            actions_list_style.display = "none";
        }

        var icon_style = {};

        icon_style["background-image"] = "url('appimages/" + this.state.current_app._id + ".png')";

        var selector_logo_style = {
            "background-image" : "url('appimages/" + this.state.current_app._id + ".png')"
        }

        return (
            <div id="applications_page" style={page_style}>

                <div className="top_block">
                    <span className="sign">APPLICATIONS MANAGEMENT</span>
                    <div className="new_app_button">Add New App</div>
                </div>

                <div className="wrapper">

                    <div className="selectors_block">

                        <div className="application_selector">
                            <div className="open_button" onClick={this.appListClick.bind(this)}>
                                <div className="logo" style={selector_logo_style}></div>
                                <div className="name">{this.state.current_app.name}</div>
                                <div className="arrow"></div>
                            </div>
                            <div className="app_list" style={app_list_style}>
                                {
                                    _.map(countlyGlobal['apps'], function(app, i){

                                        return (<div onClick={self.selectAppClick.bind(self, i)}>{app.name}</div>)

                                    })
                                }
                            </div>
                        </div>

                        <div className="action_selector">
                            <div className="open_button" onClick={this.actionsListClick.bind(this)}>
                                <div className="sign">Action</div>
                                <div className="arrow"></div>
                            </div>
                            <div className="actions_list" style={actions_list_style}>
                                <div onClick={this.deleteApp.bind(this)}>Delete App</div>
                                <div onClick={this.clearData.bind(this)}>Clear Data</div>
                            </div>
                        </div>

                    </div>

                    <div className="application_block">

                        <span className="sign">APPLICATION DATA</span>

                        <div className="info_block">
                            <div className="table">
                                <span className="row">
                                    <span className="key">App ID</span>
                                    <span className="value">{this.state.current_app._id}</span>
                                </span>

                                <EditableField value_key={"App Name"} value={this.state.current_app.name} on_save={this.saveApp} save_key="name"/>

                                <span className="row">
                                    <span className="key">App Key</span>
                                    <span className="value">{this.state.current_app.key}</span>
                                </span>

                                <EditableField value_key={"Category"} value={this.state.current_app.category} options_values={this.app_categories_options} on_save={this.saveApp} save_key="category"/>

                                <EditableField value_key={"Time Zone"} value={this.state.current_app.timezone} options_values={this.timezones_options} on_save={this.saveApp} save_key="timezone"/>

                                <span className="row">
                                    <span className="key">IAP Event Key</span>
                                    <span className="value">101010test1010101</span>
                                </span>
                            </div>

                            <div className="icon_block">
                                <span className="sign">Icon</span>
                                <div className="icon" style={icon_style}></div>
                            </div>

                        </div>

                        <div className="sdk_block">
                            <span className="sign">Run Countly SDKs</span>
                            <span className="description">Countly has several SDKs to choose from. Some of them are supported by Countly, and others are contributed by Countly community.</span>
                            <a href="https://github.com/countly" className="button">Explore at Github</a>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
});
