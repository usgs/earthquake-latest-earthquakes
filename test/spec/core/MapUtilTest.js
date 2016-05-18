/* global chai, describe, it */
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

});