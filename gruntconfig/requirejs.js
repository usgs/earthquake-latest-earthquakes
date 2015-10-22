'use strict';

var config = require('./config');

var requirejs = {
  dist: {
    options: {
      appDir: config.src + '/htdocs/js',
      baseUrl: '.',
      dir: config.dist + '/htdocs/js',
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
};

module.exports = requirejs;
