/* global chai, describe, it*/
'use strict';

var L = require('leaflet'),
    LegendControl = require('map/LegendControl');

var expect = chai.expect;

var map = new L.map(L.DomUtil.create('div', 'map'), {
  center: new L.latLng(40.0, -105.0),
  zoom: 3
});
var natgeo = new L.tileLayer('http://server.arcgisonline.com' +
    '/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}');


map.addLayer(natgeo);

describe('LegendControl', function () {

  it('Can be required', function () {
    /* jshint -W030 */
    expect(LegendControl).to.not.be.null;
    /* jshint +W030 */
  });

  it('Can be instantiated', function () {
    var control;

    control = new LegendControl();

    map.addControl(control);
    /* jshint -W030 */
    expect(control).to.not.be.null;
    expect(control.options).to.not.be.null;
    expect(control._map).to.not.be.undefined;
    /* jshint +W030 */
  });

});
