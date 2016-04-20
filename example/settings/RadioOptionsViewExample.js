'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    RadioOptionsView = require('settings/RadioOptionsView');

var collection,
    el,
    radioOptionsView;

collection = Collection();
collection.addAll(
  [
    {
      'id': '1day_m25',
      'name' : '1 Day, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_day.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '1day_all',
      'name' : '1 Day, All Magnitudes Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/all_day.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m45',
      'name' : '7 Days, Magnitude 4.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_week.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m25',
      'name' : '7 Days, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_week.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_all',
      'name' : '7 Days, All Magnitudes Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/all_week.geojsonp',
      'autoUpdate': 60 * 1000
    },
    // Added Significant feed here
    {
      'id': '30day_sig',
      'name': '30 Days, Significant Worldwide',
      'url': '/earthquakes/feed/v1.0/summary/significant_month.geojsonp',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m45',
      'name' : '30 Days, Magnitude 4.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_month.geojsonp',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m25',
      'name' : '30 Days, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_month.geojsonp',
      'autoUpdate': 15 * 60 * 1000
    }
  ]
);

el = document.querySelector('#radio-options-view-example');

radioOptionsView = RadioOptionsView({
  el: el,
  collection: collection,
  model: Model({
    'feeds': {id: '7day_m25'}
  }),
  watchProperty: 'feeds'
});
