'use strict';

var DownloadView = require('list/DownloadView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');


Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    var downloadView,
        el;

    el = document.querySelector('#download-view-example');

    downloadView = DownloadView({el: el, model: Model(data)});

    downloadView.render();

  },
  error: function () {
    document.querySelector('#download-view-example').innerHTML =
        '<p class="alert error">Failed to create download view example.</p>';
  }
});
