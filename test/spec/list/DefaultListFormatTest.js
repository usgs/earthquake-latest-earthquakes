/* global chai, describe, it */
'use strict';


var DefaultListFormat = require('list/DefaultListFormat');


var expect = chai.expect;


describe('DefaultListFormat', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof DefaultListFormat).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(DefaultListFormat).to.not.throw(Error);
    });
  });
});
