//import Calendar from 'rc-calendar';

import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import GregorianCalendarFormat from 'gregorian-calendar-format';
//import React from 'react';
var formatter = new GregorianCalendarFormat('yyyy-MM-dd HH:mm:ss');
import GregorianCalendar from 'gregorian-calendar';
//import zhCn from 'gregorian-calendar/lib/locale/zh-cn';
//import CalendarLocale from 'rc-calendar/lib/locale/zh-cn';
import Picker from 'rc-calendar/lib/Picker';

import enUs from 'gregorian-calendar/lib/locale/en-us';
import CalendarLocale from 'rc-calendar/lib/locale/en-us';

var value = new GregorianCalendar(enUs);
value.setTime(Date.now());

function disabledDate(current) {
  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return current.getTime() < date.getTime();  //can not select days after today
}

/*
var date_from = false;
var date_to   = false;
*/

var CalendarWrapper = React.createClass({

    getInitialState: function() {

        var date_range = countlyCommon.getDateRange();

        console.log("date_range 1:", date_range);

        date_range = date_range.split(" - ");

        console.log("date_range 2:", date_range);

        return {
            choise_open    : true,
            calendars_open : true,
            from_string    : date_range[0] + " 2015",
            to_string      : date_range[1] + " 2015",
        };
    },


    handleOpenClick: function(i) {

        this.setState({
            choise_open : !this.state.choise_open,
            calendars_open : false
        });
    },

    handleOpenCalendars: function(i) {

        this.setState({
            calendars_open : !this.state.calendars_open,
        });
    },

    handleFastChoise : function(choise){

        countlyCommon.setPeriod(choise);

        var date_range = countlyCommon.getDateRange();
        
        date_range = date_range.split(" - ");

        this.setState({
            "from_string" : date_range[0] + " 2015",
            "to_string"   : date_range[1] + " 2015",
        });

    },

    handleDateSelect : function(value){

        console.log('------+++--2- handleDateSelect ---+++-------');

        var date_from = value[0].time;
        var date_to   = value[1].time;

        console.log("from:", value[0].time);
        console.log("to:" , value[1].time);

        countlyCommon.setPeriod([date_from, date_to]);

        console.log("string:", formatter.format(value[0]), formatter.format(value[1]))

        var from_string = formatter.format(value[0]).split(" ");
        from_string = from_string[0];

        var to_string = formatter.format(value[1]).split(" ");
        to_string = to_string[0];

        this.setState({
            "from_string" : from_string,
            "to_string"   : to_string,
        });

    },

    render : function() {

        var selectors_class_name = "dates_list";

        if (this.state.choise_open)
        {
            selectors_class_name += " active";
        }

        var calendars_class_name = "calendars";

        if (this.state.calendars_open)
        {
            calendars_class_name += " active";
        }

        // disabledDate={disabledDate}
        // onChange={this.handleDateSelect}
        // onSelect={this.handleDateSelect}

        return (
          <div className="wrapper">

              <div className="date_sign" onClick={this.handleOpenClick}>
                  <span className="icon"></span>
                  <span className="sign">{this.state.from_string} - {this.state.to_string}</span>
                  <span className="arrow"></span>
              </div>

              <div className={selectors_class_name}>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "hour")}>Today</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "7days")}>Last Week</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "30days")}>Last Month</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "90days")}>Last 3 Months</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "month")}>Last Year</div>

                  <div className="custom_choice" onClick={this.handleOpenCalendars}>Custom</div>
              </div>

              <div className={calendars_class_name}>
                  <RangeCalendar
                     showWeekNumber={false}
                     locale={CalendarLocale}
                     onOk={this.handleDateSelect}
                     showTime={false}/>
              </div>

          </div>
        );
    }
});

React.render(
    <CalendarWrapper />,
    document.getElementById("calendar")
);
