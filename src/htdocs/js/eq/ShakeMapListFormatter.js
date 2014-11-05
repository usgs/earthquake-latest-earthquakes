/* global define */
define ([
  './DefaultListFormatter',
  'mvc/Util',
  './Format'
], function(
  DefaultListFormatter,
  Util,
  Format
){
  'use strict';

  var DEFAULTS = {
    className: 'shakemap-list'
  };

  var ShakeMapListFormatter = function (options) {
    DefaultListFormatter.apply(this, arguments);
    this._options = Util.extend({},DEFAULTS, options);
  };

  ShakeMapListFormatter.prototype =
      Object.create(DefaultListFormatter.prototype);


  ShakeMapListFormatter.prototype.getListClassName = function () {
    return this._options.className;
  };

  ShakeMapListFormatter.prototype.generateListItemMarkup = function (item) {
    var markup = [],
        prefix = this._idprefix,
        settings = this._options.settings,
        p, c, highlightClass, mmi, mmispan;

    p = item.properties;
    c = item.geometry.coordinates;
    highlightClass = '';

    if (p.mmi !== null) {
      mmi = Format.mmi(p.mmi);
      mmispan = 'intensity';
    } else {
      mmi = '&ndash;';
      mmispan = 'no-shakemap';
    }

    if (p.mmi >= 600) {
      highlightClass = ' class="bigger"';
    } else if (p.mag >= 4.5) {
      highlightClass = ' class="big"';
    }

    markup.push(
    '<li id="', prefix, item.id, '"', highlightClass, '>',
      '<span class="',mmispan,' mmi',mmi,'">',
        mmi,
      '</span> ',
      '<span class="place">',
        p.title,
      '</span> ',
      '<span class="time"> ',
        Format.dateFromEvent(item, settings),
      '</span> ',
      '<span class="depth">',
        Format.depth(c[2]),
      ' km</span>',
    '</li>');

    return markup.join('');
  };

  return ShakeMapListFormatter;
});
