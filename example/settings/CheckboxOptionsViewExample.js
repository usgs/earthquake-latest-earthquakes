'use strict';

var Collection = require('mvc/Collection'),
    Config = require('latesteqs/Config'),
    Model = require('mvc/Model'),
    CheckboxOptionsView = require('settings/CheckboxOptionsView');

var collection,
    config,
    overlays,
    el,
    checkboxOptionsView;

collection = Collection();
config = Config();

overlays = config.options.overlays.data();
collection.addAll(overlays);

el = document.querySelector('#checkbox-options-view-example');

checkboxOptionsView = CheckboxOptionsView({
  el: el,
  collection: collection,
  model: Model({
    overlays: [overlays[0], overlays[1]],
  }),
  watchProperty: 'overlays'
});

checkboxOptionsView.render();