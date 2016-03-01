var ConfigurationsPage = React.createClass({

    getInitialState : function() {

        this.initializeConfigs(0);

        return({

        });

    },

    initializeConfigs : function (id) {

        var self = this;

        console.log("{{{{{{{{ init config }}}}}}}}");

        return $.ajax({
          type:"GET",
          url:countlyCommon.API_URL + "/o/configs",
          data:{
                    api_key:countlyGlobal['member'].api_key
                },
          success:function (json) {

              console.log("{{{{{{{{{{{{ config data }}}}}}}}}}}}");
              console.log(json);

              _configsData = json;

              json.frontend.production = false;

              self.updateConfigs(json);
          }
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

                  console.log("======= config updated =========");
                  console.log(json);

                _configsData = json;
                        if(callback)
                            callback(null, json);
              },
              error:function (json) {

                  console.log("======= config error =========");
                  console.log(json);

                        if(callback)
                            callback(true, json);
              }
        });

    },

    render : function(){

        var self = this;

        return(
            <div className="page">

                <div className="configurations_page">

                    <div className="block">

                        <div className="block_label">Frontend</div>

                        <div className="block_elements">

                            <div className="setting_block">
                                <div className="setting_label">Production mode</div>
                                <div className="setting_value">off</div>
                            </div>

                            <div className="setting_block">
                                <div className="setting_label">Session timeout in ms</div>
                                <div className="setting_value">off</div>
                            </div>

                        </div>

                    </div>

                    <div className="block">

                        <div className="block_label">API</div>

                        <div className="setting_block">
                            <div className="setting_label">Production mode</div>
                            <div className="setting_value">off</div>
                        </div>

                        <div className="setting_block">
                            <div className="setting_label">Session timeout in ms</div>
                            <div className="setting_value">off</div>
                        </div>

                    </div>

                </div>
            </div>
        )
      }
})
