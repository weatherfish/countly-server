var UserPage = React.createClass({

    getInitialState : function() {

        return({
            granularity : false
        });

    },

    on_graph_mount : function(mount_data) {

        console.log("=========== mount ===========");
        console.log(mount_data);

        this.setState({
            "granularity" : mount_data.granularity
        });

    },

    render : function(){

        var self = this;

        var chart_width = window.innerWidth - 240 - 40 - 80 - 40;
        var chart_height = 300;


        var margin_left   = 30;
        var padding_left  = 30;
        var margin_right  = 30;
        var graph_height  = 300;

        var table = false;

        var sessionData = countlySession.getSessionData(),
            sessionDP = countlySession.getSessionDP();

      /*  var rows = sessionDP.chartData;*/

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

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
        }

        for (var i = 0; i < templateData["big-numbers"].items.length; i++)
        {
            templateData["big-numbers"].items[i].active = true;
        }

        var graph_width = window.innerWidth - sidebar_width - margin_left - margin_right - padding_left - 40;

        var table_width = window.innerWidth - sidebar_width - margin_left - margin_right - padding_left - 36;


        var headers = JSON.parse(JSON.stringify(templateData["big-numbers"].items));

        headers.unshift({
            "title" : "Date",
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "date",
        })

        return(
            <div className="page">

                <GraphWrapper
                    trend_sign={"USERS TREND"}
                    width={graph_width + 14}
                    height={300}
                    margin_left={40 + 20}
                    graph_width={graph_width - 40}
                    period={countlyCommon.getPeriod()}
                    big_numbers={templateData["big-numbers"].items}
                    data_function={countlySession.getUserDP}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    with_granularity={true}
                    mount_callback={this.on_graph_mount}
                />

                {(() => {

                    if (self.state.granularity)
                    {
                        return(<SortTable
                            headers={headers}
                            width={table_width}
                            row_height={50}
                            data_sign={"DATA"}
                            sort_functions={sort_functions}
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

      }
})
