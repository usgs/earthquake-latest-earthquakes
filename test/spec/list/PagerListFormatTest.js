/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';


var Formatter = require('core/Formatter'),
    PagerListFormat = require('list/PagerListFormat');


var expect = chai.expect;


describe('PagerListFormat', function () {
  var formatter,
      pagerListFormat;

  afterEach(function () {
    try {
      formatter.destroy();
      pagerListFormat.destroy();
    } catch (e) {
      /* Ignore, probably just already destroyed */
    }
  });

  beforeEach(function () {
    formatter = Formatter();
    pagerListFormat = PagerListFormat({formatter: formatter});
  });


  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof PagerListFormat).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(PagerListFormat).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      expect(pagerListFormat.destroy).to.not.throw(Error);
    });
  });

  describe('getAsideMarkup', function () {
    it('deals with null values', function () {
      var result;

      result = pagerListFormat.getAsideMarkup({});
      expect(result).to.equal('&ndash;');
    });

    it('gets property and converts to mmi', function () {
      var evt,
          mmiSpy,
          propertySpy;

      propertySpy = sinon.spy(pagerListFormat, 'getProperty');
      mmiSpy = sinon.spy(formatter, 'mmi');
      evt = {properties: {mmi: 7.6}};

      pagerListFormat.getAsideMarkup(evt);

      expect(propertySpy.callCount).to.equal(1);
      expect(mmiSpy.callCount).to.equal(1);
      /* jshint -W030 */
      expect(propertySpy.calledWith(evt, 'mmi')).to.be.true;
      /* jshint +W030 */
    });
  });

  describe('getCalloutMarkup', function () {
    it('deals with null values', function () {
      var result;

      result = pagerListFormat.getCalloutMarkup({});
      expect(result).to.equal('&ndash;');
    });

    it('gets correct property', function () {
      var evt,
          propertySpy;

      propertySpy = sinon.spy(pagerListFormat, 'getProperty');
      evt = {properties: {alert: 'silver'}};

      pagerListFormat.getCalloutMarkup(evt);

      expect(propertySpy.callCount).to.equal(1);
      /* jshint -W030 */
      expect(propertySpy.calledWith(evt, 'alert')).to.be.true;
      /* jshint +W030 */
    });
  });

  describe('getClasses', function () {
    it('contains the pager class', function () {
      var result;

      result = pagerListFormat.getClasses();
      expect(result.classes.indexOf('pager-list-item')).to.not.equal(-1);
    });
  });

  describe('getHeaderMarkup', function () {
    it('gets correct property', function () {
      var evt,
          propertySpy;

      propertySpy = sinon.spy(pagerListFormat, 'getProperty');
      evt = {properties: {time: 0}};

      pagerListFormat.getHeaderMarkup(evt);

      expect(propertySpy.callCount).to.equal(1);
      /* jshint -W030 */
      expect(propertySpy.calledWith(evt, 'title')).to.be.true;
      /* jshint +W030 */
    });
  });
});
