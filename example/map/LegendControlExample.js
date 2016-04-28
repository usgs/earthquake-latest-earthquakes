/* global L */
'use strict';


var EsriTerrain = require('leaflet/layer/EsriTerrain');

require('map/LegendControl');


var initialize = function () {
  var legendControl,
      map,
      natgeo;

  map = L.map(document.querySelector('.map'), {
      attributionControl: false,
      center: [40.0, -105.0],
      zoom: 3,
      zoomControl: false
    });
  legendControl = L.control.legendControl();
  natgeo = EsriTerrain();

  map.addLayer(natgeo);
  map.addControl(legendControl);
};


initialize();
