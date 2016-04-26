/* global L */
'use strict';

var LegendControl = require('map/LegendControl');

var map = new L.map(document.querySelector('.map'), {
    center: new L.latLng(40.0, -105.0),
    zoom: 3
  });
var legendControl = new LegendControl();
var natgeo = new L.tileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');

map.addLayer(natgeo);
map.addControl(legendControl);
