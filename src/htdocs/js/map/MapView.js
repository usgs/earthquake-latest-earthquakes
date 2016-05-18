/* global L */
'use strict';

require('leaflet/control/MousePosition');
require('leaflet/control/ZoomToControl');
require('map/LegendControl');

var EarthquakeLayer = require('map/EarthquakeLayer'),
    MapUtil = require('core/MapUtil'),
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
      _ignoreNextMoveEnd,
      _onBasemapChange,
      _onMapPositionChange,
      _onOverlayChange,
      _onViewModesChange,
      _onMoveEnd,
      _onClick,
      _overlays,
      _renderScheduled;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<div class="map"></div>';

    _basemap = null;
    _ignoreNextMoveEnd = false;
    _overlays = [];

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

    _this.map.on('click', _onClick);
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

  /**
   * DOM event listener that delegates to (potentially subclassed)
   * _this.onClick.
   *
   * @param e {DOMEvent}
   *     the dom event.
   */
  _onClick = function () {
    _this.onClick();
  };

  /**
   * Click handler for map.
   *
   * Click is captured by EarthquakeLayer when a
   * map marker is clicked, otherwise the event bubbles and any selected
   * event is deselected.
   */
  _this.onClick = function () {
    if(_this.model.get('event')) {
      _this.model.set({
        'event': null
      });
    }
  };


  _this.destroy = Util.compose(function () {
    _this.el.removeEventListener('click', _onClick);
    _this.map.off('moveend', _onMoveEnd, _this);
    _this.model.off('change:basemap', _onBasemapChange, _this);
    _this.model.off('change:mapposition', _onMapPositionChange, _this);
    _this.model.off('change:overlays', _onOverlayChange, _this);
    _this.model.off('change:viewModes', _onViewModesChange, _this);

    _basemap = null;
    _earthquakes = null;
    _ignoreNextMoveEnd = null;
    _onBasemapChange = null;
    _onClick = null;
    _onMapPositionChange = null;
    _onMoveEnd = null;
    _onOverlayChange = null;
    _onViewModesChange = null;
    _overlays = [];

    _this.map.removeLayer(_earthquakes);
    _earthquakes.destroy();

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.isEnabled = function () {
     var i,
         modes;

     modes = _this.model.get('viewModes');
     for (i = 0; i < modes.length; i++) {
       if (modes[i].id === 'map') {
         return true;
       }
     }
     return false;
   };

   _this.hasBounds = function () {
      return !_this.map.getSize().equals(new L.Point(0, 0));
   };

  _this.onBasemapChange = function () {
    _renderScheduled = true;
  };

  _this.onMapPositionChange = function () {
    _renderScheduled = true;
  };

  _this.onMoveEnd = function () {
    var bounds,
        eq,
        latlng;

    // only set mapposition when the map bounds > 0
    if (!_ignoreNextMoveEnd && _this.isEnabled() && _this.hasBounds()) {
      bounds = _this.map.getBounds();
      _this.model.set({
        'mapposition': [
          [bounds._southWest.lat, bounds._southWest.lng],
          [bounds._northEast.lat, bounds._northEast.lng]
        ]
      });
    }

    _ignoreNextMoveEnd = false;

    // Deselect event when it is no longer within the map bounds
    bounds = _this.model.get('mapposition');
    eq = _this.model.get('event');

    if (bounds && eq) {
      latlng = [eq.geometry.coordinates[1], eq.geometry.coordinates[0]];

      if (!MapUtil.boundsContain(bounds, latlng)) {
        _this.model.set({
          'event': null
        });
      }
    }
  };

  _this.onOverlayChange = function () {
    _renderScheduled = true;
  };

  _this.onViewModesChange = function () {
    _renderScheduled = true;
  };

  _this.render = function (force) {
    if (_renderScheduled || force === true) {
      _this.renderViewModesChange();
      _this.renderBasemapChange();
      _this.renderOverlayChange();
      _this.renderMapPositionChange();
    }
    _renderScheduled = false;
  };

  _this.renderBasemapChange = function () {
    var newBasemap,
        oldBasemap;

    oldBasemap = _basemap;
    newBasemap = _this.model.get('basemap');
    _basemap = newBasemap; // keep track of selected basemap

    // if basemap is already selected, do nothing
    if (oldBasemap && newBasemap && oldBasemap.id === newBasemap.id) {
      return;
    }

    // remove old basemap
    if (oldBasemap) {
      _this.map.removeLayer(oldBasemap.layer);
    }

    // add new basemap
    if (newBasemap) {
      _this.map.addLayer(newBasemap.layer);
    }
  };

  _this.renderMapPositionChange = function () {
    var mapBounds,
        modelBounds;

    if (_this.isEnabled()) {
      modelBounds = _this.model.get('mapposition');

      try {
        mapBounds = _this.map.getBounds();
      } catch(e) {
        mapBounds = L.latLngBounds([[0,0],[0,0]]);
      }

      // If the map does not have the same bounds as the model, call fitBounds.
      if (!mapBounds.equals(modelBounds)) {
        _this.map.fitBounds(modelBounds, {animate: false});
      }
    }
  };

  _this.renderOverlayChange = function () {
    var i,
        newOverlays,
        oldOverlays,
        overlay;

    oldOverlays = _overlays.slice(0);
    newOverlays = _this.model.get('overlays');
    _overlays = newOverlays; // keep track of selected overlays

    // remove overlays that no longer exist in selection
    for (i = 0; i < oldOverlays.length; i++) {
      overlay = oldOverlays[i];
      if (!Util.contains(newOverlays, overlay)) {
        _this.map.removeLayer(overlay.layer);
      }
    }

    // add overlays that were added to the selection
    for (i = 0; i < newOverlays.length; i++) {
      overlay = newOverlays[i];
      if (!Util.contains(oldOverlays, overlay)) {
        _this.map.addLayer(overlay.layer);
      }
    }
  };

  _this.renderViewModesChange = function () {
    if (_this.isEnabled()) {
      if (!_this.hasBounds()) {
        _ignoreNextMoveEnd = true;
      }
      _this.map.invalidateSize();
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MapView;
