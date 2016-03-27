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

        console.log(">> state:", state);

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

var ConfigurationsPage = React.createClass({

/*
    {
          "frontend":"Frontend",
          "api":"API",
          "apps":"Apps",
          "frontend-production":"Production mode",
          "frontend-session_timeout":"Session timeout in ms",
          "api-domain":"Domain in emails",
          "api-safe":"Safer API responses",
          "api-session_duration_limit":"Maximal Session Duration",
          "api-city_data":"Track city data",
          "api-event_limit":"Max unique event keys",
          "api-event_segmentation_limit":"Max segmentation in each event",
          "api-event_segmentation_value_limit":"Max unique values in each segmentation",
          "apps-country":"Default Country",
          "apps-category":"Default Category"
    }
*/

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

            console.log(":: config ::");
            console.log(config);

            self.setState({
                config : config,
                inited : true
            })
        });
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

        this.updateConfigs(new_config, function(error, result){

            if (error) console.log(error);

            console.log(result);

        });

        this.setState({
            "config" : new_config
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

        return(
            <div className="page configurations_page" style={page_style}>

                <div className="category">

                    <div className="block_label">Frontend</div>

                    <div className="block_elements">

                        <SwitchBlock
                            label="Production mode"
                            enabled={this.state.config.frontend.production}
                            onChange={this.on_setting_change}
                            setting={["frontend", "production"]}
                        />

                        <InputBlock
                            label="Session timeout in ms"
                            value={this.state.config.frontend.session_timeout}
                            onChange={this.on_setting_change}
                            setting={["frontend", "session_timeout"]}
                            type="int"
                        />

                    </div>

                </div>

                <div className="category">

                    <div className="block_label">API</div>

                    <div className="block_elements">

                        <InputBlock
                            label="Domain in emails"
                            value={this.state.config.api.domain}
                            onChange={this.on_setting_change}
                            setting={["api", "domain"]}
                        />

                        <SwitchBlock
                            label="Safer API responses"
                            enabled={this.state.config.api.safe}
                            onChange={this.on_setting_change}
                            setting={["api", "safe"]}
                        />

                        <InputBlock
                            label="Maximal Session Duration"
                            value={this.state.config.api.session_duration_limit}
                            onChange={this.on_setting_change}
                            setting={["api", "session_duration_limit"]}
                            type="int"
                        />

                        <SwitchBlock
                            label="Track city data"
                            enabled={this.state.config.api.city_data}
                            onChange={this.on_setting_change}
                            setting={["api", "city_data"]}
                        />

                        <InputBlock
                            label="Max unique event keys"
                            value={this.state.config.api.event_limit}
                            onChange={this.on_setting_change}
                            setting={["api", "event_limit"]}
                            type="int"
                        />

                        <InputBlock
                            label="Max segmentation in each event"
                            value={this.state.config.api.event_segmentation_limit}
                            onChange={this.on_setting_change}
                            setting={["api", "event_segmentation_limit"]}
                            type="int"
                        />

                        <InputBlock
                            label="Max unique values in each segmentation"
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
            </div>
        )
      }
})
