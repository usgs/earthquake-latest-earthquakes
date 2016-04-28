/* global L */
'use strict';

require('map/LegendControl');

var initialize = function () {
  var legendControl,
      map,
      natgeo;

  map = L.map(document.querySelector('.map'), {
      center: [40.0, -105.0],
      zoom: 3
    });
  legendControl = L.control.legendControl();
  natgeo = L.tileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');

  map.addLayer(natgeo);
  map.addControl(legendControl);
};

initialize();
