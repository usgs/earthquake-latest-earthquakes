/* global chai, describe, it */
'use strict';


var ScenarioLegendControl = require('map/ScenarioLegendControl');


var expect = chai.expect;


describe('map/ScenarioLegendControl', function () {
  describe('constructor', function () {
    it('Can be required', function () {
      /* jshint -W030 */
      expect(ScenarioLegendControl).to.not.be.null;
      /* jshint +W030 */
    });

    it('Can be instantiated', function () {
      var control;

      control = ScenarioLegendControl();

      /* jshint -W030 */
      expect(control).to.not.be.null;
      /* jshint +W030 */
    });
  });

  describe('onAdd', function () {
    it('returns a container as expected', function () {
      var control,
          result;

      control = ScenarioLegendControl();
      result = control.onAdd();

      /* jshint -W030 */
      expect(result).to.be.instanceOf(HTMLElement);
      expect(result.classList.contains('legend-control'))
          .to.be.true;
      expect(result.querySelectorAll('.magnitude-legend').length)
          .to.equal(1);
      expect(result.querySelectorAll('.intensity-legend').length)
          .to.equal(1);
      /* jshint +W030 */
    });
  });
});
