/* global chai, describe, it, L */
'use strict';

var MapUtil = require('core/MapUtil');

var expect = chai.expect;


describe('Unit tests for MapUtil', function () {

  describe('boundsContain', function () {
    var bounds;

    bounds = [
      [10, -130], // southwest
      [30, -110] // northeast
    ];

    it('contains the point', function () {
      /* jshint -W030 */
      expect(MapUtil.boundsContain(bounds, [20, -120])).to.be.true;
      expect(MapUtil.boundsContain(bounds, [10, -120])).to.be.true;
      expect(MapUtil.boundsContain(bounds, [20, -130])).to.be.true;
      /* jshint +W030 */
    });

    it('does NOT contain the point', function () {
      /* jshint -W030 */
      expect(MapUtil.boundsContain(bounds, [40, -140])).to.be.false;
      expect(MapUtil.boundsContain(bounds, [40, -120])).to.be.false;
      expect(MapUtil.boundsContain(bounds, [20, -140])).to.be.false;
      /* jshint +W030 */
    });
  });

  describe('convertBounds', function () {
    var leafletBounds,
        mappositionBounds;

    mappositionBounds = [
      [10, -130], // southwest
      [30, -110] // northeast
    ];
    leafletBounds = new L.LatLngBounds(mappositionBounds);

    it('does NOT contain the point', function () {
      expect(MapUtil.convertBounds(leafletBounds)).to.deep.equal(mappositionBounds);
    });
  });

});
