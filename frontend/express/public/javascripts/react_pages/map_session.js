var MapSessionPage = React.createClass({

    getInitialState : function() {

        var sort_functions = {
            "t" : math_sort,
            "n" : math_sort,
            "u" : math_sort,
        }

        return({
            granularity : "daily",//false, // todo - should be false
            sort_functions : sort_functions,
            inited : false,
            iso2 : false
        });
    },

    make_big_numbers : function()
    {
        var sessionData = countlySession.getSessionData();

        var big_numbers = [
            {
                "title":jQuery.i18n.map["common.total-sessions"],
                "total":sessionData.usage["total-sessions"].total,
                "trend":sessionData.usage["total-sessions"].trend,
                "help":"sessions.total-sessions",
                "short" : "t",
                "color" : "#1B8AF3"
            },
            {
                "title":jQuery.i18n.map["common.new-sessions"],
                "total":sessionData.usage["new-users"].total,
                "trend":sessionData.usage["new-users"].trend,
                "help":"sessions.new-sessions",
                "short" : "n",
                "color" : "#F2B702"
            },
            {
                "title":jQuery.i18n.map["common.unique-sessions"],
                "total":sessionData.usage["total-users"].total,
                "trend":sessionData.usage["total-users"].trend,
                "help":"sessions.unique-sessions",
                "short" : "u",
                "color" : "#FF7D7D"
            }
        ]

        for (var i = 0; i < big_numbers.length; i++)
        {
            big_numbers[i].active = true;
        }

        return big_numbers;
    },

    componentDidMount : function() {

        var self = this;

        $.when(countlyUser.initialize()).then(function () {

            var headers = self.make_big_numbers();

            var big_numbers = self.make_big_numbers();

            headers.unshift({
                "title" : "Date",
                //"help"  : "sessions.unique-sessions", // todo: add translation
                "short" : "date",
            })

            self.setState({
                inited : true,
                big_numbers : big_numbers,
                headers : headers
            })
        })
    },

    on_graph_mount : function(mount_data) {
        this.setState({
            "granularity" : mount_data.granularity
        });
    },

    componentWillReceiveProps : function(nextProps) {

        var self = this;

        var big_numbers = self.make_big_numbers();

        self.setState({
            big_numbers : big_numbers
        })

    },

    chart_data_function : function(){
        return countlySession.getSessionDP_map(this.state.iso2);
    },

    data_modificator : function(country_data){

        var iso3 = country_data.id;
        var selected_iso2 = false;

        for (var iso2 in iso3_country_codes)
        {

            if (iso3_country_codes[iso2] == iso3)
            {
                selected_iso2 = iso2;
                break;
            }

        }

        var big_numbers_data = countlySession.getSessionDP_map(selected_iso2);

        var data = big_numbers_data.chartDP;

        var new_big_numbers = [];

        for (var i = 0; i < data.length; i++)
        {
            var line = data[i];

            var short = line.short;

            var sum = 0;

            for (var j = 0; j < line.data.length; j++)
            {
                sum += line.data[j][1];
            }

            for (var b = 0; b < this.state.big_numbers.length; b++)
            {
                if (this.state.big_numbers[b].short == short)
                {

                    var big_number = this.state.big_numbers[b];

                    big_number.total = sum;

                    new_big_numbers.push(big_number)

                    break;
                }
            }
        }

        this.setState({
            "iso2" : selected_iso2,
            "big_numbers" : new_big_numbers
        })

    },

    render : function(){

        var self = this;

        if (!this.state.inited)
        {
            return (<Loader/>);
        }

        var elements_width = get_viewport_width();
        var chart_height = 300;

        var map_width = elements_width - 360;      
        var map_height = Math.round(map_width / 3 * 2.2);

        var page_style = {
            "width" : elements_width
        }

        return(
            <div className="page" style={page_style}>

                <Map
                    width={map_width}
                    metric={{id:'total', label:$.i18n.map["sidebar.analytics.sessions"], type:'number', "short":"t", "color" : "#1B8AF3"}}
                    height={map_height}
                    headline_sign="SELECT A COUNTRY"
                    onCountryClick={this.data_modificator}
                />

                <LineChart
                    trend_sign={this.state.iso2}
                    width={elements_width}
                    height={chart_height}
                    sides_padding={20}
                    period={countlyCommon.getPeriod()}
                    big_numbers={this.state.big_numbers}
                    data_function={this.chart_data_function}
                    update_graph_function={countlyCommon.updateTimeGraph}
                    with_granularity={true}
                    mount_callback={this.on_graph_mount}
                    date={this.props.date}
                />

            </div>
        )
    }
})
