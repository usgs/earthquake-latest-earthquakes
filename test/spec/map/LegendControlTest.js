/* global chai, describe, it, L*/
'use strict';

require('map/LegendControl');

var expect = chai.expect;

var map = L.map(L.DomUtil.create('div', 'map'), {
  center: [40.0, -105.0],
  zoom: 3
});


describe('LegendControl', function () {

  it('Can be required', function () {
    /* jshint -W030 */
    expect(L.control.legendControl).to.not.be.null;
    /* jshint +W030 */
  });

  it('Can be instantiated', function () {
    var control;

    control = L.control.legendControl();

    map.addControl(control);
    /* jshint -W030 */
    expect(control).to.not.be.null;
    expect(control.options).to.not.be.null;
    expect(control._map).to.not.be.undefined;
    /* jshint +W030 */
  });

});
