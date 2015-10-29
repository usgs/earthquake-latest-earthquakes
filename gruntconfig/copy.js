'use strict';

var config = require('./config');

var copy = {
  dev: {
    expand: true,
    cwd: config.src,
    dest: config.build + '/' + config.src,
    src: [
      '**/*',
      '!**/*.js',
      '!**/*.scss',
      '!**/*.css'
    ]
  },
  dist: {
    expand: true,
    cwd: config.build + '/' + config.src,
    dest: config.dist,
    src: [
      '**/*',
      '!**/*.js',
      '!**/*.scss',
      '!**/*.css',
      '!**/*.html'
    ]
  },
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
