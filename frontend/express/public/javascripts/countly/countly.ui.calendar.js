/** @jsx React.DOM */

var left_date  = {};
var right_date = {};

var DayComponentLeft = React.createClass({
    render() {

        var date = this.props.date;

        if (left_date.date)
        {
            var style = { backgroundColor: date >= left_date.date && '#19cc5d' }; //todo
        }

        return (<div style={style}>
                    {this.props.label}
                </div>);
    }
});

var DayComponentRight = React.createClass({
    render() {

        var date = this.props.date;

        if (right_date.date)
        {
            var style = { backgroundColor: date <= right_date.date && '#19cc5d' }; //todo
        }

        return (<div style={style}>
                    {this.props.label}
                </div>);
    }
});

var CalendarWrapper = React.createClass({

    getInitialState: function() {

        var date_range = countlyCommon.getDateRange();

        date_range = date_range.split(" - ");

        return {
            choise_open    : true,
            calendars_open : true,
            left_date      : false,
            right_date     : false,
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
            "from_string"    : date_range[0] + " 2015",
            "to_string"      : date_range[1] + " 2015",
            "choise_open"    : false,
            "calendars_open" : false
        });

        $(event_emitter).trigger("date_fast_choise", { "period" : choise });

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

    handleDateSelect : function(value){

        if (!right_date.date || !left_date.date)
        {
            return false;
        }

        var date_from = left_date.date.getTime();
        var date_to   = right_date.date.getTime();

        console.log("from:", date_from);
        console.log("to:" , date_to);

        countlyCommon.setPeriod([date_from, date_to]);

        var date_range = countlyCommon.getDateRange();

        date_range = date_range.split(" - ");

        this.setState({
            "from_string"    : date_range[0] + " 2015",
            "to_string"      : date_range[1] + " 2015",
            "choise_open"    : false,
            "calendars_open" : false
        });

        $(event_emitter).trigger("date_fast_choise", { "period" : [date_from, date_to] });

    },

    render : function() {

        var selectors_class_name = "dates_list";

        if (this.state.choise_open)
        {
            selectors_class_name += " active"; // fast choise
        }

        var calendars_class_name = "calendars";

        if (this.state.calendars_open)
        {
            calendars_class_name += " active"; // time range calendars

            selectors_class_name += " calendars_active";
        }

        var left_init_date = new Date();
        left_init_date.setMonth(left_init_date.getMonth() - 1);

        return (
          <div className="wrapper">

              <div className="date_sign" onClick={this.handleOpenClick}>
                  <span className="icon"></span>
                  <span className="sign">{this.state.from_string} - {this.state.to_string}</span>
                  <span className="arrow"></span>
              </div>

              <div className={selectors_class_name}>

                  <div className="top_arrow"></div>

                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "hour")}>Today</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "7days")}>Last Week</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "30days")}>Last Month</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "90days")}>Last 3 Months</div>
                  <div className="date_choice" onClick={this.handleFastChoise.bind(self, "month")}>Last Year</div>

                  <div className="custom_choice" onClick={this.handleOpenCalendars}>Custom</div>
              </div>

              <div className={calendars_class_name}>
                  <div className="calendar_wrapper">
                      <ReactWidgets.Calendar dayComponent={DayComponentLeft} onChange={this.handleLeftChange}  defaultValue={left_init_date}  />
                  </div>
                  <div className="calendar_wrapper">
                      <ReactWidgets.Calendar dayComponent={DayComponentRight} onChange={this.handleRightChange}  defaultValue={new Date()}  />
                  </div>
                  <div className="confirm_button" onClick={this.handleDateSelect}>
                      Confirm Range
                  </div>
              </div>

          </div>
        );
    }
});

React.render(
    <CalendarWrapper />,
    document.getElementById("calendar")
);
