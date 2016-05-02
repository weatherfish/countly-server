var SwitchBlock = React.createClass({

    getInitialState : function() {

        return({
            enabled : this.props.enabled
        });

    },
/*
    switch_value : function(state) {

        if (state && this.state.enabled) return false;
        if (!state && !this.state.enabled) return false;

        this.props.onChange(this.props.setting, !this.state.enabled);

        this.setState({
            enabled : !this.state.enabled
        });

    },
*/
    switch_value : function(e) {

        var state = e.target.checked;

        this.props.onChange(this.props.setting, state);

        this.setState({
            "enabled" : state
        });

    },

    render : function(){

        var self = this;

        if (this.state.enabled == false)
        {
            var enable_button_class = "button enable active";
            var disable_button_class = "button disable";
        }
        else
        {
            var enable_button_class = "button enable";
            var disable_button_class = "button disable active";
        }

        /*
        <div  onClick={this.switch_value.bind(this, true)} className={enable_button_class}>{jQuery.i18n.map["plugins.enable"]}</div>
        <div  onClick={this.switch_value.bind(this, false)} className={disable_button_class}>{jQuery.i18n.map["plugins.disable"]}</div>
        */

        if (this.state.enabled)
        {
            var checkbox = <input type="checkbox" checked onChange={this.switch_value}/>;
        }
        else
        {
            var checkbox = <input type="checkbox" onChange={this.switch_value}/>;
        }

        return(
            <div className="setting_block">
                <div className="setting_label">{this.props.label}</div>
                {checkbox}
            </div>
        )

/*
        return(
            <div className="setting_block">
                <div className="setting_label">{this.props.label}</div>
                <div  onClick={this.switch_value.bind(this, true)} className={enable_button_class}>{jQuery.i18n.map["plugins.enable"]}</div>
                <div  onClick={this.switch_value.bind(this, false)} className={disable_button_class}>{jQuery.i18n.map["plugins.disable"]}</div>
            </div>
        )
*/
    }

});

var UpdateBlock = React.createClass({
       
    //Private Properties
    _data : [],
   
    getInitialState : function() {
        
        this.initialize();
        
        return ({
            in_progress : false
        });
        
    },
   
    //Public Methods
    initialize : function() {
		return $.ajax({
            type:"GET",
            url:countlyCommon.API_PARTS.data.r+"/updates",
            data:{
                "api_key":countlyGlobal.member.api_key,
                "app_id":countlyCommon.ACTIVE_APP_ID
            },
            success:function (json) {
                
                console.log("------- get json data -------");
                console.log(json);
                
                //_data = json;
            }
        });
    },
	
	getData : function() {
		return _data;
    },
    
    update : function() {
        
        console.log("======= start update ===========");
        
        this.setState({
            in_progress : true
        })
        
        return false;
                
        return $.ajax({
            type:"GET",
            url:countlyCommon.API_PARTS.data.w+"/updates",
            data:{
                "api_key":countlyGlobal.member.api_key,
                type: 'github',
                id: 'HEAD'
            }
        });
    },
    
    check : function(key) {
		return $.ajax({
            type:"GET",
            url:countlyCommon.API_PARTS.data.r+"/updates/check",
            data:{
				"api_key":countlyGlobal.member.api_key,
                key: key
            }
        });
    },
    
    render : function(){
        
        var self = this;
        
        jQuery.i18n.map['updates.title'] = "updates block"; // todo
        
        return(        
            <div className="category">
                
                    <div className="block_label">{jQuery.i18n.map['updates.title']}</div>
                                                
                    <div className="block_elements">
                        <div className="update_status">{this.state.user_api_key}</div>
                                                
                        {(() => {
                            
                            if (!this.state.in_progress)
                            {
                                return (<div className="update_button" onClick={this.update}>
                                    Update
                                </div>)
                            }
                            else
                            {
                                return (<div className="in_progress">
                                    update in progress...
                                </div>)
                            }                            
                        
                        })()}
                        
                    </div>
                </div>);
    }    
});

