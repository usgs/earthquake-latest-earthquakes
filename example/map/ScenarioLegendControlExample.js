/* global L */
'use strict';


var Terrain = require('leaflet/layer/Terrain');

require('map/ScenarioLegendControl');


var initialize = function () {
  var scenarioLegendControl,
      map,
      natgeo;

  map = L.map(document.querySelector('.map'), {
      attributionControl: false,
      center: [40.0, -105.0],
      zoom: 3,
      zoomControl: false
    });
  scenarioLegendControl = L.control.scenarioLegendControl();
  natgeo = Terrain({
    'provider': Terrain.NATGEO
  });

  map.addLayer(natgeo);
  map.addControl(scenarioLegendControl);
};


initialize();
