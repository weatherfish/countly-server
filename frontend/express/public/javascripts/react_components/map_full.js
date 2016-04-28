var Map = React.createClass({

    previous_data : false,
    loaded : false,
    datamap : false,
    
    cityName : false,
    
    city_popup_left : false,
    arrow_popup_left : false,

    getInitialState : function() {

        var self = this;

        return {
            element_id : "map",
            cityPoints : false,
            date : this.props.date,
            selected_country  : false,
            inited : true //false
        }

    },

    componentDidMount: function() {

        var self = this;
                      
        this.draw();
        
        this.getCitiesData(function(data){  
           
            self.setState({
                city_data : data,
                //inited : true
            }, function(){
                
                if (self.state.selected_country && self.props.metric && !self.state.country_inited)
                {                                                        
                    self.setState({
                        country_inited : true
                    }, function(){ // todo: the element may not exist
                        self.draw_country({
                            height : 450,
                            metric : self.props.metric,
                            countryIso3 : self.state.selected_country
                        });
                    });
                }                 
            });
        });        
    },
    
    componentDidUpdate : function()
    {
        
        var self = this;
        
        if (!this.state.selected_country)
        {
                      
            if (!this.datamap)
            {
                this.draw();
            }
            else
            {
                this.redraw();
            }           
            
        }
        else // country mode
        {
            
            if (!this.state.city_data)
            {
                return false;
            }
            
            if (!self.state.country_inited)
            {                
                this.setState({
                    country_inited : true
                }, function(){
                    self.draw_country({
                        height : 450,
                        metric : self.props.metric,
                        countryIso3 : self.state.selected_country
                    });
                });
            }
        }
    },
    
    componentWillReceiveProps(nextProps){
                
        var self = this;
                
        if (this.state.selected_country && (nextProps.metric.id != this.props.metric.id || nextProps.date != this.state.date))
        {            
            this.setState({
                date : nextProps.date
            }, function(){
                _.defer(function () { // todo: _draw_country uses this.props.metric.color to change a color. this.props.metric.color contain old value now
                    self._draw_country(self.props.metric, self.zoomParams, self.chart_options, self.state.selected_country);  
                });
            });   
        }        
    },

    world_map_popup : function(geography, data) {

        var self = this;
/*
        if (data)
        {*/
        
        if (data)
        {
            var count = data.numberOfThings.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else
        {
            var count = 0;
        }
        
        var html = '<div class="country_hoverinfo" id="country_hoverinfo">';  
        html += "<div class='name'>" + geography.properties.name + "</div>"; 
        html += "<div class='metric'><span class='label'>" + this.props.metric.title.toLowerCase() + "</span><span class='count'>" + count + "</span></div>"; 
        html += "<div class='bottom_arrow'></div>";
        html += '</div>';
            
        // <span class='circle' style='background-color':'" + this.props.metric.color + "'></span>
            
        setTimeout(function(){
            self.draw_tooltip_graph(geography.id);
        }, 0);        

        return html;
    },
    
    draw_tooltip_graph : function(iso3) {

        var self = this;

        var width = 100;
        var height = 30;// document.body.clientHeight;

        //var iso3 = country_data.id;
        var selected_iso2 = false;

        for (var iso2 in iso3_country_codes)
        {

            if (iso3_country_codes[iso2].toLocaleLowerCase() == iso3.toLocaleLowerCase())
            {
                selected_iso2 = iso2/*.toLocaleLowerCase()*/;
                break;
            }
        }
        
        var data = countlySession.getSessionDP_map(selected_iso2);
        
        if (data.chartDP[this.props.metric.id].data.length == 0)
        {
            return false;
        }
                
        var step_size = Math.round(data.chartDP[this.props.metric.id].data.length / 10);
                
        var ready_data = [];
        var cur_y = 0;
        var cur_s = 0;
        
        for (var i = 0; i < data.chartDP[this.props.metric.id].data.length; i++)
        {
            
            cur_y += data.chartDP[this.props.metric.id].data[i][1];
            cur_s++;
            
            if (cur_s == step_size)
            {
                ready_data.push([data.chartDP[this.props.metric.id].data[i][0], cur_y]);
                
                cur_y = 0;
                cur_s = 0;
            }
        }   
        
        if (cur_s > 0) // add last part of data also there
        {
            ready_data.push([data.chartDP[this.props.metric.id].data[data.chartDP[this.props.metric.id].data.length - 1][0], cur_y]);     
        }        
                    
        var metric_data = [];
        
        for (var i = 0; i < ready_data.length; i++)
        {
            metric_data.push({
                "x" : i/*ready_data[i][0]*/,
                "y" : ready_data[i][1],
            })
        }
             
        var max_y = 0;
        
        for (var i = 0; i < metric_data.length; i++)
        {
            if (metric_data[i].y > max_y)
            {
                max_y = metric_data[i].y;
            }            
        }
        
        var test_data = [1];
            
        this.country_tooltip_svg = d3.select("#country_hoverinfo").selectAll(".country_chart").data(test_data)
            .enter()
            .append("svg:svg")
            .attr("class", "country_chart")
            .attr('width', width + "px")
            .attr('height', (height) + "px")               
            //.style("background-color", "#ffffff"/*"#FF6138"*/)  // #FF6138
                
        this.selected_iso2 = selected_iso2;
                   
        var x = d3.scale.linear().range([0, width]).domain([0, (metric_data.length - 1)]);
        var y = d3.scale.linear().range([0, height]).domain([max_y, 0]);

        var line = d3.svg.line()
            .x(function(d) {                
              return x(d.x);
            })
            .y(function(d) { return y(d.y); })
            .interpolate('linear').tension(0.8);  // 'cardinal',                    
                
        var enter_path = this.country_tooltip_svg
            .datum(metric_data)            
                .append("path")          
                .attr("class", "line")
                .attr("d", line)
                .attr("stroke", this.props.metric.color)
                .attr("stroke-width", "2px")
                .attr("fill", "none")
                .style("opacity", 1)

    },
    
    country_return_popup : function(geography, data) {

        var html = '<div class="hoverinfo return">return to world map</div>';

        return html;
    },
    
    city_popup : function(geo, data) {

        var self = this;

        var cityName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        
        if (self.city_popup_left && this.cityName == cityName)
        {
            var left_style = "style='left:" + self.city_popup_left + "px'";
            var arrow_left_style = "style='left:" + self.arrow_popup_left + "px'";
        }
        else
        {
            var left_style = "";
            var arrow_left_style = "";
        }

        var html = "<div class='city_hoverinfo' id='city_hoverinfo' " + left_style + ">";
        html += "<div class='name'>" + cityName + "</div>";        
        html += "<div class='metric'><span class='circle' style='background-color:" + this.props.metric.color + "'></span><span class='label'>" + this.props.metric.title.toLowerCase() + "</span><span class='count'>" + data.metric + "</span></div>";         
        html += "<div class='bottom_arrow' id='city_hoverinfo_arrow' " + arrow_left_style + "></div>";
        html += "</div>";
        
        if (this.cityName != cityName)
        {
            
            self.cityName = cityName;
            
            _.defer(function(){
            
                var width = document.getElementById('city_hoverinfo').offsetWidth;
                
                self.city_popup_left = (-1 * (width / 2));
                
                document.getElementById("city_hoverinfo").style.left = (self.city_popup_left) + "px";
                
                self.arrow_popup_left = ((width / 2) - 7);
                
                document.getElementById("city_hoverinfo_arrow").style.left = (self.arrow_popup_left) + "px";                
                
            });
        }                              

        return html;
    },

    draw : function() {

        var self = this;

        $("#" + this.state.element_id).empty();
        
        var metric = this.props.metric;

        var countryFills = {
            defaultFill : "#ffffff",
            reset : "#ffffff"
        }

        var countryData = this.formatData(metric);
                
        this.previous_data = countryData;

        /*
          create 10 gradations of brightness
        */

        var gradient = this.make_gradient("#198af3", "#c0dffb", 10);

        var j = 0;

        for (var i = 0; i < 1; i+=0.1)
        {
            countryFills[i.toFixed(1).toString()] = "#" + gradient[j];
            j++
        }

        countryFills["1.0"] = "#198af3"; // todo:

        var geography_config = {
            borderWidth: 1,
            borderColor: '#d3d3d3',//'#E6E6E6',
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: "#024873",
            highlightBorderColor: '#aaa',
            highlightBorderWidth: 1,
            popupTemplate : this.world_map_popup,
            hideAntarctica: true,
        }
        /*
        var projection_rotate = d3.geo.mercator()
                                .center([0, 0])       
                                .rotate([-50, 0])*/

        this.datamap = new Datamap({
            element : document.getElementById(this.state.element_id),
            height  : this.props.height,
            width   : this.props.width,
            projection : 'mercator',//'eckert3',
            //setProjection : projection_rotate,           
            fills      : countryFills,
            geographyConfig : geography_config,
            data : countryData
        });

        if (this.props.onCountryClick)
        {
            this.datamap.svg.selectAll('path').on('click', function(elem) {

                self.props.onCountryClick(elem);

            });
        }
        else
        {

            this.datamap.svg.selectAll('path').on('click', function(elem) {

                var countryIso = elem.id;

                self.setState({
                    selected_country : countryIso,
                    country_inited : false
                })
                
                if (self.props.onCountryClickAdditional){
                    self.props.onCountryClickAdditional(countryIso);
                }
                
            });   
        }
    },

    redraw : function () {

        var metric = this.props.metric;

        var countryData = this.formatData(metric);    
        
        for (var iso3 in this.previous_data)
        {
            if (!countryData[iso3] || !countryData[iso3].numberOfThings || countryData[iso3].numberOfThings == 0)
            {
                countryData[iso3] = {
                    "fillKey"        : "reset",
                    "numberOfThings" : 0
                };
            }
        }

        this.previous_data = countryData;

        this.datamap.updateChoropleth(countryData);

        return true;
    },

    draw_country : function(options) {

        var self = this;

        if (options.countryIso3.toLowerCase() != "rus" && options.countryIso3.toLowerCase() != "usa") // no russia in topojson files
        {
            var dataUrl = "/javascripts/visualization/datamaps/tjson/" + options.countryIso3.toLowerCase() + ".tjson";
        }
        else {
            var dataUrl = false;
        }

        var chart_options = {
            borderWidth: 1,
            borderColor: "#575757"/*'#E6E6E6'*/,
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: "#024873",
            highlightBorderColor: '#aaa',
            highlightBorderWidth: 1,
            popupTemplate : this.country_return_popup,
            dataUrl: dataUrl
        }

        if (options) {

            if (options.height) {
                chart_options.height = options.height;

                //preserve the aspect ratio of the chart if height is given
                chart_options.width = (options.height * 556 / 347);
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

                    self.setState({
                        "inited" : true
                    })
                    
                    self.zoomParams = zoomParams;
                    self.chart_options = chart_options;
                    
                    
                    _.defer(function () {
                        self._draw_country(options.metric, zoomParams, chart_options, options.countryIso3);
                    });                                                 
                }
            });
        }
        else
        {
            alert("error ISO3");
            return false;
        }
    },

    _draw_country : function(ob, zoomParams, chart_options, country_iso3) {
        
        var self = this;
        
        if (!zoomParams)
        {            
            return false;
        }

        var element_id = this.state.element_id;

        this.datamap = false;
        $("#" + element_id).empty();

        /*
          create map
        */

        var containerHeigth = this.props.height;

        var mapHeight = containerHeigth - 50;
        var mapWidth  = mapHeight * 1.48;

        var colors = d3.scale.category10();

        var wScale = mapWidth  / (Math.abs(zoomParams.lon_size) / 360) / 2 / Math.PI;
        var hScale = mapHeight / (Math.abs(zoomParams.lat_size) / 360) / 2 / Math.PI;
        var scale = Math.min(wScale, hScale)

        if (scale > 300)
        {
            scale -= 200;
        }

        var map_data = { };

        map_data[zoomParams.iso3] = {
            "fillKey" : "selected"
        }

        if (country_iso3.toLowerCase() != "rus") // no russia in topojson files
        {
            var scope = country_iso3.toLowerCase()
        }
        else {
            var scope = "world";
        }
                
        var projection_function = function(element) {
                    
            var center_lat = parseFloat(zoomParams.lat.toFixed(3));
            var center_lon = parseFloat(zoomParams.lon.toFixed(3));

            var width_projection = (element.offsetHeight / 2) * 1.92;

            var projection = d3.geo.mercator()
                            .center([center_lon, center_lat])                          
                            .scale(scale)                           
                            .translate([mapWidth/2, mapHeight/2]); // You should also only translate the projection by half the width and height of the container, otherwise the center will be in the bottom right corner.

            var path = d3.geo
                        .path()
                        .projection(projection);

            return {
                "path"       : path,
                "projection" : projection
            };
        }               

        if (scope == "usa")
        {
            projection_function = null;
            
            var datamap_lib = Datamap_usa;
        }
        else
        {
            var datamap_lib = Datamap;
        }

        var country_map = new datamap_lib({
            element    : document.getElementById(element_id),
            height     : mapHeight,
            width      : mapWidth,
            setProjection : projection_function,
            fills: {
                "defaultFill" : "#fff",                 
                "bubble"      : self.props.metric.color,
            },
            geographyConfig : chart_options,   
            data : map_data,
            scope : scope,
        });

        var bubbles_config = { 
                    popupTemplate : this.city_popup,
                    highlightFillColor: '#00C652',
                    highlightBorderColor: '#141821',
                    highlightBorderWidth: 2,
                    highlightBorderOpacity: 1,
                    highlightFillOpacity: 0.85,
                    exitDelay: 100, 
                    }

        var city_points = this.formatCountryData(this.props.metric);

        country_map.bubbles(city_points, bubbles_config);

        var bind_events = function()
        {
            if (country_map.svg.selectAll('path')[0].length > 1)
            {
                country_map.svg.selectAll('path').on('click', function(elem) {

                    self.setState({
                        selected_country : false
                    });
                    
                    if (self.props.onCountryClickAdditional){
                        self.props.onCountryClickAdditional(false);
                    }

                    return true;
                });
            }
            else
            {
                setTimeout(function(){
                    bind_events();
                }, 100);
            }
        }

        bind_events();

        country_map.graticule();

    },

    formatData : function (data_metric){

        var chartData = {cols:[], rows:[]};

        var locations_db = countlyUser.getDbObj();
                
        if (!locations_db.meta){
            return {};
        }
        
        var countries = locations_db['meta']['countries'];// countlyCommon.union({}, locations_db['meta']['countries']);

        var tt = countlyCommon.extractTwoLevelData(locations_db, countries, countlyLocation.clearLocationObject, [
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
        //chartData.cols.push(ob);

        var maxMetric = 0;

        chartData.rows = _.map(tt.chartData, function (value, key, list) {

            if (value.country == "European Union" || value.country == "Unknown" || value.code == "Unknown") {
                return {
                    /* todo */
                };
            }

            if (value[data_metric.short] > maxMetric)
            {
                maxMetric = value[data_metric.short];
            }

            return {
                code    : value.code,
                country : value.country,
                metric  : value[data_metric.short]
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
            countryData[country] = {
                "fillKey"        : 'increase',
                "numberOfThings" : metric
            }    
            countryData[country] = {
                "fillKey"        : 'decrease',
                "numberOfThings" : metric
            }*/
 
            countryData[country] = {
                "fillKey"        : linearMetric,
                "numberOfThings" : metric
            }
  
        }

        return countryData;
    },
    
    getCitiesData : function(__callback){
        
        var self = this;
        
        var period = countlyCommon.getPeriodForAjax();

        //_activeAppKey = countlyCommon.ACTIVE_APP_KEY;
        //_initialized = true;

        return $.ajax({
            type:"GET",
            url:countlyCommon.API_PARTS.data.r,
            data:{
                "api_key" : countlyGlobal.member.api_key,
                "app_id"  : countlyCommon.ACTIVE_APP_ID,
                "method"  : "cities",
                "period"  : period
            },
            dataType:"jsonp",
            success:function (json) {
                                
                var locations_db = json;
                //setMeta();
                                
                self.citiesData = locations_db.citiesData;
                
                if (self.props.onCitiesData)
                {
                    self.props.onCitiesData(self.citiesData);
                }

                if (locations_db['meta']) {
                   var cities = (locations_db['meta']['cities']) ? locations_db['meta']['cities'] : [];
                } else {
                   var cities = [];
                }
                
                var city_data = countlyCommon.extractTwoLevelData(locations_db,cities, countlyCity.clearLocationObject, [
                    {
                        "name":"city",
                        "func":function (rangeArr, dataObj) {
                            return rangeArr;
                        }
                    },
                    { "name":"t" },
                    { "name":"u" },
                    { "name":"n" }
                ]);
                               
                __callback(city_data);
                
            }});
    },

    formatCountryData : function(ob){
        
        var self = this;
        
        var selected_iso2 = false;

        for (var iso2 in iso3_country_codes)
        {
            if (iso3_country_codes[iso2].toLowerCase() == self.state.selected_country.toLowerCase())
            {
                selected_iso2 = iso2.toLowerCase();
                break;
            }
        }
              
        ob = ob || {id:'total', label:$.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        chartData.cols = [
            {id:'city', label:"City", type:'string'}
        ];
        chartData.cols.push(ob);

        var maxMetric = 0;

        chartData.rows = _.map(this.state.city_data.chartData, function (value, key, list) {
            if (value.city == "Unknown") {
                return {};
            }
            
            if (!value[ob.short])
            {
                return false;
            }                        
                    
            if (value[ob.short] > maxMetric)
            {
                maxMetric = value[ob.short];
            }
                        
            return {
                city   : value.city,
                metric : value[ob.short]
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
            var coordsData = self.citiesData[cityName];
            
            if (!coordsData)
            {
                return false;
            }
         
            if (selected_iso2 != coordsData.country.toLowerCase())
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

    },
    
    render : function(){

        if (this.state.selected_country && !this.state.country_inited)
        {
            return (<Loader/>);
        }

        var map_style = {};
        
        if (this.state.selected_country)
        {
            map_style.top = 40;
        }

        return (
            <div className="map_wrapper">

                {(() => {

                    if (this.props.headline_sign){
                        return(<div className="headline_sign">{this.props.headline_sign}</div>)
                    }

                })()}

                <div id="map" style={map_style}>

                </div>
            </div>
        )
        
        /*
        <div className="search_block">
                    <div className="icon"></div>
                    <input type="search" placeholder="Search for Country"/>
                </div>
        */
        
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
})
