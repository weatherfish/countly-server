var CountriesPage = React.createClass({

    mixins: [UpdatePageMixin],

    getInitialState: function() {

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
            "country_flag" : natural_sort
        }

        return ({
            sort_functions : sort_functions,
            metric : "t",
            radio_button : 0,
            inited : false,
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

    },

    radio_button_click : function(id)
    {

        if (id == this.state.radio_button){
            return true;
        }

        var metric = this.state.metrics[id]["short"];

        console.log("new map metric:", metric);

        this.setState({
            radio_button : id,
            metric : metric
        });

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

        var page_style = {
            "width" : elements_width
        }

        var table_headers = JSON.parse(JSON.stringify(this.state.metrics));

        table_headers.unshift({
            "title" : "Country",
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "country_flag",
        })

        return (
            <div className="page" style={page_style}>

                <Map
                    width={map_width}
                    metric={this.state.metric}
                    height={480}
                    headline_sign="COUNTRIES"
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

                <SortTable
                    headers={table_headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={this.state.sort_functions}
                    data_function={countlyLocation.getLocationData}
                    convert_data_function={false}
                    date_sign={"Date"}
                    rows_per_page={20}
                    filter_field={"country"}
                    date={this.props.date}
                />

            </div>
        );
    },
});
