'use strict';

var Catalog = require('latesteqs/Catalog'),
    DownloadView = require('list/DownloadView');


var initialize = function () {
  var catalog,
      downloadView,
      el,
      search;

  catalog = Catalog();
  search = 'https://earthquake.usgs.gov/fdsnws/event/1/query' +
      '?format=geojson&jsonerror=true' +
      '&starttime=2016-04-21%2000%3A00%3A00' +
      '&endtime=2016-04-28%2023%3A59%3A59' +
      '&maxlatitude=50&minlatitude=24.6' +
      '&maxlongitude=-65' +
      '&minlongitude=-125' +
      '&minmagnitude=3' +
      '&orderby=time';

  el = document.querySelector('#download-view-example');

  downloadView = DownloadView(
    {
      el: el,
      model: catalog.model,
      collection: catalog
    });

  // Comment out the following line, and uncomment the line after that.
  // If you want to test the search functionality.
  catalog.loadUrl('/feeds/2.5_week.json');
  // catalog.loadUrl(search);
};


initialize();
