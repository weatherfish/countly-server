module.exports = function(grunt) {

  //require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    jshint: {
		//http://www.jshint.com/docs/options/
		options:{
			eqeqeq: false,
			latedef: false,
			noempty: false,
			asi:true,
			loopfunc:true,
			shadow:true,
			sub:true,
			node:true,
            esversion: 6,
			'-W041': true,
			'-W038': true,
			'-W082': true,
			'-W058': true,
			'-W030': true,
			'-W032': true,
			'-W027': true,
			'-W018': true,
            '-W093': true
		},
		all: ['Gruntfile.js', 'api/api.js', 'api/lib/*.js', 'api/parts/**/*.js', 'api/utils/common.js', 'frontend/express/app.js', 'plugins/pluginManager.js', 'plugins/**/api/*.js', 'plugins/**/api/parts/**/*.js', 'plugins/**/frontend/*.js']
    },
	  concat: {
  		options: {
  			//separator: "\n"
        separator: ";"
  		},
  		dom: {
  			src: [
  				'frontend/express/public/javascripts/dom/jquery/jquery-1.8.3.min.js',
  				/*'frontend/express/public/javascripts/dom/jquery.form.js',
  				'frontend/express/public/javascripts/dom/tipsy/jquery.tipsy.js',
  				'frontend/express/public/javascripts/dom/jquery.noisy.min.js',
  				'frontend/express/public/javascripts/dom/jquery.sticky.headers.js',*/
  				'frontend/express/public/javascripts/dom/jqueryui/jquery-ui-1.8.22.custom.min.js',
  				'frontend/express/public/javascripts/dom/jqueryui/jquery-ui-i18n.js',
  				/*'frontend/express/public/javascripts/dom/slimScroll.min.js',
  				'frontend/express/public/javascripts/dom/jquery.easing.1.3.js',
  				'frontend/express/public/javascripts/dom/dataTables/js/jquery.dataTables.js',
  				'frontend/express/public/javascripts/dom/dataTables/js/ZeroClipboard.js',
  				'frontend/express/public/javascripts/dom/dataTables/js/TableTools.js',*/
  			],
  			dest: 'frontend/express/public/javascripts/min/countly.dom.concat.js'
        //dest: 'frontend/express/public/javascripts/min/countly.dom.js'
  		},
  		utils: {
  			src: [
    			'frontend/express/public/javascripts/utils/underscore-min.js',
    			/*'frontend/express/public/javascripts/utils/prefixfree.min.js',*/
    			'frontend/express/public/javascripts/utils/moment/moment.min.js',
    			'frontend/express/public/javascripts/utils/moment/moment.isocalendar.min.js',
    			'frontend/express/public/javascripts/utils/moment/lang-all.min.js',
    			/*'frontend/express/public/javascripts/utils/handlebars.js',
    			'frontend/express/public/javascripts/utils/backbone-min.js',*/
    			'frontend/express/public/javascripts/utils/jquery.i18n.properties-min-1.0.9.js',
    			/*'frontend/express/public/javascripts/utils/jstz.min.js',*/
    			'frontend/express/public/javascripts/utils/store+json2.min.js',
    			'frontend/express/public/javascripts/utils/jquery.idle-timer.js',
        		/*'frontend/express/public/javascripts/utils/textcounter.min.js',*/
        		/*'frontend/express/public/javascripts/utils/initialAvatar.js',
                'frontend/express/public/javascripts/utils/jquery.amaran.min.js',
                'frontend/express/public/javascripts/utils/jquery.titlealert.js',*/
                'frontend/express/public/javascripts/utils/globalize.min.js',
    			'frontend/express/public/javascripts/countly/countly.common.js',
                'frontend/express/public/javascripts/sort_functions.js',
                'frontend/express/public/javascripts/utils/superagent.min.js'
  			],
  			dest: 'frontend/express/public/javascripts/min/countly.utils.concat.js'
            //dest: 'frontend/express/public/javascripts/min/countly.utils.js'
  		},
  		visualization: {
  			src: [
                'frontend/express/public/javascripts/visualization/d3/d3.min.js',
                'frontend/express/public/javascripts/visualization/d3/d3.geo.projection.min.js',
                'frontend/express/public/javascripts/visualization/rickshaw/rickshaw.js',
                 'frontend/express/public/javascripts/react-with-addons.js',
                 //'frontend/express/public/javascripts/JSXTransformer.js',
                 'frontend/express/public/javascripts/react-widgets/react-widgets.js',
                 'frontend/express/public/javascripts/fixed-data-table/dist/fixed-data-table.js',
                 'frontend/express/public/javascripts/ReactRouter.min.js',
                 'frontend/express/public/javascripts/visualization/datamaps/topojson.min.js',
                 'frontend/express/public/javascripts/visualization/datamaps/country_codes.js',
                 'frontend/express/public/javascripts/visualization/datamaps/datamaps.world.hires.min.js',
                 'frontend/express/public/javascripts/visualization/datamaps/datamaps.usa.min.js',
  			],
  			dest: 'frontend/express/public/javascripts/min/countly.visualization.concat.js'
            //dest: 'frontend/express/public/javascripts/min/countly.visualization.js'
  		},
  		lib: {
  			src: [
  				//'frontend/express/public/javascripts/countly/countly.map.helper.js',
  				'frontend/express/public/javascripts/countly/countly.event.js',
  				'frontend/express/public/javascripts/countly/countly.session.js',
  				'frontend/express/public/javascripts/countly/countly.city.js',
  				'frontend/express/public/javascripts/countly/countly.location.js',
  				'frontend/express/public/javascripts/countly/countly.user.js',
  				'frontend/express/public/javascripts/countly/countly.device.list.js',
  				'frontend/express/public/javascripts/countly/countly.device.js',
  				'frontend/express/public/javascripts/countly/countly.device.detail.js',
  				'frontend/express/public/javascripts/countly/countly.app.version.js',
  				'frontend/express/public/javascripts/countly/countly.carrier.js',
  				'frontend/express/public/javascripts/countly/countly.allapps.js',
  				'frontend/express/public/javascripts/countly/countly.template.js',
  			],
  			dest: 'frontend/express/public/javascripts/min/countly.lib.concat.js'
        //dest: 'frontend/express/public/javascripts/min/countly.lib.js'
  		},
      pages: {
  			src: [
  				'frontend/express/public/javascripts/react_pages_compiled/*',
  			],
  			dest: 'frontend/express/public/javascripts/min/countly.react_pages.concat.js'
        //dest: 'frontend/express/public/javascripts/min/countly.react_pages.js'
  		},
      components: {
  			src: [
  				'frontend/express/public/javascripts/react_components_compiled/*',
  			],
  			dest: 'frontend/express/public/javascripts/min/countly.react_components.concat.js'
        //dest: 'frontend/express/public/javascripts/min/countly.react_components.js'
  		}
    },
    uglify: {
  		options: {
  			banner: '/*! Countly <%= grunt.template.today("dd-mm-yyyy") %> */\n',
              mangle: {
                  except: ["$super"]
              }
  		},
  		dist: {
  			files: {
                'frontend/express/public/javascripts/min/countly.dom.js': 'frontend/express/public/javascripts/min/countly.dom.concat.js',
                'frontend/express/public/javascripts/min/countly.utils.js': 'frontend/express/public/javascripts/min/countly.utils.concat.js',
                'frontend/express/public/javascripts/min/countly.visualization.js': 'frontend/express/public/javascripts/min/countly.visualization.concat.js',
                'frontend/express/public/javascripts/min/countly.lib.js': 'frontend/express/public/javascripts/min/countly.lib.concat.js',
                'frontend/express/public/javascripts/min/countly.react_components.js' : 'frontend/express/public/javascripts/min/countly.react_components.concat.js',
                'frontend/express/public/javascripts/min/countly.react_pages.js' : 'frontend/express/public/javascripts/min/countly.react_pages.concat.js'
  			}
  		}
    },
    copy: {},
    cssmin: {
    	dist: {
    		files: {
                'frontend/express/public/stylesheets/main.min.css': [
                'frontend/express/public/stylesheets/main.css',      
                'frontend/express/public/stylesheets/compiled_css_sidebar.css',
                "frontend/express/public/stylesheets/compiled_css_topbar.css",
                "frontend/express/public/stylesheets/compiled_css_calendar.css",
                "frontend/express/public/stylesheets/compiled_css_line_chart.css",
                "frontend/express/public/stylesheets/big_number.css",
                "frontend/express/public/stylesheets/radio_button.css",
                "frontend/express/public/javascripts/visualization/rickshaw/rickshaw.min.css",
                "frontend/express/public/javascripts/react-widgets/core.css",
                "frontend/express/public/javascripts/react-widgets/react-widgets.css",
                "frontend/express/public/stylesheets/compiled_css_tables.css",
                "frontend/express/public/stylesheets/dashboard.css",
                "frontend/express/public/stylesheets/date_sign_block.css",
                "frontend/express/public/stylesheets/compiled_css_map.css",
                "frontend/express/public/stylesheets/compiled_css_applications.css",
                "frontend/express/public/javascripts/fixed-data-table/dist/fixed-data-table.css",
                "frontend/express/public/stylesheets/bar_chart.css",
                "frontend/express/public/stylesheets/horizontal_bar_chart.css",
                "frontend/express/public/stylesheets/compiled_css_manage_users.css",
                "frontend/express/public/stylesheets/compiled_css_configurations.css",
                "frontend/express/public/stylesheets/compiled_css_events_page.css",
                "frontend/express/public/stylesheets/crashes_page.css",
                "frontend/express/public/stylesheets/compiled_css_selector_with_search.css",
                "frontend/express/public/stylesheets/compiled_css_select.css",
                "frontend/express/public/stylesheets/compiled_css_multi_select.css",
                "frontend/express/public/stylesheets/compiled_css_crash_details.css",
                "frontend/express/public/stylesheets/bool_pie_chart.css",
                "frontend/express/public/stylesheets/average_bar.css",
                "frontend/express/public/stylesheets/compiled_css_platforms.css",
                "frontend/express/public/stylesheets/no_data_block.css",
                "frontend/express/public/stylesheets/alert.css",    
                "frontend/express/public/stylesheets/populator.css"                   
    	    	],
    		}
    	}
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
		  timeout: 50000
        },
        src: ['test/**/*.js']
      }
    },
    /*"babel": {
      options: {
        sourceMap: true,
        "experimental": true,
        presets: ['es2015', 'react'],
        plugins: ["transform-es2015-modules-amd"]
      },
      files: [{
            "expand": true,
            //"cwd": "frontend/express/public/javascripts/react_components/",
            "src": ["frontend/express/public/javascripts/react_components/*.js"],
            "dest": "frontend/express/public/javascripts/react_components_compiled/",
            //"ext": ".js"
        }]
      /*dist: {
        files: {
          "./frontend/express/public/javascripts/react_components/sidebar.js": "./frontend/express/public/javascripts/react_components_compiled/sidebar.js",
          //"frontend/express/public/javascripts/react_components/": "frontend/express/public/javascripts/react_components_compiled/*",
          //"frontend/express/public/javascripts/react_pages/": "frontend/express/public/javascripts/react_pages_compiled/*"
        }
      }*/
    /*}*/
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('default', ['jshint', 'mochaTest']);

  grunt.registerTask('dist', [/*'babel',*/ 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('plugins', 'Minify plugin JS / CSS files and copy images', function(){
  	var plugins = require('./plugins/plugins.json'), js = [], css = [], img = [], fs = require('fs'), path = require('path');
  	console.log('Preparing production files for following plugins: %j', plugins);

  	plugins.forEach(function(plugin){
  		var files, pluginPath = path.join(__dirname, 'plugins', plugin),
  			javascripts = path.join(pluginPath, 'frontend/public/javascripts'),
  			stylesheets = path.join(pluginPath, 'frontend/public/stylesheets'),
  			images = path.join(pluginPath, 'frontend/public/images', plugin);

  		if (fs.statSync(javascripts).isDirectory()) {
  			files = fs.readdirSync(javascripts);
  			if (files.length) {
  				// move models to the top, then all dependencies, then views
  				for (var i = 0; i < files.length; i++) {
  					if (files[i].indexOf('countly.models.js') !== -1 && i !== 0) {
  						files.splice(0, 0, files.splice(i, 1)[0]);
  					} else if (files[i].indexOf('countly.views.js') !== -1 && i !== files.length - 1) {
  						//files.splice(files.length - 1, 0, files.splice(i, 1)[0]);
  					}
  				}

	  			files.forEach(function(name){
	  				var file = path.join(javascripts, name);
	  				if (fs.statSync(file).isFile()) {

              if (file.indexOf('countly.views.js') !== -1)
              {
                  return false;
              }

	  					js.push('plugins/' + plugin + '/frontend/public/javascripts/' + name);
              console.log('Plugin js file: %j', 'plugins/' + plugin + '/frontend/public/javascripts/' + name);
	  				}
	  			});
  			}
  		}

  		if (fs.statSync(stylesheets).isDirectory()) {
	  		files = fs.readdirSync(stylesheets);
	  		files.forEach(function(name){
	  			var file = path.join(stylesheets, name);
	  			if (fs.statSync(file).isFile() && name !== 'pre-login.css') {
	  				css.push('plugins/' + plugin + '/frontend/public/stylesheets/' + name);
	  			}
	  		});
  		}

  		try {
  			if (fs.statSync(images).isDirectory()) {
  				img.push({expand: true, cwd:'plugins/' + plugin + '/frontend/public/images/' + plugin + '/', filter:'isFile', src:'**', dest: 'frontend/express/public/images/' + plugin + '/'});
  			}
  		} catch(err) {
  			if (err.code !== 'ENOENT') { throw err; }
  		}
  	});

	grunt.config('copy.plugins.files', img);

	grunt.config('concat.plugins.src', js);
	//grunt.config('concat.plugins.dest', 'frontend/express/public/javascripts/min/countly.plugins.concat.js');
    grunt.config('concat.plugins.dest', 'frontend/express/public/javascripts/min/countly.plugins.js');

	grunt.config('uglify.plugins.files.frontend/express/public/javascripts/min/countly\\.plugins\\.js', 'frontend/express/public/javascripts/min/countly.plugins.concat.js');

	grunt.config('cssmin.plugins.files.frontend/express/public/stylesheets/plugins\\.min\\.css', css);

	// grunt.task.loadTasks(['copy:plugins', 'concat:plugins', 'uglify:plugins']);
	// grunt.task.run(['concat', 'uglify']);
	grunt.task.run(['concat:plugins'/*, 'uglify:plugins'*/, 'copy:plugins'/*, 'cssmin:plugins'*/]);

  	console.log('Done preparing production files');
  });

  grunt.registerTask('locales', 'Concat all locale files into one', function(){
  	var plugins = require('./plugins/plugins.json'), locales = {}, fs = require('fs'), path = require('path');
  	console.log('Preparing locale files for core & plugins: %j', plugins);

  	var pushLocaleFile = function(name, path){
  		var lang = '';
  		name = name.replace('.properties', '');
  		if (name.indexOf('_') !== -1) {
  			lang = name.split('_').pop();
  		}

  		if (!locales[lang]) {
  			locales[lang] = [];
  		}

  		locales[lang].push(path);
  	};

  	[path.join(__dirname, 'frontend/express/public/localization/dashboard')/*, path.join(__dirname, 'frontend/express/public/localization/help')*//*, path.join(__dirname, 'frontend/express/public/localization/mail')*/].forEach(function(dir){
  		fs.readdirSync(dir).forEach(function(name){
  			var file = path.join(dir, name);
  		  	if (fs.statSync(file).isFile()) {
  		  		pushLocaleFile(name, dir + '/' + name);
  		  	}
  		});
  	});

  	plugins.forEach(function(plugin){
  		var localization = path.join(__dirname, 'plugins', plugin, 'frontend/public/localization');

  		try {
	  		if (fs.statSync(localization).isDirectory()) {
	  			fs.readdirSync(localization).forEach(function(name){
	  				var file = path.join(localization, name);
	  				if (fs.statSync(file).isFile()) {
	  					pushLocaleFile(name, 'plugins/' + plugin + '/frontend/public/localization/' + name);
	  				}
	  			});
	  		}
  		} catch(err) {
  			if (err.code !== 'ENOENT') { throw err; }
  		}
	});

  	for (var lang in locales) {
  		grunt.config('concat.locales_' + lang + '.options.separator', '\n\n');
  		grunt.config('concat.locales_' + lang + '.src', locales[lang]);
  		grunt.config('concat.locales_' + lang + '.dest', 'frontend/express/public/localization/min/locale' + (lang.length ? '_' + lang : '') + '.properties');
		  grunt.task.run('concat:locales_' + lang);
  	}

  	console.log('Done preparing locale files');
  });

  grunt.registerTask('dist-all', ['dist', 'plugins', 'locales']);

};
