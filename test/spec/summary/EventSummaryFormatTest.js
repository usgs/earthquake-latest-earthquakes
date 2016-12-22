/* global before, chai, describe, it, sinon */
'use strict';

var EventSummaryFormat = require('summary/EventSummaryFormat'),
    Formatter = require('core/Formatter');

var expect = chai.expect;

var feature = {
  properties: {
    mag: 4.1,
    place: '9km NE of Noatak, Alaska',
    time: 1460494200000,
    updated: 1460496137194,
    tz: -480,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/ak13428667',
    detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ak13428667.geojson',
    felt: 0,
    cdi: 1,
    mmi: 4.46,
    alert: 'green',
    status: 'reviewed',
    tsunami: 1,
    sig: 259,
    net: 'ak',
    code: '13428667',
    ids: ',ak13428667,',
    sources: ',ak,',
    types: ',cap,dyfi,general-link,geoserve,losspager,nearby-cities,origin,shakemap,',
    nst: null,
    dmin: null,
    rms: 0.64,
    gap: null,
    magType: 'ml',
    type: 'earthquake',
    title: 'M 4.1 - 9km NE of Noatak, Alaska'
  },
  geometry: {
    type: 'Point',
    coordinates: [
      -162.8311,
      67.6369,
      13.7
    ]
  },
  id: 'ak13428667'
};

var featureNoData = {
  properties: {
    mag: 4.1,
    place: '9km NE of Noatak, Alaska',
    time: null,
    updated: 1460496137194,
    tz: -480,
    url: 'https://earthquake.usgs.gov/earthquakes/eventpage/ak13428667',
    detail: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/ak13428667.geojson',
    felt: 0,
    cdi: null,
    mmi: null,
    alert: null,
    status: 'reviewed',
    tsunami: 0,
    sig: 259,
    net: 'ak',
    code: '13428667',
    ids: ',ak13428667,',
    sources: ',ak,',
    types: ',cap,dyfi,general-link,geoserve,losspager,nearby-cities,origin,shakemap,',
    nst: null,
    dmin: null,
    rms: 0.64,
    gap: null,
    magType: 'ml',
    type: 'earthquake',
    title: 'M 4.1 - 9km NE of Noatak, Alaska'
  },
  geometry: {
    type: 'Point',
    coordinates: [
      null,
      null,
      null
    ]
  },
  id: 'ak13428667'
};

describe('summary/EventSummaryFormat', function () {

  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof EventSummaryFormat).to.equal('function');
    });
  });

  describe('format with data', function () {
    var el,
        formatView;

    before(function () {
      formatView = EventSummaryFormat();
      el = formatView.format(feature);
    });

    it('creates an event summary', function () {
      expect(el.classList.contains('event-summary')).to.equal(true);
    });

    it('displays the cdi correctly when cdi data is unavailable', function () {
      expect(el.querySelector('.mmiI > .roman').innerHTML).to.equal('I');
    });

    it('displays the mmi correctly when mmi data is available', function () {
      expect(el.querySelector('.mmiIV > .roman').innerHTML).to.equal('IV');
    });

    it('displays the alertlevel when alertlevel data is available', function () {
      expect(el.querySelector('.pager-alertlevel-green > .roman').innerHTML).to.equal('GREEN');
    });

    it('displays tsunami when tsunami data is available', function () {
      expect(el.querySelector('.tsunami')).to.not.equal('stuff');
    });

    it('displays time', function () {
      expect(el.querySelector('time').innerHTML).to.equal('2016-04-12 20:50:00 (UTC)');
    });

    it('displays location', function () {
      expect(el.querySelector('.location').innerHTML).to.equal('67.637°N&nbsp;162.831°W');
    });

    it('display depth', function () {
      expect(el.querySelector('.depth').innerHTML).to.equal('13.7 km');
    });
  });

  describe('format without data', function () {
    var el,
        formatView;

    before(function () {
      formatView = EventSummaryFormat();
      el = formatView.format(featureNoData);
    });

    it('displays the cdi correctly when cdi data is unavailable', function () {
      expect(el.querySelector('.mmiI > .roman')).to.equal(null);
    });

    it('displays the mmi correctly when mmi data is unavailable', function () {
      expect(el.querySelector('.mmiIV > .roman')).to.equal(null);
    });

    it('displays the alertlevel when alertlevel data is unavailable', function () {
      expect(el.querySelector('.pager-alertlevel-green > .roman')).to.equal(null);
    });

    it('displays tsunami when tsunami data is unavailable', function () {
      expect(el.querySelector('.tsunami')).to.equal(null);
    });
  });

  describe('setTimezoneOffset', function () {
    var formatter,
        formatView;

    before(function () {
      formatter = Formatter();
      formatView = EventSummaryFormat({formatter: formatter});
    });

    it('sets timezone offset that is passed to datetime format', function () {
      var timeSpy;

      timeSpy = sinon.spy(formatter, 'datetime');
      formatView.setTimezoneOffset(12345);
      formatView.format(featureNoData);

      expect(timeSpy.getCall(0).args[1]).to.equal(12345);
      timeSpy.restore();
    });
  });

});


//expect(el.querySelector('.mmi')).to.equal('test');
