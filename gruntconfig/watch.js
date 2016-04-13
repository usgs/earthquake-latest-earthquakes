'use strict';

var config = require('./config');

var watch = {
  css: {
    files: [
      config.src + '/htdocs/**/*.scss'
    ],
    tasks: [
      'postcss:dev'
    ]
  },

  gruntfile: {
    files: [
      'Gruntfile.js',
      'gruntconfig/**/*.js'
    ],
    options: {
      reload: true
    },
    tasks: [
      'jshint:gruntfile'
    ]
  },

  livereload: {
    files: [
      config.build + '/' + config.src + '/htdocs/**/*'
    ],
    options: {
      livereload: config.liveReloadPort
    }
  },

  scripts: {
    files: [
      config.src + '/htdocs/**/*.js'
    ],
    tasks: [
      'jshint:scripts',
      'browserify:index',
      'browserify:bundle'
    ]
  },

  static: {
    files: [
      config.src + '/**/*',
      '!' + config.src + '/**/*.js',
      '!' + config.src + '/**/*.scss'
    ],
    tasks: [
      'copy:dev'
    ]
  },

  tests: {
    files: [
      config.test + '/*.html',
      config.test + '/**/*.js'
    ],
    tasks: [
      'copy:test',
      'browserify:test'
    ]
  }
};

module.exports = watch;
