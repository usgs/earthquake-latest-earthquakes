/* global L */
'use strict';


var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var _AGE_DAY,
    _AGE_DAY_CLASS,
    _AGE_HOUR,
    _AGE_HOUR_CLASS,
    _AGE_MONTH,
    _AGE_MONTH_CLASS,
    _AGE_OLDER_CLASS,
    _AGE_WEEK,
    _AGE_WEEK_CLASS,
    _MAG_UNKNOWN_CLASS,
    _MAG_0_CLASS,
    _MAG_1_CLASS,
    _MAG_2_CLASS,
    _MAG_3_CLASS,
    _MAG_4_CLASS,
    _MAG_5_CLASS,
    _MAG_6_CLASS,
    _MAG_7_CLASS,
    _TYPE_EQ_CLASS,
    _TYPE_OTHER_CLASS,
    _TYPE_OTHER_TRANSFORM;


_AGE_HOUR = 60 * 60 * 1000;
_AGE_DAY = 24 * _AGE_HOUR;
_AGE_WEEK = 7 * _AGE_DAY;
_AGE_MONTH = 30 * _AGE_DAY;

_AGE_HOUR_CLASS = 'eq-age-hour';
_AGE_DAY_CLASS = 'eq-age-day';
_AGE_WEEK_CLASS = 'eq-age-week';
_AGE_MONTH_CLASS = 'eq-age-month';
_AGE_OLDER_CLASS = 'eq-age-older';

_MAG_UNKNOWN_CLASS = 'eq-mag-unknown';
_MAG_0_CLASS = 'eq-mag-0';
_MAG_1_CLASS = 'eq-mag-1';
_MAG_2_CLASS = 'eq-mag-2';
_MAG_3_CLASS = 'eq-mag-3';
_MAG_4_CLASS = 'eq-mag-4';
_MAG_5_CLASS = 'eq-mag-5';
_MAG_6_CLASS = 'eq-mag-6';
_MAG_7_CLASS = 'eq-mag-7';

_TYPE_EQ_CLASS = 'eq-type-eq';
_TYPE_OTHER_CLASS = 'eq-type-other';
_TYPE_OTHER_TRANSFORM = 'rotate(45deg) scale(0.7071, 0.7071)';

var _DEFAULTS = {
};


/**
 * Class info and constructor parameters.
 */
