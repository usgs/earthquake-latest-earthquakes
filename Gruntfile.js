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
            'PHPRC': process.cwd() + '/node_modules/hazdev-template/dist/conf/php.ini'
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

	grunt.initConfig({
		app: appConfig,
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
				tasks: ['compass:dev']
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
				'htmlmin:dist',
				'uglify'
			]
		},
		connect: {
			options: {
				hostname: '*'
			},
			rules: [
				{from: '^/theme/(.*)$', to: '/hazdev-template/dist/htdocs/$1'}
			],
			dev: {
				options: {
					base: '<%= app.src %>/htdocs',
					port: 8080,
					middleware: function (connect, options) {
						return [
							lrSnippet,
							mountFolder(connect, '.tmp'),
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
							(function () {
								var gzip = require('connect-gzip');
								return gzip.gzip({
									matchType: /text|javascript|json|css/
								});
							})(),
							mountPHP(options.base),
							mountFolder(connect, options.base),
							rewriteRulesSnippet,
							mountFolder(connect, 'node_modules')
						];
					}
				}
			},
			test: {
				options: {
					base: '<%= app.test %>',
					port: 8000,
					middleware: function (connect, options) {
						return [
							mountFolder(connect, '.tmp'),
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
					appDir: appConfig.src + '/htdocs/js',
					baseUrl: '.',
					dir: appConfig.dist + '/htdocs/js',
					useStrict: true,
					wrap: false,
					removeCombined: true,
					// for bundling require library in to index.js
					paths: {
						requireLib: '../../../node_modules/requirejs/require',
						leaflet: '../../../node_modules/leaflet/dist/leaflet'
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
								'requireLib'
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
				options: {
					'root': 'node_modules',
					'noRebase': true
				},
				files: {
					'<%= app.dist %>/htdocs/css/index.css': [
						'<%= app.src %>/htdocs/css/index.css'
					],
					'<%= app.dist %>/htdocs/css/documentation.css': [
						'<%= app.src %>/htdocs/css/documentation.css'
					]
				}
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
			leaflet_custom: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'node_modules/leaflet/dist',
					dest: 'node_modules/leaflet/dist/',
					src: 'leaflet-custom-src.js',
					rename: function (dest, src) {
						return dest + src.replace('-custom-src', '-src');
					}
				},
				{
					expand: true,
					dot: true,
					cwd: 'node_modules/leaflet/dist',
					dest: 'node_modules/leaflet/dist/',
					src: 'leaflet-custom.js',
					rename: function (dest, src) {
						return dest + src.replace('-custom', '');
					}
				}]
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
			},
			jakefile: {
				expand: true,
				dot: true,
				cwd: 'node_modules/leaflet',
				dest: 'node_modules/leaflet/',
				src: 'Jakefile.js',
				rename: function (dest, src) {
					return dest + src.replace('.js', '_custom.js');
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
						from: 'data-main="js/index.js" src="/requirejs/require.js"',
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
						from: 'leaflet/dist/leaflet-custom-src',
						to: 'leaflet/dist/leaflet/leaflet'
					},
				]
			},
			leaflet_jakefile: {
				src: [
				'node_modules/leaflet/Jakefile_custom.js'
				],
				overwrite: true,
				replacements: [
					{
						from: 'build.build(complete);',
						to: 'build.build(complete, compsBase32, buildName);'
					},
					{
						from: 'task(\'build\', {async: true}, function ()',
						to: 'task(\'build\', {async: true}, function (compsBase32, buildName)'
					}
				]
			},
			legacyTemplate: {
				src: [
					'<%= app.dist %>/**/*.php'
				],
				overwrite: true,
				replacements: [
					{
						from:'include \'template.inc.php\';',
						to: 'include $_SERVER[\'DOCUMENT_ROOT\'] . \'/template/template.inc.php\';'
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
		},
		exec: {
			build_leaflet: {
				cmd: 'jake -f Jakefile_custom.js build[1trs00i5,custom]',
				cwd: 'node_modules/leaflet'
			}
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

	//remove "copy:jakefile", and "replace:leaflet_jakefile"
	//	when Jakefile.js is upgraded with next release.
	grunt.registerTask('build', function (task) {
		var tasks = [
			'clean:dist',
			'copy:jakefile',
			'replace:leaflet_jakefile',
			'exec:build_leaflet',
			'copy:leaflet_custom',
			'concurrent:predist',
			'requirejs:dist',
			'concurrent:dist',
			'replace:html',
			'replace:javascript',
			'replace:leaflet_shim_dist',
			'replace:leaflet_jakefile',
			'open:dist',
			'configureRewriteRules',
			'connect:dist'
		];

		if (task === 'legacy') {
			tasks.splice(-2, 0, 'replace:legacyTemplate');
		}

		grunt.task.run(tasks);
	});

	//remove "copy:jakefile", and "replace:leaflet_jakefile"
	//	when Jakefile.js is upgraded with next release.
	grunt.registerTask('default', [
		'clean:dist',
		'copy:jakefile',
		'replace:leaflet_jakefile',
		'exec:build_leaflet',
		'copy:leaflet_custom',
		'compass:dev',
		'configureRewriteRules',
		'connect:test',
		'connect:dev',
		'open:test',
		'open:dev',
		'watch'
	]);

};
