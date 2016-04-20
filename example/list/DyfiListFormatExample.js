'use strict';


var DyfiListFormat = require('list/DyfiListFormat'),
    Xhr = require('util/Xhr');


Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    var list,
        dyfiListFormat;

    dyfiListFormat = DyfiListFormat();

    list = document.createElement('ul');
    list.classList.add('no-style');
    (data.features || []).forEach(function (feature) {
      var item;

      item = list.appendChild(document.createElement('li'));
      item.appendChild(dyfiListFormat.format(feature));
    });

    document.querySelector('#dyfi-list-format-example').appendChild(list);
  },
  error: function () {
    document.querySelector('#dyfi-list-format-example').innerHTML =
        '<p class="alert error">Failed to create DYFI list format.</p>';
  }
});
