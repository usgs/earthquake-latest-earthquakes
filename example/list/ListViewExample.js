'use strict';

var Collection = require('mvc/Collection'),
    DefaultListFormat = require('list/DefaultListFormat'),
    ListView = require('list/ListView'),
    Model = require('mvc/Model'),
    Xhr = require('util/Xhr');


var listView,
    model;

model = Model({
  catalog: Collection(),
  listFormat: DefaultListFormat()
});

listView = ListView({
  el: document.querySelector('#list-view-example'),
  model: model
});

Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    model.get('catalog').reset(data.features || []);
    model.trigger('change');
  },
  error: function () {
    model.get('catalog').reset([]);
    model.trigger('change');
  }
});
