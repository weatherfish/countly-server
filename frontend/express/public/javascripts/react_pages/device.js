var DevicePage = React.createClass({

    getInitialState: function() {

        return({

        });

    },

    render : function(){

        var templateData = {
            "page-title":jQuery.i18n.map["devices.title"],
            "logo-class":"devices",
            "graph-type-double-pie":true,
            "pie-titles":{
                "left":jQuery.i18n.map["common.total-users"],
                "right":jQuery.i18n.map["common.new-users"]
            },
            "bars":[
                {
                    "title":jQuery.i18n.map["common.total-users"], // todo : not common.total-sessions
                    "data":countlyDeviceDetails.getPlatformBars(),
                    "help":"dashboard.top-platforms",
                    "short" : "t",
                    "color" : "#1B8AF3"
                },
                {
                    "title":jQuery.i18n.map["common.new-users"],
                    "data":countlyDeviceDetails.getOSVersionBars(),
                    "help":"devices.platform-versions2",
                    "short" : "n",
                    "color" : "#1B8AF3"
                },
                {
                    "title":jQuery.i18n.map["common.total-sessions"], // todo: ma
                    "data":countlyDeviceDetails.getResolutionBars(),
                    "help":"dashboard.top-resolutions",
                    "short" : "u",
                    "color" : "#1B8AF3"
                }
            ],
            "chart-helper":"devices.chart",
            "table-helper":""
        };

        var labels_mapping = {
            "t" : jQuery.i18n.map["common.total-users"],
            "n" : jQuery.i18n.map["common.new-users"],
            //"u" : jQuery.i18n.map["common.unique-sessions"], // todo: here is not unique-sessions
        }

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
            "device" : natural_sort
        }

        var chart_width = window.innerWidth - 240 - 146;
        var chart_height = 300;

        var table_width = window.innerWidth - 240 - 146;

        var frequencyData = countlyUser.getFrequencyData();

        var headers = templateData["bars"];

        var margins = {
            top    : 20,
            right  : 30,
            bottom : 30,
            left   : 30,
            bar_bottom : 15,
            label_bottom : 20
        };

        headers.unshift({
            "title" : "Device",
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "device",
        })

        // bar_margin_bottom={15}

        return (

            <div className="page">

                <HorizontalBarChart
                    width={chart_width}
                    data_function={countlyDevice.getDeviceData}
                    labels_mapping={labels_mapping}
                    graph_label={"DEVICES DISTRIBUTION"}
                    label_key={"device"}
                    bar_height={34}
                    margins={margins}
                />

                <SortTable
                    headers={headers}
                    width={table_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={sort_functions}
                    data_function={countlyDevice.getDeviceData}
                    convert_data_function={false}
                    initial_sort={"device"}
                    rows_per_page={20}
                />

            </div>
        )
    }
})
