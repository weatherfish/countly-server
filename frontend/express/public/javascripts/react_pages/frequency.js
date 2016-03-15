var FrequencyPage = React.createClass({

    getInitialState: function() {

        var headers = [{
            "title":jQuery.i18n.map["session-frequency.table.time-after"], // todo : not common.total-sessions
            "short" : "f",
        },
        {
            "title":jQuery.i18n.map["common.number-of-users"],
            "short" : "t"
        },
        {
            "title":jQuery.i18n.map["common.percent"],
            "short" : "percent"
        }]

        var sort_functions = {
            "t" : math_sort,
            "f" : math_sort,
            "percent" : math_sort
        }

        return({
            sort_functions : sort_functions,
            headers : headers,
            inited : false
        });

    },

    componentDidMount : function() {

        var self = this;

        $.when(countlyUser.initialize()).then(function () {

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

        var page_style = {
            "width" : elements_width
        }

        return (
            <div className="page" style={page_style}>

                <Chart headline_sign={"SESSION FREQUENCY"}
                    headers={this.state.headers}
                    width={elements_width}
                    height={chart_height}
                    side_margin={30}
                    bar_width={40}
                    data_function={countlyUser.getFrequencyData}
                    tooltip_width={60}
                    tooltip_height={44}
                    bar_width={40}
                    date={this.props.date}
                />

                <SortTable
                    headers={this.state.headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={this.state.sort_functions}
                    data_function={countlyUser.getFrequencyData}
                    convert_data_function={false}
                    initial_sort={"frequency"}
                    rows_per_page={20}
                    date={this.props.date}
                />
          </div>)
    }
})
