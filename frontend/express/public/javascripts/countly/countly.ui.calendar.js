/** @jsx React.DOM */

var fast_choises = [
    ["hour", "Today"],
    ["7days", "Last Week"],
    ["30days", "Last Month"],
    ["90days", "Last 3 Months"],
    ["month", "Last Year"],
]

var left_date  = {}; // todo: remove globals
var right_date = {};

var DayComponentRight = React.createClass({
    render() {

        var date = this.props.date;

        if (right_date.date && date <= right_date.date)
        {
            if (left_date.date)
            {
                if (date >= left_date.date)
                {
                    var class_name = "selected_day";
                }
            }
            else
            {
                var class_name = "selected_day";
            }
        }

        return (<div className={class_name}>
                    {this.props.label}
                </div>);
    }
});

var DayComponentLeft = React.createClass({
    render() {

        var date = this.props.date;

        if (left_date.date && date >= left_date.date)
        {
            if (right_date.date)
            {
                if (date <= right_date.date)
                {
                    var class_name = "selected_day";
                }
            }
            else
            {
                var class_name = "selected_day";
            }
        }

        return (<div className={class_name}>
                    {this.props.label}
                </div>);
    }
});

var CalendarWrapper = React.createClass({

    getInitialState: function() {

        var date_range = countlyCommon.getDateRange();
        date_range = date_range.split(" - ");

        // ------------

        var date_values = this.fill_date_values(date_range);

        global_controller.date_string = date_values.from_string + " - " + date_values.to_string;

        $(event_emitter).trigger("date_init", { "state" : { "from_string" : date_values.from_string, "to_string" : date_values.to_string } } );

        return {
            choise_open     : false,
            calendars_open  : false,
            transition_open    : false,
            transition_c_open  : false,
            transition_close   : false,
            transition_c_close : false,
            in_close           : false, // 2-step animation during both panel closing
            //left_date      : false, // todo: now they are globals
            //right_date     : false,
            from_string : date_values.from_string,
            to_string   : date_values.to_string,
            fast_choise : countlyCommon.getPeriod()
        };
    },

    componentDidMount : function(){

        //var self = this;

        $(event_emitter).on('date_extend', this.date_extend.bind(this));

    },

    date_extend : function(e, data){

        var ld = new Date(left_date.date);
        var extended_left_date = ld.setDate(ld.getDate() - data.days_extend);

        left_date.date = new Date(extended_left_date);

        this.handleDateSelect();

    },

    /*
        Create string with date description
    */

    fill_date_values : function(date_range)
    {

        if (countlyCommon.periodObj.currentPeriodArr) // not "today" and "year???" - fast choise
        {

            var current_period = countlyCommon.periodObj.currentPeriodArr;
            var first_date = current_period[0].split(".");
            var last_date  = current_period[current_period.length - 1].split(".");

            var left_month  = first_date[1] - 1;
            var right_month = last_date[1] - 1;

            left_date.date  = new Date(first_date[0], left_month, first_date[2]);
            right_date.date = new Date(last_date[0], right_month, last_date[2]);

            var first_date_year = date_range[0];

            if (first_date[0] != last_date[0] && date_range[0].indexOf(",") == -1) // can be ["24 Feb", "19 Oct"] or ["12 Nov, 2014", "19 Oct, 2015"]
            {
                first_date_year += " " + first_date[0];
            }

            var last_date_year  = date_range[1];

            if (date_range[1].indexOf(",") == -1)
            {
                last_date_year += " " + last_date[0];
            }

        }
        else
        {

            //if(Object.prototype.toString.call(date_range) === '[object Array]') {

                if (date_range[0].indexOf(":") > -1) // today
                {
                    /*
                        ["00:00", "17:15"]
                    */

                    left_date.date  = new Date();
                    right_date.date = new Date();

                    var first_date_year = date_range[0];
                    var last_date_year  = date_range[1] + " Today";
                }
                else
                {
                    /*
                        Last Year: "Jan" - current month
                    */

                    var current_year = new Date().getFullYear();

                    var first_date_year = date_range[0];
                    var last_date_year  = date_range[1] + " " + current_year;

                    left_date.date = new Date(current_year, 0, 1);
                    right_date.date = new Date();
                }
            //}
        }

        console.log("computed first_date_year:", first_date_year);
        console.log("computed last_date_year:", last_date_year);

        return {
            from_string : first_date_year,  // first_date_year - wrong variable name
            to_string   : last_date_year
        }
    },

    clickedOutsideElement : function(event, elemId) {

        if (!event)
        {
            return false;
        }

        var theElem = this.getEventTarget(event);
        while(theElem != null) {
          if(theElem.id == elemId)
            return false;
          theElem = theElem.offsetParent;
        }
        return true;
    },

    getEventTarget : function(evt) {
        var targ = (evt.target) ? evt.target : evt.srcElement;
        if(targ != null) {
          if(targ.nodeType == 3)
            targ = targ.parentNode;
        }
        return targ;
    },

    handleOpenClick: function(i) {

        var self = this;

        document.onclick = function(event) {

            if(self.clickedOutsideElement(event, 'calendar'))
            {

                /*
                close time range window
                */

                document.onclick = false;

                var state_obj = { };

                if (self.state.calendars_open == true)
                {
                    state_obj.calendars_open     = false;
                    state_obj.transition_c_close = false;
                    state_obj.in_close           = false;
                }
                else
                {
                    state_obj.choise_open      = false;
                    state_obj.transition_close = false;
                    state_obj.calendars_open   = false;
                }

                self.setState(state_obj);
            }

        }

        var state_obj = { };

        if (this.state.choise_open)
        {
            /* if time range calendars are open, close them first */
            if (this.state.calendars_open)
            {
                state_obj.calendars_open     = false;
                state_obj.transition_c_close = true;
                state_obj.in_close           = true; // will start full animation for closing boch panels
            }
            else
            {
                state_obj.choise_open      = false;
                state_obj.transition_close = true;
            }
        }
        else
        {
            state_obj.transition_open = true; // start open fast time range choise
        }

        this.setState(state_obj);

    },

    handleOpenCalendars: function(i) {

        if (this.state.calendars_open == false)
        {
            this.setState({
                transition_c_open : true
            });
        }
        else
        {
            this.setState({
                calendars_open : false,
                transition_c_close : true
            });
        }
    },

    handleLeftChange : function(date){

        var day   = date.getDate();
        var month = date.getMonth();

        left_date.day   = day;
        left_date.month = month;

        left_date.date = date;

        this.setState({
            "left_date" : date
        });

        return true;
    },

    handleRightChange : function(date){

        var day   = date.getDate();
        var month = date.getMonth();

        right_date.day   = day;
        right_date.month = month;

        right_date.date = date;

        this.setState({
            "right_date" : date
        });

        return true;
    },


    /*
        Push "1 week", "month" etc
    */

    handleFastChoise : function(choise){

        //countlyCommon.setPeriod([date_from, date_to]);

        console.log("fast choise:", choise);

        countlyCommon.setPeriod(choise);

        document.onclick = false; // unbind closing on outside place

        // ----------

        var date_range = countlyCommon.getDateRange();
        date_range = date_range.split(" - ");

        // ----------

        var date_values = this.fill_date_values(date_range);

        var state_obj = {
            from_string : date_values.from_string, // first_date_year - wrong variable name
            to_string   : date_values.to_string,
            fast_choise : choise
        }

        /* if time range calendars are open, close them first */
        if (this.state.calendars_open == true)
        {
            state_obj.calendars_open     = false;
            state_obj.transition_c_close = true;
            state_obj.in_close           = true;
        }
        else
        {
            state_obj.choise_open      = false;
            state_obj.transition_close = true;
            state_obj.calendars_open   = false;
        }

        this.setState(state_obj);
        

        //global_controller.date_string = state_obj.from_string + " - " + state_obj.to_string;

        $(event_emitter).trigger("date_choise", { "period" : choise, "state" : state_obj });

    },

    /*
      date select on time range
    */

    handleDateSelect : function(value){

        if (!right_date.date || !left_date.date)
        {
            return false;
        }

        document.onclick = false; // unbind closing on outside place

        var date_from = left_date.date.getTime();
        var date_to   = right_date.date.getTime();

        console.log("from:", date_from);
        console.log("to:" , date_to);

        countlyCommon.setPeriod([date_from, date_to]);

        var date_range = countlyCommon.getDateRange();

        date_range = date_range.split(" - ");

        var date_values = this.fill_date_values(date_range);

        var state_obj = {
            from_string : date_range[0]/* + " " + date_values.from_string*/, // todo : "2014 2014", "2015 2015"
            to_string   : date_range[1]/* + " " + date_values.to_string*/,
            fast_choise : false
        }

        if (this.state.calendars_open == true)
        {
            state_obj.calendars_open     = false;
            state_obj.transition_c_close = true;
            state_obj.in_close           = true;
        }
        else
        {
            state_obj.choise_open      = false;
            state_obj.transition_close = true;
            state_obj.calendars_open   = false;
        }

        this.setState(state_obj);

        //global_controller.date_string = state_obj.from_string + " - " + state_obj.to_string;

        $(event_emitter).trigger("date_choise", { "period" : [date_from, date_to], "state" : state_obj }); // todo: change date_fast_choise

    },

    componentDidUpdate : function() {

        if (this.state.transition_open) // open left part
        {

            var self = this;

            // transition does not work between display:none and display:block, so we need transition states
            setTimeout(function(){

                self.setState({
                    "choise_open"     : true,
                    "transition_open" : false
                });

                var active_elements = document.getElementsByClassName('dates_list');

                if (active_elements.length > 0)
                {
                    transitionEvent = self.whichTransitionEvent(active_elements[0]);

                    if(transitionEvent){
                        active_elements[0].addEventListener(transitionEvent, self.transitionEnd);
                    }
                }

            }, 10);

        }
        else if (this.state.transition_c_open) // open right part
        {

            var self = this;

            // transition does not work between display:none and display:block, so we need transition states
            setTimeout(function(){

                self.setState({
                    "calendars_open"    : true,
                    "transition_c_open" : false
                });

            }, 10);

        }
        else if (this.state.transition_c_close)
        {
            var active_elements = document.getElementsByClassName('calendars');

            if (active_elements.length > 0)
            {
                transitionEvent = this.whichTransitionEvent(active_elements[0]);

                /*
                    need to change menu items style for change opacity
                */

                if(transitionEvent){
                    active_elements[0].addEventListener(transitionEvent, this.transitionEnd);
                }
            }
        }
        else if (this.state.transition_close)
        {
            var active_elements = document.getElementsByClassName('dates_list');

            if (active_elements.length > 0)
            {
                transitionEvent = this.whichTransitionEvent(active_elements[0]);

                if(transitionEvent){
                    active_elements[0].addEventListener(transitionEvent, this.transitionEnd);
                }
            }
        }

        if (this.state.choise_open == true || this.state.transition_close == true)
        {
            document.getElementById('content-container').style['z-index'] = 101; // todo: !!!!! change
        }
        else
        {
            document.getElementById('content-container').style['z-index'] = 2000; // todo: !!!!! change

        }

    },

    /*
        finish 2 step animation
    */

    transitionEnd: function (event){

        if (event.propertyName != "opacity")
        {
            return false;
        }

        if (event.target.className.indexOf("calendars") > -1)
        {
            var obj = {
                "transition_c_close" : false,
            }

            if (this.state.in_close)
            {
                obj.choise_open      = false;
                obj.transition_close = true;
            }

            this.setState(obj);
        }
        else
        {

            if (this.state.choise_open && this.state.fast_choise == false)
            {
                this.handleOpenCalendars();
            }
            else
            {
                this.setState({
                    "transition_close" : false,
                    "in_close"         : false
                });
            }
        }

        event.target.removeEventListener(event.type, this.transitionEnd);
    },

    render : function() {

        var self = this;

        var selectors_class_name = "dates_list";

        if (this.state.choise_open == true)
        {
            selectors_class_name += " active";
        }

        if (this.state.transition_open == false && this.state.transition_close == false && this.state.choise_open == false)
        {
            selectors_class_name += " hidden";
        }

        var calendars_class_name = "calendars";

        if (this.state.calendars_open)
        {
            calendars_class_name += " active";

            selectors_class_name += " calendars_active";
        }

        if (this.state.transition_c_open == false && this.state.transition_c_close == false && this.state.calendars_open == false)
        {
            calendars_class_name += " hidden";
        }

        var fast_choises_html = fast_choises.map(function (item, i) {

            var choise_name         = item[0];
            var choise_localization = item[1];

            var class_name = "date_choice";

            if(choise_name == self.state.fast_choise && !self.state.calendars_open)
            {
                class_name += " active";
            }

            return (
                <div className={class_name} onClick={self.handleFastChoise.bind(self, choise_name)}>{choise_localization}</div>
            );
        });

        var date_sign_class = "date_sign";

        if (this.state.choise_open)
        {
            date_sign_class += " active";
        }

        var custom_choice_class = "custom_choice";

        if (this.state.calendars_open || Array.isArray(countlyCommon.getPeriod()))
        {
            custom_choice_class += " active";
        }

        var element_width = window.innerWidth - 240 - 20 - 20 - 16;

        var element_style = {
            width : element_width
        };

        return (

            <div className="wrapper" style={element_style}>

                <div id="calendar">

                    <div className={date_sign_class} onClick={this.handleOpenClick}>
                        <span className="icon"></span>
                        <span className="sign">{this.state.from_string} - {this.state.to_string}</span>
                        <span className="arrow"></span>
                    </div>

                    <div className={selectors_class_name}>

                        <div className="top_arrow"></div>

                        {fast_choises_html}

                        <div className={custom_choice_class} onClick={this.handleOpenCalendars}>
                            <span>Custom</span>
                            <div className="arrow"></div>
                        </div>
                    </div>

                    <div className={calendars_class_name}>

                        <div className="calendar_wrapper">
                            <ReactWidgets.Calendar dayComponent={DayComponentLeft} max={right_date.date} onChange={this.handleLeftChange} defaultValue={left_date.date}  />
                        </div>
                        <div className="calendar_wrapper">
                            <ReactWidgets.Calendar dayComponent={DayComponentRight} min={left_date.date} onChange={this.handleRightChange} defaultValue={right_date.date}  />
                        </div>

                        <div className="confirm_button" onClick={this.handleDateSelect}>
                            Confirm Range
                        </div>
                    </div>

                </div>
            </div>
        );
    },

    whichTransitionEvent: function(el){

        var t;
        var transitions = {
            'transition'      : 'transitionend',
            /*'OTransition'     : 'oTransitionEnd',
            'MozTransition'   : 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'*/
        };
        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

});

console.log(">>> finish load Calendar  >>>");
