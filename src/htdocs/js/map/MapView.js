/* global L, SCENARIO_MODE */
'use strict';

require('leaflet/control/MousePosition');
require('leaflet/control/ZoomToControl');
require('map/LegendControl');
require('map/ScenarioLegendControl');

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

      _earthquakes,
      _onBasemapChange,
      _onMapPositionChange,
      _onOverlayChange,
      _onViewModesChange,
      _onMoveEnd,
      _onClick,
      _renderBasemapChange,
      _renderMapPositionChange,
      _renderOverlayChange,
      _renderViewModesChange;

  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);

    el = _this.el;
    el.innerHTML = '<div class="map"></div>';

    _this.basemap = null;
    _this.ignoreNextMoveEnd = false;
    _this.overlays = [];

    _this.config = options.config;

    _this.map = L.map(
      el,
      {
        attributionControl: false,
        maxBounds: [
          [-90, -Infinity],
          [90, Infinity]
        ],
        zoomAnimation: false
      }
    );

    _earthquakes = EarthquakeLayer({
      collection: options.catalog,
      model: _this.model
    });

    _this.map.addLayer(_earthquakes);

    // position all controls bottomright
    if (!Util.isMobile()) {
      L.control.mousePosition().addTo(_this.map);
    }
    if (SCENARIO_MODE) {
      L.control.scenarioLegendControl().addTo(_this.map);
      _this.createScenarioBadge();
    } else {
      L.control.legendControl().addTo(_this.map);
    }
    L.control.scale({'position': 'bottomright'}).addTo(_this.map);

    L.control.zoomToControl({
      'locations': options.locations,
      'position': 'topright'
    }).addTo(_this.map);


    _this.map.on('click', _onClick, _this);
    _this.map.on('moveend', _onMoveEnd, _this);
    _this.model.on('change:basemap', 'onBasemapChange', _this);
    _this.model.on('change:mapposition', 'onMapPositionChange', _this);
    _this.model.on('change:overlays', 'onOverlayChange', _this);
    _this.model.on('change:viewModes', 'onViewModesChange', _this);
    _this.model.on('change:event', 'onChangeEvent', _this);
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
   * DOM event listener that delegates to (potentially subclassed)
   * _this.onMoveEnd.
   *
   * @param e {DOMEvent}
   *     the dom event.
   */
  _onMoveEnd = function () {
    _this.onMoveEnd();
  };

  _this.createScenarioBadge = function () {
    var badge;

    badge = document.createElement('div');
    badge.classList.add(
      'scenario-badge',
      'leaflet-control',
      'alert',
      'warning'
    );
    badge.innerHTML = 'Scenario';
    _this.el.appendChild(badge);
  };

  _this.deselectEventonMoveEnd = function () {
    var bounds,
        eq,
        latlng;

    bounds = _this.map.getBounds();
    eq = _this.model.get('event');

    if (bounds && eq && _this.isFilterEnabled()) {
      latlng = [eq.geometry.coordinates[1], eq.geometry.coordinates[0]];
      bounds = [
        [bounds._southWest.lat, bounds._southWest.lng],
        [bounds._northEast.lat, bounds._northEast.lng]
      ];

      if (!MapUtil.boundsContain(bounds, latlng)) {
        _this.model.set({
          'event': null
        });
      }
    }
  };

  _this.destroy = Util.compose(function () {
    _this.map.off('click', _onClick, _this);
    _this.map.off('moveend', _onMoveEnd, _this);
    _this.model.off('change:basemap', _onBasemapChange, _this);
    _this.model.off('change:mapposition', _onMapPositionChange, _this);
    _this.model.off('change:overlays', _onOverlayChange, _this);
    _this.model.off('change:viewModes', _onViewModesChange, _this);
    _this.model.off('change:event', _this.onChangeEvent, _this);

    _this.map.removeLayer(_earthquakes);
    _earthquakes.destroy();

    _earthquakes = null;
    _onBasemapChange = null;
    _onClick = null;
    _onMapPositionChange = null;
    _onMoveEnd = null;
    _onOverlayChange = null;
    _renderBasemapChange = null;
    _renderMapPositionChange = null;
    _renderOverlayChange = null;
    _renderViewModesChange = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * gets latitude and longitude for an event
   */
  _this.getEventLocation = function () {
    var eq,
        latLng,
        latitude,
        longitude;

    eq = _this.model.get('event');

    if (eq === null) {
      return;
    }

    latitude = eq.geometry.coordinates[1];
    longitude = eq.geometry.coordinates[0];

    latLng = [latitude, longitude];
    return latLng;
  };

  /**
   * Gets bounds around a given latitude, longitude
   *
   * @param number {latitude, longitude}
   *    latitude and longitude
   */
  _this.getPaddedBounds = function (latitude, longitude) {
    var bounds,
        pad;

    pad = 5;

    bounds = new L.LatLngBounds(
      [Math.max(latitude - pad, -90), Math.max(longitude - pad, -180)],
      [Math.min(latitude + pad,  90), Math.min(longitude + pad,  180)]
    );

    return bounds;
  };

  _this.hasBounds = function () {
    return !_this.map.getSize().equals(new L.Point(0, 0));
  };

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

  _this.isFilterEnabled = function () {
    var filter;

    filter = _this.model.get('restrictListToMap');

    if (filter.length === 0) {
      return false;
    }

    return true;
  };

  _this.onBasemapChange = function () {
    _renderBasemapChange = true;
  };

  /**
   * Updates the view port of the map if an event is selected that is outside
   * the vieport of the map.
   */
  _this.onChangeEvent = function () {
    var bounds,
        latLng,
        map,
        mapBounds;

    if (_this.onMoveEndTriggered) {
      return;
    }

    try {
      map = _this.map;
      latLng = _this.getEventLocation();
      mapBounds = MapUtil.convertBounds(map.getBounds());

      if (!MapUtil.boundsContain(mapBounds, latLng)) {
        bounds = _this.getPaddedBounds(latLng[0], latLng[1]);

        if (bounds.intersects(mapBounds)) {
          map.panTo(latLng);
        } else {
          map.fitBounds(bounds, {animate:false});
        }
      }
    } catch (e) {
      // nothing should happen
    }
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

  _this.onMapPositionChange = function () {
    _renderMapPositionChange = true;
  };

  _this.onMoveEnd = function () {
    var bounds;

    _this.deselectEventonMoveEnd();

    // only set mapposition when the map bounds > 0
    if (!_this.ignoreNextMoveEnd && _this.isEnabled() && _this.hasBounds()) {
      _this.onMoveEndTriggered = true;
      bounds = _this.map.getBounds();
      _this.model.set({
        'mapposition': MapUtil.convertBounds(bounds)
      });
      _this.onMoveEndTriggered = false;
    }

    _this.ignoreNextMoveEnd = false;
  };

  _this.onOverlayChange = function () {
    _renderOverlayChange = true;
  };

  _this.onViewModesChange = function () {
    _renderViewModesChange = true;
  };

  _this.render = function (force) {
    if (_renderViewModesChange || force === true) {
      _this.renderViewModesChange();
    }

    if (_renderBasemapChange || force === true) {
      _this.renderBasemapChange();
    }

    if (_renderOverlayChange || force === true) {
      _this.renderOverlayChange();
    }

    if (_renderMapPositionChange || force === true) {
      _this.renderMapPositionChange();
    }
  };

  _this.renderBasemapChange = function () {
    var newBasemap,
        oldBasemap;

    oldBasemap = _this.basemap;
    newBasemap = _this.model.get('basemap');
    _this.basemap = newBasemap; // keep track of selected basemap
    _renderBasemapChange = false;

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

    _renderMapPositionChange = false;


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

    _renderMapPositionChange = false;
  };

  _this.renderOverlayChange = function () {
    var i,
        newOverlays,
        oldOverlays,
        overlay;

    oldOverlays = _this.overlays.slice(0);
    newOverlays = _this.model.get('overlays') || [];
    _this.overlays = newOverlays; // keep track of selected overlays
    _renderOverlayChange = false;

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

    _renderViewModesChange = false;

    if (_this.isEnabled()) {
      if (!_this.hasBounds()) {
        _this.ignoreNextMoveEnd = true;
      }
      _this.map.invalidateSize();
      // ensure map is updated when view mode changes and map is visible
      _this.renderMapPositionChange();
      // focus map on selected event when "map" is enabled as a view mode
      if (_this.model.get('event')) {
        _this.onChangeEvent();
      }
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MapView;
