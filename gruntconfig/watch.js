'use strict';

var config = require('./config');

var watch = {
  css: {
    files: [
      config.src + '/htdocs/css/**/*.css'
    ],
    tasks: [
      'postcss:build'
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
      config.src + '/htdocs/js/**/*.js'
    ],
    tasks: [
      'jshint:scripts',
      'requirejs:dev'
    ]
  },

  tests: {
    files: [
      config.test + '/*.html',
      config.test + '/**/*.js'
    ],
    tasks: [
      'copy:test',
      'requirejs:test'
    ]
  }
};

module.exports = watch;
