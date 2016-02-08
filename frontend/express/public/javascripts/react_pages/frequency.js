var FrequencyPage = React.createClass({

    getInitialState: function() {

        return({

        });

    },

    render : function(){

        var chart_width = window.innerWidth - 240 - 40 - 80 - 40;
        var chart_height = 300;

        var frequencyData = countlyUser.getFrequencyData();

        return (

            <div className="page">

                <Chart trend_sign={false}
                    width={chart_width}
                    height={chart_height}
                    data={frequencyData.chartData}
                    data_function={countlyUser.getFrequencyData}
                    tooltip_width={60}
                    tooltip_height={44}
                    bar_width={40}
                />

                <DateSign
                    sign={"most frequent"}
                />

            </div>
        )
    }
})
