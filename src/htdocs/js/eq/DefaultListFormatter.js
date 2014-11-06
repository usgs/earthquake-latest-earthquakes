/* global define */
define([
  'mvc/Util',
  './Format'
], function (
  Util,
  Format
) {
  'use strict';

  var DEFAULTS = {
  };

  var DefaultListFormatter = function (options) {
    this._options = Util.extend({}, DEFAULTS, options);
  };

  DefaultListFormatter.prototype.getListClassName = function () {
    return this._options.className;
  };

  DefaultListFormatter.prototype.generateListItemMarkup = function(item) {
    var prefix = this._options.idprefix,
        settings = this._options.settings,
        props = item.properties,
        coords = item.geometry.coordinates,
        className = '';

        if (props.sig >= 600) {
          className = ' class="bigger"';
        } else if (props.mag >= 4.5) {
          className = ' class="big"';
        }

    return [
        '<li id="', prefix, item.id, '"', className, '>',
          '<span class="mag">',
            Format.magnitude(props.mag),
          '</span> ',
          '<span class="place">',
            this._generateListItemTitle(props.type, props.place),
          '</span> ',
          '<span class="time"> ',
            Format.dateFromEvent(item, settings),
          '</span> ',
          '<span class="depth">',
            Format.depth(coords[2]),
          ' km</span>',
        '</li>'
      ].join('');
  };

  DefaultListFormatter.prototype._generateListItemTitle =
      function (type, place) {

    if (type === null || type.toLowerCase() === 'earthquake') {
      return place;
    } else {
      type = type.toLowerCase();
      if (type === 'quarry') {
        type = 'Quarry Blast';
      } else if (type === 'nuke') {
        type = 'Nuclear Explosion';
      } else if (type === 'rockfall') {
        type = 'Rockslide';
      } else if (type === 'rockburst') {
        type = 'Rockslide';
      } else if (type === 'sonicboom') {
        type = 'Sonic Boom';
      } else {
        type = type.replace(/\w\S*/g,
            function (txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
      }
    }
    return type + ' ' + place;
  };

  DefaultListFormatter.prototype.destroy = function () {
    return;
  };

  return DefaultListFormatter;
});