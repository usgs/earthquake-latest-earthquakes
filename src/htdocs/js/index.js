/* global SCENARIO_MODE */
'use strict';

var LatestEarthquakes = require('latesteqs/LatestEarthquakes'),
    Xhr = require('util/Xhr');

if (SCENARIO_MODE) {
  // fetch catalog feeds
  Xhr.ajax({
    url: 'https://earthquake.usgs.gov/scenarios/catalog/index.json.php',
    success: function (data) {
      var feeds,
          url;

      feeds = [];
      url = 'https://earthquake.usgs.gov/fdsnws/scenario/1/query.geojson' +
          '?starttime=1900/01/01T00:00:00Z';

      for (var i = 0, len = data.length; i < len; i++) {
        feeds.push({
          'id': data[i].id,
          'name': data[i].title,
          'url': url + '&catalog=' + data[i].id
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

