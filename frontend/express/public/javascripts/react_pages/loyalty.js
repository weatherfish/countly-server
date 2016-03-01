var LoyaltyPage = React.createClass({

    getInitialState: function() {

        return({

        });

    },

    render : function(){

        var elements_width = get_viewport_width();
        var chart_height = 300;

        var loyaltyData = countlyUser.getLoyaltyData();

        console.log("======== frequencyData.chartData =========");
        console.log(loyaltyData.chartData);

        /*
                { "mData": "l", sType:"loyalty", "sTitle": jQuery.i18n.map["user-loyalty.table.session-count"] },
                { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-users"] },
                { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }
        */

        var headers = [{
            "title":jQuery.i18n.map["user-loyalty.table.session-count"], // todo : not common.total-sessions
            "short" : "l",
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
            "l" : math_sort,
            "t" : math_sort,
            "percent" : math_sort
        }

      /*  { "mData": "f", sType:"frequency", "sTitle": jQuery.i18n.map["session-frequency.table.time-after"] },
        { "mData": "t", sType:"formatted-num", "mRender":function(d) { return countlyCommon.formatNumber(d); }, "sTitle": jQuery.i18n.map["common.number-of-users"] },
        { "mData": "percent", "sType":"percent", "sTitle": jQuery.i18n.map["common.percent"] }*/
        /*
        */

        var page_style = {
            "width" : elements_width
        }

        return (

            <div className="page" style={page_style}>

                <Chart headline_sign={"LOYALTY"}
                    headers={headers}
                    width={elements_width}
                    height={chart_height}
                    side_margin={30}
                    bar_width={40}
                    data={loyaltyData.chartData}
                    data_function={countlyUser.getLoyaltyData}
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
                    data_function={countlyUser.getLoyaltyData}
                    convert_data_function={false}
                    initial_sort={"loyalty"}
                    rows_per_page={20}
                />

            </div>
        )
    }
})
