var NewAppWindow = React.createClass({

    mixins: [React.LinkedStateMixin, OutsideClickClose],

    countries : [],
    categories : [],

    app_data : {},

    icon_file : false,

    getInitialState : function() {
/*

      var userTimezone = jstz.determine().name();

        // Set timezone selection defaults to user's current timezone
        for (var countryCode in timezones) {
            for (var i = 0; i < timezones[countryCode].z.length; i++) {
                for (var countryTimezone in timezones[countryCode].z[i]) {
                    if (timezones[countryCode].z[i][countryTimezone] == userTimezone) {
                        initCountrySelect("#app-add-timezone", countryCode, countryTimezone, userTimezone);
                        break;
                    }
                }
            }
        }
*/
        var zones = countlyCommon.getTimeZones();
        var categories = countlyCommon.getAppCategories();

        for (var key in zones)
        {
            this.countries.push({
                "key" : key,
                "label" : zones[key].n,

            });
        };

        for (var key in categories)
        {
            this.categories.push({
                "key" : key,
                "label" : categories[key],

            });
        };

        return ({
            //"confirmation_waiting" : false
            "open" : false,
            "confirmation_waiting" : true,
            "confirmation_sign" : jQuery.i18n.map["management-applications.delete-confirm"],
            "confirmation_function" : false,
        });

    },
/*
    componentDidMount : function(){

        var self = this;

        document.onclick = function(event) {

            if(self.clickedOutsideElement(event, React.findDOMNode(self).getAttribute("data-reactid")))
            {

                console.log("--- click outside ----");

                document.onclick = false;
                self.props.onClose();
            }
        }
    },
*/
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

    on_setting_change : function(key, value){
        this.app_data[key] = value;
    },

    add : function(){

        if (!this.icon_file)
        {
            alert("error");
            return false;
        }

        var self = this;

        this.setState({
            loading : true
        })

        this.props.onClose();

        $.ajax({
            type:"GET",
            url:countlyCommon.API_PARTS.apps.w + '/create',
            data:{
                args:JSON.stringify({
                    name : this.app_data.name,
                    category : this.app_data.category,
                    timezone : this.app_data.timezone,
                    country  : this.app_data.country
                }),
                api_key:countlyGlobal['member'].api_key
            },
            dataType:"jsonp",
            success:function (data) {

                var newAppObj = {
                    "_id":data._id,
                    "name":data.name,
                    "key":data.key,
                    "category":data.category,
                    "timezone":data.timezone,
                    "country":data.country
                };

                

                // --------------------------------------------

                var new_app_id = data["_id"];

                //initAppManagement(new_app_id);

                console.log("new_app_id:", new_app_id);

                self.props.upload_icon(new_app_id, self.icon_file, function(error, result){

                    console.log("--- add finish ----");
                    console.log(result);

                    //initAppManagement(new_app_id);

                    self.props.onCreate(data);

                    self.setState({
                        loading : false
                    })
                });
            }})
    },

    cancel : function(){

        this.props.onClose();

        this.setState({

        });

    },

    handleIconAdd: function(e){

        var file = this.refs.file.getDOMNode().files[0];

        if (!file)
        {
            return false;
        }

        this.icon_file = file;

    },

    render : function(){

        if (this.state.loading)
        {
            return (<Loader/>);
        }

        var new_app_block_style = {
            width : 440/*get_viewport_width()*/
        };

        if (!this.props.open){
            new_app_block_style.display = "none";
            //new_app_block_style.right = -440;
        }
        else
        {
            //new_app_block_style.right = 0;
        }

        return(
            <div className="new_app_block" style={new_app_block_style}>

                <div className="label">
                    <div className="cancel_button" onClick={this.cancel}></div>
                    <span>{jQuery.i18n.map["management-applications.my-new-app"]}</span>
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

var ActionSelector = React.createClass({

    mixins: [OutsideClickClose],

    getInitialState: function() {
        return ({
            "open" : false
        })
    },

    openClick : function(){

        var new_open_state = !this.state.open;

        if (new_open_state)
        {

            var self = this;

            document.onclick = function(event) {

                if(self.clickedOutsideElement(event, React.findDOMNode(self).getAttribute("data-reactid")))
                {

                    document.onclick = false;

                    self.setState({
                        "open" : false
                    })
                }
            }
        }

        this.setState({
            "open" : new_open_state
        })

    },

    render : function(){

        var actions_list_style = {};

        if (this.state.open)
        {
            actions_list_style.display = "block";
        }
        else {
            actions_list_style.display = "none";
        }
        
        actions_list_style.width = "270px";

        return(<div className="action_selector">
            <div className="open_button" onClick={this.openClick}>
                <div className="sign">Action</div>
                <div className="arrow"></div>
            </div>
            <div className="actions_list" style={actions_list_style}>
                <div onClick={this.props.deleteApp}>{jQuery.i18n.map["common.delete"]}</div>
                <div onClick={this.props.clearData.bind(this, "all-data")}>{jQuery.i18n.map["management-applications.clear-all-data"]}</div>
                <div onClick={this.props.clearData.bind(this, "1month-data")}>{jQuery.i18n.map["management-applications.clear-1month-data"]}</div>
                <div onClick={this.props.clearData.bind(this, "3month-data")}>{jQuery.i18n.map["management-applications.clear-3month-data"]}</div>
                <div onClick={this.props.clearData.bind(this, "6month-data")}>{jQuery.i18n.map["management-applications.clear-6month-data"]}</div>
                <div onClick={this.props.clearData.bind(this, "1year-data")}>{jQuery.i18n.map["management-applications.clear-1year-data"]}</div>
                <div onClick={this.props.clearData.bind(this, "2year-data")}>{jQuery.i18n.map["management-applications.clear-2year-data"]}</div>
            </div>
        </div>)
    }

});

var ApplicationsPage = React.createClass({

    app_categories : false,

    getInitialState: function() {

        this.app_categories = countlyCommon.getAppCategories();
        var timezones = countlyCommon.getTimeZones();

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
        }

        this.app_categories_options = [];

        for (var key in this.app_categories)
        {
            var value = this.app_categories[key];
            this.app_categories_options[key] = value;
        }

        console.log("init app id:", countlyCommon.ACTIVE_APP_ID);

        if (countlyCommon.ACTIVE_APP_ID)
        {
            var app_id = countlyCommon.ACTIVE_APP_ID;
            var current_app = countlyGlobal['apps'][app_id];
            var new_app_open = false;
        }
        else
        {
            var app_id = false;
            var current_app = false;
            var new_app_open = true;
        }

        return({
            current_app : current_app,
            current_app_id : app_id,
            app_list_is_open : false,
            //actions_list_is_open : false,
            new_app_open : new_app_open
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

    onAppCreate : function(app){

        console.log("=========== on app create =======");

        this.props.on_app_create(app);

        this.selectAppClick(app.id);

    },

    selectAppClick : function(id){

        console.log("selectAppClick:", id);

        var current_app = countlyGlobal['apps'][id];

        this.setState({
            current_app : current_app,
            current_app_id : current_app._id,
            app_list_is_open : false
        });

    },

    saveApp : function(props, state){

        var self = this;

        var updated_app = this.state.current_app;

        if (state.value_key)
        {
            updated_app[props.save_key] = state.value_key;
        }
        else
        {
            updated_app[props.save_key] = state.value;
        }

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

                for (var modAttr in data) {
                    countlyGlobal['apps'][updated_app._id][modAttr] = data[modAttr];
                    countlyGlobal['admin_apps'][updated_app._id][modAttr] = data[modAttr];
                }

                console.log("========= saved ==============");
                console.log(countlyGlobal['apps'][updated_app._id]);
                console.log(data);

                self.props.on_app_edit(updated_app._id);

            }
        });
    },

    clearData : function(period){

        var self = this;

        var current_app = this.state.current_app;

        //return false;
/*
        CountlyHelpers.confirm(jQuery.i18n.map["management-applications.clear-confirm"], "red", function (result) {
            
            if (!result) {
                return true;
            }
*/

        var _clear = function()
        {
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
                    
                    console.log("{{{{{{{{{{ clear result }}}}}}}}}");
                    console.log(result)

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

                    self.setState({                      
                        confirmation_waiting : false,
                        confirmation_sign : false,
                        confirmation_function : false
                    });

                    /*if (!result) {
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-admin"], "red");
                        return false;
                    }*/ /*else {
                        
                        CountlyHelpers.alert(jQuery.i18n.map["management-applications.clear-success"], "black");
                    }*/
                }
            });
        };//);
        
        this.setState({
            "confirmation_waiting" : true,
            "confirmation_sign" : jQuery.i18n.map["management-applications.clear-confirm"],
            "confirmation_function" : _clear
        });
    },

    deleteApp : function()
    {

        var self = this;

        var _delete = function()
        {

            console.log("===== call delete =======");
            console.log(self.state);
            console.log(self.props);
            
            var _props = self.props;

            var appId = self.state.current_app._id;

            $.ajax({
                type:"GET",
                url:countlyCommon.API_PARTS.apps.w + '/delete',
                data:{
                    args:JSON.stringify({
                        app_id:appId
                    }),
                    api_key:countlyGlobal['member'].api_key
                },
                dataType:"jsonp",
                success:function () {

                    delete countlyGlobal['apps'][appId];
                    delete countlyGlobal['admin_apps'][appId];

                    var current_app = false/*countlyGlobal['apps'][0]*/;

                    for (var app_id in countlyGlobal['apps'])
                    {
                        current_app = countlyGlobal['apps'][app_id];                        
                        break;
                    }
                    
                    self.setState({
                        current_app : current_app,
                        current_app_id : current_app._id,
                        actions_list_is_open : false,
                        confirmation_waiting : false,
                        confirmation_sign : false,
                        confirmation_function : false
                    });
                                          
                    _props.on_app_delete(appId);
            
                    /*
                    var activeApp = $(".app-container").filter(function () {
                        return $(this).data("id") && $(this).data("id") == appId;
                    });

                    var changeApp = (activeApp.prev().length) ? activeApp.prev() : activeApp.next();
                    initAppManagement(changeApp.data("id"));
                    activeApp.fadeOut("slow").remove();

                    if (_.isEmpty(countlyGlobal['apps'])) {
                        $("#new-install-overlay").show();
                        $("#sidebar-app-select .logo").css("background-image", "");
                        $("#sidebar-app-select .text").text("");
                    }*/
                },
                error:function () {
                    CountlyHelpers.alert(jQuery.i18n.map["management-applications.delete-admin"], "red");
                }

            });
        }

        this.setState({
            "confirmation_waiting" : true,
            "confirmation_sign" : jQuery.i18n.map["management-applications.delete-confirm"],
            "confirmation_function" : _delete
        });

    },

    cancel_confirmation : function()
    {
        this.setState({
            "confirmation_waiting" : false,
            "confirmation_sign" : false,
            "confirmation_function" : false
        });
    },

    new_app_click : function(){

        this.setState({
            new_app_open : !this.state.new_app_open
        })
    },

    new_app_close : function()
    {
        this.setState({
            new_app_open : false
        })
    },

    handleIconChange: function(e){

        var self = this;

        console.log("this.refs.file:", this.refs);

        var file = this.refs.app_image.getDOMNode().files[0];

        if (!file)
        {
            return false;
        }

        this.upload_icon(this.state.current_app_id, file, function(error, result){

            var app = self.state.current_app;
            app.icon_version = (Math.random().toString(36)+'00000000000000000').slice(2, 8+2); // need to update the image in react render

            countlyGlobal['apps'][self.state.current_app_id] = app;
            countlyGlobal['admin_apps'][self.state.current_app_id] = app;

            self.props.on_app_edit(self.state.current_app_id);

            self.setState({
                current_app : app
            })
        });

    },

    upload_icon : function(app_id, file, __callback){

        //var file = this.icon_file;

        var fd = new FormData();
        fd.append('file', file);

        superagent
            .post('/apps/icon')
            .field('name', file.name)
            .field("app_image_id", app_id)
            .field('size', file.size)
            .attach('app_image', file, file.name)
            .set('Accept', 'application/json')
            .set('x-csrf-token', countlyGlobal['csrf_token'])
            .end(function(err, res){

                if (err)
                {
                    console.log("upload error:", err);
                    __callback(err, false);
                    return false;
                }

                console.log("uploaded:", res);

                var image_url = res.text;

                __callback(false, image_url);

            })

    },

    render : function(){

        var self = this;

        var elements_width = get_viewport_width();

        var page_style = {
            width : elements_width
        }

        var app_list_style = {}

        if (this.state.app_list_is_open)
        {
            app_list_style.display = "block";
        }
        else {
            app_list_style.display = "none";
        }

        var icon_style = {};

        icon_style["background-image"] = "url('/appimages/" + this.state.current_app._id + ".png?v=" + this.state.current_app.icon_version + "')";

        var selector_logo_style = {
            "background-image" : "url('/appimages/" + this.state.current_app._id + ".png?v=" + this.state.current_app.icon_version + "')"
        }

        var app_selectors = [];

        //countlyGlobal['apps'].forEach(function(app){

        for (var app_id in countlyGlobal['apps'])
        {

            app_selectors.push({
                "key" : app_id,
                "label" : countlyGlobal['apps'][app_id].name
            });

        };
/*
        var confirm_block_style = {};

        if (this.state.confirmation_waiting)
        {
            confirm_block_style.display = "block";
            confirm_block_style.left = (elements_width / 2) - (300 / 2);
        }*/
        
        /*
         
                
        */

        return (
            <div id="applications_page" style={page_style}>

                <div className="top_block">
                    <span className="sign">{jQuery.i18n.map["management-applications.title"]}</span>
                    <div className="new_app_button" onClick={this.new_app_click}>{jQuery.i18n.map["management-applications.my-new-app"]}</div>
                </div>

                <NewAppWindow
                    open={this.state.new_app_open}
                    onClose={this.new_app_close}
                    onCreate={self.onAppCreate}
                    upload_icon={this.upload_icon}
                />
               
                {(() => {
                    
                                        
                    if (this.state.confirmation_waiting)
                        return (<Alert 
                            sign={this.state.confirmation_sign}
                            on_cancel={this.cancel_confirmation}
                            on_confirm={this.state.confirmation_function.bind(this)}
                        />)
                    
                    
                })()}

                {(() => {

                    if (this.state.current_app)
                    {
                        return (

                          <div className="wrapper">

                              <SimpleSelectBlock
                                  selectors={app_selectors}
                                  active_selector_key={self.state.current_app_id}
                                  onChange={self.selectAppClick}
                                  className="application_selector"
                              />

                              <ActionSelector
                                  deleteApp={this.deleteApp}
                                  clearData={this.clearData}
                              />

                              <div className="application_block">

                                  <span className="sign">APPLICATION DATA</span>

                                  <div className="info_block">
                                      <div className="table">
                                          <span className="row">
                                              <span className="key">{jQuery.i18n.map["management-applications.app-id"]}</span>
                                              <span className="value">{this.state.current_app._id}</span>
                                          </span>

                                          <EditableField
                                              value_key={jQuery.i18n.map["management-applications.application-name"]}
                                              value={this.state.current_app.name}
                                              on_save={this.saveApp}
                                              save_key="name"
                                          />

                                          <span className="row">
                                              <span className="key">{jQuery.i18n.map["management-applications.app-key"]}</span>
                                              <span className="value">{this.state.current_app.key}</span>
                                          </span>

                                          <EditableField
                                              value_key={jQuery.i18n.map["management-applications.category"]}
                                              value={this.state.current_app.category}
                                              options_values={this.app_categories_options}
                                              on_save={this.saveApp}
                                              save_key="category"
                                          />

                                          <EditableField
                                              value_key={jQuery.i18n.map["management-applications.time-zone"]}
                                              value={this.state.current_app.timezone}
                                              options_values={this.timezones_options}
                                              on_save={this.saveApp}
                                              save_key="timezone"
                                          />

                                          <span className="row">
                                              <span className="key">IAP Event Key</span>
                                              <span className="value">---</span>
                                          </span>
                                      </div>

                                      <div className="icon_block">

                                          <form ref="uploadForm" enctype="multipart/form-data" id="add-app-image-form">
                                              <input ref="app_image" type="file" id="app_image" name="app_image" className="inputfile" onChange={this.handleIconChange}/>
                                              <label for="app_image"><span className="sign">{jQuery.i18n.map["management-applications.icon"]}</span>
                                              <div className="icon" style={icon_style}></div></label>
                                          </form>
                                      </div>

                                  </div>

                                  <div className="sdk_block">
                                      <span className="sign">Run Countly SDKs</span>
                                      <span className="description">Countly has several SDKs to choose from. Some of them are supported by Countly, and others are contributed by Countly community.</span>
                                      <a href="https://github.com/countly" className="button">Explore at Github</a>
                                  </div>

                              </div>

                          </div>

                        );
                    }
                    else
                    {
                        return (
                            <div className="wrapper">
                                <div className="sdk_block">
                                    <span className="sign">Run Countly SDKs</span>
                                    <span className="description">Countly has several SDKs to choose from. Some of them are supported by Countly, and others are contributed by Countly community.</span>
                                    <a href="https://github.com/countly" className="button">Explore at Github</a>
                                </div>
                            </div>
                        );
                    }

                })()}
                
            </div>
        );
    }
    
    /*
    <div className="confirm_block" style={confirm_block_style}>
                    <div className="sign">{this.state.confirmation_sign}</div>
                    <div className="buttons">
                        <span className="cancel" onClick={this.cancel_confirmation}>cancel</span>
                        <span className="confirm" onClick={this.confirmation_function}>confirm</span>
                    </div>
                </div>
    */
    
});
