var Populator = React.createClass({

    settings : [],

    getInitialState: function(){

        return({
            in_progress : false
        });
       
    },
    
    componentDidMount : function() {
        //CountlyHelpers.loadJS("populator/javascripts/chance.js");  
    },
    
    on_setting_change : function(setting, value) {
                       
        this.settings[setting] = value;        
               
/*
        var new_config = this.state.config;

        new_config[setting[0]][setting[1]] = value;

        this.updateConfigs(new_config, function(error, result){

            if (error) console.log(error);

            console.log(result);

        });

        this.setState({
            "config" : new_config
        });
*/
    },
    
    start_generation : function(){
        
        console.log("{{{{{{ start generation }}}}}}}}}]");
        
        var start_time = moment(this.settings.date_from, 'YYYY-MM-DD').unix();
        var end_time = moment(this.settings.date_to, 'YYYY-MM-DD').unix();
        
        console.log("start time:", start_time);
        console.log("end_time:", end_time);
        
        //var newUnixTimeStamp = moment(value, 'YYYY-MM-DD').unix();
        
        countlyPopulator.setStartTime(start_time);
        countlyPopulator.setEndTime(end_time);
        countlyPopulator.generateUsers(this.settings.amount_users);
        
        this.setState({
            in_progress : true
        })
        
    },
    
    stop_generation : function(){
        console.log("[[[ click stop ]]]");
        countlyPopulator.stopGenerating(function(done){
            console.log("- generator stop --");
                        
        });
    },

    render : function(){

        var elements_width = get_viewport_width();
        
        var page_style = {
            "width" : elements_width
        }
 
        return (
                <div id="populator" style={page_style}>
                    <div className="headline">data populator</div>
                    <div className="control_block">
                    
                        <InputBlock
                            label={jQuery.i18n.map["populator.amount-users"]}
                            value={1000}
                            onChange={this.on_setting_change}
                            setting={"amount_users"}
                            type="int"
                        />
                        
                        <InputBlock
                            label={jQuery.i18n.map["populator.date-from"]}
                            value={"2016-02-02"}
                            onChange={this.on_setting_change}
                            setting={"date_from"}                            
                        />
                        <InputBlock
                            label={jQuery.i18n.map["populator.date-to"]}
                            value={"2016-02-04"}
                            onChange={this.on_setting_change}
                            setting={"date_to"}                            
                        />
                        <InputBlock
                            label={jQuery.i18n.map["populator.maxtime"]}
                            value={200}
                            onChange={this.on_setting_change}
                            setting={"maxtime"}
                            type="int"
                        />
                        
                        

                        {(() => {
                            
                            if (!this.state.in_progress)
                            {
                                return (<div className="generate_button" onClick={this.start_generation}>
                                    GENERATE
                                </div>)
                            }
                            else
                            {
                                return (<div>
                                    in progress...
                                    <div className="generate_button" onClick={this.stop_generation}>
                                        STOP
                                    </div>
                                </div>);
                            }
                            
                        })()}     
                        
                        
                    </div>
                    
                    <div className="info_block">
                        <div>
                            <span>{jQuery.i18n.map["populator.bulk"]}</span>
                            <span>{this.state.bulk}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.users"]}</span>
                            <span>{this.state.users}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.push-users"]}</span>
                            <span>{this.state.push}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.events"]}</span>
                            <span>{this.state.events}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.purchases"]}</span>
                            <span>{this.state.purchases}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.sessions"]}</span>
                            <span>{this.state.sessions}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.extends"]}</span>
                            <span>{this.state.extends}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.duration"]}</span>
                            <span>{this.state.duration}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.crashes"]}</span>
                            <span>{this.state.crashes}</span>
                        </div>
                        <div>
                            <span>{jQuery.i18n.map["populator.requests"]}</span>
                            <span>{this.state.requests}</span>
                        </div>
                    </div>
                
            </div>)
        
        
        
        /*

        */
    }
});
