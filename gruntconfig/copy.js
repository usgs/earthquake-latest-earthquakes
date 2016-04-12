'use strict';

var config = require('./config');

var copy = {
  dev: {
    cwd: config.src,
    dest: config.build + '/' + config.src,
    expand: true,
    options: {mode: true},
    src: [
      '**/*',
      '!**/js/**/*',
      '!**/*.scss',
      '!**/*.css'
    ]
  },
  dist: {
    cwd: config.build + '/' + config.src,
    dest: config.dist,
    expand: true,
    options: {mode: true},
    src: [
      '**/*',
      '!**/*.js',
      '!**/*.js.map',
      '!**/*.scss',
      '!**/*.css',
      '!**/*.html'
    ]
  },

  leaflet: {
    expand: true,
    cwd: 'node_modules/leaflet/dist',
    dest: config.build + '/' + config.src + '/htdocs/lib/leaflet-0.7.7',
    rename: function (dest, src) {
      var newName;

      // swap -src version to be default and add -min to compressed version
      // this is nice for debugging but allows production to use default
      // version as compressed
      newName = src.replace('leaflet.js', 'leaflet-min.js');
      newName = newName.replace('leaflet-src.js', 'leaflet.js');

      return dest + '/' + newName;
    },
    src: [
      '**/*'
    ]
  },

  test: {
    expand: true,
    cwd: config.test,
    dest: config.build + '/' + config.test,
    src: [
      'test.html'
    ]
  }
};

module.exports = copy;
