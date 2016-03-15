var DashboardMap = React.createClass({

    datamap : false,

    getInitialState : function() {

        return {
            "active_top_tab" : 0
        }

    },

    previous_data : false,

    popupTemplate : function(geography, data) {

        if (data)
        {
            var string = '<div class="hoverinfo"><strong>' + geography.properties.name + " : " + data.numberOfThings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); + '</strong></div>';
        }
        else
        {
            var string = '<div class="hoverinfo"><strong>' + geography.properties.name + ' : 0</strong></div>';
        }

        return string;
    },

    draw : function() {

        var ob = { id: "total", label: "Sessions", type: "number", metric: "t" };

        var countryFills = {
            defaultFill : "#ffffff"
        }

        /*
          create 10 gradations of brightness
        */

        //countryFills["0.0"] = "#c0dffb";

        //var gradient = this.make_gradient("#c0dffb", "#198AF3", 10);

        var gradient = this.make_gradient("#198af3", "#c0dffb", 10);

        var j = 0;

        for (var i = 0/* 0.1*/; i < 1; i+=0.1)
        {
            //countryFills[i.toFixed(1).toString()] = this.colorLuminance(countryFills["0.0"], i * (-1)); // .toFixed(1) because Javascript have some problem with float: http://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
            countryFills[i.toFixed(1).toString()] = "#" + gradient[j];
            j++
        }

        countryFills["1.0"] = "#198af3"; // todo:

        var geographyConfig = {
            borderWidth: 1,
            borderColor: '#E6E6E6',
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: "#024873",
            highlightBorderColor: '#aaa',
            highlightBorderWidth: 1,
            popupTemplate : this.popupTemplate
        }

        var countryData = this.formatData(ob);

        this.previous_data = countryData;

        this.datamap = new Datamap({
            element    : document.getElementById("map"),
            height     : this.props.height,
            width      : this.props.width,
            projection : 'mercator',
            fills      : countryFills,
            geographyConfig: geographyConfig,
            data       : countryData
        });

    },

    redraw : function (ob) {

        var countryData = this.formatData(ob);

        for (var iso3 in this.previous_data)
        {
            if (!countryData[iso3])
            {
                countryData[iso3] = {
                    "fillKey"        : "0.0",
                    "numberOfThings" : 0
                };
            }
        }

        this.previous_data = countryData;

        this.datamap.updateChoropleth(countryData);

        return true;
    },

    formatData : function (ob){

        ob = ob || {id:'total', label:$.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        var _locationsDb = countlyUser.getDbObj();
        var _countries = _locationsDb['meta']['countries'];// countlyCommon.union({}, _locationsDb['meta']['countries']);

        var tt = countlyCommon.extractTwoLevelData(_locationsDb, _countries, countlyLocation.clearLocationObject, [
            {
                "name":"country",
                "func":function (rangeArr, dataObj) {
                    return countlyLocation.getCountryName(rangeArr);
                }
            },
            {
                "name":"code",
                "func":function (rangeArr, dataObj) {
                    return countlyLocation.getCountryCode(rangeArr);
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        chartData.cols = [
            {id:'country', label:$.i18n.map["countries.table.country"], type:'string'}
        ];
        chartData.cols.push(ob);

        var maxMetric = 0;

        chartData.rows = _.map(tt.chartData, function (value, key, list) {

            if (value.country == "European Union" || value.country == "Unknown" || value.code == "Unknown") {
                return {
                    /* todo */
                };
            }

            if (value[ob.metric] > maxMetric)
            {
                maxMetric = value[ob.metric];
            }

            return {
                code    : value.code,
                country : value.country,
                metric  : value[ob.metric]
            };
        });

        var linear = d3.scale.linear()
          .domain([0, maxMetric])
          .range([0.1, 1]);

        var countryData = { };

        for (var i = 0; i < chartData.rows.length; i++)
        {
            var country = chartData.rows[i]["code"];
            var metric  = chartData.rows[i]["metric"];
            var linearMetric = (linear(metric) * 0.6).toFixed(1).toString();

/*
            if (country == "CHN")
            {
                countryData[country] = {
                    "fillKey"        : 'increase',
                    "numberOfThings" : metric
                }
            }
            else if (country == "AUS")
            {
                countryData[country] = {
                    "fillKey"        : 'decrease',
                    "numberOfThings" : metric
                }
            }
            else
            {*/
                countryData[country] = {
                    "fillKey"        : linearMetric,
                    "numberOfThings" : metric
                }
            /*}*/
        }

        return countryData;
    },

    make_gradient : function(start_color, end_color, colors_count)
    {
        function hex (c) {
            var s = "0123456789abcdef";
            var i = parseInt (c);
            if (i == 0 || isNaN (c))
              return "00";
            i = Math.round (Math.min (Math.max (0, i), 255));
            return s.charAt ((i - i % 16) / 16) + s.charAt (i % 16);
        }

        /* Convert an RGB triplet to a hex string */
        function convertToHex (rgb) {
            return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
        }

        /* Remove '#' in color hex string */
        function trim (s) { return (s.charAt(0) == '#') ? s.substring(1, 7) : s }

        /* Convert a hex string to an RGB triplet */
        function convertToRGB (hex) {
            var color = [];
            color[0] = parseInt ((trim(hex)).substring (0, 2), 16);
            color[1] = parseInt ((trim(hex)).substring (2, 4), 16);
            color[2] = parseInt ((trim(hex)).substring (4, 6), 16);
            return color;
        }

        function generateColor(colorStart,colorEnd,colorCount){

            // The beginning of your gradient
            var start = convertToRGB (colorStart);

            // The end of your gradient
            var end   = convertToRGB (colorEnd);

            // The number of colors to compute
            var len = colorCount;

            //Alpha blending amount
            var alpha = 0.0;

            var saida = [];

            for (i = 0; i < len; i++) {
              var c = [];
              alpha += (1.0/len);

              c[0] = start[0] * alpha + (1 - alpha) * end[0];
              c[1] = start[1] * alpha + (1 - alpha) * end[1];
              c[2] = start[2] * alpha + (1 - alpha) * end[2];

              saida.push(convertToHex (c));

            }

            return saida;

        }

        var tmp = generateColor(start_color, end_color, colors_count);

        return tmp;

    },

    render : function(){

        return (
            <div id="map">
            </div>
        )

    },

    componentDidMount : function()
    {
        this.draw();
    },

    componentDidUpdate : function()
    {
        this.redraw();
    }

})
