'use strict';

var Collection = require('mvc/Collection'),
    DefaultListFormat = require('list/DefaultListFormat'),
    DYFIListFormat = require('list/DefaultListFormat'), // TODO
    ListView = require('list/ListView'),
    PagerListFormat = require('list/PagerListFormat'),
    ShakeMapListFormat = require('list/ShakeMapListFormat'),
    Xhr = require('util/Xhr');


var formats,
    listView,

    onFormatClick;


formats = {
  'default-format': null,
  'magnitude-format': DefaultListFormat(),
  'dyfi-format': DYFIListFormat(),
  'shakemap-format': ShakeMapListFormat(),
  'pager-format': PagerListFormat()
};

// -- Start basic usage example

listView = ListView({
  collection: Collection(),
  el: document.querySelector('#list-view-example')
});

// -- End basic usage example




Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    listView.collection.reset(data.features || []);
  },
  error: function () {
    listView.collection.reset([]);
  }
});

onFormatClick = function (evt) {
  var format,
      target;

  target = evt ? evt.target : null;

  if (target && target.nodeName.toUpperCase() === 'BUTTON') {
    Array.prototype.forEach.call(evt.currentTarget.querySelectorAll('button'),
    function (button) {
      if (button === target) {
        button.classList.add('green');
        button.classList.add('confirm');
      } else {
        button.classList.remove('green');
        button.classList.remove('confirm');
      }
    });

    format = target.getAttribute('data-format');
    if (formats.hasOwnProperty(format)) {
      listView.model.set({'listFormat': formats[format]});
    }
  }
};

document.querySelector('.format-options').addEventListener('click',
    onFormatClick);
