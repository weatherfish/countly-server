var Link = ReactRouter.Link;

var CrashesPage = React.createClass({

    mixins: [ UpdatePageMixin, ReactRouter.History, UnmounCheckMixin ],

    topbar_height : 110,

    initial_metric : "cr",

    metrics : false,

    getInitialState: function() {

        var table_headers = [
            {
                "title":jQuery.i18n.map["crashes.error"],
                "short" : "name",
                "width_percent" : 30
            },
            {
                "title":jQuery.i18n.map["crashes.users"],
                "short" : "users",
                "width_percent" : 10
            },
            {
                "title":jQuery.i18n.map["crashes.platform"],
                "short" : "os",
                "width_percent" : 20
            },
            {
                "title":jQuery.i18n.map["crashes.reports"],
                "short" : "reports",
                "width_percent" : 12
            },
            {
                "title": jQuery.i18n.map["crashes.fatal"],
                "short" : "nonfatal",
                "width_percent" : 14,
                formatting_function :  function(value){

                    if (value != 0)
                    {
                        return <div>Fatal</div>;
                    }
                    else
                    {
                        return <div>Non-fatal</div>;
                    }
                }
            },
            {
                "title":jQuery.i18n.map["crashes.resolved"],
                "short" : "is_resolved",
                "width_percent" : 14,
                formatting_function :  function(value){

                    if (value != 0)
                    {
                        return <div className="solved">Solved</div>;
                    }
                    else
                    {
                        return <div className="unresolved">Unresolved</div>;
                    }
                }
            },
            /*{
                "title":jQuery.i18n.map["crashes.frequency"],
                "short" : "l",
            },*/
            /*{
                "title":"last_time", //jQuery.i18n.map["crashes.last_time"],
                "short" : "lastTs",
            },
            {
                "title":"latest_app", //jQuery.i18n.map["crashes.latest_app"],
                "short" : "latest_version"
            },*/
            ]

        var sort_functions = {
            "nonfatal" : math_sort,
            "reports" : math_sort,
            "users" : math_sort,
            "os" : math_sort,
            "name" : math_sort,
            "lastTs" : math_sort,
            "is_resolved" : math_sort,
        }

        var crashes_types = [
            {
                "type" : "crash-all",
                "label" : jQuery.i18n.map["crashes.all"]
            },
            {
                "type" : "crash-resolved",
                "label" : jQuery.i18n.map["crashes.resolved"]
            },
            {
                "type" : "crash-unresolved",
                "label" : jQuery.i18n.map["crashes.unresolved"]
            },
            {
                "type" : "crash-new",
                "label" : jQuery.i18n.map["crashes.new"]
            },
            /*{
                "type" : "crash-viewed",
                "label" : jQuery.i18n.map["crashes.viewed"]
            },
            {
                "type" : "crash-reoccurred",
                "label" : jQuery.i18n.map["crashes.renew-crashes"]
            },*/
            {
                "type" : "crash-fatal",
                "label" : jQuery.i18n.map["crashes.fatal"]
            },
            {
                "type" : "crash-nonfatal",
                "label" : jQuery.i18n.map["crashes.nonfatal"]
            },
            /*{
                "type" : "crash-hidden",
                "label" : jQuery.i18n.map["crashes.hidden"]
            }*/
        ];

        this.metrics = {
            cr:jQuery.i18n.map["crashes.total"],
            cru:jQuery.i18n.map["crashes.unique"],
            crnf:jQuery.i18n.map["crashes.nonfatal"]+" "+jQuery.i18n.map["crashes.title"],
            crf:jQuery.i18n.map["crashes.fatal"]+" "+jQuery.i18n.map["crashes.title"],
            crru:jQuery.i18n.map["crashes.resolved-users"]
        };

        return {
            "date_period" : false,
            "table_headers" : table_headers,
            "inited" : false,
            "sort_functions" : sort_functions,
            "crash_selectors_active" : false,
            //"crash_type_filter" : ((store.get("countly_crashfilter")) ? store.get("countly_crashfilter") : "crash-all"),
            "crashes_types" : crashes_types,
            "active_crash_filter" : crashes_types[0], // todo: ((store.get("countly_crashfilter")) ? store.get("countly_crashfilter") : "crash-all"),
            "loading" : false,
            "long_text_flag" : false
        }

    },

    make_graph_tabs : function()
    {

        var dashboard = countlyCrashes.getDashboardData();

        var graph_tabs = [
            {
                "title" : jQuery.i18n.map["crashes.total"],
                "data":dashboard.usage['total'],
                "id":"crash-cr",
                "help":"crashes.help-total",
                "metric" : "cr",
                "color" : "#1A8AF3"
            },
            {
                "title" : jQuery.i18n.map["crashes.unique"],
                "data":dashboard.usage['unique'],
                "id":"crash-cru",
                "help":"crashes.help-unique",
                "metric" : "cru",
                "color" : "#5DCBFF"
            },
            {
                "title":jQuery.i18n.map["crashes.nonfatal"]+" "+jQuery.i18n.map["crashes.title"],
                "data":dashboard.usage['nonfatal'],
                "id":"crash-crnf",
                "help":"crashes.help-nonfatal",
                "metric" : "crnf",
                "color" : "#9521B8"
            },
            {
                "title":jQuery.i18n.map["crashes.fatal"]+" "+jQuery.i18n.map["crashes.title"],
                "data":dashboard.usage['fatal'],
                "id":"crash-crf",
                "help":"crashes.help-fatal",
                "metric" : "crf",
                "color" : "#F9BD34"
            },
            {
                "title":jQuery.i18n.map["crashes.resolved-users"],
                "data":dashboard.usage['resolved'],
                "id":"crash-crru",
                "help":"crashes.help-resolved-users",
                "metric" : "crru",
                "color" : "#9FC126"
            }];

        return graph_tabs;

    },

    init_data : function(timestamp) {

        var self = this;

        $.when(countlyCrashes.initialize()).then(function () {
            
            if (self.isUnmounted){                
                return false;
            }

            //var crashData = countlyCrashes.getData();
            //var chartData = countlyCrashes.getChartData(self.initial_metric, self.metrics[self.initial_metric]);

            var graph_tabs = self.make_graph_tabs();

            var elements_width = get_viewport_width();

            var tab_width = Math.round(elements_width / graph_tabs.length)

            self.setState({
                "graph_tabs" : graph_tabs,
                "chart_color" : graph_tabs[0].color,
                "active_top_tab" : 0,
                "active_metric" : self.initial_metric,
                "tabs_data_function" : countlyCrashes.getDashboardData, // data function for tabs data
                "graph_data_function" : countlyCrashes.getChartData, // data function for line chart
                "inited" : true,
                "elements_width" : elements_width,
                "top_tab_width" : tab_width
            })
        });
    },

    componentWillReceiveProps: function(nextProps) {
        
        console.log("= crashes next props ===");
        console.log(nextProps)

        var self = this;

        this.setState({
            loading : true
        });

        $.when(countlyCrashes.refresh(this.state.active_crash_filter)).then(function () {

            self.setState({
                "graph_tabs" : self.make_graph_tabs(),
                "date_period" : nextProps.date.period,
                "loading" : false
            });

        });

        /*if (nextProps.date != this.props.date) // todo
        {*/

        //}
    },

    top_tab_click : function(i, tab) {

        if (i == this.state.active_top_tab)
        {
            return true;
        }

        this.setState({
            "active_top_tab" : i,
            "active_metric" : tab.metric,
            "chart_color" : tab.color
        })

    },

    graph_data_function : function(){

        return this.state.graph_data_function(this.state.active_metric, this.metrics[this.state.active_metric], this.state.chart_color);

    },

    table_data_function : function()
    {

        var self = this;

        var data = countlyCrashes.getData().groups;

        if (this.state.active_crash_filter.type != "crash-all")
        {

            var filtered_data = [];

            data.forEach(function(element){

                if (self.state.active_crash_filter.type == "crash-resolved" && element.is_resolved) filtered_data.push(element);
                else if (self.state.active_crash_filter.type == "crash-unresolved" && !element.is_resolved) filtered_data.push(element);
                else if (self.state.active_crash_filter.type == "crash-nonfatal" && element.nonfatal == 0) filtered_data.push(element);
                else if (self.state.active_crash_filter.type == "crash-fatal" && element.nonfatal != 0) filtered_data.push(element);
                else if (self.state.active_crash_filter.type == "crash-new" && element.is_new) filtered_data.push(element);

                /* todo */

                /*else if (this.state.active_crash_filter.type == "crash-viewed" && element.is_resolved) filtered_data.push(element);
                else if (this.state.active_crash_filter.type == "crash-reoccurred" && element.is_resolved) filtered_data.push(element);
                else if (this.state.active_crash_filter.type == "crash-hidden" && element.is_resolved) filtered_data.push(element);*/

            });

            data = filtered_data;
        }

        return {
            chartData : data
        }

    },

    show_crash_selectors : function()
    {
        this.setState({
            crash_selectors_active : !this.state.crash_selectors_active
        })
    },

    crash_type_select : function(type)
    {

        store.set("countly_crashfilter", type);

        this.setState({
            active_crash_filter : type,
            crash_selectors_active : false
        })
    },

    row_click : function(row_data)
    {

        var error_id = row_data._id;

        this.history.pushState(null, "/crashes/" + error_id);
    },

    is_long_text : function(height, id)
    {

        if (height > 14) // todo: var
        {
            this.setState({
                long_text_flag : true
            })
        }
    },

    render : function(){

        if (!this.state.inited || this.state.loading)
        {
            return (<Loader/>);
        }

        var self = this;

        //var elements_width = get_viewport_width();

        var elements_width = this.state.elements_width;

        var graph_width = elements_width - 40; // todo
        var map_width = elements_width - 500; // todo

        var dashboard_style = {
            "width" : elements_width
        }

        var top_tab_style = {
            "width" : elements_width/*+ 1*/ /* +1 because of relative -1px left position, need for hide left border if tab is active */
        }

        var tab_item_style = {
            "width" : this.state.top_tab_width// Math.round(top_tab_style.width / this.state.graph_tabs.length)
        }

        var last_tab_width_difference = top_tab_style.width - (tab_item_style.width * this.state.graph_tabs.length);

        var labels_mapping = {
            "t" : jQuery.i18n.map["common.total-users"],
            "n" : jQuery.i18n.map["common.new-users"],
        }

        var lines_descriptions = [
            {
                "label" : "Current Time Range"
            },
            {
                "label" : "Previous Time Range"
            }            
        ]
/*
        var text_check_style = "normal 12px Lato-Semibold"; // toto: non-english languages will have another font-family

        var long_text_flag = false;

        this.state.graph_tabs.every(function(element){

            var text_width = self.getTextWidth(element.title, text_check_style); // toto: non-english languages will have another font-family

            console.log(">>>> text_width:", text_width);

            if (text_width > tab_item_style.width)
            {
                long_text_flag = true;
                return false;
            }

            return true;
        });
*/
        //long_text_flag = true; // todo: !remove

        console.log("long_text_flag:", this.state.long_text_flag);

        if (this.state.long_text_flag)
        {
            top_tab_style.height = (this.topbar_height + 10) + "px"
        }
        else
        {
            top_tab_style.height = this.topbar_height + "px"
        }

        var crash_selectors_style = {};

        if (this.state.crash_selectors_active)
        {
            crash_selectors_style.display = "block";
        }
        else
        {
            crash_selectors_style.display = "none";
        }

        var additional_filter = (

            <div className="crash_type_selectors">

                <div className="current" onClick={this.show_crash_selectors}>
                    <span className="sign">{self.state.active_crash_filter.label}</span>
                    <span className="arrow"/>
                </div>

                <div className="crash_selectors" style={crash_selectors_style}>
                    <div className="top_arrow"/>
                    {
                        _.map(self.state.crashes_types, function(type, id) {

                            if (type.type == self.state.active_crash_filter.type)
                            {
                                var class_name = "active";
                            }
                            else {
                                var class_name = "";
                            }

                            return (<span className={class_name} onClick={self.crash_type_select.bind(self, type)}>{type.label}</span>)

                        })
                    }
                </div>
            </div>)

        // todo: change id and classname

        return (
            <div className="crashes_page" id="dashboard" style={dashboard_style}>

                <div className="top_tabs" style={top_tab_style}>
                {
                    _.map(this.state.graph_tabs, function(tab, id) {

                        var data = tab.data;

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

                        //var text_width = self.getTextWidth(title, text_check_style);

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

                        if (self.state.long_text_flag)
                        {
                            style.height = (self.topbar_height + 10) + "px";
                        }
                        else
                        {
                            style.height = (self.topbar_height) + "px"
                        }

                        return (
                            <div onClick={self.top_tab_click.bind(self, id, tab)} className={class_name} style={style}>
                                <div className={"total"}>
                                    {total}
                                </div>
                                <div className={trend_class_name}>
                                    {percent_change}
                                </div>
                                <div className={"title"}>
                                    <MultiLangLabel
                                        label={title}
                                        onHeightChange={self.is_long_text}
                                        id={id}
                                    />
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
                    with_granularity={true}
                    data_function={self.graph_data_function}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    lines_descriptions={lines_descriptions}
                    reverse_dp={true}
                />

                <SortTable
                    headers={this.state.table_headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={this.state.sort_functions}
                    data_function={this.table_data_function}
                    convert_data_function={false}
                    initial_sort={"name"}
                    rows_per_page={20}
                    date={this.props.date}
                    additional_filter={additional_filter}
                    on_row_click={this.row_click}
                />

            </div>
        )
    },

})
