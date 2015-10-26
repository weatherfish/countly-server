var monlog = { log: { debug: function(message) { }, info: function(message) { }, warn: function(message) { }, error: function(message) { } }};

var lazy = require("lazy");
var fs   = require("fs");
var Mongolian = require('mongolian');
var async = require("async");

var server = new Mongolian(monlog);

var mongo_db = server.db("countly");

var cities_coords = mongo_db.collection('cities_coords');

var data_file = './cities1000.txt';

// todo: db.cities_coords.ensureIndex( { city: 1 } )

var insert_queue = async.queue(function (city_obj, callback) {

    cities_coords.insert(city_obj, function(error, result){

        if (error)
        {
            // todo
        }

        callback();
    });

}, 100);

insert_queue.drain = function() {
    console.log('all cities have been inserted');
    process.exit(1);
}

new lazy(fs.createReadStream('./cities1000.txt'))
   .lines
   .forEach(function(line){

        var line = line.toString().replace(/\s+/g,'+');

        line = line.split("+");

        var city = line[1].toLowerCase(); // todo: "The" city

        var lat  = false;
        var lon  = false;

        for (var i = 2; i < line.length; i++)
        {
            if (line[i].indexOf(".") > -1) // if something like 55.3123
            {
                if (!lat)
                {
                    lat = line[i];
                }
                else
                {
                    lon = line[i];
                    break;
                }
            }
        }

        var data = {
            "city" : city,
            "lat"  : lat,
            "lon"  : lon,
        }

        insert_queue.push(data);

    }
);
