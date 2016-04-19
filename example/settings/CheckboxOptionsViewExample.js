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
      'url': tileHost + '/basemap/tiles/plates/{z}/{x}/{y}.png',
      'zindex': 5,
      'attribution': 'USGS'
    },
    {
      'id': 'faults',
      'name': 'U.S. Faults',
      'tileUrl': tileHost + '/basemap/tiles/faults/{z}/{x}/{y}.png',
      'dataUrl': tileHost + '/basemap/tiles/faults/{z}/{x}/{y}.grid.json?callback={cb}',
      'zindex': 4,
      'attribution': 'USGS',
      'className': 'MouseOverLayer',
      'tiptext': '{NAME}'
    },
    {
      'id': 'ushazard',
      'name': 'U.S. Hazard',
      'url': tileHost + '/basemap/tiles/ushaz/{z}/{y}/{x}.png',
      'format': 'ArcCache',
      'zindex': 3,
      'opacity': 0.6,
      'attribution': ''
    }
  ],
);

el = document.querySelector('#checkbox-options-view-example');

checkboxOptionsView = CheckboxOptionsView({
  el: el,
  collection: collection,
  model: Model({
    overlays: 'faults'
  }),
  section: 'overlays'
});
