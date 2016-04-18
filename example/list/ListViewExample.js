'use strict';

var ListView = require('list/ListView'),
    Xhr = require('util/Xhr');


Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (/*data*/) {
    var listView;

    listView = ListView({
      el: document.querySelector('#list-view-example')
    });
    listView.render();
  },
  error: function () {
    document.querySelector('#default-list-format-example').innerHTML =
        '<p class="alert error">Failed to create default list format.</p>';
  }
});
