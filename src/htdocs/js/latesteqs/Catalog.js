'use strict';


var Collection = require('mvc/Collection'),
    L = require('leaflet'),
    Model = require('mvc/Model'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS = {
  config: null,
  model: null
};


/**
 * Latest earthquakes catalog.
 *
 * Extends collection, and handles Config and Settings logic for
 * loading feed/search and autoUpdate.
 */
var Catalog = function (options) {
  var _this,
      _initialize,

      _allData,
      _parent;


  // catalog is a collection of earthquakes
  _this = Collection();
  _parent = Util.extend({}, _this);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.model = options.model || Model();
    _this.model.on('change:feed', 'load', _this);
    _this.model.on('change:sort', 'onSort', _this);
    _this.model.on('change:restrictListToMap', 'onRestrictListToMap', _this);

    // save reference to unfiltered data
    _allData = [];

    // TODO: handle autoUpdate

    // keep track of whether there was a load error
    _this.error = false;
  };


  /**
   * Free event listeners and references.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    _this.model.off('change:feed', 'load', _this);
    _this.model.off('change:sort', 'sort', _this);
    _this.model.off('change:restrictListToMap', 'onRestrictListToMap', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Bounds contain test that accounts for leaflets handling for longitude.
   *
   * When initial bounds.contains fails: shifts bounds left or right,
   * until northEast is less than one world to the right of test point and repeats test.
   *
   * @param bounds {4x4 Array [southWest, northEast] or LatLngBounds object}
   * @param latlng {leaflet LatLng}
   * @return true if bounds contain latlng, before or after normalization, false otherwise.
   */
  _this.boundsContain = function(bounds, latlng) {

    if (Util.isArray(bounds)) {
      bounds = L.latLngBounds(bounds);
    }

    if (Util.isArray(latlng)) {
      latlng = L.latLng(latlng[0], latlng[1]);
    }

    // simple test
    if (bounds.contains(latlng)) {
      return true;
    }

    // longitude may be off by world(s), adjust east bound to (just) right of test point
    while (bounds._northEast.lng > latlng.lng + 360) {
      bounds._northEast.lng -= 360;
      bounds._southWest.lng -= 360;
    }
    while (bounds._northEast.lng < latlng.lng) {
      bounds._northEast.lng += 360;
      bounds._southWest.lng += 360;
    }

    // now test with adjusted bounds
    return bounds.contains(latlng);
  };

  /**
   * Filter list of events and return only what is inside the map bounds
   *
   * @param items {Array}
   *     array of events
   * @param bounds {Array}
   *     map bounds
   *
   * @return {Array}
   *     filtered events that are within the map bounds
   */
  _this.filterEvents = function (items, bounds) {
    var coordinates,
        i,
        item,
        events,
        len;

    events = [];

    // loop through all events, check against map bounds
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      coordinates = item.geometry.coordinates;
      if (_this.boundsContain(bounds, [coordinates[1], coordinates[0]])) {
        events.push(item);
      }
    }

    return events;
  };

  /**
   * Fetch catalog based on config and model.
   */
  _this.load = function () {
    var feed,
        params,
        url;

    feed = _this.model.get('feed');
    if (feed) {
      if (feed.url) {
        // feed
        url = feed.url;
        params = null;
      } else {
        // search
        url = _this.model.get('searchUrl');
        params = feed.params;
      }

      _this.loadUrl(url, params);
      return;
    } else {
      _this.onLoadError('no feed selected');
    }
  };

  /**
   * Load a catalog url.
   *
   * @param url {String}
   *     catalog url.
   * @param data {Object}
   *     optional, data for ajax call.
   */
  _this.loadUrl = function (url, data) {
    // signal to listeners that a load is starting
    _this.trigger('loading');

    Xhr.ajax({
      url: url,
      data: data || null,
      success: _this.onLoadSuccess,
      error: _this.onLoadError
    });
  };

  /**
   * Called when catalog fails to load.
   */
  _this.onLoadError = function (err/*, xhr */) {
    // TODO: check error info on xhr object.
    _this.error = err;
    _this.metadata = null;
    _this.reset([]);
  };

  /**
   * Called when catalog successfully loaded.
   */
  _this.onLoadSuccess = function (data/*, xhr*/) {
    _this.error = false;
    _this.metadata = data.metadata;
    _this.reset(data.features);

    // save reference to unfiltered data
    _allData = data.features.slice(0);
    // pass through filter, it will only apply if filter is enabled
    _this.onRestrictListToMap();
  };

  /**
   * Filters the catalog based on the current map extents.
   *
   */
  _this.onRestrictListToMap = function () {
    var bounds,
        items,
        restrictListToMap;

    items = [];
    restrictListToMap = _this.model.get('restrictListToMap');

    // filter based on map extents, or remove filtering
    if (restrictListToMap && restrictListToMap.length === 1) {
      bounds = this.model.get('mapposition');
      // when filtering, use _allData (unfiltered array of events)
      items = _this.filterEvents(_allData.slice(0), bounds);
    } else {
      items = _allData;
    }

    _this.reset(items);
  };

  /**
   * Sorts the data.
   *
   * @param method {Object}
   *        the selected settings sort object from the model
   */
  _this.onSort = function () {
    var method;

    method = _this.model.get('sort');

    if (method && method.sort) {
      _this.sort(method.sort);
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Catalog;
