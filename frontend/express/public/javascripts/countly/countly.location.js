(function (countlyLocation, $, undefined) {

    // Private Properties
    var _periodObj = {},
        _locationsDb = {},
        _countries = [],
        _chart,
        _dataTable,
        _chartElementContainer = ".widget-content",
        _chartElementId = "geo-chart",
        _activeContainer = false,
        _chartOptions = {
            borderWidth: 1,
            borderColor: '#888',
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: "#024873",
            highlightBorderColor: '#aaa',
            highlightBorderWidth: 1
        },
        _defaultFill = "#fff", // fill for countries with empty metrics
        _basicFill   = "#E6EFF2", // basic fill for countries with non empty metrics
        _datamap     = false,
        _countryMap  = {},
        _countryData_previous = false;

    // Load local country names
    $.get('localization/countries/' + countlyCommon.BROWSER_LANG_SHORT + '/country.json', function (data) {
        _countryMap = data;
    });

    // Public Methods
    countlyLocation.initialize = function () {
        _locationsDb = countlyUser.getDbObj();
        setMeta();
    };

    countlyLocation.refresh = function (newJSON) {
        countlyCommon.extendDbObj(_locationsDb, newJSON);
        extendMeta();
    };

    countlyLocation.reset = function () {
        _locationsDb = {};
        setMeta();
    };

    countlyLocation.drawGeoChart = function (options) {

        _periodObj = countlyCommon.periodObj;

        if (options) {
            if (options.chartElementId) {
                _chartElementId = options.chartElementId;
            }

            if (options.height) {
                _chartOptions.height = options.height;

                //preserve the aspect ratio of the chart if height is given
                _chartOptions.width = (options.height * 556 / 347);
            }
        }

        draw(options.metric);
    };

    countlyLocation.refreshGeoChart = function (metric) {
        reDraw(metric);
    };

    countlyLocation.getLocationData = function (options) {

        var locationData = countlyCommon.extractTwoLevelData(_locationsDb, _countries, countlyLocation.clearLocationObject, [
            {
                "name":"country",
                "func":function (rangeArr, dataObj) {
                    return countlyLocation.getCountryName(rangeArr);
                }
            },
            {
                "name":"code",
                "func":function (rangeArr, dataObj) {
                    return rangeArr.toLowerCase();
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);
        locationData.chartData = countlyCommon.mergeMetricsByName(locationData.chartData, "country");
        locationData.chartData = _.sortBy(locationData.chartData, function(obj) { return -obj.t; });

        if (options && options.maxCountries && locationData.chartData) {
            if (locationData.chartData.length > options.maxCountries) {
                locationData.chartData = locationData.chartData.splice(0, options.maxCountries);
            }
        }

        for (var i = 0; i < locationData.chartData.length; i++) {
            locationData.chartData[i]['country_flag'] =
                "<div class='flag' style='background-image:url("+countlyGlobal["path"]+"/images/flags/" + locationData.chartData[i]['code'] + ".png);'></div>" +
                locationData.chartData[i]['country'];
        }

        return locationData.chartData;
    };

    countlyLocation.clearLocationObject = function (obj) {
        if (obj) {
            if (!obj["t"]) obj["t"] = 0;
            if (!obj["n"]) obj["n"] = 0;
            if (!obj["u"]) obj["u"] = 0;
        }
        else {
            obj = {"t":0, "n":0, "u":0};
        }

        return obj;
    };

    countlyLocation.getCountryName = function (cc) {

        var countryName = _countryMap[cc.toUpperCase()];

        if (countryName) {
            return countryName;
        } else {
            return jQuery.i18n.map["common.unknown"] || "Unknown";
        }
    };

    countlyLocation.getCountryCode = function (cc) {

        if (iso3_country_codes[cc]){
            return iso3_country_codes[cc];
        }
        else
        {
            return "Unknown";
        }
    };

    countlyLocation.changeLanguage = function () {
        // Load local country names
        return $.get('localization/countries/' + countlyCommon.BROWSER_LANG_SHORT + '/country.json', function (data) {
            _countryMap = data;
        });
    };

    _chartOptions.popupTemplate = function(geography, data) {

        if (data)
        {
            var string = '<div class="hoverinfo"><strong>' + geography.properties.name + " : " + data.numberOfThings + '</strong></div>';
        }
        else
        {
            var string = '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
        }

        return string;
    }

    //Private Methods

    /*
       finds the element in which is loaded the map and returns the size
    */
    function getContainerSize()
    {

        if ($(".map-list")[0])
        {
            var containerHeigth = d3.select(".map-list").node().getBoundingClientRect().height;
            var containerWidth  = d3.select(".map-list").node().getBoundingClientRect().width;
            _activeContainer = ".map-list";
        }
        else
        {
            var containerHeigth = d3.select(_chartElementContainer).node().getBoundingClientRect().height;
            var containerWidth  = d3.select(_chartElementContainer).node().getBoundingClientRect().width;
            _activeContainer = _chartElementContainer;
        }

        var container_size = {
            "width"  : containerWidth,
            "heigth" : containerHeigth
        }

        return container_size;
    }

    function formatData(ob){

        ob = ob || {id:'total', label:$.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

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

            if (value.country == "European Union" || value.country == jQuery.i18n.map["common.unknown"]) {
                return {c:[
                    {v:""},
                    {v:value[ob.metric]}
                ]};
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
            {
                countryData[country] = {
                    "fillKey"        : linearMetric,
                    "numberOfThings" : metric
                }
            }
        }

        return countryData;
    }

    function draw(ob) {

        $("#" + _chartElementId).empty();

        var countryData = formatData(ob);

        var countryFills = {
            defaultFill : _defaultFill,
            increase    : 'url(#increase)',
            decrease    : 'url(#decrease)'
        }

        /*
          create 10 gradations of brightness
        */

        countryFills["0.0"] = "#ffffff";

        for (var i = 0.1; i < 1; i+=0.1)
        {
            countryFills[i.toFixed(1).toString()] = colorLuminance(_basicFill, i * (-1)); // .toFixed(1) because Javascript have some problem with float: http://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
        }

        /*
          create map
        */

        var containerSize = getContainerSize();

        var mapHeight = containerSize.heigth - 50;
        var mapWidth  = mapHeight * 1.48;

        $("#" + _chartElementId).css("margin-left", containerSize.width/2 * -1); // center the map element
        $("#" + _chartElementId).css("margin-top", 10);

        _countryData_previous = countryData;

        _datamap = new Datamap({
            element    : document.getElementById(_chartElementId),
            height     : mapHeight,
            width      : mapWidth,
            projection : 'mercator',
            fills      : countryFills,
            geographyConfig: _chartOptions,
            data       : countryData
        });
/*
        _datamap
            .svg.call(d3.behavior.zoom()
                .scale(0.1)
                .scaleExtent([0, 0.5])
                .on("zoom", redraw));


        function redraw() {

            console.log("==== translate ====");
            console.log(d3.event.translate);
            console.log("==== scale ====");
            console.log(d3.event.scale);

            _datamap.svg
                .transition()
                .duration(1000)
                //.style("stroke-width", 1.5 / d3.event.scale + "px")
                .attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }
*/
        _datamap.svg.selectAll('path').on('click', function(elem) {

/*
            var scale     = 4;
            //var translate = [-400, -500];

            var translate = [-600, -600];

            _datamap.svg.selectAll("g")
                .transition()
                .duration(5000)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
*/

            if (_activeContainer != _chartElementContainer)
            {
                return false;
            }

            var countryIso = elem.id;

            countlyCity.drawGeoChart({
                height        : 450,
                "countryIso3" : countryIso
            });

            store.set("countly_location_city", true);

        });

        return true;
    }

    function reDraw(ob) {

        if (!_datamap)
        {
            /* todo */
            return false;
        }

        var countryData = formatData(ob);

        for (var iso3 in _countryData_previous)
        {
            if (!countryData[iso3])
            {
                countryData[iso3] = {
                    "fillKey"        : "0.0",
                    "numberOfThings" : 0
                };
            }
        }

        _countryData_previous = countryData;

        _datamap.updateChoropleth(countryData);

        return true;
    }

    function setMeta() {
        if (_locationsDb['meta']) {
            _countries = (_locationsDb['meta']['countries']) ? _locationsDb['meta']['countries'] : [];
        } else {
            _countries = [];
        }
    }

    function extendMeta() {
        if (_locationsDb['meta']) {
            _countries = countlyCommon.union(_countries, _locationsDb['meta']['countries']);
        }
    }

    function colorLuminance(hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');

    	  if (hex.length < 6) {
    		    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    	  }

      	lum = lum || 0;

      	// convert to decimal and change luminosity
      	var rgb = "#", c, i;
      	for (i = 0; i < 3; i++) {
      		  c = parseInt(hex.substr(i*2,2), 16);
      		  c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      		  rgb += ("00"+c).substr(c.length);
      	}

      	return rgb;
    }

}(window.countlyLocation = window.countlyLocation || {}, $));
