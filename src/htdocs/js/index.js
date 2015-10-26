require.config({
  baseUrl: 'js',
  paths: {
    leaflet: '../leaflet/dist/leaflet-custom-src',
    localStorage: '../lib/localStorage',
    JSON: '../lib/JSON'
  },
  shim: {
    leaflet: {exports: 'L'},
    localStorage: {exports: 'localStorage'},
    JSON: {exports: 'JSON'}
  }
});



var _application;

require(
  ['eq/EarthquakeApp'],
  function(EarthquakeApp) {
    'use strict';

    _application = new EarthquakeApp({
      el: document.getElementById('application')
    });

  }
);
