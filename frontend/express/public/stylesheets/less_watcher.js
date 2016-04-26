//var config = require('./config');

var chokidar = require('chokidar');

var child_process = require('child_process');

var exec = require('exec');

var folder = '/home/ubuntu/apr_04_uiv2/frontend/express/public/stylesheets';

deploying = false;

var watcher = chokidar.watch(folder, {ignored: /node_modules/, persistent: true});
watcher
    .on('add', function(path) {console.log('File', path, 'has been added');})
    .on('change', function(path) {

      if (path.indexOf(".css") > -1)
      {
          console.log("simple css", path);
          return false;
      }

      if (!deploying)
      {

          deploying = true;
          
          var file = path.split("/");
          
          var less_filename = file[file.length - 1];
          
          var css_filename = less_filename.replace("less", "css");

            //var cmd = 'cd ' + folder + ' && lessc calendar.less calendar.css && lessc tables.less tables.css && lessc map.less map.css && lessc selector_with_search.less selector_with_search.css';

            var cmd = 'cd ' + folder + ' && lessc ' + less_filename + " compiled_css_" + css_filename;

            console.log("new_cmd:", cmd);

            //var cmd = 'cd ' + folder + ' && ./change_colors2.sh';

            //console.log("cmd");
            
            console.log("--triger --");

            setTimeout(function(){
                exec(cmd, function(err, out, code) {

                    console.log('##### deploy #####')

                    process.stderr.write(err);
                    process.stdout.write(out);

                    deploying = false;

                });

            }, 100);

            console.log('File', path, 'has been changed');
      }

    })
    .on('unlink', function(path) {console.log('File', path, 'has been removed');})
    .on('error', function(error) {console.error('Error happened', error);})
