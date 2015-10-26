var monlog = { log: { debug: function(message) { }, info: function(message) { }, warn: function(message) { }, error: function(message) { } }};

var Mongolian = require('mongolian');
var async = require("async");
var Shp   = require('shp');

var server = new Mongolian(monlog);

var mongo_db = server.db("countly");



var data_file  = './geo_data/TM_WORLD_BORDERS-0.3';
var table_name = 'countries_geo_data';
var threads    = 2;

var countries_data = mongo_db.collection(table_name);

// todo: countries_data.ensureIndex( { iso2: 1 } )

var insert_queue = async.queue(function (country, callback) {

    countries_data.insert(country, function(error, result){

        if (error)
        {
            // todo: error
        }

        callback();
    });

}, threads);

insert_queue.drain = function() {
    console.log('all country have been inserted');
    process.exit(1);
}

Shp.readFile(data_file, function(error, data){

    for (var cn = 0; cn < data.features.length; cn++)
    {

        var country_data = {
            "name" : data.features[cn].properties.NAME.toLowerCase(),
            "iso2" : data.features[cn].properties.ISO2,
            "iso3" : data.features[cn].properties.ISO3,
            "un"   : data.features[cn].properties.UN,
            //"lat"  : data.features[cn].properties.LAT,
            //"lon"  : data.features[cn].properties.LON
        }

        var max_lat = false;
        var min_lat = false;
        var max_lon = false;
        var min_lon = false;

        var right = {
            max_lon : false,
            min_lon : false
        }

        var left = {
            max_lon : false,
            min_lon : false
        }

        for (var i = 0; i < data.features[cn].geometry.coordinates.length; i++)
        {
            for (var j = 0; j < data.features[cn].geometry.coordinates[i].length; j++)
            {

                var lat = data.features[cn].geometry.coordinates[i][j][1];
                var lon = data.features[cn].geometry.coordinates[i][j][0];
/*
                if (lon > 178)
                {
                    var is_medium_land = true;
                    break;
                }
*/
                if (lat > max_lat || !max_lat)
                {
                    max_lat = lat;
                }

                if (lat < min_lat || !min_lat)
                {
                    min_lat = lat;
                }

                if (lon > 0) // right part
                {
                    if (lon > right.max_lon || !right.max_lon)
                    {
                        right.max_lon = lon;
                    }

                    if (lon < right.min_lon || !right.min_lon)
                    {
                        right.min_lon = lon;
                    }
                }
                else // left part
                {
                    if (lon > left.max_lon || !left.max_lon)
                    {
                        left.max_lon = lon;
                    }

                    if (lon < left.min_lon || !left.min_lon)
                    {
                        left.min_lon = lon;
                    }
                }
            }

            /*if (is_medium_land)
            {
                break;
            }*/

        }

        if (right.max_lon - right.min_lon > left.max_lon - left.min_lon && left.max_lon < -10)
        {

            country_data.location_box = {
                        "max_lat" : max_lat,
                        "min_lat" : min_lat,
                        "max_lon" : right.max_lon + (left.max_lon - left.min_lon),
                        "min_lon" : right.min_lon
            };

        }
        else if (right.max_lon - right.min_lon > left.max_lon - left.min_lon)
        {

            country_data.location_box = {
                        "max_lat" : max_lat,
                        "min_lat" : min_lat,
                        "max_lon" : right.max_lon,
                        "min_lon" : right.min_lon
            };

        }
        else if (right.max_lon - right.min_lon < left.max_lon - left.min_lon && right.min_lon > 10)
        {

            country_data.location_box = {
                        "max_lat" : max_lat,
                        "min_lat" : min_lat,
                        "max_lon" : left.max_lon,
                        "min_lon" : left.min_lon - (right.max_lon - right.min_lon)
            };

        }
        else if (right.max_lon - right.min_lon < left.max_lon - left.min_lon)
        {

            country_data.location_box = {
                        "max_lat" : max_lat,
                        "min_lat" : min_lat,
                        "max_lon" : left.max_lon,
                        "min_lon" : left.min_lon
            };

        }

        country_data.name = country_data.name.replace(/\s+/g, '');

        insert_queue.push(country_data);

        /*if (is_medium_land)
        {
            console.log("medium:");
            console.log(country_data);
        }*/

/*
        country_data.location_box = {
                    "max_lat" : max_lat,
                    "min_lat" : min_lat,
                    "max_lon" : max_lon,
                    "min_lon" : min_lon
                  };

        insert_queue.push(country_data);*/

    }
});
