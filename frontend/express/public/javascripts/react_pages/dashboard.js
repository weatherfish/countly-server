var Dashboard = React.createClass({

    topbar_height : 110,

    getInitialState: function() {

        /*
            Settings of horizontal bar chart
        */

        var top_items_bars = [
            {
                "title":jQuery.i18n.map["common.bar.top-platform"],
                "data_function":countlyDeviceDetails.getPlatformBars,
                "help":"dashboard.top-platforms"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-resolution"],
                "data_function":countlyDeviceDetails.getResolutionBars,
                "help":"dashboard.top-resolutions"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-carrier"],
                "data_function":countlyCarrier.getCarrierBars,
                "help":"dashboard.top-carriers"
            },
            {
                "title":jQuery.i18n.map["common.bar.top-users"],
                "data_function":countlySession.getTopUserBars,
                "help":"dashboard.top-users"
            }
        ];

        return {
            "date_period" : false,
            "top_items_bars" : top_items_bars,
            "inited" : false
        }

    },

    componentDidMount : function() {

        var self = this;

        $.when(countlyUser.initialize(), countlyCarrier.initialize(), countlyDeviceDetails.initialize()).then(function () {

            var sessionData = countlySession.getSessionData();

            var graph_tabs = [
            {
                  "title":jQuery.i18n.map["common.total-sessions"],
                  "data":sessionData.usage['total-sessions'],
                  "id":"draw-total-sessions",
                  "help":"dashboard.total-sessions",
                  "data_function" : countlySession.getSessionDPTotal, // data function for line chart
                  "data_item" : "total-sessions"
            },
            {
                  "title":jQuery.i18n.map["common.total-users"],
                  "data":sessionData.usage['total-users'],
                  "id":"draw-total-users",
                  "help":"dashboard.total-users",
                  "data_function" : countlySession.getUserDPActive, // data function for line chart
                  "data_item" : "total-users"
            },
            {
                  "title":jQuery.i18n.map["common.new-users"],
                  "data":sessionData.usage['new-users'],
                  "id":"draw-new-users",
                  "help":"dashboard.new-users",
                  "data_function" : countlySession.getUserDPNew, // data function for line chart
                  "data_item" : "new-users"
            },
            {
                  "title":jQuery.i18n.map["dashboard.time-spent"],
                  "data":sessionData.usage['total-duration'],
                  "id":"draw-total-time-spent",
                  "help":"dashboard.total-time-spent",
                  "data_function" : countlySession.getDurationDP, // data function for line chart
                  "data_item" : "total-duration"
            },
            {
                  "title":jQuery.i18n.map["dashboard.avg-time-spent"],
                  "data":sessionData.usage['avg-duration-per-session'],
                  "id":"draw-time-spent",
                  "help":"dashboard.avg-time-spent2",
                  "data_function" : countlySession.getDurationDPAvg, // data function for line chart
                  "data_item" : "avg-duration-per-session"
            },
            {
                  "title":jQuery.i18n.map["dashboard.avg-reqs-received"],
                  "data":sessionData.usage['avg-events'],
                  "id":"draw-avg-events-served",
                  "help":"dashboard.avg-reqs-received",
                  "data_function" : countlySession.getEventsDPAvg, // data function for line chart
                  "data_item" : "avg-events"
            }]

            self.setState({
                "graph_tabs" : graph_tabs,
                "active_top_tab" : 0,
                "tabs_data_function" : countlySession.getSessionData, // data function for tabs data
                "graph_data_function" : graph_tabs[0].data_function, // data function for line chart
                "inited" : true
            })
        });
    },

    componentWillReceiveProps: function(nextProps) {

        /*if (nextProps.date != this.props.date) // todo
        {*/
            this.setState({ "date_period" : nextProps.date.period });
        //}
    },

    top_tab_click : function(i, tab) {

        if (i == this.state.active_top_tab)
        {
            return true;
        }

        this.setState({
            "active_top_tab" : i,
            "graph_data_function" : tab.data_function
        })

    },

    render : function(){

        var self = this;

        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var elements_width = get_viewport_width();

        var graph_width = elements_width - 40; // todo
        var map_width = elements_width - 500; // todo

        var dashboard_style = {
            "width" : elements_width
        }

        var top_tab_style = {
            "width" : elements_width/*+ 1*/ /* +1 because of relative -1px left position, need for hide left border if tab is active */
        }

        var tab_item_style = {
            "width" : Math.round(top_tab_style.width / this.state.graph_tabs.length)
        }

        var last_tab_width_difference = top_tab_style.width - (tab_item_style.width * this.state.graph_tabs.length);

        var labels_mapping = {
            "t" : jQuery.i18n.map["common.total-users"],
            "n" : jQuery.i18n.map["common.new-users"],
        }

        var lines_descriptions = [
            {
                "label" : "Previous Time Range"
            },
            {
                "label" : "Current Time Range"
            }
        ]

        var text_check_style = "normal 12px Lato-Semibold"; // letter-spacing: 0.98px;

        var long_text_flag = false;

        this.state.graph_tabs.every(function(element){

            var text_width = self.getTextWidth(element.title, text_check_style); // toto: non-english languages will have another font-family

            if (text_width > tab_item_style.width)
            {
                long_text_flag = true;
                return false;
            }

            return true;
        });

        console.log("long_text_flag:", long_text_flag);

        if (long_text_flag)
        {
            top_tab_style.height = (this.topbar_height + 20) + "px"
        }
        else
        {
            top_tab_style.height = this.topbar_height + "px"
        }

        console.log("-------------------------- this.state.graph tabs ----");
        console.log(this.state.graph_tabs);

        return (
            <div id="dashboard" style={dashboard_style}>

                <div className="top_tabs" style={top_tab_style}>
                {

                    _.map(this.state.graph_tabs, function(tab, id) {

                        var tabs_data = self.state.tabs_data_function(); // todo: !!! no need to call this function in loop

                        var data = tabs_data.usage[tab.data_item]; // todo: !!! tabs_data.usage[tab.data_item] = tab.usage

                        //var total = tab.data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); ;

                        //var data = tab.data;

                        var total = data.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                        var class_name = "tab";

                        if (id == self.state.active_top_tab)
                        {
                            class_name += " active";
                        }

                        if (data.trend == "u")
                        {
                            var trend_class_name = "trend up";
                            var percent_change = "+ " + data.change;
                        }
                        else
                        {
                            var trend_class_name = "trend down";
                            var percent_change = /*"- " + */data.change;
                        }

                        var title = tab.title.toUpperCase();

                        var text_width = self.getTextWidth(title, text_check_style); // toto: non-english languages will have another font-family

                        if (id == self.state.graph_tabs.length - 1)
                        {
                            var style = {
                                width : tab_item_style.width + last_tab_width_difference
                            }
                        }
                        else
                        {
                            var style = tab_item_style;
                        }

                        if (long_text_flag)
                        {
                            style.height = "130px";
                        }
                        else
                        {
                            style.height = "110px";
                        }

                        return (
                            <div  onClick={self.top_tab_click.bind(self, id, tab)} className={class_name} style={style}>
                                <div className={"total"}>
                                    {total}
                                </div>
                                <div className={trend_class_name}>
                                    {percent_change}
                                </div>
                                <div className={"title"}>
                                    {title}
                                </div>
                            </div>)
                    })
                }
                </div>

                <LineChart trend_sign={false}
                    width={elements_width}
                    height={260}
                    sides_padding={20}
                    graph_width={elements_width}
                    period={countlyCommon.getPeriod()}
                    big_numbers={false}
                    with_granularity={false}
                    data_function={this.state.graph_data_function}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    lines_descriptions={lines_descriptions}
                />

                <DateSign
                    sign={"most frequent"}
                />

                <DashboardBarChart
                    width={graph_width}
                    height={300}
                    data_function={false}
                    labels_mapping={labels_mapping}
                    graph_label={"DEVICES DISTRIBUTION"}
                    label_key={"device"}
                    data={this.state.top_items_bars}
                />

                <DateSign
                    sign={"countries"}
                />

                <DashboardMap
                    width={map_width}
                    height={420}
                />

            </div>
        );

        /*
        <div className="live_block">

            <div className="bar_block first">
                <div className="sign">LIVE: TOTAL USERS</div>
                <div className="bar_rect">
                    <div className="bar-outer">
                    <div className="bar-inner" style={style}>
                      <span className="bar-inner-text">2,348</span>
                    </div>
                    <span className="bar-outer-text">2,348</span>
                    </div>
                </div>
                <div className="max">
                    <span>MAX</span><span className="count">2,429</span>
                </div>
            </div>

            <div className="bar_block second">
                <div className="sign">LIVE: NEW USERS</div>
                <div className="bar_rect">
                    <div className="bar-outer">
                    <div className="bar-inner" style={style}>
                      <span className="bar-inner-text">1,225</span>
                    </div>
                    <span className="bar-outer-text">1,225</span>
                    </div>
                </div>
                <div className="max">
                    <span>MAX</span><span className="count">1,923</span>
                </div>
            </div>

        </div>
        */
    },

    getTextWidth : function(text, font) {
        // re-use canvas object for better performance
        var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        context["letter-spacing"] = "0.98px";        
        var metrics = context.measureText(text);
        return metrics.width;
    },

});
