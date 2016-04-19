/* global chai, describe, it */
'use strict';


var CheckboxOptionsView = require('settings/CheckboxOptionsView');


var expect = chai.expect;


describe('CheckboxOptionsView', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof CheckboxOptionsView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(CheckboxOptionsView).to.not.throw(Error);
    });
  });
});
