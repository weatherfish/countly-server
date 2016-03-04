var UserPage = React.createClass({

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

            var sessionData = countlySession.getSessionData(),
                sessionDP = countlySession.getSessionDP();

            var templateData = {
                "page-title":jQuery.i18n.map["sessions.title"],
                "logo-class":"sessions",
                "big-numbers":{
                    "count":3,
                    "items":[
                        {
                            "title":jQuery.i18n.map["common.total-users"],
                            "total":sessionData.usage["total-users"].total,
                            "trend":sessionData.usage["total-users"].trend,
                            "help":"users.total-users",
                            "short" : "t",
                            "color" : "#1B8AF3"
                        },
                        {
                            "title":jQuery.i18n.map["common.new-users"],
                            "total":sessionData.usage["new-users"].total,
                            "trend":sessionData.usage["new-users"].trend,
                            "help":"users.new-users",
                            "short" : "n",
                            "color" : "#F2B702",
                        },
                        {
                            "title":jQuery.i18n.map["common.returning-users"],
                            "total":sessionData.usage["returning-users"].total,
                            "trend":sessionData.usage["returning-users"].trend,
                            "help":"users.returning-users",
                            "short" : "r",
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

        var elements_width = get_viewport_width();
        var chart_height = 300;

        if (this.state.inited)
        {

            return(
                <div className="page">

                    <LineChart
                        trend_sign={"USERS TREND"}
                        width={elements_width}
                        height={chart_height}
                        margin_left={40 + 20}
                        graph_width={elements_width}
                        period={countlyCommon.getPeriod()}
                        big_numbers={this.state.templateData["big-numbers"].items}
                        data_function={countlySession.getUserDP}
                        update_graph_function={countlyCommon.updateTimeGraph}
                        with_granularity={true}
                        mount_callback={this.on_graph_mount}
                    />

                    {(() => {

                        if (self.state.granularity)
                        {
                            return(<SortTable
                                headers={this.state.headers}
                                width={elements_width}
                                row_height={50}
                                data_sign={"DATA"}
                                sort_functions={this.state.sort_functions}
                                data_function={countlySession.getUserDP}
                                convert_data_function={true}
                                initial_sort={"date"}
                                granularity={this.state.granularity}
                                rows_per_page={20}
                            />)
                        }

                    })()}

                </div>
            )

        } else {

            return (
                <div id='loader_wrapper'><div id='loader'></div></div>
            )
        }
    }
})
