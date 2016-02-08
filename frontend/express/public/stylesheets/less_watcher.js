//var config = require('./config');

var chokidar = require('chokidar');

var child_process = require('child_process');

var exec = require('exec');

var folder = '/home/ubuntu/countly_sidebar/frontend/express/public/stylesheets';

deploying = false;

var watcher = chokidar.watch(folder, {ignored: /node_modules/, persistent: true});
watcher
    .on('add', function(path) {console.log('File', path, 'has been added');})
    .on('change', function(path) {

      if (path.indexOf(".css") > -1)
      {
          console.log("simple css");
          return false;
      }

      if (!deploying)
      {

          deploying = true;


            var cmd = 'cd ' + folder + ' && lessc ui.v2.less v2.css && lessc ui.calendar.less calendar.css && lessc tables.less tables.css && lessc map.less map.css && grunt dist-all';


            setTimeout(function(){
                exec(cmd, function(err, out, code) {

                    console.log('##### deploy #####')

                    process.stderr.write(err);
                    process.stdout.write(out);

                    deploying = false;

                });

            }, 2000);

            console.log('File', path, 'has been changed');
      }

    })
    .on('unlink', function(path) {console.log('File', path, 'has been removed');})
    .on('error', function(error) {console.error('Error happened', error);})
