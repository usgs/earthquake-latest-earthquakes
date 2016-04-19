'use strict';

var Collection = require('mvc/Collection'),
    ListView = require('list/ListView'),
    Xhr = require('util/Xhr');


var collection,
    listView;


collection = Collection();

listView = ListView({
  // listFormat: require('list/DefaultListFormat')(), // optional

  catalog: collection, // may be latesteqs/Catalog, but only need Collection
  el: document.querySelector('#list-view-example')
});


Xhr.ajax({
  url: '/feeds/2.5_week.json',
  success: function (data) {
    collection.reset(data.features || []);
  },
  error: function () {
    collection.reset([]);
  }
});
