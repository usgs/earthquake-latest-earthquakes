'use strict';

var Formatter = require('core/Formatter'),
    Util = require('util/Util');

var _DEFAULTS = {

};

var EventSummaryFormat = function (options) {
  var _this,
      _initialize,

      _formatter;


  _this = {};

  _initialize = function(options) {
    options = Util.extend({}, _DEFAULTS, options);
    _formatter = options.formatter || Formatter();
  };

  _this.destroy = Util.compose(function () {
    _this = null;
    _initialize = null;

    _formatter = null;
  }, _this.destroy);

  _this.format = function (eq) {
    var alertlevel,
        buf,
        cdi,
        coordinates,
        depth,
        impactBuf,
        latitude,
        longitude,
        mmi,
        properties,
        time,
        tsunami;


    properties = eq.properties;
    alertlevel = properties.alert;
    cdi = properties.cdi;
    mmi = properties.mmi;
    tsunami = properties.tsunami;
    time = Date(properties.time);

    coordinates = eq.geometry.coordinates;
    depth = coordinates[2];
    latitude = coordinates[1];
    longitude = coordinates[0];

    buf = [];
    impactBuf = [];

    if (typeof cdi !== 'undefined' && cdi !== null) {
      cdi = _formatter.mmi(cdi);
      impactBuf.push('<a href="#dyfi"' +
          ' class="mmi' + cdi + '"' +
          ' title="Did You Feel It? maximum reported intensity"' +
          '>' +
            '<strong class="roman">' + cdi + '</strong>' +
            '<br/>' +
            '<abbr title="Did You Feel It?">DYFI?</abbr>' +
          '</a>');
    }

    if (typeof mmi !== 'undefined' && mmi !== null) {
      mmi = _formatter.mmi(mmi);
      impactBuf.push('<a href="#shakemap"' +
          ' class="mmi' + mmi + '"' +
          ' title="ShakeMap maximum estimated intensity"' +
          '>' +
            '<strong class="roman">' + mmi + '</strong>' +
            '<br/>' +
            '<abbr title="ShakeMap">ShakeMap</abbr>' +
          '</a>');
    }
    if (typeof alertlevel !== 'undefined' && alertlevel !== null) {
      impactBuf.push('<a href="#pager"' +
          ' class="pager-alertlevel-' + alertlevel.toLowerCase() + '"' +
          ' title="PAGER estimated impact alert level"' +
          '>' +
            '<strong class="roman">' +
              alertlevel.toUpperCase() +
            '</strong>' +
            '<br/>' +
            '<abbr title="' +
                'Prompt Assessment of Global Earthquakes for Response' +
                '">PAGER</abbr>' +
          '</a>');
    }
    if (typeof tsunami !== 'undefined' && tsunami !== null && tsunami > 0) {
      impactBuf.push('<a href="http://www.tsunami.gov/"' +
          ' class="tsunami"' +
          ' title="Tsunami Warning Center"' +
          '>' +
            '<img src="images/logos/tsunami.jpg"' +
                ' alt="Tsunami Warning Center"/>' +
          '</a>');
    }
    if (impactBuf.length > 0) {
      buf.push('<div class="impact-bubbles clearfix">' +
          impactBuf.join('') +
          '</div>');
    }

    if (time !== 'undefined' && time !== null) {
      time = _formatter.datetime(time, 0, false);
    } else {
      time = '&ndash;';
    }
    if (latitude !== 'undefined' && latitude !== null) {
      latitude = _formatter.latitude(latitude);
    } else {
      latitude = '&ndash;';
    }
    if (longitude !== 'undefined' && longitude !== null) {
      longitude = _formatter.longitude(longitude);
    } else {
      longitude = '&ndash;';
    }
    if (depth !== 'undefined' && depth !== null) {
      depth = _formatter.depth(depth, 'km');
    } else {
      depth = '&ndash;';
    }

    buf.push(
      '<dl>',
        '<dt>Time</dt>',
        '<dd>',
          '<time datetime="',
              time,
          '">',
            time,
          '</time>',
        '</dd>',
        '<dt>Location</dt>',
          '<dd>', latitude, ' ',
              longitude,
          '</dd>',
        '<dt>Depth</dt>',
          '<dd>', depth, ' km</dd>',
      '</dl>'
    );


    return buf.join('');
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = EventSummaryFormat;
