require.config({
  baseUrl: 'js',
  urlArgs: 'stamp=' + (new Date()).getTime()
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
