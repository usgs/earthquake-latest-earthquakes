/* global L */
'use strict';

var Catalog = require('latesteqs/Catalog'),
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
    _TYPE_OTHER_CLASS;


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


var _DEFAULTS = {
};


/**
 * Class info and constructor parameters.
 */
var EarthquakeLayer = function (options) {
  var _this,
      _initialize;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.catalog = options.catalog || Catalog();
    _this.el = options.el || document.createElement('div');
    _this.model = options.model || Model();
    _this.map = null;

    _this.el.classList.add('earthquake-layer');
    _this.el.classList.add('leaflet-zoom-hide');

    _this.catalog.on('reset', 'render', _this);
    _this.el.addEventListener('click', _this.onClick);
    _this.model.on('change:event', 'onSelect', _this);
  };

  /**
   * Free referenes and unbind events.
   */
  _this.destroy = Util.compose(function () {
    _this.catalog.off('reset', 'render', _this);
    _this.el.removeEventListener('click', _this.onClick);
    _this.model.off('change:event', 'onSelect', _this);

    _this = null;
  }, _this.destroy);

  /**
   * Get classes for marker.
   */
  _this.getClasses = function (eq) {
    var age,
        ageClass,
        classes,
        mag,
        magClass,
        props,
        type,
        typeClass;

    classes = ['earthquake-marker'];
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
    classes.push(ageClass);

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
    classes.push(magClass);

    if (type === 'earthquake') {
      typeClass = _TYPE_EQ_CLASS;
    } else {
      typeClass = _TYPE_OTHER_CLASS;
    }
    classes.push(typeClass);

    return classes;
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
   * @return {DOMElement}
   *     marker element.
   */
  _this.getMarker = function (eq) {
    var el;

    el = eq._marker;
    if (!el) {
      // cache element
      el = document.createElement('div');
      el.setAttribute('data-id', eq.id);
      el.className = 'earthquake-marker';
      eq._marker = el;
    }

    // always update appearance
    el.className = _this.getClasses(eq).join(' ');

    return el;
  };

  /**
   * Leaflet convenience method.
   *
   * @param map {L.map}
   *     map layer should be added to.
   */
  _this.addTo = function (map) {
    map.addLayer(_this);
  };

  /**
   * Leaflet ILayer API method.
   *
   * Called when layer is added to map.
   */
  _this.onAdd = function (map) {
    map.getPanes().overlayPane.appendChild(_this.el);
    map.on('viewreset', _this.render);
    map.on('zoomend', _this.render);
    _this.map = map;
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
      eq = _this.catalog.get(id);
    }
    _this.model.set({
      'event': eq
    });
  };

  /**
   * Leaflet ILayer API method.
   *
   * Called when layer is removed from map.
   */
  _this.onRemove = function (map) {
    map.getPanes().overlayPane.removeChild(_this.el);
    map.off('viewreset', _this.render);
    map.off('zoomend', _this.render);
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

    selected = _this.el.querySelector('.selected');
    if (selected) {
      selected.classList.remove('selected');
    }

    eq = _this.model.get('event');
    if (eq) {
      marker = _this.getMarker(eq);
      marker.classList.add('selected');
    }
  };

  /**
   * Redraw earthquakes.
   */
  _this.render = function () {
    var center,
        data,
        eq,
        fragment,
        i,
        latLng,
        lngMin,
        lngMax,
        map,
        marker,
        pos;

    if (_this.map === null) {
      // not visible yet
      return;
    }

    data = _this.catalog.data();
    fragment = document.createDocumentFragment();
    map = _this.map;
    center = map.getCenter().lng;
    lngMin = center - 180;
    lngMax = center + 180;

    for (i = data.length - 1; i >= 0; i--) {
      eq = data[i];

      // create element
      marker = _this.getMarker(eq);
      fragment.appendChild(marker);

      // position
      latLng = _this.getLatLng(eq, lngMin, lngMax);
      pos = map.latLngToLayerPoint(latLng);
      L.DomUtil.setPosition(marker, pos);
    }

    // set selection
    _this.onSelect();

    // clear remaining elements, that weren't moved to fragment
    Util.empty(_this.el);
    // add elements
    _this.el.appendChild(fragment);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EarthquakeLayer;
