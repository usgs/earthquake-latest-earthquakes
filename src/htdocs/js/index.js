/* global SCENARIO_MODE */
'use strict';

var LatestEarthquakes = require('latesteqs/LatestEarthquakes'),
    Xhr = require('util/Xhr');

if (SCENARIO_MODE) {
  // fetch catalog feeds
  Xhr.ajax({
    url: 'https://earthquake.usgs.gov/scenarios/catalog/index.json.php',
    success: function (data) {
      var feeds;

      feeds = [];

      for (var i = 0, len = data.length; i < len; i++) {
        feeds.push({
          'id': data[i].id,
          'name': data[i].title,
          'bbox': data[i].bbox,
          'params': {
            'catalog': data[i].id,
            'starttime': '1900-01-01T00:00:00Z'
          }
        });
      }

      LatestEarthquakes({
        el: document.querySelector('#latest-earthquakes'),
        feed: feeds
      });
    },
    error: function () {
      // TODO
    }
  });
} else {
  LatestEarthquakes({
    el: document.querySelector('#latest-earthquakes')
  });
}
