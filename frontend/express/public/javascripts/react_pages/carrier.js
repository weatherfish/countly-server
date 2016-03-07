var CarrierPage = React.createClass({

    getInitialState: function() {

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
                "title":jQuery.i18n.map["common.total-sessions"], // todo:
                "help":"dashboard.top-resolutions",
                "short" : "u",
                "color" : "#1B8AF3"
            }
        ]

        headers.unshift({
            "title" : "Carrier",
            //"help"  : "sessions.unique-sessions", // todo: add translation
            "short" : "carrier",
        })

        return({
            "labels_mapping" : labels_mapping,
            "sort_functions" : sort_functions,
            "headers" : headers,
            "inited" : false
        });

    },

    componentDidMount : function() {

        var self = this;

        $.when(countlyCarrier.initialize()).then(function () {

            self.setState({
                inited : true,
            })

        });
    },

    render : function(){
      
        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var elements_width = get_viewport_width();
        var chart_height = 300;

        var chart_margins = {
            top    : 20,
            right  : 30,
            bottom : 30,
            left   : 30,
            bar_bottom : 15,
            label_bottom : 20
        };

        var page_style = {
            "width" : elements_width
        }

        return (

            <div className="page" style={page_style}>

                <HorizontalBarChart
                    width={elements_width}
                    height={chart_height}
                    data_function={countlyCarrier.getCarrierData}
                    labels_mapping={this.state.labels_mapping}
                    graph_label={"CARRIERS"}
                    label_key={"carrier"}
                    bar_height={34}
                    margins={chart_margins}
                    date={this.props.date}
                />

                <SortTable
                    headers={this.state.headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={this.state.sort_functions}
                    data_function={countlyCarrier.getCarrierData}
                    convert_data_function={false}
                    date_sign={"Date"}
                    rows_per_page={20}
                    filter_field={"carrier"}
                    date={this.props.date}
                />

            </div>
        )
    }
})
