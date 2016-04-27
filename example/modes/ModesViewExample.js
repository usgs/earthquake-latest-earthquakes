'use strict';


var Collection = require('mvc/Collection'),
    Config = require('latesteqs/LatestEarthquakesConfig'),
    Model = require('mvc/Model'),
    ModesView = require('modes/ModesView');


var collection,
    config,
    el,
    modesView,
    viewModes;

collection = Collection();

config = Config({
  'event':{}
});

viewModes = config.options.viewModes.data();
collection.addAll(viewModes);

el = document.querySelector('#modes-view-example');

modesView = ModesView({
  el: el,
  collection: collection,
  model: Model({
    viewModes: [viewModes[0], viewModes[1], viewModes[2], viewModes[3]],
  }),
  watchProperty: 'viewModes'
});

modesView.render();
