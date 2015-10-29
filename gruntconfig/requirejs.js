'use strict';

var config = require('./config');

var requirejs = {
  dev: {
    options: {
      appDir: config.src + '/htdocs/js',
      baseUrl: '.',
      dir: config.build + '/' + config.src + '/htdocs/js',
      useStrict: true,
      wrap: false,
      removeCombined: true,
      optimize: 'none',
      generateSourceMaps: true,
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
  },
  test: {
    options: {
      appDir: config.test,
      baseUrl: '.',
      dir: config.build + '/' + config.test,
      useStrict: true,
      wrap: false,
      removeCombined: true,
      optimize: 'none',
      paths: {
        requireLib: '../node_modules/requirejs/require'
      },

      modules: [
        {
          name: 'test',
          include:[
            'requireLib'
          ]
        }
      ]
    }
  }
};

module.exports = requirejs;
