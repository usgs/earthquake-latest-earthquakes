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
  leaflet_custom: {
    files: [{
      cwd: 'node_modules/leaflet/dist',
      dest: 'node_modules/leaflet/dist/',
      dot: true,
      expand: true,
      rename: function (dest, src) {
        return dest + src.replace('-custom-src', '-src');
      },
      src: 'leaflet-custom-src.js'
    },
    {
      cwd: 'node_modules/leaflet/dist',
      dest: 'node_modules/leaflet/dist/',
      dot: true,
      expand: true,
      rename: function (dest, src) {
        return dest + src.replace('-custom', '');
      },
      src: 'leaflet-custom.js'
    }]
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
