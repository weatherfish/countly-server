var CrashDetailsPage = React.createClass({

    metrics : [],

    pie_charts_colors : ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"],

    getInitialState: function() {

        // "00bf85dafddf7e8d0a31edb903dd1535e15b724a"

        var crash_id = this.props.params.crash_id;

        var bar_chart_keys = [
            { "short" : "k" },
            { "short" : "v" },
        ];

        var table_headers = [{
            "title":jQuery.i18n.map["crashes.crashed"],
            "short" : "ts",
        },
        {
            "title":jQuery.i18n.map["crashes.os_version"],
            "short" : "os" // todo: + OS version
        },
        {
            "title":jQuery.i18n.map["crashes.device"],
            "short" : "device"
        },
        {
            "title":jQuery.i18n.map["crashes.app_version"],
            "short" : "app_version"
        }];

        var sort_functions = {
            "ts" : math_sort,
            "os" : math_sort,
            "device" : math_sort,
            "app_version" : math_sort,
        }

        return {
            "date_period" : false,
            "inited"      : false,
            "active_tab"  : "description",
            "current_metric" : "app_version",
            "bar_chart_keys" : bar_chart_keys,
            "sort_functions" : sort_functions,
            "table_headers" : table_headers
        }

    },

    componentDidMount : function() {

        var self = this;

        $.when(countlyCrashes.initialize("00bf85dafddf7e8d0a31edb903dd1535e15b724a")).then(function () {

            //var crashData = countlyCrashes.getData();
            //var chartData = countlyCrashes.getChartData(self.initial_metric, self.metrics[self.initial_metric]);

            var crashData = countlyCrashes.getGroupData();

            var error_trace = crashData.error.split("\n");

            var metrics = countlyCrashes.getMetrics();

            for (var key in metrics)
            {
                self.metrics.push({
                    "key" : key,
                    "label" : metrics[key]
                });
            }

            self.setState({
                "crash_data" : crashData,
                "error_trace" : error_trace,
                "is_resolved" : crashData.is_resolved,
                "inited" : true
            })
        });
    },

    pie_function : function(selector){

        var pie_data = countlyCrashes.getBoolBars(selector);

        return pie_data;
    },

    bars_data_function : function(){

        var full_data = this.state.crash_data.dp[this.state.current_metric];

        var data = full_data.dp[0].data;

        var formatted_data = [];

        full_data.ticks.forEach(function(tick, i){ // todo!!!!! can be some inaccuracy

            if (tick[0] == -1 || !data[i])
            {
                return false;
            }

            var k = tick[1];

            var v = data[i][1];

            formatted_data.push({
                "k" : k,
                "v" : v,
                //"color" : "red"
            });

        });

        return {
            chartData : formatted_data
        };

    },

    table_data_function : function()
    {
        var full_data = this.state.crash_data.data;

        return {
            chartData : full_data
        };
    },

    change_tab : function(tab){

        this.setState({
            "active_tab" : tab
        })

    },

    mark : function(){

        this.setState({
            "is_resolved" : !this.state.is_resolved
        })

    },

    metric_switch : function(metric){

        this.setState({
            "current_metric" : !this.state.is_resolved
        })

        //$.when(countlyCrashes.refresh()).then(function () {

    },

    render : function(){

        if (!this.state.inited || this.state.loading)
        {
            return (<Loader/>);
        }

        var self = this;

        var elements_width = get_viewport_width(); // todo!

        var page_style = {
            "width" : elements_width
        }

        var blocks_style = {
            "width" : elements_width - 40
        }

        var crash_data = this.state.crash_data;

        var description_tab_class = "";
        var description_block_style = {};
        var comments_tab_class = "";
        var comments_block_style = {};

        if (this.state.active_tab == "description")
        {
            comments_block_style.display = "none";
            description_tab_class = "active";
        }
        else
        {
            description_block_style.display = "none";
            comments_tab_class = "active";
        }

        if (this.state.is_resolved)
        {
            var is_resolved = jQuery.i18n.map["crashes.resolved"];
            var button_sign = jQuery.i18n.map["crashes.mark-unresolved"];
            var mark_classname = "mark_button unresolved";
            var status_classname = "status unresolved";
        }
        else
        {
            var is_resolved = jQuery.i18n.map["crashes.unresolved"];
            var button_sign = jQuery.i18n.map["crashes.mark-resolved"];
            var mark_classname = "mark_button resolved";
            var status_classname = "status resolved";
        }

        var metrics_selector = <SimpleSelectBlock
                                  selectors={this.metrics}
                                  active_selector_key={false}
                                  onChange={this.metric_switch}
                                  className="metric_selector"
                              />

        return (
            <div className="crash_details page" id="dashboard" style={page_style}>

                <div className="info_block">
                    <div className="name">{this.state.crash_data.name.substr(0, 80)}</div>
                    <div className={status_classname}>{is_resolved}</div>
                    <div className={mark_classname} onClick={this.mark}>{button_sign}</div>
                </div>

                <div className="tabs">
                    <span onClick={this.change_tab.bind(this, "description")} className={description_tab_class}>DESCRIPTION</span>
                    <span onClick={this.change_tab.bind(this, "comments")} className={comments_tab_class}>COMMENTS</span>
                </div>

                <div className="description" style={description_block_style}>
                {
                    _.map(this.state.error_trace, function(line, i) {

                        return (<div><span>{i}</span><span>{line}</span></div>);

                    })

                }
                </div>
                <div className="comments" style={comments_block_style}></div>

                <div className="data_block">

                    <div className="block_sign">CRASH DATA</div>

                    <div className="simple_blocks" style={blocks_style}>

                        <div>
                            <span className="value">{crash_data.os}</span>
                            <span className="sign">{jQuery.i18n.map["crashes.platform"].toUpperCase()}</span>
                        </div>

                        <div>
                            <span className="value">{crash_data.reports}</span>
                            <span className="sign">{jQuery.i18n.map["crashes.reports"].toUpperCase()}</span>
                        </div>

                        <div>
                            <span className="value">{crash_data.users + " ("+((crash_data.users/crash_data.total)*100).toFixed(2)+"%)"}</span>
                            <span className="sign">{jQuery.i18n.map["crashes.affected-users"].toUpperCase()}</span>
                        </div>

                        <div>
                            <span className="value">{crash_data.latest_version.replace(/:/g, '.')}</span>
                            <span className="sign">{jQuery.i18n.map["crashes.highest-version"].toUpperCase()}</span>
                        </div>

                    </div>

                    <div className="advanced_blocks" style={blocks_style}>

                        <div>

                            <span className="sign">{jQuery.i18n.map["crashes.ram"].toUpperCase()}</span>

                            <span className="value_block">
                                <span className="value">{(crash_data.ram.total/crash_data.ram.count).toFixed(2)+" %"}</span>
                                <span>AVERAGE</span>
                            </span>

                            <div className="min_max">
                                <span className="min">{crash_data.ram.min+" %"}</span>
                                <span className="max">{crash_data.ram.max+" %"}</span>
                            </div>

                            <div className="bar"></div>

                        </div>

                        <div>

                            <span className="sign">{jQuery.i18n.map["crashes.disk"].toUpperCase()}</span>

                            <span className="value_block">
                                <span className="value">{(crash_data.disk.total/crash_data.disk.count).toFixed(2)+" %"}</span>
                                <span>AVERAGE</span>
                            </span>

                            <div className="min_max">
                                <span className="min">{crash_data.disk.min+" %"}</span>
                                <span className="max">{crash_data.disk.max+" %"}</span>
                            </div>

                            <div className="bar"></div>

                        </div>

                        <div>

                            <span className="sign">{jQuery.i18n.map["crashes.battery"].toUpperCase()}</span>

                            <span className="value_block">
                                <span className="value">{(crash_data.bat.total/crash_data.bat.count).toFixed(2)+" %"}</span>
                                <span>AVERAGE</span>
                            </span>

                            <div className="min_max">
                                <span className="min">{crash_data.bat.min+" %"}</span>
                                <span className="max">{crash_data.bat.max+" %"}</span>
                            </div>

                            <div className="bar"></div>

                        </div>

                        <div>

                            <span className="sign">{jQuery.i18n.map["crashes.run"].toUpperCase()}</span>

                            <span className="value_block">
                                <span className="value">{(crash_data.run.total/crash_data.run.count).toFixed(2)+" %"}</span>
                                <span>AVERAGE</span>
                            </span>

                            <div className="min_max">
                                <span className="min">{crash_data.run.min+" %"}</span>
                                <span className="max">{crash_data.run.max+" %"}</span>
                            </div>

                            <div className="bar"></div>

                        </div>

                    </div>

                    <div className="pie_charts_blocks" style={blocks_style}>

                        <div className="pie_wrapper">
                            <BoolPieChart
                                width={200}
                                height={200}
                                data_function={this.pie_function.bind(this, "root")}
                                color={this.pie_charts_colors[9]}
                            />
                            <div className="sign">{jQuery.i18n.map["crashes.root"]}</div>
                        </div>

                        <div className="pie_wrapper">
                            <BoolPieChart
                                width={200}
                                height={200}
                                data_function={this.pie_function.bind(this, "online")}
                                color={this.pie_charts_colors[7]}
                            />
                            <div className="sign">{jQuery.i18n.map["crashes.online"]}</div>
                        </div>

                        <div className="pie_wrapper">
                            <BoolPieChart
                                width={200}
                                height={200}
                                data_function={this.pie_function.bind(this, "muted")}
                                color={this.pie_charts_colors[2]}
                            />
                            <div className="sign">{jQuery.i18n.map["crashes.muted"]}</div>
                        </div>

                        <div className="pie_wrapper">
                            <BoolPieChart
                                width={200}
                                height={200}
                                data_function={this.pie_function.bind(this, "background")}
                                color={this.pie_charts_colors[1]}
                            />
                            <div className="sign">{jQuery.i18n.map["crashes.background"]}</div>
                        </div>

                    </div>

                    <div className="bar_chart_block">

                        <Chart headline_sign={"CRASH DISTRIBUTION BY"}
                            headers={this.state.bar_chart_keys}
                            width={elements_width}
                            height={300}
                            side_margin={30}
                            bar_width={40}
                            data_function={this.bars_data_function}
                            tooltip_width={60}
                            tooltip_height={44}
                            bar_width={40}
                            date={this.props.date}
                            additional_selector={metrics_selector}

                        />

                    </div>

                    <div className="table_block">

                        <SortTable
                            headers={this.state.table_headers}
                            width={elements_width}
                            row_height={50}
                            data_sign={"CRASH OCCURENCIES LIST"}
                            sort_functions={this.state.sort_functions}
                            data_function={this.table_data_function}
                            convert_data_function={false}
                            initial_sort={"frequency"}
                            rows_per_page={20}
                            date={this.props.date}
                        />

                    </div>

                </div>
            </div>
        )

    },
})
