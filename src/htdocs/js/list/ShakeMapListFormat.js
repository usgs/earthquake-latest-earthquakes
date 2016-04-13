'use strict';

var Util = require('util/Util');

var _DEFAULTS = {

};

var ShakeMapListFormat = function (options) {
  var _this,
      _initialize,

      _prefix,
      _settings;

  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _prefix = options.idprefix;
    _settings = options.settings;
  };

  _this.format = function (eq) {
    var prop,
        coord,
        highlightClass,
        mmi,
        mmiClass;

    prop = eq.properties;
    coord = eq.properties.coordinates;
    highlightClass = '';

    if (prop.mmi !== null) {
      // mmi = Format.mmi(prop.mmi);
      mmiClass = 'intensity mmi' + mmi;
    } else {
      mmi = '&ndash';
      mmiClass = 'no-shakemap';
    }

    if (prop.sig >= 600) {
      highlightClass = ' class="bigger"';
    } else if (prop.mag >= 4.5) {
      highlightClass = ' class="big"';
    }

    return '<li id="' + _prefix + eq.id + '"' + highlightClass + '>' +
    '<span class="' + mmiClass +'">' +
      mmi +
    '</span> ' +
    '<span class="place">' +
      prop.title +
    '</span> ' +
    '<span class="time"> ' +
      // Format.dateFromEvent(eq, _settings) +
    '</span> ' +
    '<span class="depth">' +
      // Format.depth(coord[2]) +
    ' km</span>' +
    '</li>';


  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ShakeMapListFormat;
