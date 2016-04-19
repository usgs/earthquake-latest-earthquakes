'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    CheckboxOptionsView = require('settings/CheckboxOptionsView');

var collection,
    el,
    checkboxOptionsView;

collection = Collection();
collection.addAll(
  [
    {
      'id': 'plates',
      'name': 'Plate Boundaries',
      'zindex': 5,
      'attribution': 'USGS'
    },
    {
      'id': 'faults',
      'name': 'U.S. Faults',
      'zindex': 4,
      'attribution': 'USGS',
      'className': 'MouseOverLayer',
      'tiptext': '{NAME}'
    },
    {
      'id': 'ushazard',
      'name': 'U.S. Hazard',
      'format': 'ArcCache',
      'zindex': 3,
      'opacity': 0.6,
      'attribution': ''
    }
  ]
);

el = document.querySelector('#checkbox-options-view-example');

checkboxOptionsView = CheckboxOptionsView({
  el: el,
  collection: collection,
  model: Model({
    overlays: [{id: 'faults'}]
  }),
  section: 'overlays'
});
