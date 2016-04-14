'use strict';

var DefaultListFormat = require('list/DefaultListFormat'),
    Xhr = require('util/Xhr');


Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    var defaultListFormat,
        list;

    defaultListFormat = DefaultListFormat();

    list = document.createElement('ul');
    list.classList.add('no-style');
    (data.features || []).forEach(function (feature) {
      var item;

      item = list.appendChild(document.createElement('li'));
      item.appendChild(defaultListFormat.format(feature));
    });

    document.querySelector('#default-list-format-example').appendChild(list);
  },
  error: function () {
    document.querySelector('#default-list-format-example').innerHTML =
        '<p class="alert error">Failed to create default list format.</p>';
  }
});
