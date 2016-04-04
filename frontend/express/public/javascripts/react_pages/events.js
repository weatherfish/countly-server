var EventsPage = React.createClass({

    //colors : ["#1B8AF3", "#F2B702"],

    mixins: [UpdatePageMixin],

    getInitialState: function() {

        var sort_functions = {
            "s" : math_sort,
            "c" : math_sort,
            "curr_segment" : math_sort
        }

        return({
            sort_functions : sort_functions,
            inited : false,
            loading : false
        });

    },

    init_data : function(timestamp) {

        var self = this;

        $.when(countlyEvent.initialize()).then(function () {
/*
            var eventData = countlyEvent.getEventData();

            var eventSummary = countlyEvent.getEventSummary();
*/
            var events_types = countlyEvent.getEvents();

            console.log("==================================events types ============");
            console.log(events_types);

            var segmentations = countlyEvent.getEventSegmentations();

            //var active_segmentation = countlyEvent.getActiveSegmentation();

            var active_segmentation = false;

            var headers = self.make_headers();

            var table_headers = [];

            if (!active_segmentation)
            {
                table_headers.push({
                    "title" : "date",
                    "short" : "date"
                })

                table_headers.push({
                    "title" : headers[0].title,
                    "short" : "c"
                })

                table_headers.push({
                    "title" : headers[1].title,
                    "short" : "s"
                })
            }
            else
            {
                table_headers.push({
                    "title" : "Segment",
                    "short" : "curr_segment"
                })
                table_headers.push({
                    "title" : "Count",
                    "short" : "c"
                })
            }

            if (events_types.length > 0){
                var active_event = events_types[0];
            }
            else
            {
                var active_event = false;
            }

            self.setState({
                inited : true,
                events_types : events_types,
                active_event : events_types[0],
                headers : headers,
                segmentations : segmentations,
                active_segmentation : active_segmentation,
                table_headers : table_headers
            })

        });
    },

    on_graph_mount : function(mount_data) {

        console.log("===== graph mount ====");
        console.log(mount_data);

        /*this.setState({
            "granularity" : mount_data.granularity
        });*/
    },

    make_headers : function(){

        var eventData = countlyEvent.getEventData();

        var eventSummary = countlyEvent.getEventSummary();

        var headers = [];

        eventData.daily_granularity.forEach(function(data_line, i){

            var total = 0;

            //eventSummary.items.forEach(function(item, id){
            for (var i = 0; i < eventSummary.items.length; i++)
            {

                var item = eventSummary.items[i];

                if (item.title.toLowerCase() == data_line.label.toLowerCase())
                {

                    total = item.total;
                    break;
                }

            };

            headers.push({
                "title" : data_line.label,
                //"short" : "l",
                "total" : total,
                "color" : data_line.color,
                "active" : true
            });

        });

        return headers;

    },

    componentWillReceiveProps : function(nextProps) {

        //var self = this;

        if (!this.state.active_segmentation)
        {
            var headers = this.make_headers();

            this.setState({
                headers : headers
            })
        }

    },

    show_events_selectors : function(){

        this.setState({
            "events_selectors_open" : !this.state.events_selectors_open
        })

    },

    event_selector_click : function(new_event){

        var self = this;

        this.setState({
            loading : true
        });

        countlyEvent.setActiveEvent(new_event.key, function() {

            $.when(countlyEvent.initialize(true)).then(function () {
/*
                var eventData = countlyEvent.getEventData();

                var eventSummary = countlyEvent.getEventSummary();
*/
                var segmentations = countlyEvent.getEventSegmentations();

                var headers = self.make_headers();

                var table_headers = [];

                table_headers.push({
                    "title" : "date",
                    "short" : "date"
                })

                table_headers.push({
                    "title" : headers[0].title,
                    "short" : "c"
                })

                table_headers.push({
                    "title" : headers[1].title,
                    "short" : "s"
                })

                self.setState({
                    //"events_selectors_open" : false,
                    "headers" : headers,
                    "table_headers" : table_headers,
                    "active_event" : new_event,
                    "segmentations" : segmentations,
                    "segmentation_selectors_open" : false,
                    "active_segmentation" : false,
                    "events_selectors_open" : false,
                    "loading" : false
                });

            });
        });
    },

    show_segmentation_selectors : function(){

        this.setState({
            "segmentation_selectors_open" : !this.state.segmentation_selectors_open
        })

    },

    segmentation_selector_click : function(segmentation){

        console.log("segmentation_selector_click:", segmentation);

        var self = this;

        this.setState({
            "loading" : true
        });

        if (segmentation)
        {
            var set_segmentation = segmentation;
        }
        else
        {
            var set_segmentation = "";
        }

        countlyEvent.setActiveSegmentation(set_segmentation, function() {

            var table_headers = [];

            if (!segmentation)
            {

                var headers = self.make_headers();

                table_headers.push({
                    "title" : "date",
                    "short" : "date"
                })

                table_headers.push({
                    "title" : headers[0].title,
                    "short" : "c"
                })

                table_headers.push({
                    "title" : headers[1].title,
                    "short" : "s"
                })
            }
            else
            {
                table_headers.push({
                    "title" : "Segment",
                    "short" : "curr_segment"
                })
                table_headers.push({
                    "title" : "Count",
                    "short" : "c"
                })
            }

            self.setState({
                "segmentation_selectors_open" : false,
                "active_segmentation" : segmentation,
                "table_headers" : table_headers,
                "loading" : false,
            })

        });
    },

    settings_button_click : function(){

        this.setState({
            events_map_edit : !this.state.events_map_edit
        });
    },

    on_events_map_save : function(){
        this.setState({
            events_map_edit : false
        });
    },

    on_events_map_cancel : function(){
        this.setState({
            events_map_edit : false
        });
    },

    render : function(){

        var self = this;

        if (!this.state.inited || this.state.loading)
        {
            return (<Loader/>);
        }

        if (!this.state.active_event)
        {
            return (<div>no data</div>)
        }

        var elements_width = get_viewport_width();
        var chart_height = 300;
        var line_chart_hover_disable = false;

        var page_style = {
            "width" : elements_width
        }

        var events_selectors_current_style = { };
        var segmentation_selectors_current_style = { };

        if (this.state.events_selectors_open)
        {
            events_selectors_current_style.display = "block";
            line_chart_hover_disable = true;
        }
        else
        {
            events_selectors_current_style.display = "none";
        }

        if (this.state.segmentation_selectors_open)
        {
            segmentation_selectors_current_style.display = "block";
            line_chart_hover_disable = true;
        }
        else
        {
            segmentation_selectors_current_style.display = "none";
        }

        var segmentation_arrow_style = {};

        if (self.state.segmentations && self.state.segmentations.length > 0)
        {
            segmentation_arrow_style.display = "block";
        }
        else
        {
            segmentation_arrow_style.display = "none";
            segmentation_selectors_current_style.display = "none";
        }

        if (self.state.active_segmentation)
        {
            var current_segmentation = self.state.active_segmentation;
            var no_segmantation_selector_class = "";
        }
        else
        {
            var current_segmentation = jQuery.i18n.map["events.no-segmentation"];
            var no_segmantation_selector_class = "active";
        }

        var events_map_edit_style = { };

        if (this.state.events_map_edit)
        {
            events_map_edit_style.display = "block";
        }
        else
        {
            events_map_edit_style.display = "none";
        }

        if (!this.state.active_segmentation)
        {
            var convert_table_function = true;
        }
        else
        {
            var convert_table_function = false;
        }

        return (
            <div className="page events_page" style={page_style}>

                <div className="control_block">

                    <div className="events_selection">

                        <div className="sign">EVENT SELECTION</div>

                        <div className="current" onClick={this.show_events_selectors}>
                            <span className="sign">{this.state.active_event.name}</span>
                            <span className="arrow"/>
                        </div>

                        <div className="selectors" style={events_selectors_current_style}>
                            <div className="top_arrow"/>
                            {
                                _.map(self.state.events_types, function(event_type, id) {

                                    if (event_type.name == self.state.active_event.name)
                                    {
                                        var class_name = "active";
                                    }
                                    else {
                                        var class_name = "";
                                    }

                                    return (<span className={class_name} onClick={self.event_selector_click.bind(self, event_type)}>{event_type.name}</span>)
                                })
                            }
                        </div>

                        <div className="settings_button" onClick={self.settings_button_click}>
                        Settings
                        </div>

                        <div className="events_map_edit" style={events_map_edit_style}>
                        {
                            _.map(self.state.events_types, function(event_type, id) {

                                if (event_type.count)
                                {
                                    var count_sign = event_type.count;
                                }
                                else
                                {
                                    var count_sign = "count";
                                }

                                if (event_type.sum)
                                {
                                    var sum_sign = event_type.count;
                                }
                                else
                                {
                                    var sum_sign = "sum";
                                }

                                return (<div><span className="key">{event_type.key}</span><input value={event_type.name}/><input value={count_sign}/><input value={sum_sign}/></div>)
                            })
                        }

                            <div className="buttons_block">
                                <span className="save" onClick={this.on_events_map_save}>save</span>
                                <span className="cancel" onClick={this.on_events_map_cancel}>cancel</span>
                            </div>

                        </div>

                    </div>

                    <div className="segmentation_selection">

                          <div className="sign">SEGMENTATION SELECTION</div>

                          <div className="current" onClick={self.show_segmentation_selectors}>
                              <span className="sign">{current_segmentation}</span>
                              <span className="arrow" style={segmentation_arrow_style}/>
                          </div>

                          <div className="selectors" style={segmentation_selectors_current_style}>
                              <div className="top_arrow"/>
                              <span className={no_segmantation_selector_class} onClick={self.segmentation_selector_click.bind(self, false)}>{jQuery.i18n.map["events.no-segmentation"]}</span>
                              {
                                  _.map(self.state.segmentations, function(segmentation, id) {

                                      if (segmentation == countlyEvent.getActiveSegmentation())
                                      {
                                          var class_name = "active";
                                      }
                                      else {
                                          var class_name = "";
                                      }

                                      return (<span className={class_name} onClick={self.segmentation_selector_click.bind(self, segmentation)}>{segmentation}</span>)

                                  })

                              }
                          </div>

                    </div>

                </div>

                {(() => {

                    if (!self.state.active_segmentation)
                    {

                        return(<LineChart
                            trend_sign={"EVENTS"}
                            width={elements_width}
                            height={chart_height}
                            sides_padding={20}
                            period={countlyCommon.getPeriod()}
                            big_numbers={self.state.headers}
                            data_function={countlyEvent.getEventData}
                            update_graph_function={countlyCommon.updateTimeGraph}
                            with_granularity={true}
                            mount_callback={self.on_graph_mount}
                            date={self.props.date}
                            disable_hover={line_chart_hover_disable}
                        />)

                    }
                    else
                    {
                        return(<Chart headline_sign={"SEGMENTATION"}
                            headers={self.state.table_headers}
                            width={elements_width}
                            height={chart_height}
                            side_margin={30}
                            bar_width={40}
                            data_function={countlyEvent.getEventData}
                            tooltip_width={60}
                            tooltip_height={44}
                            bar_width={40}
                            date={self.props.date}
                        />)
                    }
                })()}

                <SortTable
                    headers={this.state.table_headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={this.state.sort_functions}
                    data_function={countlyEvent.getEventData}
                    convert_data_function={convert_table_function}
                    initial_sort={"loyalty"}
                    rows_per_page={20}
                    date={this.props.date}
                />

            </div>
        )
    }
})
/*

*/
