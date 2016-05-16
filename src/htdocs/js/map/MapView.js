/* global L */
'use strict';

require('leaflet/control/MousePosition');
require('leaflet/control/ZoomToControl');
require('map/LegendControl');

var EarthquakeLayer = require('map/EarthquakeLayer'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
    locations: [
      {
        title:'Alaska',
        id: 'alaska',
        bounds: [[72,-175], [50,-129]]
      },
      {
        title:'California',
        id: 'california',
        bounds: [[42,-125], [32,-113]]
      },
      {
        title:'Central U.S.',
        id: 'central_us',
        bounds:[[32,-104],[40,-88]]
      },
      {
        title:'Hawaii',
        id: 'hawaii',
        bounds: [[22,-160], [18,-154]]
      },
      {
        title:'Puerto Rico',
        id: 'puerto_rico',
        bounds: [[20,-70], [16,-62]]
      },
      {
        title:'U.S.',
        id: 'us',
        bounds:[[50,-125], [24.6,-65]]
      },
      {
        title:'World',
        id: 'world',
        bounds:[[70,20],[-70,380]]
      }
    ]
};


/**
 * Class info and constructor parameters.
 */
var MapView = function (options) {
  var _this,
      _initialize,

      _basemap,
      _earthquakes,
      _handlingMoveEnd,
      _onBasemapChange,
      _onMapPositionChange,
      _onOverlayChange,
      _onViewModesChange,
      _onMoveEnd,
      _overlays,
      _renderScheduled;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<div class="map"></div>';

    _basemap = null;
    _overlays = null;
    _handlingMoveEnd = false;

    _this.config = options.config;

    _this.map = L.map(
      el,
      {
        attributionControl: false,
        zoomAnimation: false
      }
    );

    _earthquakes = EarthquakeLayer({
      collection: options.catalog,
      model: _this.model
    });

    _this.map.addLayer(_earthquakes);
    L.control.legendControl().addTo(_this.map);
    L.control.scale().addTo(_this.map);
    L.control.zoomToControl({locations:options.locations}).addTo(_this.map);

    if (!Util.isMobile()) {
      L.control.mousePosition().addTo(_this.map);
    }

    _this.map.on('moveend', _onMoveEnd, _this);
    _this.model.on('change:basemap', _onBasemapChange, _this);
    _this.model.on('change:mapposition', _onMapPositionChange, _this);
    _this.model.on('change:overlays', _onOverlayChange, _this);
    _this.model.on('change:viewModes', _onViewModesChange, _this);

  };

  _onBasemapChange = function () {
    _this.onBasemapChange();
  };

  _onMapPositionChange = function () {
    _this.onMapPositionChange();
  };

  _onMoveEnd = function () {
    _this.onMoveEnd();
  };

  _onOverlayChange = function () {
    _this.onOverlayChange();
  };

  _onViewModesChange = function () {
    _this.onViewModesChange();
  };

  _this.destroy = Util.compose(function () {
    _this.map.off('moveend', _onMoveEnd, _this);
    _this.model.off('change:basemap', _onBasemapChange, _this);
    _this.model.off('change:mapposition', _onMapPositionChange, _this);
    _this.model.off('change:overlays', _onOverlayChange, _this);
    _this.model.off('change:viewModes', _onViewModesChange, _this);

    _basemap = null;
    _earthquakes = null;
    _handlingMoveEnd = null;
    _onBasemapChange = null;
    _onMapPositionChange = null;
    _onMoveEnd = null;
    _onOverlayChange = null;
    _onViewModesChange = null;
    _overlays = null;

    _this.map.removeLayer(_earthquakes);
    _earthquakes.destroy();
    _earthquakes = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.onBasemapChange = function () {
    _renderScheduled = true;
  };

  _this.onMapPositionChange = function () {
    _renderScheduled = true;
  };

  _this.onMoveEnd = function () {
    var bounds;

    _handlingMoveEnd = true;

    bounds = _this.map.getBounds();
    _this.model.set({
      'mapposition': [
        [bounds._southWest.lat, bounds._southWest.lng],
        [bounds._northEast.lat, bounds._northEast.lng]
      ]
    });

    _handlingMoveEnd = false;
  };

  _this.onOverlayChange = function () {
    _renderScheduled = true;
  };

  _this.onViewModesChange = function () {
    _renderScheduled = true;
  };

  _this.render = function (force) {
    if (_renderScheduled || force === true) {
      _this.renderBasemapChange();
      _this.renderMapPositionChange();
      _this.renderOverlayChange();
      _this.renderViewModesChange();
    }
    _renderScheduled = false;
  };

  _this.renderBasemapChange = function () {
    if (_basemap) {
      _this.map.removeLayer(_basemap.layer);
    }
    _basemap = _this.model.get('basemap');
    if (_basemap) {
      _this.map.addLayer(_basemap.layer);
    }
  };

  _this.renderMapPositionChange = function () {
    var bounds;

    if (!_handlingMoveEnd) {
      bounds = _this.model.get('mapposition');
      _this.map.fitBounds(bounds);
    }
  };

  _this.renderOverlayChange = function () {
    var i,
        length;

    if (_overlays) {
      length = _overlays.length;
      for (i = 0; i < length; i++) {
        _this.map.removeLayer(_overlays[i].layer);
      }
    }

    _overlays = _this.model.get('overlays');
    length = _overlays.length;
    for (i = 0; i < length; i++) {
      if (_overlays[i].layer !== null) {
        _overlays[i].layer.setZIndex(1);
        _this.map.addLayer(_overlays[i].layer);
      }
    }
  };

  _this.renderViewModesChange = function () {
    // TODO, check that the map is enabled
    _this.map.invalidateSize();
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MapView;
