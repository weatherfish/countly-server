var SessionPage = React.createClass({

    mixins: [UpdatePageMixin],

    getInitialState : function() {

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
        }

        return({
            granularity : false, //"daily",//false, // todo - should be false
            sort_functions : sort_functions,
            inited : false,
            data_timestamp : false,
            active_app : this.props.active_app,
            big_numbers : false
        });
    },

    init_data : function(timestamp)
    {
        var self = this;

        $.when(countlyUser.initialize()).then(function () {

            var headers = self.make_big_numbers();

            var big_numbers = self.make_big_numbers();

            headers.unshift({
                "title" : jQuery.i18n.map["common.date"],
                "short" : "date",
            })

            self.setState({
                inited : true,
                big_numbers : big_numbers,
                headers : headers,
                data_timestamp : timestamp
            })
        })
    },

    make_big_numbers : function()
    {
        var sessionData = countlySession.getSessionData();

        var big_numbers = [
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

        for (var i = 0; i < big_numbers.length; i++)
        {
            if (this.state.big_numbers)
            {
                big_numbers[i].active = this.state.big_numbers[i].active;
            }
            else
            {
                big_numbers[i].active = true;
            }
            
        }

        return big_numbers;
    },

    on_graph_mount : function(mount_data) {

        this.setState({
            "granularity" : mount_data.granularity
        });
    },

    componentWillReceiveProps : function(nextProps) {
                       
        if (nextProps.active_app != this.state.active_app) // active app changed
        {                                               
            this.setState({
                active_app : nextProps.active_app,
                inited : false
            });
            
            var data_timestamp = Math.floor(Date.now());

            this.init_data(data_timestamp);
            
        }
        else
        {
            var big_numbers = this.make_big_numbers();

            this.setState({
                big_numbers : big_numbers
            });
        }
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

        /*
        margin_left={40 + 20}
        graph_width={elements_width}
        */

        return(
            <div className="page" style={page_style}>

                <LineChart
                    trend_sign={jQuery.i18n.map["sessions.title"]}
                    width={elements_width}
                    height={chart_height}
                    sides_padding={20}
                    period={countlyCommon.getPeriod()}
                    big_numbers={this.state.big_numbers}
                    data_function={countlySession.getSessionDP}
                    with_granularity={true}
                    mount_callback={this.on_graph_mount}
                    date={this.props.date}
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
                            date={this.props.date}
                        />)
                    }

                })()}

            </div>
        )
    }
})
