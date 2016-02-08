var SessionPage = React.createClass({

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

        console.log("=================== templateData ==================");
        console.log(templateData);

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

        var table_width = window.innerWidth - sidebar_width - margin_left - margin_right - padding_left - 40;


        var headers = JSON.parse(JSON.stringify(templateData["big-numbers"].items));

        headers.unshift({
            "title" : "Date",
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "date",
        })

        return(
            <div className="page">

                <GraphWrapper
                    trend_sign={"SESSIONS TREND"}
                    width={graph_width + 14}
                    height={300}
                    margin_left={40 + 20}
                    graph_width={graph_width - 40}
                    period={countlyCommon.getPeriod()}
                    big_numbers={templateData["big-numbers"].items}
                    data_function={countlySession.getSessionDP}
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
                            data_function={countlySession.getSessionDP}
                            convert_data_function={true}
                            date_sign={"Date"}
                            granularity={this.state.granularity}
                            rows_per_page={20}
                        />)
                    }

                })()}

            </div>
        )

      }
})


/*
        var frequencyData = countlyUser.getFrequencyData();

        return (

            React.createElement(GraphWrapper, {
                "trend_sign"  : "SESSIONS TREND",
                "width"       : graph_width - 70 - 70,
                "height"      : 300,
                "margin_left" : 40,
                //"granularity_rows" : granularity_rows,
                //"data"        : sessionDP,
                "graph_width" : graph_width, // todo: combine
                //"granularity" : _granularity,
                "period"      : countlyCommon.getPeriod(),
                "big_numbers" : self.templateData["big-numbers"].items,
                //"big_number_click" : update_graph,
                "data_function" : countlySession.getSessionDP,
                "update_graph_function" : countlyCommon.updateTimeGraph,
                "with_granularity" : true,
                "mount_callback" : function(mount_data){

                    document.getElementsByClassName("widget")[0].setAttribute("style","width:" + graph_width + "px");
                    document.getElementById('content').style.width = (graph_width + padding_left + 4) + 40 + "px";
                    document.getElementsByClassName('table_block')[0].style.width = (graph_width + 4) + 40 + "px";

                    /* TABLE WRAPPER */
/*
                    var headers = JSON.parse(JSON.stringify(self.templateData["big-numbers"].items));

                    headers.unshift({
                        "title" : "Date",
                        //"help"  : "sessions.unique-sessions", // todo: add translate
                        "short" : "date",
                    })

                    var table_wrapper = React.createElement(SortTable, {
                        //"rows"    : granularity_rows,
                        "headers" : headers,
                        "width"   : table_width,
                        "row_height" : 50,
                        "data_sign" : "DATA",
                        "sort_functions" : sort_functions,
                        "data_function" : countlySession.getSessionDP,
                        "convert_data_function" : true, // todo: change to function
                        "date_sign" : "Date",
                        "granularity" : mount_data.granularity,
                        "rows_per_page" : 20
                    }, null);

                    React.render(table_wrapper, document.getElementsByClassName('table_block')[0]);

                }
*/
