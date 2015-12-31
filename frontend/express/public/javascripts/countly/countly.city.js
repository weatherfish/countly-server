(function (countlyCity, $, undefined) {


    // Private Properties
    var _periodObj = {},
        _locationsDb = {},
        _activeAppKey = 0,
        _cities = [],
        _chart,
        _dataTable,
        _chartElementContainer = ".widget-content",
        _chartElementId = "geo-chart",
        _chartOptions = {
            borderWidth: 1,
            borderColor: '#bbb',
            popupOnHover: true, //disable the popup while hovering
            highlightOnHover: true,
            highlightFillColor: '#ddd',
            highlightBorderColor: '#444',
            highlightBorderWidth: 2
        },
        _defaultFill = "#ddd", // "#E6EFF2",
        _bubblesFill = "#024873",
        _datamap     = false,
        _countryMap  = {},
        _initialized = false,
        _period = null;

    if (countlyCommon.CITY_DATA === false) {
        countlyCity.initialize = function() { return true; };
        countlyCity.refresh = function() { return true; };
        countlyCity.drawGeoChart = function() { return true; };
        countlyCity.refreshGeoChart = function() { return true; };
        countlyCity.getLocationData = function() { return []; };
    } else {
        // Public Methods
        countlyCity.initialize = function () {

            if (_initialized && _period == countlyCommon.getPeriodForAjax() && _activeAppKey == countlyCommon.ACTIVE_APP_KEY) {
                return countlyCity.refresh();
            }

            _period = countlyCommon.getPeriodForAjax();

            if (!countlyCommon.DEBUG) {
                _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                _initialized = true;

                return $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.data.r,
                    data:{
                        "api_key":countlyGlobal.member.api_key,
                        "app_id":countlyCommon.ACTIVE_APP_ID,
                        "method":"cities",
                        "period":_period
                    },
                    dataType:"jsonp",
                    success:function (json) {
                        _locationsDb = json;
                        setMeta();
                    }
                });
            } else {
                _locationsDb = {"2012":{}};
                return true;
            }
        };

        countlyCity.refresh = function () {

            _periodObj = countlyCommon.periodObj;

            if (!countlyCommon.DEBUG) {

                if (_activeAppKey != countlyCommon.ACTIVE_APP_KEY) {
                    _activeAppKey = countlyCommon.ACTIVE_APP_KEY;
                    return countlyCity.initialize();
                }

                return $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.data.r,
                    data:{
                        "api_key":countlyGlobal.member.api_key,
                        "app_id":countlyCommon.ACTIVE_APP_ID,
                        "method":"cities",
                        "action":"refresh"
                    },
                    dataType:"jsonp",
                    success:function (json) {
                        countlyCommon.extendDbObj(_locationsDb, json);
                        setMeta();
                    }
                });
            } else {
                _locationsDb = {"2012":{}};
                return true;
            }
        };

        countlyCity.reset = function () {
            _locationsDb = {};
            setMeta();
        };

        countlyCity.drawGeoChart = function (options) {

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

            if (options.countryIso3)
            {
                return $.ajax({
                    type:"GET",
                    url:countlyCommon.API_PARTS.data.r,
                    data:{
                        "api_key" : countlyGlobal.member.api_key,
                        "app_id"  : countlyCommon.ACTIVE_APP_ID,
                        "method"  : "country_latlon",
                        "iso3"    : options.countryIso3
                    },
                    dataType:"jsonp",
                    success:function (json) {

                        /*
                            Get country size for calculate scale
                        */

                        console.log("country data 00000000000:");
                        console.log(json);


                        var lat_size = json.location_box.max_lat - json.location_box.min_lat;
                        var lon_size = json.location_box.max_lon - json.location_box.min_lon;

                        if (lat_size > lon_size)
                        {
                            var max_latlon_size = lat_size;
                        }
                        else
                        {
                            var max_latlon_size = lon_size;
                        }

                        var zoomParams = {
                            "iso3" : json.iso3,
                            "lat"  : json.lat,
                            "lon"  : json.lon,
                            "size" : parseInt(json.size),
                            "lat_size" : lat_size,
                            "lon_size" : lon_size,
                            "max_latlon_size" : max_latlon_size,
                            "location_box"    : json.location_box
                        }

                        draw(options.metric, zoomParams);

                    }
                });
            }
            else
            {
                console.log("error");
                return false;
            }
        };

        countlyCity.refreshGeoChart = function (metric) {
            if (google.visualization) {
                reDraw(metric);
            } else {
                google.load('visualization', '1', {'packages':['geochart'], callback:draw});
            }
        };

        countlyCity.getLocationData = function (options) {

            var locationData = countlyCommon.extractTwoLevelData(_locationsDb, _cities, countlyCity.clearLocationObject, [
                {
                    "name":"city",
                    "func":function (rangeArr, dataObj) {
                        if(rangeArr == "Unknown")
                            return jQuery.i18n.map["common.unknown"];
                        return rangeArr;
                    }
                },
                { "name":"t" },
                { "name":"u" },
                { "name":"n" }
            ]);

            if (options && options.maxCountries && locationData.chartData) {
                if (locationData.chartData.length > options.maxCountries) {
                    locationData.chartData = locationData.chartData.splice(0, options.maxCountries);
                }
            }

            return locationData.chartData;
        };
    }

    countlyCity.clearLocationObject = function (obj) {
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

    //Private Methods

    _chartOptions.popupTemplate = function(geography, data) {

        var string = '<div class="hoverinfo"><strong>return to world map</strong></div>';

        return string;
    }

    function popupTemplate(geo, data) {

        var cityName = data.name.charAt(0).toUpperCase() + data.name.slice(1);

        var html = "<div class='hoverinfo'>";
        html += "<div><b>city: " + cityName + "</b></div>";
        html += "<div>metric: " + data.metric + "</div>lat:" + data.latitude + ", long:" + data.longitude;
        html += "</div>";

        return html;
    }

    function formatData(ob){

        ob = ob || {id:'total', label:$.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        var tt = countlyCommon.extractTwoLevelData(_locationsDb, _cities, countlyCity.clearLocationObject, [
            {
                "name":"city",
                "func":function (rangeArr, dataObj) {
                    if(rangeArr == "Unknown")
                        return jQuery.i18n.map["common.unknown"];
                    return rangeArr;
                }
            },
            { "name":"t" },
            { "name":"u" },
            { "name":"n" }
        ]);

        chartData.cols = [
            {id:'city', label:"City", type:'string'}
        ];
        chartData.cols.push(ob);

        var maxMetric = 0;

        chartData.rows = _.map(tt.chartData, function (value, key, list) {

            if (value.city == jQuery.i18n.map["common.unknown"]) {
                return {c:[
                    {v:""},
                    {v:value[ob.metric]}
                ]};
            }

            return {
                city   : value.city,
                metric : value[ob.metric]
            };
        });

        var linear = d3.scale.linear()
            .domain([0, maxMetric])
            .range([5, 20]);

        var cityPoints = [];

        chartData.rows.forEach(function(cityChartData){

            if (!cityChartData.city)
            {
                return false;
            }

            var cityName   = cityChartData.city.toLowerCase();
            var coordsData = _locationsDb.citiesData[cityName];

            if (!coordsData)
            {
                return false;
            }

            var linearMetric = parseInt(linear(cityChartData.metric));

            if (!coordsData.lat || !coordsData.lon)
            {
                return false;
            }

            cityPoints.push({
                name      : cityName,
                metric    : cityChartData.metric,
                radius    : linearMetric,
                fillKey   : 'bubble',
                latitude  : parseFloat(coordsData.lat),
                longitude : parseFloat(coordsData.lon)
            });
        });

        return cityPoints;

    };

    function draw(ob, zoomParams) {

        if (!zoomParams/* || !zoomParams.size*/)
        {
            /* todo */
            countlyLocation.drawGeoChart(false);
            store.set("countly_location_city", false);
            return false;
        }

        $("#" + _chartElementId).empty();

        var cityPoints = formatData(ob);

        /*
          create map
        */

        var containerHeigth = d3.select(_chartElementContainer).node().getBoundingClientRect().height;
        var containerWidth  = d3.select(_chartElementContainer).node().getBoundingClientRect().width;

        var mapHeight = containerHeigth - 50;
        var mapWidth  = mapHeight * 1.48;

        $("#" + _chartElementId).css("margin-left", containerWidth/2 * -1); // center the map element
        $("#" + _chartElementId).css("margin-top", 10);

        var colors = d3.scale.category10();

        //var scale = 1000 - (zoomParams.size * 0.00005);
        //var scale = parseInt(600 - zoomParams.max_latlon_size);
        //scale = 310;

        var wScale = mapWidth  / (Math.abs(zoomParams.lon_size) / 360) / 2 / Math.PI;
        var hScale = mapHeight / (Math.abs(zoomParams.lat_size) / 360) / 2 / Math.PI;
        var scale = Math.min(wScale, hScale)

        //scale = 400;

        console.log("zoomParams.max_latlon_size:", zoomParams.max_latlon_size);
        console.log("country scale:", scale);
        console.log("zoom params:");
        console.log(zoomParams);

        if (scale > 300)
        {
            scale -= 200;
        }

        var map_data = { };

        map_data[zoomParams.iso3] = {
            "fillKey" : "selected"
        }

        _datamap = new Datamap({
            element    : document.getElementById(_chartElementId),
            height     : mapHeight,
            width      : mapWidth,
            setProjection: function(element) {

                var center_lat = parseFloat(zoomParams.lat.toFixed(3));
                var center_lon = parseFloat(zoomParams.lon.toFixed(3));

                /* override */
                //center_lat = 51.5;
                //center_lon = 0;
                //scale      = 600;

                var width_projection = (element.offsetHeight / 2) * 1.92;

                console.log("translate:", element.offsetWidth / 2, " -- ", element.offsetHeight / 2);
                console.log("center_lon:", center_lon);
                console.log("center_lat:", center_lat);

                //center_lon += 34;

                var projection = d3.geo.mercator()
                        .center([center_lon, center_lat])
                        //.rotate([-32, 0])
                        .scale(scale)
                        //.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
                        .translate([mapWidth/2, mapHeight/2]); // You should also only translate the projection by half the width and height of the container, otherwise the center will be in the bottom right corner.

                var path = d3.geo
                            .path()
                            .projection(projection);

                return {
                          "path"       : path,
                          "projection" : projection
                       };
            },
            fills: {
                "defaultFill" : "#fff", //_defaultFill,
                "selected"    : _defaultFill,
                "bubble"      : _bubblesFill,
            },
            geographyConfig: _chartOptions,
            data : map_data
        });

        _datamap.bubbles(cityPoints, { "popupTemplate" : popupTemplate });

        _datamap.svg.selectAll('path').on('click', function(elem) {
            countlyLocation.drawGeoChart(false);
            store.set("countly_location_city", false);
            return true;
        });

        _datamap.graticule();
/*
        _datamap.arc([
                {
                    origin: {
                      latitude: zoomParams.location_box.max_lat,
                      longitude: zoomParams.location_box.min_lon,
                    },
                    destination: {
                      latitude: zoomParams.location_box.max_lat,
                      longitude: zoomParams.location_box.max_lon,
                    },
                    "options": {"strokeWidth": 2, "strokeColor": "rgba(255,0,255,0.33)"}
                }
                ,
                {
                  origin: {
                      latitude: zoomParams.location_box.max_lat,
                      longitude: zoomParams.location_box.min_lon,
                    },
                    destination: {
                      latitude: zoomParams.location_box.min_lat,
                      longitude: zoomParams.location_box.min_lon,
                    },
                    "options": {"strokeWidth": 3, "strokeColor": "rgba(255,255,0,0.33)"}
                }
                ,
                {
                  origin: {
                      latitude: zoomParams.location_box.min_lat,
                      longitude: zoomParams.location_box.min_lon,
                    },
                    destination: {
                      latitude: zoomParams.location_box.min_lat,
                      longitude: zoomParams.location_box.max_lon,
                    },
                    "options": {"strokeWidth": 2, "strokeColor": "rgba(0,0,255,0.33)"}
                }
                ,
                {
                    origin: {
                      latitude: zoomParams.location_box.max_lat,
                      longitude: zoomParams.location_box.max_lon,
                    },
                    destination: {
                      latitude: zoomParams.location_box.min_lat,
                      longitude: zoomParams.location_box.max_lon,
                    },
                    "options": {"strokeWidth": 2, "strokeColor": "rgba(0,255,0,0.33)"}

              }], {
              greatArc: true,
              animationSpeed: 2000
        });*/

        return true;
    }

    function reDraw(ob) {

        var cityPoints = formatData(ob);

        _datamap.bubbles(cityPoints, { "popupTemplate" : popupTemplate });

        return true;
    }

    function setMeta() {
        if (_locationsDb['meta']) {
            _cities = (_locationsDb['meta']['cities']) ? _locationsDb['meta']['cities'] : [];
        } else {
            _cities = [];
        }
    }

}(window.countlyCity = window.countlyCity || {}, $));
