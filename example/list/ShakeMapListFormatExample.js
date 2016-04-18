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
    list.appendChild((data.features||[]).reduce(function (fragment, feature) {
      var item;

      item = document.createElement('li');
      item.appendChild(shakeMapListFormat.format(feature));

      fragment.appendChild(item);
      return fragment;
    }, document.createDocumentFragment()));

    document.querySelector('#shakemap-list-format-example').appendChild(list);
  },
  error: function () {
    document.querySelector('#shakemap-list-format-example').innerHTML =
        '<p class="alert error">Failed to create Shakemap list format.</p>';
  }
});
