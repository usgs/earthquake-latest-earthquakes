'use strict';

var ShakeMapListFormat = require('list/ShakeMapListFormat'),
    Xhr = require('util/Xhr');

Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    var list,
        shakeMapListFormat;

    shakeMapListFormat = ShakeMapListFormat();

    list = document.createElement('ul');
    list.classList.add('no-style');

    (data.features||[]).forEach(function (feature) {
      var item;

      item = list.appendChild(document.createElement('li'));
      item.appendChild(shakeMapListFormat.format(feature));
    });

    document.querySelector('#shakemap-list-format-example').appendChild(list);

  },
  error: function () {
    document.querySelector('#shakemap-list-format-example').innerHTML =
        '<p class="alert error">Failed to create Shakemap list format.</p>';
  }
});
