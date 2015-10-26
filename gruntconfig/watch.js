'use strict';

var config = require('./config');

var watch = {
  scripts: {
    files: [config.src + '/htdocs/js/**/*.js'],
    options: {
      livereload: config.liveReloadPort
    }
  },
  css: {
    files: [config.src + '/htdocs/css/**/*.scss'],
    tasks: ['postcss:build'],
    livereload: config.liveReloadPort
  },
  tests: {
    files: [config.test + '/*.html', config.test + '/**/*.js']
  },
  livereload: {
    options: {
      livereload: config.liveReloadPort
    },
    files: [
      config.src + '/htdocs/**/*.html',
      config.src + '/htdocs/css/**/*.css',
      config.src + '/htdocs/img/**/*.{png,jpg,jpeg,gif}',
      '.tmp/css/**/*.css'
    ]
  },
  gruntfile: {
    files: ['Gruntfile.js'],
    tasks: ['jshint:gruntfile']
  }
};

module.exports = watch;
