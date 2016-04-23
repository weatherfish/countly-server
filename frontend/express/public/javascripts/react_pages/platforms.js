var PlatformsPage = React.createClass({

    mixins: [UpdatePageMixin],

    colors : ["#1A8AF3", "#5DCBFF", "#9521B8", "#26C1B9", "#9FC126", "#0FB654", "#A63818", "#F73930", "#FD8927", "#F9BD34", "#FF7575"],

    getInitialState: function() {

        var table_headers = [
            {
                "title":jQuery.i18n.map["common.total-users"], // todo : not common.total-sessions
                "short" : "t",
                "color" : "#1B8AF3"
            },
            {
                "title":jQuery.i18n.map["common.new-users"],
                "short" : "n",
                "color" : "#1B8AF3"
            },
            {
                "title":jQuery.i18n.map["common.total-sessions"], // todo: ma
                "short" : "u",
                "color" : "#1B8AF3"
            }
        ]
/*
        var labels_mapping = {
            "t" : jQuery.i18n.map["common.total-users"],
            "n" : jQuery.i18n.map["common.new-users"],
            "u" : jQuery.i18n.map["common.unique-sessions"], // todo: here is not unique-sessions
        }
*/
        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
            "os_" : math_sort,
            "os_version" : math_sort
        }

        table_headers.unshift({
            "title" : jQuery.i18n.map["platforms.table.platform"],
            //"help"  : "sessions.unique-sessions", // todo: add translation
            "short" : "os_",
        })

        return({
            "sort_functions" : sort_functions,
            "table_headers" : table_headers,
            "active_app" : this.props.active_app
            //"active_bar_id" : 0
            //"active_tab" : 1
        });

    },

    init_data : function(timestamp) {

        var self = this;

        $.when(countlyDeviceDetails.initialize()).then(function () {

            active_platform : null;

            var platform_data = countlyDeviceDetails.getPlatformData();

            if (!self.state.horizontal_chart_headers) // todo: fast fix
            {

                var version_title = jQuery.i18n.map["platforms.table.platform-version"];

                if (platform_data.chartData && platform_data.chartData[0])
                {
                    version_title += " " + platform_data.chartData[0]['os_'];
                }

                var horizontal_chart_headers = [
                    {
                        "title":jQuery.i18n.map["platforms.table.platform"],
                        "data":countlyDeviceDetails.getPlatformData(),
                        "table_data_function":platform_data,
                        "help":"dashboard.top-resolutions",
                        "label_key" : "os_",
                        "colors" : self.colors,
                        "active_bars" : true,
                        "active" : true,
                        "active_bar_id" : 0
                    },
                    {
                        "title":version_title,
                        "data":countlyDeviceDetails.getOSVersionData(self.activePlatform),
                        "table_data_function":countlyDeviceDetails.getOSVersionData.bind(self, self.activePlatform),
                        "help":"dashboard.top-platforms",
                        "label_key" : "os_version",
                        "color" : self.colors[0],
                        "active" : false
                    }
                ];
            }
            else
            {
                var horizontal_chart_headers = self.state.horizontal_chart_headers;

                horizontal_chart_headers[0].data = countlyDeviceDetails.getPlatformData();
                horizontal_chart_headers[1].data = countlyDeviceDetails.getOSVersionData(self.activePlatform);
            }

            self.setState({
                horizontal_chart_headers : horizontal_chart_headers,
                inited : true,
            })

        });
    },

    componentWillReceiveProps: function(nextProps) {

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
    
            var horizontal_chart_headers = this.state.horizontal_chart_headers;
    
            horizontal_chart_headers[0].data = countlyDeviceDetails.getPlatformData();
            horizontal_chart_headers[1].data = countlyDeviceDetails.getOSVersionData(this.activePlatform);
    
            this.setState({
                horizontal_chart_headers : horizontal_chart_headers,
            });      
        }
    },

    change_platform : function(platform, color_id) {
        
        this.activePlatform = platform;

        var headers = this.state.horizontal_chart_headers;

        headers[1].title = jQuery.i18n.map["platforms.table.platform-version"] + " " + platform;
/*
        if (platform == "Blackberry" || platform == "WatchOS")
        {
            var real_platform = platform;
            platform = "Android";
        }
*/
        headers[1].data = countlyDeviceDetails.getOSVersionData(platform);
        headers[1].color = this.colors[color_id];

        headers[0].active_bar_id = color_id;
/*
        if (real_platform && real_platform == "Blackberry")
        {
            for (var i = 0; i < headers[1].data.chartData.length; i++)
            {
                headers[1].data.chartData[i]["os_version"] = headers[1].data.chartData[i]["os_version"].replace("Android", "Blackberry");
            }
        }

        if (real_platform && real_platform == "WatchOS")
        {
            for (var i = 0; i < headers[1].data.chartData.length; i++)
            {
                headers[1].data.chartData[i]["os_version"] = headers[1].data.chartData[i]["os_version"].replace("Android", "WatchOs");
            }
        }
*/
        this.setState({
            "horizontal_chart_headers" : headers,
            //"active_bar_id" : color_id,
        });

    },

    table_os_data : function(){

        return countlyDeviceDetails.getOSVersionData(null);

    },

    tab_change : function(tab_id){

        console.log("--- change tab ----");
        console.log(tab_id);

        var headers = this.state.horizontal_chart_headers;

        headers[0].active = !headers[0].active;
        headers[1].active = !headers[1].active;

        var table_headers = this.state.table_headers;

        if (headers[0].active)
        {
            table_headers[0].title = jQuery.i18n.map["platforms.table.platform"];
            table_headers[0].short = this.state.horizontal_chart_headers[0].label_key;
        }
        else
        {
            table_headers[0].title = jQuery.i18n.map["platforms.table.platform-version"];
            table_headers[0].short = this.state.horizontal_chart_headers[1].label_key;
        }

        this.setState({
            "horizontal_chart_headers" : headers,
            "table_headers" : table_headers
        });

    },

    get_active_tab : function()
    {

        var active_tab = false;

        for (var i = 0; i <   this.state.horizontal_chart_headers.length; i++) {

            var element = this.state.horizontal_chart_headers[i];

            if (element.active == true)
            {
                active_tab = element;
                break;
            }
        }

        return active_tab;

    },

    get_table_header : function(){

        return this.get_active_tab().title;

    },

    get_table_data : function(){
        return JSON.parse(JSON.stringify(this.get_active_tab().data));
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
            label_bottom : 40
        };

        var page_style = {
            "width" : elements_width
        }

        /*
        <SortTable
            headers={this.state.headers}
            width={elements_width}
            row_height={50}
            data_sign={"DATA"}
            sort_functions={this.state.sort_functions}
            data_function={countlyDeviceDetails.getResolutionData}
            convert_data_function={false}
            initial_sort={"resolution"}
            rows_per_page={20}
            filter_field={"resolution"}
            date={this.props.date}
        />

        */

        // active_tab={this.state.active_tab}

        return (

            <div className="page platforms_page" style={page_style}>

                <HorizontalBarInteractive
                    width={elements_width}
                    height={chart_height}
                    data_function={false}
                    labels_mapping={this.state.horizontal_chart_headers}
                    graph_label={jQuery.i18n.map["platforms.title"]}
                    label_key={false}
                    bar_height={34}
                    margins={chart_margins}
                    date={this.props.date}
                    onClick={this.change_platform}
                    onBoxClick={this.tab_change}
                />

                <SortTable
                    headers={this.state.table_headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={this.get_table_header()}
                    sort_functions={this.state.sort_functions}
                    data={this.get_table_data()}
                    convert_data_function={false}
                    initial_sort={"os_"}
                    rows_per_page={20}
                />

            </div>
        )
    }
})
