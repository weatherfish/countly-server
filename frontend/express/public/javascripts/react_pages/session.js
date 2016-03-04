var SessionPage = React.createClass({

    getInitialState : function() {

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
        }

        return({
            granularity : false,
            sort_functions : sort_functions,
            inited : false
        });

    },

    componentDidMount : function() {

        var self = this;

        $.when(countlyUser.initialize()).then(function () {

            var sessionData = countlySession.getSessionData();
                //sessionDP = countlySession.getSessionDP();

            var templateData = {
                "page-title":jQuery.i18n.map["sessions.title"],
                "logo-class":"sessions",
                "big-numbers":{
                    "count":3,
                    "items":[
                        {
                            "title":jQuery.i18n.map["common.total-sessions"],
                            "total":sessionData.usage["total-sessions"].total,
                            "trend":sessionData.usage["total-sessions"].trend,
                            "help":"sessions.total-sessions",
                            "short" : "t",
                            "color" : "#1B8AF3"
                        },
                        {
                            "title":jQuery.i18n.map["common.new-sessions"],
                            "total":sessionData.usage["new-users"].total,
                            "trend":sessionData.usage["new-users"].trend,
                            "help":"sessions.new-sessions",
                            "short" : "n",
                            "color" : "#F2B702"
                        },
                        {
                            "title":jQuery.i18n.map["common.unique-sessions"],
                            "total":sessionData.usage["total-users"].total,
                            "trend":sessionData.usage["total-users"].trend,
                            "help":"sessions.unique-sessions",
                            "short" : "u",
                            "color" : "#FF7D7D"
                        }
                    ]
                }
            };

            for (var i = 0; i < templateData["big-numbers"].items.length; i++)
            {
                templateData["big-numbers"].items[i].active = true;
            }

            var headers = JSON.parse(JSON.stringify(templateData["big-numbers"].items));

            headers.unshift({
                "title" : "Date",
                //"help"  : "sessions.unique-sessions", // todo: add translate
                "short" : "date",
            })

            self.setState({
                inited : true,
                templateData : templateData,
                headers : headers
            })
        })
    },

    on_graph_mount : function(mount_data) {
        this.setState({
            "granularity" : mount_data.granularity
        });
    },

    render : function(){

        var self = this;

        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var elements_width = get_viewport_width();
        var chart_height = 300;

        var page_style = {
            "width" : elements_width
        }

        return(
            <div className="page" style={page_style}>

                <LineChart
                    trend_sign={"SESSIONS TREND"}
                    width={elements_width}
                    height={chart_height}
                    margin_left={40 + 20}
                    graph_width={elements_width}
                    period={countlyCommon.getPeriod()}
                    big_numbers={this.state.templateData["big-numbers"].items}
                    data_function={countlySession.getSessionDP}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    with_granularity={true}
                    mount_callback={this.on_graph_mount}
                />

                {(() => {

                    if (self.state.granularity)
                    {
                        return(<SortTable
                            headers={self.state.headers}
                            width={elements_width}
                            row_height={50}
                            data_sign={"DATA"}
                            sort_functions={this.state.sort_functions}
                            data_function={countlySession.getSessionDP}
                            convert_data_function={true}
                            initial_sort={"date"}
                            granularity={this.state.granularity}
                            rows_per_page={20}
                        />)
                    }

                })()}

            </div>
        )
    }
})
