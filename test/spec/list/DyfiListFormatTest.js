/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';

var DyfiListFormat  = require('list/DyfiListFormat');

var expect = chai.expect;

describe('DyfiListFormat', function () {
  var dyfiListFormat;

  afterEach(function () {
    try {
      dyfiListFormat.destroy();
    } catch (e) {
      /* Ignore, probably just already destroyed */
    }
  });

  beforeEach(function () {
    dyfiListFormat = DyfiListFormat();
  });

  describe('constructor', function() {
    it('is defined', function () {
      expect(typeof DyfiListFormat).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(DyfiListFormat).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      expect(dyfiListFormat.destroy).to.not.throw(Error);
    });
  });

  describe('getAsideMarkup', function () {
    it('deals with null values', function () {
      var result;

      result = dyfiListFormat.getAsideMarkup({});
      expect(result).to.equal(
          '<span class="responses">&ndash; responses</span>'
        );
    });

    it('gets property and prints response', function () {
      var dyfiProp,
          responses,
          responsesSpy,
          propertySpy;

      dyfiProp = {properties: {felt: 1}};
      propertySpy = sinon.spy(dyfiListFormat, 'getProperty');
      responsesSpy = sinon.spy(dyfiListFormat, 'getAsideMarkup');

      responses = dyfiListFormat.getAsideMarkup(dyfiProp);

      expect(propertySpy.callCount).to.equal(1);
      expect(responsesSpy.callCount).to.equal(1);
      /* jshint -W030 */
      expect(propertySpy.calledWith(dyfiProp, 'felt')).to.be.true;
      /* jshint +W030 */

      expect(responses).to.equal(
          '<span class="responses">1 response</span>');
    });
  });

  describe('getCalloutMarkup', function () {
    it('deals with null values', function () {
      var result;

      result = dyfiListFormat.getCalloutMarkup({});
      expect(result).to.equal(
          '<span class="no-dyfi">&ndash;</span>');
    });

    it('gets correct property', function () {
      var dyfiProp,
          propertySpy;

      propertySpy = sinon.spy(dyfiListFormat, 'getProperty');
      dyfiProp = {properties: {cdi: 4, felt: 1}};

      dyfiListFormat.getCalloutMarkup(dyfiProp);

      expect(propertySpy.callCount).to.equal(2);
      /* jshint -W030 */
      expect(propertySpy.calledWith(dyfiProp, 'cdi')).to.be.true;
      /* jshint +W030 */
    });
  });

  describe('getClasses', function () {
    it('contains the dyfi class', function () {
      var result;

      result = dyfiListFormat.getClasses();
      expect(result.classes.indexOf('dyfi-list-item')).to.not.equal(-1);
    });
  });

  describe('getHeaderMarkup', function () {
    it('gets correct property', function () {
      var dyfiProp,
          propertySpy;

      propertySpy = sinon.spy(dyfiListFormat, 'getProperty');
      dyfiProp = {properties: {title: 0}};

      dyfiListFormat.getHeaderMarkup(dyfiProp);

      expect(propertySpy.callCount).to.equal(1);
      /* jshint -W030 */
      expect(propertySpy.calledWith(dyfiProp, 'title')).to.be.true;
      /* jshint +W030 */
    });
  });
});
