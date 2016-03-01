var Dashboard = React.createClass({

    getInitialState: function() {

        $(event_emitter).on('date_choise', function(e, period){ // todo: rename to date_change

            console.log("========= date choise getInitialState ============");

        }.bind(this));

        return {
            "active_top_tab" : 0,
            "graph_data_function" : this.props.graph_data_function,
            "date_period" : false
        }

    },

    componentWillMount: function() {

        console.log("{{{{{{{{{{{{{ dashboar will mount }}}}}}}}}}}}}");

        $(event_emitter).on('date_choise_test', function(e, period){

            console.log("========= date choise ============");
            //console.log(period);

            this.setState({ "date_period" : period })
    /*
            var rows = updated_data.rows;
            var granularity = updated_data.new_granularity;
    */
        }.bind(this));

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

    getTextWidth : function(text, font) {
        // re-use canvas object for better performance
        var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    },

    render : function(){

        var self = this;

        console.log("{{{{{{{{{{{{{{{{ render }}}}}}}}}}}}}}}}");

        var sidebar_width = 240;
        var margin_left   = 40 + 10;
        var padding_left  = 30;
        var margin_right  = 30;
        var graph_height  = 300;

        var graph_width = window.innerWidth - sidebar_width - margin_left - margin_right - 80;

        var elements_width = window.innerWidth - sidebar_width - margin_left;
        var map_width   = window.innerWidth - sidebar_width - margin_left - margin_right - padding_left - 300 - 110; // todo

        var dashboard_style = {
            "width" : window.innerWidth - sidebar_width - margin_left - margin_right + 24
        }

        var top_tab_style = {
            "width" : window.innerWidth - sidebar_width - margin_left - margin_right + 24/*+ 1*/ /* +1 because of relative -1px left position, need for hide left darkr border if tab is active */
        }

        console.log("block width:", top_tab_style.width);
        console.log("calc tab width:", Math.round(top_tab_style.width / this.props.graph_tabs.length));

        var tab_item_style = {
            "width" : Math.round(top_tab_style.width / this.props.graph_tabs.length)
        }

        console.log(":: tab_item_style ::");
        console.log(tab_item_style);

        var last_tab_width_difference = top_tab_style.width - (tab_item_style.width * this.props.graph_tabs.length);

        console.log("last_tab_width_difference:", last_tab_width_difference);

        var labels_mapping = {
            "t" : jQuery.i18n.map["common.total-users"],
            "n" : jQuery.i18n.map["common.new-users"],
            //"u" : jQuery.i18n.map["common.unique-sessions"], // todo: here is not unique-sessions
        }

        var lines_descriptions = [
            {
                "label" : "Previous Time Range"
            },
            {
                "label" : "Current Time Range"
            }
        ]

        var style = {
            width : "23%"
        }

        var text_check_style = "normal 12pt Lato-Semibold"; // toto: non-english languages will have another font-family

        var long_text_flag = false;

        this.props.graph_tabs.every(function(element){

            var text_width = self.getTextWidth(element.title, text_check_style); // toto: non-english languages will have another font-family

            console.log("text_width check:", text_width);

            if (text_width > tab_item_style.width)
            {
                long_text_flag = true;
                return false;
            }

            return true;
        })

        console.log("long_text_flag:", long_text_flag);

        if (long_text_flag)
        {
            top_tab_style.height = "130px"
        }
        else
        {
            top_tab_style.height = "110px"
        }

        return (
            <div id="dashboard" style={dashboard_style}>

                <div className="top_tabs" style={top_tab_style}>
                {
                    _.map(this.props.graph_tabs, function(tab, id) {

                        var data = self.props.tabs_data_function();

                        data = data.usage[tab.data_item];

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

                        if (tab.title)
                        {
                            var title = tab.title.toUpperCase();
                        }
                        else
                        {
                            var title = "---";
                        }

                        var text_width = self.getTextWidth(title, text_check_style); // toto: non-english languages will have another font-family

                        console.log("text_width:", text_width);
/*
                        if (text_width > tab_item_style.width)
                        {
                            var long_text_flag = true;
                        }
                        else
                        {
                            var long_text_flag = false;
                        }
*/
                        if (id == self.props.graph_tabs.length - 1)
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
                              <div className={"green_line"}>
                              </div>
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

                <GraphWrapper trend_sign={false}
                    width={graph_width}
                    height={260}
                    margin_left={margin_left}
                    graph_width={graph_width}
                    period={countlyCommon.getPeriod()}
                    big_numbers={false}
                    with_granularity={false}
                    data_function={this.state.graph_data_function}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    tmp_colors={this.props.tmp_colors}
                    lines_descriptions={lines_descriptions}
                />

                <DateSign
                    sign={"most frequent"}
                />

                <DashboardBarChart
                    width={elements_width - 40}
                    height={300}
                    data_function={false}
                    labels_mapping={labels_mapping}
                    graph_label={"DEVICES DISTRIBUTION"}
                    label_key={"device"}
                    data={this.props.top_items_bars}
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

});
