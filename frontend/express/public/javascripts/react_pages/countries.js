var CountriesPage = React.createClass({

    mixins: [UpdatePageMixin, UnmounCheckMixin],

    getInitialState: function() {

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
            "city" : math_sort,            
            "country_flag" : natural_sort
        }

        return ({
            sort_functions : sort_functions,
            metric : {id:0, title:$.i18n.map["common.total-sessions"], type:'number', "short":"t", "color" : "#1B8AF3"},
            radio_button : 0,
            inited : false,
            active_app : this.props.active_app,
            selected_country : false
            /*maps : maps,
            cur_map : cur_map*/
        })

        /*
        var maps = {
            "map-list-sessions": {id:'total', label:jQuery.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"},
            "map-list-users": {id:'total', label:jQuery.i18n.map["sidebar.analytics.users"], type:'number', metric:"u"},
            "map-list-new": {id:'total', label:jQuery.i18n.map["common.table.new-users"], type:'number', metric:"n"}
        };

        var cur_map = "map-list-sessions";
        */

    },

    init_data : function(timestamp) {

        var self = this;

        $.when(countlyUser.initialize(), countlyCity.initialize()).then(function () {

            if (self.isUnmounted){                
                return false;
            }

            var sessionData = countlySession.getSessionData();

            var metrics = [
                {
                    "id" : 0,
                    "title":jQuery.i18n.map["common.total-sessions"],
                    "total":sessionData.usage["total-sessions"].total,
                    "trend":sessionData.usage["total-sessions"].trend,
                    "help":"countries.total-sessions",
                    "short" : "t",
                    "color" : "#1B8AF3"
                },
                {
                    "id" : 1,
                    "title":jQuery.i18n.map["common.total-users"],
                    "total":sessionData.usage["total-users"].total,
                    "trend":sessionData.usage["total-users"].trend,
                    "help":"countries.total-users",
                    "short" : "u",
                    "color" : "#F2B702"
                },
                {
                    "id" : 2,
                    "title":jQuery.i18n.map["common.new-users"],
                    "total":sessionData.usage["new-users"].total,
                    "trend":sessionData.usage["new-users"].trend,
                    "help":"countries.new-users",
                    "short" : "n",
                    "color" : "#FF7D7D"
                }
            ]

/*
            var templateData = {
                "page-title":jQuery.i18n.map["countries.title"],
                "logo-class":"countries",
                "big-numbers":{
                    "count":3,
                    "items":
                },
                "chart-helper":"countries.chart",
                "table-helper":"countries.table"
            };
*/

            self.setState({
                inited : true,
                //template_data : templateData,
                metrics : metrics
            })

        });
    },

    componentWillReceiveProps : function(nextProps) {

        if (nextProps.active_app != this.state.active_app) // active app changed
        {                                               
            this.setState({
                active_app : nextProps.active_app,
                inited : false
            });
            
            var data_timestamp = Math.floor(Date.now());

            this.init_data(data_timestamp);
            
        }
        else
        {

            var sessionData = countlySession.getSessionData();
    
            var metrics = [
                {
                    "title":jQuery.i18n.map["common.total-sessions"],
                    "total":sessionData.usage["total-sessions"].total,
                    "trend":sessionData.usage["total-sessions"].trend,
                    "help":"countries.total-sessions",
                    "short" : "t",
                    "color" : "#1B8AF3"
                },
                {
                    "title":jQuery.i18n.map["common.total-users"],
                    "total":sessionData.usage["total-users"].total,
                    "trend":sessionData.usage["total-users"].trend,
                    "help":"countries.total-users",
                    "short" : "u",
                    "color" : "#F2B702"
                },
                {
                    "title":jQuery.i18n.map["common.new-users"],
                    "total":sessionData.usage["new-users"].total,
                    "trend":sessionData.usage["new-users"].trend,
                    "help":"countries.new-users",
                    "short" : "n",
                    "color" : "#FF7D7D"
                }
            ]
    
            this.setState({
                metrics : metrics
            })
            
        }

    },

    radio_button_click : function(id)
    {

        if (id == this.state.radio_button){
            return true;
        }

        var metric = this.state.metrics[id];

        this.setState({
            radio_button : id,
            metric : metric
        });

    },
    
    select_country : function(country){
       
        this.setState({
            selected_country : (country ? country.toLowerCase() : false)
        })
          
    },
    
    onCitiesData : function(data){
        
        console.log("=========== onCitiesData ==============");
        console.log(data);          
    },
    
    get_city_data : function(){
        
        var data = countlyCity.getLocationData();
        return data;
          
    },

    render : function(){

        var self = this;

        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var table_width = get_viewport_width();

        var elements_width = get_viewport_width();
        var map_width = elements_width - 360;
        var map_height = 480;
        
        var page_style = {
            "width" : elements_width
        }

        var table_headers = JSON.parse(JSON.stringify(this.state.metrics));

        if (this.state.selected_country)
        {
            table_headers.unshift({
                "title" : jQuery.i18n.map["countries.table.city"], 
                "short" : "city",
            })
        }
        else
        {
            table_headers.unshift({
                "title" : jQuery.i18n.map["countries.table.country"],              
                "short" : "country_flag",
            })
        }

        
        return (
            <div className="page" style={page_style}>

                <Map
                    width={map_width}
                    metric={this.state.metric}
                    height={map_height}
                    headline_sign={jQuery.i18n.map["countries.title"]}
                    onCountryClickAdditional={this.select_country}
                    onCitiesData={this.onCitiesData}
                />

                <div className="radio_buttons_container">
                {
                    _.map(self.state.metrics, function(radio_button, i) {

                        return <RadioButton
                                  id={i}
                                  data={radio_button}
                                  on_click={self.radio_button_click.bind(self, i)}
                                  current_button_id={self.state.radio_button}
                                  />
                    })
                }

                </div>
                
                {(() => {
                    
                    if (this.state.selected_country)
                    {
                        return (<SortTable
                            key="country_table"
                            headers={table_headers}
                            width={elements_width}
                            row_height={50}
                            data_sign={"DATA"}
                            sort_functions={this.state.sort_functions}
                            data_function={this.get_city_data}
                            convert_data_function={false}                            
                            rows_per_page={20}
                            filter_field={"city"}
                            date={this.props.date}
                            initial_sort={"city"}
                        />);
                    }
                    else
                    {
                        return (<SortTable
                            key="city_table"
                            headers={table_headers}
                            width={elements_width}
                            row_height={50}
                            data_sign={"DATA"}
                            sort_functions={this.state.sort_functions}
                            data_function={countlyLocation.getLocationData}
                            convert_data_function={false}                           
                            rows_per_page={20}
                            filter_field={"country"}
                            date={this.props.date}
                            initial_sort={"country_flag"}
                        />);
                    }
                    
                })()}                

            </div>
        );
    },
});
