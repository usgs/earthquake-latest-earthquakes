/* global define */
define ([
  'mvc/Util',
  './Format',
  './DefaultListFormatter'
], function(
  Util,
  Format,
  DefaultListFormatter
){
  'use strict';

  var DEFAULTS = {};

  var ShakeMapListFormatter = function (options) {
    this._options = Util.extend({},DEFAULTS, options);
  };

  ShakeMapListFormatter.prototype = Object.create(DefaultListFormatter.prototype);

  ShakeMapListFormatter.prototype.getListClassName = function () {
    return this._options.className;
  };

  ShakeMapListFormatter.prototype.generateListItemMarkup = function (item) {
    var prefix = this._options.idprefix,
        settings = this._options.settings,
        p, c, highlightClass, mmi, mmiClass;

    p = item.properties;
    c = item.geometry.coordinates;
    highlightClass = '';

    if (p.mmi !== null) {
      mmi = Format.mmi(p.mmi);
      mmiClass = 'intensity mmi' + mmi;
    } else {
      mmi = '&ndash;';
      mmiClass = 'no-shakemap';
    }

    if (p.sig >= 600) {
      highlightClass = ' class="bigger"';
    } else if (p.mag >= 4.5) {
      highlightClass = ' class="big"';
    }

  return '<li id="' + prefix + item.id + '"' + highlightClass + '>' +
    '<span class="' + mmiClass +'">' +
      mmi +
    '</span> ' +
    '<span class="place">' +
      p.title +
    '</span> ' +
    '<span class="time"> ' +
      Format.dateFromEvent(item, settings) +
    '</span> ' +
    '<span class="depth">' +
      Format.depth(c[2]) +
    ' km</span>' +
    '</li>';
  };

  return ShakeMapListFormatter;
});
