var DashboardMap = React.createClass({

    datamap : false,

    previous_data : false,

    getInitialState : function() {

        return {
            "active_top_tab" : 0
        }

    },

    componentDidMount : function()
    {
        this.draw(this.props.metric);
    },

    componentWillReceiveProps: function(nextProps) 
    {
        this.redraw(nextProps.metric); 
    },
        
    componentDidUpdate : function()
    {
        this.redraw(this.props.metric);
    },

    popupTemplate : function(geography, data) {

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
        
        console.log(data);
        
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
              
        //var metric_data = data.chartDP[0].data;
        
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
    
    draw : function(metric) {

        //var ob = { id: "total", label: "Sessions", type: "number", metric: "t" };

        var countryFills = {
            defaultFill : "#ffffff",
            reset : "#ffffff"
        }

        /*
          create 10 gradations of brightness
        */

        var gradient = this.make_gradient("#198af3", "#c0dffb", 10);

        var j = 0;

        for (var i = 0; i < 1; i+=0.1)
        {
            //countryFills[i.toFixed(1).toString()] = this.colorLuminance(countryFills["0.0"], i * (-1)); // .toFixed(1) because Javascript have some problem with float: http://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript
            countryFills[i.toFixed(1).toString()] = "#" + gradient[j];
            j++
        }

        countryFills["1.0"] = "#198af3"; // todo:

        var geographyConfig = {
            borderWidth: 1,
            borderColor: '#eeeeee',
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: "#024873",
            highlightBorderColor: '#aaa',
            highlightBorderWidth: 1,
            popupTemplate : this.popupTemplate
        }

        var countryData = this.formatData(metric);
        
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

    redraw : function (metric) {

        if (!this.datamap)
        {
            console.log("!this.datamap");
            //return false;
        }

        var countryData = this.formatData(metric);

        for (var iso3 in this.previous_data)
        {
            if (!countryData[iso3])
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

    formatData : function (ob){

        ob = ob || {id:'total', label:$.i18n.map["sidebar.analytics.sessions"], type:'number', metric:"t"};
        var chartData = {cols:[], rows:[]};

        var _locationsDb = countlyUser.getDbObj();
        
        if (!_locationsDb['meta'])
        {
            return false;
        }
        
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

/*              countryData[country] = {
                    "fillKey"        : 'increase',
                    "numberOfThings" : metric
            
                countryData[country] = {
                    "fillKey"        : 'decrease',
                    "numberOfThings" : metric
                }
            */
            countryData[country] = {
                "fillKey"        : linearMetric,
                "numberOfThings" : metric
            }
        }

        return countryData;
    },
    
    render : function(){

        return (
            <div id="map">
            </div>
        )

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
