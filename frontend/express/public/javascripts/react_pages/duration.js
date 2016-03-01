var DurationPage = React.createClass({

    getInitialState: function() {

        return({

        });

    },

    render : function(){

        var elements_width = get_viewport_width();
        var chart_height = 300;

        var data = countlySession.getDurationData();

        console.log("======== countlySession.getDurationData =========");
        console.log(data.chartData);
/*
        { "mData": "ds", sType:"session-duration", "sTitle": jQuery.i18n.map["session-duration.table.duration"] },
        { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-users"] },
        { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
*/
        var headers = [{
            "title":jQuery.i18n.map["session-duration.table.duration"],
            "short" : "ds",
        },
        {
            "title":jQuery.i18n.map["common.number-of-users"],
            "short" : "t"
        },
        {
            "title":jQuery.i18n.map["common.percent"],
            "short" : "percent"
        }]

        var sort_functions = {
            "ds" : math_sort,
            "f" : math_sort,
            "percent" : math_sort
        }

        var page_style = {
            "width" : elements_width
        }

        return (

            <div className="page" style={page_style}>

                <Chart headline_sign={"DURATION"}
                    headers={headers}
                    width={elements_width}
                    height={chart_height}
                    side_margin={30}
                    bar_width={40}
                    data={data.chartData}
                    data_function={countlySession.getDurationData}
                    tooltip_width={60}
                    tooltip_height={44}
                    bar_width={40}
                />

                <SortTable
                    headers={headers}
                    width={elements_width}
                    row_height={50}
                    data_sign={"DATA"}
                    sort_functions={sort_functions}
                    data_function={countlySession.getDurationData}
                    convert_data_function={false}
                    initial_sort={"duration"}
                    rows_per_page={20}
                />

            </div>
        )
    }
})
