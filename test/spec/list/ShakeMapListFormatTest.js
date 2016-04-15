/* global chai, describe, it */
'use strict';


var ShakeMapListFormat = require('list/ShakeMapListFormat');


var expect = chai.expect;


describe('ShakeMapListFormat', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof ShakeMapListFormat).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(ShakeMapListFormat).to.not.throw(Error);
    });
  });

  describe('getCalloutMarkup', function () {
    var shakeMapListFormat = ShakeMapListFormat();
    it('returns shakemap specific markup', function () {
      expect(shakeMapListFormat.getCalloutMarkup({
        properties: {
          mmi:4.4
        }
      })).to.contain('mmiIV');
    });
  });
});
