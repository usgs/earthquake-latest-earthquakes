'use strict';

var Formatter = require('core/Formatter'),
    Util = require('util/Util');


var _DEFAULTS = {

};

/**
 * Formats an event summary
 * @param options {Object}
 */
var EventSummaryFormat = function (options) {
  var _this,
      _initialize,

      _formatter;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _formatter = options.formatter || Formatter();
  };


  _this.destroy = Util.compose(function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Formats earthquake data for the list.
   *
   * @param eq {Object}
   *    a featured object from the summary feed.
   * @return {DOMElement}
   *    dom element with formatted information.
   */
  _this.format = function (eq) {
    var alertlevel,
        buf,
        cdi,
        coordinates,
        depth,
        el,
        impactBuf,
        latitude,
        location,
        longitude,
        mmi,
        properties,
        time,
        tsunami,
        url;

    el = document.createElement('div');
    el.className = 'event-summary';

    properties = eq.properties;
    alertlevel = properties.alert;
    cdi = properties.cdi;
    mmi = properties.mmi;
    tsunami = properties.tsunami;
    time = new Date(properties.time);
    url = properties.url;

    coordinates = eq.geometry.coordinates;
    depth = coordinates[2];
    latitude = coordinates[1];
    longitude = coordinates[0];

    time = _formatter.datetime(time, 0, false);
    location = _formatter.location(latitude, longitude);
    depth = _formatter.depth(depth, 'km');

    buf = [];
    impactBuf = [];

    buf.push(
      '<h1>',
        '<a href="', url, '">',
          properties.title,
        '</a>',
      '</h1>'
    );

    if (typeof cdi !== 'undefined' && cdi !== null) {
      cdi = _formatter.mmi(cdi);
      impactBuf.push('<a href="' + url + '#dyfi"' +
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
      impactBuf.push('<a href="' + url + '#shakemap"' +
          ' class="mmi' + mmi + '"' +
          ' title="ShakeMap maximum estimated intensity"' +
          '>' +
            '<strong class="roman">' + mmi + '</strong>' +
            '<br/>' +
            '<abbr title="ShakeMap">ShakeMap</abbr>' +
          '</a>');
    }
    if (typeof alertlevel !== 'undefined' && alertlevel !== null) {
      impactBuf.push('<a href="' + url + '#pager"' +
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
          '<dd class="location">', location,
          '</dd>',
        '<dt>Depth</dt>',
          '<dd class="depth">', depth, '</dd>',
      '</dl>'
    );

    el.innerHTML = buf.join('');
    return el;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EventSummaryFormat;
