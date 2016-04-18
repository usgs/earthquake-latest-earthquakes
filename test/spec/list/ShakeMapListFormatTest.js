/* global afterEach, beforeEach, chai, describe, it */
'use strict';


var ShakeMapListFormat = require('list/ShakeMapListFormat');


var expect = chai.expect;


describe('ShakeMapListFormat', function () {
  var shakeMapListFormat;

  afterEach(function () {
    try {
      shakeMapListFormat.destroy();
    } catch (e) {
      /* Ignore, probably just already destroyed */
    }
  });

  beforeEach(function () {
    shakeMapListFormat = ShakeMapListFormat();
  });


  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof ShakeMapListFormat).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(ShakeMapListFormat).to.not.throw(Error);
    });
  });

  describe('getCalloutMarkup', function () {
    it('returns shakemap specific markup', function () {
      expect(shakeMapListFormat.getCalloutMarkup({
        properties: {
          mmi:4.4
        }
      })).to.equal('<span class="roman mmi mmiIV">IV</span>');
    });
  });

  describe('getClasses', function () {
    it('contains the shakemap class', function () {
      var result;

      result = shakeMapListFormat.getClasses();
      expect(result.classes.indexOf('shakemap-list-item')).to.not.equal(-1);
    });
  });

  describe('getHeaderMarkup', function () {
    it('gets correct property', function () {
      var result;

      result = shakeMapListFormat.getHeaderMarkup({
        properties: {
          title:'M 4.1 - 9km NE of Noatak, Alaska'
        }
      });

      expect(result).to.equal('M 4.1 - 9km NE of Noatak, Alaska');

    });
  });

});
