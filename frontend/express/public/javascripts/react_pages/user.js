var UserPage = React.createClass({

    getInitialState : function() {

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
        }

        return({
            granularity : "daily", // false, // todo - should be false
            sort_functions : sort_functions,
            inited : false
        });
    },

    make_big_numbers : function()
    {
        var sessionData = countlySession.getSessionData();

        var big_numbers = [
            {
                "title":jQuery.i18n.map["common.table.total-users"],
                "total":sessionData.usage["total-users"].total,
                "trend":sessionData.usage["total-users"].trend,
                "help":"users.total-users",
                "short" : "t",
                "color" : "#1B8AF3"
            },
            {
                "title":jQuery.i18n.map["common.table.new-users"],
                "total":sessionData.usage["new-users"].total,
                "trend":sessionData.usage["new-users"].trend,
                "help":"users.new-users",
                "short" : "n",
                "color" : "#F2B702",
            },
            {
                "title":jQuery.i18n.map["common.table.returning-users"],
                "total":sessionData.usage["returning-users"].total,
                "trend":sessionData.usage["returning-users"].trend,
                "help":"users.returning-users",
                "short" : "r",
                "color" : "#FF7D7D"
            }
        ]

        for (var i = 0; i < big_numbers.length; i++)
        {
            big_numbers[i].active = true;
        }

        return big_numbers;
    },

    componentDidMount : function() {

        var self = this;

        $.when(countlyUser.initialize()).then(function () {

            var headers = self.make_big_numbers();

            var big_numbers = self.make_big_numbers();

            headers.unshift({
                "title" : "Date",
                //"help"  : "sessions.unique-sessions", // todo: add translation
                "short" : "date",
                "big_numbers" : big_numbers
            })

            self.setState({
                inited : true,
                big_numbers : big_numbers,
                headers : headers,
            })
        })
    },

    on_graph_mount : function(mount_data) {

        this.setState({
            "granularity" : mount_data.granularity
        });

    },

    componentWillReceiveProps : function(nextProps) {

        var self = this;

        var big_numbers = self.make_big_numbers();

        self.setState({
            big_numbers : big_numbers
        })

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
                    trend_sign={"USERS TREND"}
                    width={elements_width}
                    height={chart_height}
                    sides_padding={20}
                    period={countlyCommon.getPeriod()}
                    big_numbers={this.state.big_numbers}
                    data_function={countlySession.getUserDP}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    with_granularity={true}
                    mount_callback={this.on_graph_mount}
                    date={this.props.date}
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
                            date={this.props.date}
                        />)
                    }

                })()}

            </div>
        )
    }
})
