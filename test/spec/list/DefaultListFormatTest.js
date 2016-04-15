/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';


var DefaultListFormat = require('list/DefaultListFormat'),
    Formatter = require('core/Formatter');


var expect = chai.expect;


describe('DefaultListFormat', function () {
  var defaultListFormat,
      formatter;

  afterEach(function () {
    try {
      defaultListFormat.destroy();
      formatter.destroy();
    } catch (e) {
      /* Ignore, already destroyed */
    }
  });

  beforeEach(function () {
    formatter = Formatter();
    defaultListFormat = DefaultListFormat({formatter: formatter});
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof DefaultListFormat).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(DefaultListFormat).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      expect(defaultListFormat.destroy).to.not.throw(Error);
    });
  });

  describe('format', function () {


    it('has such a method', function () {
      expect(defaultListFormat).to.respondTo('format');
    });

    it('returns an HTMLElement', function () {
      var result;

      result = defaultListFormat.format({});
      expect(result).to.be.instanceof(HTMLElement);
    });

    it('delegates to markup methods', function () {
      var asideSpy,
          calloutSpy,
          classesSpy,
          headerSpy,
          subheaderSpy;

      asideSpy = sinon.spy(defaultListFormat, 'getAsideMarkup');
      calloutSpy = sinon.spy(defaultListFormat, 'getCalloutMarkup');
      classesSpy = sinon.spy(defaultListFormat, 'getClasses');
      headerSpy = sinon.spy(defaultListFormat, 'getHeaderMarkup');
      subheaderSpy = sinon.spy(defaultListFormat, 'getSubheaderMarkup');

      defaultListFormat.format({});

      expect(asideSpy.callCount).to.equal(1);
      expect(calloutSpy.callCount).to.equal(1);
      expect(classesSpy.callCount).to.equal(1);
      expect(headerSpy.callCount).to.equal(1);
      expect(subheaderSpy.callCount).to.equal(1);

      asideSpy.restore();
      calloutSpy.restore();
      classesSpy.restore();
      headerSpy.restore();
      subheaderSpy.restore();
    });
  });

  describe('getAsideMarkup', function () {
    it('delegates to formatter and does not fail on null', function () {
      var depthSpy;

      depthSpy = sinon.spy(formatter, 'depth');
      defaultListFormat.getAsideMarkup();

      expect(depthSpy.callCount).to.equal(1);
      depthSpy.restore();
    });
  });

  describe('getCalloutMarkup', function () {
    it('delegates to formatter and does not fail on null', function () {
      var magnitudeSpy;

      magnitudeSpy = sinon.spy(formatter, 'magnitude');
      defaultListFormat.getCalloutMarkup();

      expect(magnitudeSpy.callCount).to.equal(1);
      magnitudeSpy.restore();
    });
  });

  describe('getClasses', function () {
    it('returns expected object', function () {
      var result;

      result = defaultListFormat.getClasses();

      expect(typeof result).to.equal('object');
      /* jshint -W030 */
      expect(result.hasOwnProperty('classes')).to.be.true;
      expect(Array.isArray(result.classes)).to.be.true;
      /* jshint +W030 */
      expect(result.classes.indexOf('eq-list-item')).to.not.equal(-1);
    });
  });

  describe('getHeaderMarkup', function () {
    it('pulls place property off object and falls back', function () {
      var propertySpy,
          result;

      propertySpy = sinon.spy(defaultListFormat, 'getProperty');
      result = defaultListFormat.getHeaderMarkup();

      expect(propertySpy.callCount).to.equal(1);
      /* jshint -W030 */
      expect(propertySpy.calledWith(undefined, 'place')).to.be.true;
      /* jshint +W030 */
      expect(result).to.equal('Unknown Event');

      propertySpy.restore();
    });
  });

  describe('getProperty', function () {
    it('returns null when does not exist', function () {
      var result;

      result = defaultListFormat.getProperty({}, 'foo');
      /* jshint -W030 */
      expect(result).to.be.null;
      /* jshint +W030 */
    });

    it('returns the correct value when property exists', function () {
      var result;

      result = defaultListFormat.getProperty(
          {properties: {foo: 'foo', bar: 'bar'}}, 'foo');

      expect(result).to.equal('foo');
    });
  });

  describe('getSubheaderMarkup', function () {
    it('delegates to formatter', function () {
      var timeSpy;

      timeSpy = sinon.spy(formatter, 'datetime');
      defaultListFormat.getSubheaderMarkup();

      expect(timeSpy.callCount).to.equal(1);
      timeSpy.restore();
    });
  });
});