var ConfigurationsPage = React.createClass({

    countries : [],
    categories : [],

    getInitialState : function() {

        var zones = countlyCommon.getTimeZones();
        var categories = countlyCommon.getAppCategories();

        //zones.forEach(function(zone){

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

        return({
            inited : false,
            confirmation_waiting : false,
            confirmation_sign : false, //jQuery.i18n.map["management-applications.delete-confirm"],
            confirmation_function : false,
            user_api_key : this.props.user_api_key,
            password_change_is_active : false
        });

    },

    initializeConfigs : function (__callback) {

        return $.ajax({
            type:"GET",
            url:countlyCommon.API_URL + "/o/configs",
            data:{ api_key:countlyGlobal['member'].api_key },
            success:function (json) {
                __callback(false, json);
            }
        });
    },

    componentDidMount : function() {

        var self = this;

        this.initializeConfigs(function(error, config){

            config.user = {};
            
            config.user.username = self.props.username;

            self.setState({
                config : config,
                inited : true
            })
        });
        
        setTimeout(function(){
            
            var scrollToAnchor = function() {
                         
                const hashParts = window.location.hash.split('#');
                
                if (hashParts[1])
                {
                    var element = document.getElementById(hashParts[1]);
                    element.scrollIntoView();
                }
            
            }
            
            scrollToAnchor();
            
            window.onhashchange = scrollToAnchor; // todo : unbind                 
            
        }, 200)
    },

    updateConfigs : function (configs, callback) {

        $.ajax({
              type:"GET",
              url:countlyCommon.API_URL + "/i/configs",
              data:{
                        configs:JSON.stringify(configs),
                        api_key:countlyGlobal['member'].api_key
                    },
              success:function (json) {
                  if(callback) callback(null, json);
              },
              error:function (error) {
                  if(callback) callback(error, false);
              }
        });

    },

    on_setting_change : function(setting, value) {

        var new_config = this.state.config;

        new_config[setting[0]][setting[1]] = value;
        
        var password_change_is_active = this.state.password_change_is_active;
        
        if (setting[0] != "user")
        {
            this.updateConfigs(new_config, function(error, result){

                if (error) console.log(error);
    
                //console.log(result);
    
            });
        }
        else
        {           
            if (new_config.user.old_pass && (new_config.user.new_pass && this.check_pass(new_config.user.new_pass) && (new_config.user.new_pass == new_config.user.new_pass_again)))
            {
                password_change_is_active = true;
            }
            else
            {
                password_change_is_active = false;
            }
        }        

        this.setState({
            "config" : new_config,
            "password_change_is_active" : password_change_is_active
        });

    },
    
    check_pass : function(pass){
        
        console.log("check pass:", pass);
        
        if (pass.length < 6) return false;
        
        return true;
    },
    
    change_pass : function(){
                        
        var self = this;
        
        var config = this.state.config;
        
        config.user.old_pass = "";
        config.user.new_pass = "";
        
        this.setState({
            config : config
        })

        $.ajax({
            type:"POST",
            url:countlyGlobal["path"]+"/user/settings",
            data:{
                "username":this.props.username,
                "api_key":this.state.user_api_key,
                "old_pwd":this.state.config.user.old_pass,
                "new_pwd":this.state.config.user.new_pass,                
                _csrf:countlyGlobal['csrf_token']
            },
            success:function (result) {
                console.log("{{{{{{{ change_pass result }}}}");
                console.log(result)
            }
        });
    },
    
    generate_api_key : function(){
        
        _generate = function(){
            
            var key = "";
            var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        
            for( var i=0; i < 32; i++ )
                key += possible.charAt(Math.floor(Math.random() * possible.length));
                                
            this.setState({
                "user_api_key" : key,
                "confirmation_waiting" : false,
                "confirmation_sign" : false,
                "confirmation_function" : false,
            });
            
            $.ajax({
                type:"POST",
                url:countlyGlobal["path"]+"/user/settings",
                data:{
                    "username":this.props.username,                   
                    "api_key":key,
                    _csrf:countlyGlobal['csrf_token']
                },
                success:function (result) {
                    
                    console.log("{{{{{{{{{ save result }}}}}}}}}}}}");
                    console.log(result);                   
                }
            });
        }
        
        this.setState({
            "confirmation_waiting" : true,
            "confirmation_sign" : "will change api key",
            "confirmation_function" : _generate
        });
        
        return false;        
          
    },

    cancel_confirmation : function()
    {
        this.setState({
            "confirmation_waiting" : false,
            "confirmation_sign" : false,
            "confirmation_function" : false
        });
    },

    render : function(){

        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var self = this;

        var elements_width = get_viewport_width();

        var page_style = {
            "width" : elements_width
        }
        
        var password_change_button_class = "save_password_button";
        
        if (this.state.password_change_is_active)
        {
            password_change_button_class += " active";
        }

        return(
            <div className="page configurations_page" style={page_style}>
            
                {(() => {                    
                                        
                    if (this.state.confirmation_waiting)
                        return (<Alert 
                            sign={this.state.confirmation_sign}
                            on_cancel={this.cancel_confirmation}
                            on_confirm={this.state.confirmation_function.bind(this)}
                        />)
                                        
                })()}     
                                
                <div className="category">

                    <div className="block_label">{jQuery.i18n.map["configs.frontend"]}</div>

                    <div className="block_elements">

                        <SwitchBlock
                            label={jQuery.i18n.map["configs.frontend-production"]}
                            enabled={this.state.config.frontend.production}
                            onChange={this.on_setting_change}
                            setting={["frontend", "production"]}
                        />

                        <InputBlock
                            label={jQuery.i18n.map["configs.frontend-session_timeout"]}
                            value={this.state.config.frontend.session_timeout}
                            onChange={this.on_setting_change}
                            setting={["frontend", "session_timeout"]}
                            type="int"
                        />

                    </div>

                </div>

                <div className="category">

                    <div className="block_label">{jQuery.i18n.map["configs.api"]}</div>

                    <div className="block_elements">

                        <InputBlock
                            label={jQuery.i18n.map["configs.api-domain"]}
                            value={this.state.config.api.domain}
                            onChange={this.on_setting_change}
                            setting={["api", "domain"]}
                        />

                        <SwitchBlock
                            label={jQuery.i18n.map["configs.api-safe"]}
                            enabled={this.state.config.api.safe}
                            onChange={this.on_setting_change}
                            setting={["api", "safe"]}
                        />

                        <InputBlock
                            label={jQuery.i18n.map["configs.api-session_duration_limit"]}
                            value={this.state.config.api.session_duration_limit}
                            onChange={this.on_setting_change}
                            setting={["api", "session_duration_limit"]}
                            type="int"
                        />

                        <SwitchBlock
                            label={jQuery.i18n.map["configs.api-city_data"]}
                            enabled={this.state.config.api.city_data}
                            onChange={this.on_setting_change}
                            setting={["api", "city_data"]}
                        />

                        <InputBlock
                            label={jQuery.i18n.map["configs.api-event_limit"]}
                            value={this.state.config.api.event_limit}
                            onChange={this.on_setting_change}
                            setting={["api", "event_limit"]}
                            type="int"
                        />

                        <InputBlock
                            label={jQuery.i18n.map["configs.api-event_segmentation_limit"]}
                            value={this.state.config.api.event_segmentation_limit}
                            onChange={this.on_setting_change}
                            setting={["api", "event_segmentation_limit"]}
                            type="int"
                        />

                        <InputBlock
                            label={jQuery.i18n.map["configs.api-event_segmentation_value_limit"]}
                            value={this.state.config.api.event_segmentation_value_limit}
                            onChange={this.on_setting_change}
                            setting={["api", "event_segmentation_value_limit"]}
                            type="int"
                        />

                    </div>

                </div>

                <div className="category">

                    <div className="block_label">Apps</div>

                    <div className="block_elements">

                        <SelectBlock
                            label="Default Country"
                            selectors={this.countries}
                            active_selector_key={this.state.config.apps.country}
                            onChange={this.on_setting_change}
                            setting={["apps", "country"]}
                        />

                        <SelectBlock
                            label="Default Category"
                            selectors={this.categories}
                            active_selector_key={this.state.config.apps.category}
                            onChange={this.on_setting_change}
                            setting={["apps", "category"]}
                        />

                    </div>
                </div>
                
                <h1 className="inner_link" id="user_settings"></h1>
                
                <div className="category">
                
                    <div className="block_label">User Settings</div>
                                        
                    <div className="block_elements">
                    
                        <InputBlock
                                label={jQuery.i18n.map["user-settings.username"]}
                                value={this.state.config.user.username}
                                onChange={this.on_setting_change}
                                setting={["user", "username"]}                            
                            />
                                            
                        <InputBlock
                                margin_top={20}
                                label={jQuery.i18n.map["placeholder.old-password"]}
                                value={this.state.config.user.old_pass}
                                onChange={this.on_setting_change}
                                type="password"
                                setting={["user", "old_pass"]}                            
                            />
                            
                        <InputBlock
                                label={jQuery.i18n.map["placeholder.new-password"]}
                                value={this.state.config.user.new_pass}
                                onChange={this.on_setting_change}
                                type="password"
                                setting={["user", "new_pass"]}                            
                            />
                            
                        <InputBlock
                                label={jQuery.i18n.map["placeholder.again"]}
                                value={this.state.config.user.new_pass_again}
                                onChange={this.on_setting_change}
                                type="password"
                                setting={["user", "new_pass_again"]}                            
                            />
                            
                        <div className={password_change_button_class} onClick={this.change_pass}>
                            Change
                        </div>
                        
                    </div>
                </div>
                
                <h1 className="inner_link" id="api_key"></h1>
                
                <div className="category">
                
                    <div className="block_label">{jQuery.i18n.map["user-settings.api-key"]}</div>
                                                
                    <div className="block_elements">
                        <div className="api_key">{this.state.user_api_key}</div>
                        <div className="generate_api_key" onClick={this.generate_api_key}>
                            Regenerate
                        </div>
                    </div>
                </div>
                
                <h1 className="inner_link" id="updates"></h1>
                
                <UpdateBlock />
                                                
            </div>
        )
      }
})
