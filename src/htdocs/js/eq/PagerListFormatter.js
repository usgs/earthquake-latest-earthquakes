/* global define */
define ([
  'mvc/Util',
  './Format'
], function(
  Util,
  Format
){
  'use strict';

  var DEFAULTS = {
    className: 'pager-list'
  };

  var PagerListFormatter = function (options) {
    this._options = Util.extend({},DEFAULTS, options);
  };

  PagerListFormatter.prototype.getListClassName = function () {
    return this._options.className;
  };

  PagerListFormatter.prototype.generateListItemMarkup = function (item) {
    var prefix = this._options.idprefix,
        settings = this._options.settings,
        p, c, highlightClass, alert, alertClass, mmi, mmiClass;

    p = item.properties;
    c = item.geometry.coordinates;
    highlightClass = '';

    if (p.alert !== null) {
      alert = p.alert.charAt(0).toUpperCase();
      alertClass = 'alert pager-alertlevel-' + p.alert;
    } else {
      alert = '&ndash;';
      alertClass = 'no-pager';
    }

    if (p.mmi !== null) {
      mmi = Format.mmi(p.mmi);
      mmiClass = 'intensity mmi' + mmi;
    } else {
      mmi = '&ndash;';
      mmiClass = 'no-intensity';
    }

    if (p.sig>= 600) {
      highlightClass = ' class="bigger"';
    } else if (p.mag >= 4.5) {
      highlightClass = ' class="big"';
    }

  return '<li id="' + prefix + item.id + '"' + highlightClass + '>' +
    '<span class="' + alertClass + '">' +
      alert +
    '</span> ' +
    '<span class="place">' +
      p.title +
    '</span> ' +
    '<span class="time"> ' +
      Format.dateFromEvent(item, settings) +
    '</span> ' +
    '<span class="maxintensity">' +
      'Max Intensity:' +
      '<span class="' + mmiClass + '">' +
        mmi +
      '</span>' +
    '</span>' +
    '</li>';
  };

  PagerListFormatter.prototype.destroy = function () {
    return;
  };

  return PagerListFormatter;
});
