/* global chai, describe, it */
'use strict';


var LegendControl = require('map/LegendControl');


var expect = chai.expect;


describe('map/LegendControl', function () {
  describe('constructor', function () {
    it('Can be required', function () {
      /* jshint -W030 */
      expect(LegendControl).to.not.be.null;
      /* jshint +W030 */
    });

    it('Can be instantiated', function () {
      var control;

      control = LegendControl();

      /* jshint -W030 */
      expect(control).to.not.be.null;
      /* jshint +W030 */
    });
  });

  describe('onAdd', function () {
    it('returns a container as expected', function () {
      var control,
          result;

      control = LegendControl();
      result = control.onAdd();

      /* jshint -W030 */
      expect(result).to.be.instanceOf(HTMLElement);
      expect(result.classList.contains('legend-control'))
          .to.be.true;
      expect(result.querySelectorAll('.legend-control-item').length)
          .to.equal(4);
      /* jshint +W030 */
    });
  });
});
