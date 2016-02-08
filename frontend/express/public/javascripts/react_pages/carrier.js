var CarrierPage = React.createClass({

    getInitialState: function() {

        return({

        });

    },

    render : function(){

        var labels_mapping = {
            "t" : jQuery.i18n.map["common.total-users"],
            "n" : jQuery.i18n.map["common.new-users"],
        }

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
            "carrier" : natural_sort
        }

        var headers = [
            {
                "title":jQuery.i18n.map["common.total-users"], // todo : not common.total-sessions
                "help":"dashboard.top-platforms",
                "short" : "t",
                "color" : "#1B8AF3"
            },
            {
                "title":jQuery.i18n.map["common.new-users"],
                "help":"devices.platform-versions2",
                "short" : "n",
                "color" : "#1B8AF3"
            },
            {
                "title":jQuery.i18n.map["common.total-sessions"], // todo: ma
                "help":"dashboard.top-resolutions",
                "short" : "u",
                "color" : "#1B8AF3"
            }
        ]

        var chart_width = window.innerWidth - 240 - 40 - 80 - 40;
        var chart_height = 300;

        headers.unshift({
            "title" : "Carrier",
            //"help"  : "sessions.unique-sessions", // todo: add translate
            "short" : "carrier",
        })

        return (

            <div className="page">

                <HorizontalBarChart
                    width={chart_width}
                    height={chart_height}
                    data_function={countlyCarrier.getCarrierData}
                    labels_mapping={labels_mapping}
                    graph_label={"CARRIERS"}
                    label_key={"resolution"}
                    bar_height={34}
                    bar_margin_bottom={15}
                />

                <SortTable
                    headers={headers}
                    width={chart_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={sort_functions}
                    data_function={countlyCarrier.getCarrierData}
                    convert_data_function={false}
                    date_sign={"Date"}
                    granularity={"daily_granularity"}
                    rows_per_page={20}
                />

            </div>
        )
    }
})
