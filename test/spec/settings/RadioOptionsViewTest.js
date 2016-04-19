/* global chai, describe, it */
'use strict';


var RadioOptionsView = require('settings/RadioOptionsView');


var expect = chai.expect;


describe('RadioOptionsView', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof RadioOptionsView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(RadioOptionsView).to.not.throw(Error);
    });
  });
});
