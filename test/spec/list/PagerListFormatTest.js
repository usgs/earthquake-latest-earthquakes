/* global chai, describe, it */
'use strict';


var PagerListFormat = require('list/PagerListFormat');


var expect = chai.expect;


describe('PagerListFormat', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof PagerListFormat).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(PagerListFormat).to.not.throw(Error);
    });
  });
});
