/* global L */
'use strict';


var EarthquakeLayer = require('map/EarthquakeLayer'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
};


/**
 * Class info and constructor parameters.
 */
var MapView = function (options) {
  var _this,
      _initialize,

      _basemap,
      _earthquakes,
      _changedMapPosition,
      _triggeredMapPosition;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<div class="map"></div>';

    _basemap = null;
    _changedMapPosition = false;
    _triggeredMapPosition = false;

    _this.config = options.config;

    _this.map = L.map(el).setView([34, -118], 3);

    _earthquakes = EarthquakeLayer({
      catalog: options.catalog,
      model: _this.model
    });

    _this.map.addLayer(_earthquakes);

    _this.model.on('change:basemap', 'renderBasemap', _this);
    _this.map.on('moveend', _this.onMoveEnd);

    _this.map.invalidateSize();
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:basemap', 'renderBasemap', _this);
    _this.map.off('moveend', _this.onMoveEnd);

    _this.map.removeLayer(_earthquakes);
    _earthquakes.destroy();
    _earthquakes = null;

    _this = null;
  }, _this.destroy);

  _this.onMoveEnd = function () {
    _earthquakes.render();
  };

  _this.renderBasemap = function () {
    if (_basemap) {
      _this.map.removeLayer(_basemap.layer);
    }
    _basemap = _this.model.get('basemap');
    if (_basemap) {
      _this.map.addLayer(_basemap.layer);
    }
  };

  _this.render = function () {
    _this.map.invalidateSize();
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MapView;