var EarthquakeLayer = function (options) {
  var _this,
      _initialize,

      _onClick,
      _onMoveEnd,
      _onZoomEnd,
      _render;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.collection = options.collection || Collection();
    _this.el = options.el || document.createElement('div');
    _this.model = options.model || Model();
    _this.map = null;

    _this.el.classList.add('earthquake-layer');
    _this.el.classList.add('leaflet-zoom-hide');

    _this.collection.on('reset', 'render', _this);
    _this.el.addEventListener('click', _onClick);
    _this.model.on('change:event', 'onSelect', _this);
    //_this.model.on('change:event', _this.zoomToFeature, _this);
  };

  /**
   * DOM event listener that delegates to (potentially subclassed)
   * _this.onClick.
   *
   * @param e {DOMEvent}
   *     the dom event.
   */
  _onClick = function (e) {
    _this.onClick(e);
  };

  /**
   * DOM event listener that delegates to (potentially subclassed)
   * _this.onMoveEnd.
   *
   * @param e {DOMEvent}
   *     the dom event.
   */
  _onMoveEnd = function (e) {
    _this.onMoveEnd(e);
  };

  /**
   * DOM event listener that delegates to (potentially subclassed)
   * _this.onZoomEnd.
   *
   * @param e {DOMEvent}
   *     the dom event.
   */
  _onZoomEnd = function (e) {
    _this.onZoomEnd(e);
  };

  /**
   * DOM event listener that delegates to (potentially subclassed)
   * _this.render.
   *
   * @param e {DOMEvent}
   *     the dom event.
   */
  _render = function (e) {
    _this.render(e);
  };


  /**
   * Leaflet convenience method.
   *
   * @param map {L.map}
   *     map layer should be added to.
   */
  _this.addTo = function (map) {
    map.addLayer(_this);
    return _this;
  };

  /**
   * Free referenes and unbind events.
   */
  _this.destroy = function () {
    _this.collection.off('reset', 'render', _this);
    _this.el.removeEventListener('click', _onClick);
    _this.model.off('change:event', 'onSelect', _this);

    _onClick = null;
    _onMoveEnd = null;
    _onZoomEnd = null;
    _render = null;

    _initialize = null;
    _this = null;
  };

  /**
   * Get location for earthquake.
   *
   * @param eq {Object}
   *     earthquake object.
   * @param lngMin {Number}
   *     returned longitude should be no less than this value.
   * @param lngMax {Number}
   *     returned longitude should be no greater than this value.
   */
  _this.getLatLng = function (eq, lngMin, lngMax) {
    var coords,
        lat,
        lng;

    coords = eq.geometry.coordinates;
    lat = coords[1];
    lng = coords[0];

    // center within view
    while (lng <= lngMin) {
      lng += 360;
    }
    while (lng > lngMax) {
      lng -= 360;
    }

    return [lat, lng];
  };

  /**
   * Get marker for earthquake.
   *
   * @param eq {Object}
   *     earthquake object.
   * @param latLng {Object}
   *     normalized latitude/longitude for object.
   * @return {DOMElement}
   *     marker element, positioned and styled.
   */
  _this.getMarker = function (eq, latLng) {
    var marker,
        pos;

    // create element
    marker = document.createElement('div');

    // data-id is used by select
    marker.setAttribute('data-id', eq.id);

    // position
    pos = _this.map.latLngToLayerPoint(latLng);
    L.DomUtil.setPosition(marker, pos);

    // set classes after positioned
    _this.setMarkerClasses(eq, marker);

    return marker;
  };

  /**
   * Leaflet ILayer API method.
   *
   * Called when layer is added to map.
   */
  _this.onAdd = function (map) {
    map.getPanes().overlayPane.appendChild(_this.el);
    map.on('viewreset', _render);
    map.on('zoomend', _onZoomEnd);
    map.on('moveend', _onMoveEnd, _this);

    _this.map = map;
    _this.onZoomEnd();
    _this.render();
  };

  /**
   * Click handler for layer.
   *
   * @param e {MouseEvent}
   *     the click event.
   */
  _this.onClick = function (e) {
    var eq,
        id,
        target;

    eq = null;
    // get clicked eq
    target = e.target;
    id = target.getAttribute('data-id');
    if (id) {
      eq = _this.collection.get(id);
    }
    _this.model.set({
      'event': eq
    });

    // stops "click" event from bubbling to the map
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
  };

  _this.onMoveEnd = function () {
    _this.render();
  };

  /**
   * Leaflet ILayer API method.
   *
   * Called when layer is removed from map.
   */
  _this.onRemove = function (map) {
    map.getPanes().overlayPane.removeChild(_this.el);
    map.off('viewreset', _render);
    map.off('zoomend', _onZoomEnd);

    _this.map = null;
  };

  /**
   * Model change:event handler.
   *
   * Called when event is selected, or deselected.
   */
  _this.onSelect = function () {
    var eq,
        marker,
        selected;

    selected = _this.el.querySelectorAll('.selected');
    Array.prototype.forEach.call(selected, function (el) {
      el.classList.remove('selected');
    });

    eq = _this.model.get('event');
    if (eq) {
      marker = _this.el.querySelector('[data-id="' + eq.id + '"]');
      if (marker) {
        marker.classList.add('selected');
      }
    }
  };

  /**
   * Update zoom classes.
   *
   * Triggered by map zoomend event.
   */
  _this.onZoomEnd = function () {
    var el,
        zoom;

    if (_this.map === null) {
      return;
    }

    el = _this.el;
    zoom = _this.map.getZoom();
    // set zoom class
    if (zoom > 10) {
      el.classList.add('zoomedin');
      el.classList.remove('zoomednormal');
      el.classList.remove('zoomedout');
    } else if (zoom > 5) {
      el.classList.remove('zoomedin');
      el.classList.add('zoomednormal');
      el.classList.remove('zoomedout');
    } else {
      el.classList.remove('zoomedin');
      el.classList.remove('zoomednormal');
      el.classList.add('zoomedout');
    }
  };

  /**
   * Redraw earthquakes.
   */
  _this.render = function () {
    var center,
        data,
        el,
        eq,
        fragment,
        i,
        lngMin,
        lngMax,
        map,
        marker;

    if (_this.map === null) {
      // not visible yet
      return;
    }

    data = _this.collection.data();
    el = _this.el;
    fragment = document.createDocumentFragment();
    map = _this.map;
    center = map.getCenter().lng;
    lngMin = center - 180;
    lngMax = center + 180;

    for (i = data.length - 1; i >= 0; i--) {
      eq = data[i];
      marker = _this.getMarker(eq, _this.getLatLng(eq, lngMin, lngMax));
      fragment.appendChild(marker);
    }

    // clear existing elements
    el.innerHTML = '';
    // add elements
    el.appendChild(fragment);

    // (re) select
    _this.onSelect();
  };

  /**
   * Set classes for marker.
   */
  _this.setMarkerClasses = function (eq, marker) {
    var age,
        ageClass,
        classes,
        mag,
        magClass,
        props,
        type,
        typeClass;

    marker.classList.add('earthquake-marker');
    props = eq.properties;
    if (!props) {
      return classes;
    }

    age = new Date().getTime() - props.time;
    mag = props.mag;
    type = props.type;

    if (age <= _AGE_HOUR) {
      ageClass = _AGE_HOUR_CLASS;
    } else if (age <= _AGE_DAY) {
      ageClass = _AGE_DAY_CLASS;
    } else if (age <= _AGE_WEEK) {
      ageClass = _AGE_WEEK_CLASS;
    } else if (age <= _AGE_MONTH) {
      ageClass = _AGE_MONTH_CLASS;
    } else {
      ageClass = _AGE_OLDER_CLASS;
    }
    marker.classList.add(ageClass);

    if (!mag && mag !== 0) {
      magClass = _MAG_UNKNOWN_CLASS;
    } else if (mag >= 7) {
      magClass = _MAG_7_CLASS;
    } else if (mag >= 6) {
      magClass = _MAG_6_CLASS;
    } else if (mag >= 5) {
      magClass = _MAG_5_CLASS;
    } else if (mag >= 4) {
      magClass = _MAG_4_CLASS;
    } else if (mag >= 3) {
      magClass = _MAG_3_CLASS;
    } else if (mag >= 2) {
      magClass = _MAG_2_CLASS;
    } else if (mag >= 1) {
      magClass = _MAG_1_CLASS;
    } else {
      magClass = _MAG_0_CLASS;
    }
    marker.classList.add(magClass);

    if (type === 'earthquake') {
      typeClass = _TYPE_EQ_CLASS;
    } else {
      typeClass = _TYPE_OTHER_CLASS;
      marker.style.transform =
          (marker.style.transform ? marker.style.transform + ' ' : '') +
          _TYPE_OTHER_TRANSFORM;
    }
    marker.classList.add(typeClass);
  };

  // _this.zoomToFeature = function () {
  //   var bounds,
  //       eq,
  //       latitude,
  //       longitude,
  //       map,
  //       pad;
  //
  //   eq = _this.model.get('event');
  //   map = _this.map;
  //
  //   if (eq === null || map === null) {
  //     return;
  //   }
  //
  //   latitude = eq.geometry.coordinates[1];
  //   longitude = eq.geometry.coordinates[0];
  //   pad = 5;
  //
  //   if (map.getBounds().contains(L.latLng(latitude, longitude))) {
  //     return;
  //   } else {
  //     bounds = [
  //       [Math.max(latitude - pad, -90), Math.max(longitude - pad, -180)],
  //       [Math.min(latitude + pad,  90), Math.min(longitude + pad,  180)]
  //     ];
  //
  //     _this.model.set({
  //       'mapposition': bounds
  //     });
  //   }
  // };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EarthquakeLayer;
