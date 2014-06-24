'use strict';

var LIVE_RELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVE_RELOAD_PORT});
var rewriteRulesSnippet = require('grunt-connect-rewrite/lib/utils').rewriteRequest;
var gateway = require('gateway');

var mountFolder = function (connect, dir) {
	return connect.static(require('path').resolve(dir));
};

var BUILD_TIME = new Date().getTime();


var mountPHP = function (dir, options) {
    options = options || {
        '.php': 'php-cgi',
        'env': {
            'PHPRC': process.cwd() + '/node_modules/hazdev-template/src/conf/php.ini'
        }
    };
    return gateway(require('path').resolve(dir), options);
};

module.exports = function (grunt) {

	// Load grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// App configuration, used throughout
	var appConfig = {
		src: 'src',
		dist: 'dist',
		test: 'test',
		tmp: '.tmp'
	};

	// TODO :: Read this from .bowerrc
	var bowerConfig = {
		directory: 'bower_components'
	};

	grunt.initConfig({
		app: appConfig,
		bower: bowerConfig,
		watch: {
			scripts: {
				files: ['<%= app.src %>/htdocs/js/**/*.js'],
				tasks: ['concurrent:scripts'],
				options: {
					livereload: LIVE_RELOAD_PORT
				}
			},
			scss: {
				files: ['<%= app.src %>/htdocs/css/**/*.scss'],
				tasks: ['copy:leaflet', 'compass:dev']
			},
			tests: {
				files: ['<%= app.test %>/*.html', '<%= app.test %>/**/*.js'],
				tasks: ['concurrent:tests']
			},
			livereload: {
				options: {
					livereload: LIVE_RELOAD_PORT
				},
				files: [
					'<%= app.src %>/htdocs/**/*.html',
					'<%= app.src %>/htdocs/css/**/*.css',
					'<%= app.src %>/htdocs/img/**/*.{png,jpg,jpeg,gif}',
					'.tmp/css/**/*.css'
				]
			},
			gruntfile: {
				files: ['Gruntfile.js'],
				tasks: ['jshint:gruntfile']
			}
		},
		concurrent: {
			scripts: ['jshint:scripts', 'mocha_phantomjs'],
			tests: ['jshint:tests', 'mocha_phantomjs'],
			predist: [
				'jshint:scripts',
				'jshint:tests',
				'compass',
				'copy'
			],
			dist: [
				'cssmin:dist',
				'cssmin:leaflet',
				'htmlmin:dist',
				'uglify'
			]
		},
		connect: {
			options: {
				hostname: 'localhost'
			},
			rules: [
				{from: '^/theme/(.*)$', to: '/hazdev-template/src/htdocs/$1'}
			],
			dev: {
				options: {
					base: '<%= app.src %>/htdocs',
					port: 8080,
					components: bowerConfig.directory,
					middleware: function (connect, options) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
							mountFolder(connect, options.components),
							mountPHP(options.base),
							mountFolder(connect, options.base),
							rewriteRulesSnippet,
							mountFolder(connect, 'node_modules')
						];
					}
				}
			},
			dist: {
				options: {
					base: '<%= app.dist %>/htdocs',
					port: 8081,
					keepalive: true,
					middleware: function (connect, options) {
						return [
							mountPHP(options.base),
							mountFolder(connect, options.base)
						];
					}
				}
			},
			test: {
				options: {
					base: '<%= app.test %>',
					components: bowerConfig.directory,
					port: 8000,
					middleware: function (connect, options) {
						return [
							mountFolder(connect, '.tmp'),
							mountFolder(connect, 'bower_components'),
							mountFolder(connect, 'node_modules'),
							mountFolder(connect, options.base),
							mountFolder(connect, appConfig.src + '/htdocs/js')
						];
					}
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: ['Gruntfile.js'],
			scripts: ['<%= app.src %>/htdocs/js/**/*.js'],
			tests: ['<%= app.test %>/**/*.js']
		},
		compass: {
			dev: {
				options: {
					sassDir: '<%= app.src %>/htdocs/css',
					cssDir: '<%= app.tmp %>/css',
					environment: 'development'
				}
			}
		},
		mocha_phantomjs: {
			all: {
				options: {
					urls: [
						'http://localhost:<%= connect.test.options.port %>/index.html'
					]
				}
			}
		},
		requirejs: {
			dist: {
				options: {
					appDir: appConfig.src + '/htdocs',
					baseUrl: 'js',
					dir: appConfig.dist + '/htdocs',
					useStrict: true,
					wrap: false,

					// for bundling require library in to index.js
					paths: {
						requireLib: '../../../bower_components/requirejs/require',
						leaflet: '../../../node_modules/leaflet/dist/leaflet-src'
					},

					shim: {
						leaflet: {
							exports: 'L'
						}
					},

					modules: [
						{
							name: 'index',
							include:[
								'../lib/require/require'
							],
							excludeShallow: [
								'eq/MapViewDependencies',
								'map/*',
								'leaflet'
							]
						},
						{
							name: 'eq/MapViewDependencies',
							excludeShallow: [
								'mvc/*',
								'eq/Format'
							]
						}
					]
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'<%= app.dist %>/htdocs/css/index.css': [
						'<%= app.src %>/htdocs/css/index.css'
					]
				}
			},
			leaflet: {
				dest: '<%= app.dist %>/htdocs/lib/leaflet/leaflet.css',
				src: 'node_modules/leaflet/dist/leaflet.css'
			}
		},
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: '<%= app.src %>',
					src: '**/*.html',
					dest: '<%= app.dist %>'
				}]
			}
		},
		uglify: {
			options: {
				mangle: true,
				compress: true,
				report: 'gzip'
			},
			dist: {
				files: {
					'<%= app.dist %>/htdocs/js/index.js':
							['<%= app.dist %>/htdocs/js/index.js'],
					'<%= app.dist %>/htdocs/js/eq/MapViewDependencies.js':
							['<%= app.dist %>/htdocs/js/eq/MapViewDependencies.js']
				}
			}
		},
		copy: {
			leaflet: {
				expand: true,
				cwd: 'node_modules/leaflet/dist',
				dest: '<%= app.dist %>/htdocs/lib/leaflet',
				src: [
					'leaflet.js',
					'leaflet.css',
					'images/**'
				]
			},
			app: {
				expand: true,
				cwd: '<%= app.src %>/htdocs',
				dest: '<%= app.dist %>/htdocs',
				src: [
					'img/**/*.{png,gif,jpg,jpeg}',
					'**/*.php'
				]
			},
			lib: {
				expand: true,
				cwd: '<%= app.src %>/lib',
				dest: '<%= app.dist %>/lib',
				src: [
					'**/*'
				],
				options: {
					mode: true
				}
			}
		},
		replace: {
			html: {
				src: [
					'<%= app.dist %>/htdocs/index.html'
				],
				overwrite: true,
				replacements: [
					{
						from: 'data-main="js/index.js" src="lib/require/require.js"',
						to: 'src="js/index.js?build=' + BUILD_TIME + '"'
					},
					{
						from: 'css/index.css',
						to: 'css/index.css?build=' + BUILD_TIME + '"'
					}
				]
			},
			javascript: {
				src: [
					'<%= app.dist %>/htdocs/js/index.js'
				],
				overwrite: true,
				replacements: [
					{
						from: '"stamp="+(new Date).getTime()',
						to: '"build=' + BUILD_TIME + '"'
					}
				]
			},
			leaflet_shim_dist: {
				src: [
					'<%= app.dist %>/htdocs/js/index.js'
				],
				overwrite: true,
				replacements: [
					{
						from: 'leaflet/dist',
						to: 'lib/leaflet'
					},
					{
						from: 'leaflet-src',
						to: 'leaflet'
					}
				]
			}
		},
		open: {
			dev: {
				path: 'http://localhost:<%= connect.dev.options.port %>'
			},
			test: {
				path: 'http://localhost:<%= connect.test.options.port %>'
			},
			dist: {
				path: 'http://localhost:<%= connect.dist.options.port %>'
			}
		},
		clean: {
			dist: ['<%= app.dist %>'],
			dev: ['<%= app.tmp %>', '.sass-cache']
		}
	});

	grunt.event.on('watch', function (action, filepath) {
		// Only lint the file that actually changed
		grunt.config(['jshint', 'scripts'], filepath);
	});

	grunt.registerTask('test', [
		'clean:dist',
		'connect:test',
		'mocha_phantomjs'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'concurrent:predist',
		'requirejs:dist',
		'concurrent:dist',
		'replace',
		'open:dist',
		'connect:dist'
	]);

	grunt.registerTask('default', [
		'clean:dist',
		'copy:leaflet',
		'compass:dev',
		'configureRewriteRules',
		'connect:test',
		'connect:dev',
		'open:test',
		'open:dev',
		'watch'
	]);

};
