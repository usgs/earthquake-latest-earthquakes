'use strict';

var Catalog = require('latesteqs/Catalog'),
    DefaultListFormat = require('list/DefaultListFormat'),
    DYFIListFormat = require('list/DyfiListFormat'),
    ListView = require('list/ListView'),
    PagerListFormat = require('list/PagerListFormat'),
    ShakeMapListFormat = require('list/ShakeMapListFormat'),
    Xhr = require('util/Xhr');


var catalog,
    formats,
    listView,

    onFormatClick;


formats = {
  'default-format': null,
  'magnitude-format': {format: DefaultListFormat()},
  'dyfi-format': {format: DYFIListFormat()},
  'shakemap-format': {format: ShakeMapListFormat()},
  'pager-format': {format: PagerListFormat()}
};

// -- Start basic usage example
catalog = Catalog();

listView = ListView({
  collection: catalog,
  el: document.querySelector('#list-view-example')
});

// -- End basic usage example

catalog.loadUrl('/feeds/2.5_week.json');

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
