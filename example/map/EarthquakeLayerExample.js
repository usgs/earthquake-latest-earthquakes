/* global L */
'use strict';


var Catalog = require('latesteqs/Catalog'),
    EarthquakeLayer = require('map/EarthquakeLayer'),
    Model = require('mvc/Model'),
    Terrain = require('leaflet/layer/Terrain');


var catalog,
    el,
    model,
    map;

el = document.querySelector('#earthquake-layer-example');
el.innerHTML = '<div class="map"></div>' +
    '<div class="info"></div>';

map = L.map(el.querySelector('.map')).setView([39, -105], 3);
Terrain({
  'provider': Terrain.NATGEO
}).addTo(map);

catalog = Catalog();
model = Model();
map.addLayer(EarthquakeLayer({
  catalog: catalog,
  model: model
}));

model.on('change:event', function () {
  var eq,
      info;

  eq = model.get('event');
  info = el.querySelector('.info');

  info.innerHTML = '<div class="alert info">' +
      (eq ? '<pre>' + JSON.stringify(eq, null, 2) + '</pre>' :
          'No event selected') +
      '</div>';
});

catalog.loadUrl('/feeds/2.5_week.json');
