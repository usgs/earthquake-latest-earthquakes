'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    Util = require('util/Util');


var _DEFAULTS = {
  basemaps: [
    {
      'id': 'grayscale',
      'name': 'Grayscale',
      'layer': null
    },
    {
      'id': 'terrain',
      'name': 'Terrain',
      'layer': null
    },
    {
      'id': 'street',
      'name': 'Street',
      'layer': null
    },
    {
      'id': 'satellite',
      'name': 'Satellite',
      'layer': null
    }
  ],

  defaults: {
    autoUpdate: true,
    basemap: 'grayscale',
    feed: '1day_m25',
    listFormat: 'default',
    mapposition: [
      // "conterminous" us
      [60.0, -150.0],
      [10.0, -50.0]
    ],
    overlays: {
      plates: true
    },
    restrictListToMap: true,
    search: null,
    sort: 'newest',
    timeZone: 'utc',
    viewModes: {
      list: true,
      map: true,
      settings: false,
      help: false
    }
  },

  feeds: [
    {
      'id': '1day_m25',
      'name' : '1 Day, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_day.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '1day_all',
      'name' : '1 Day, All Magnitudes Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/all_day.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m45',
      'name' : '7 Days, Magnitude 4.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_week.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m25',
      'name' : '7 Days, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_week.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_all',
      'name' : '7 Days, All Magnitudes Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/all_week.geojson',
      'autoUpdate': 60 * 1000
    },
    // Added Significant feed here
    {
      'id': '30day_sig',
      'name': '30 Days, Significant Worldwide',
      'url': '/earthquakes/feed/v1.0/summary/significant_month.geojson',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m45',
      'name' : '30 Days, Magnitude 4.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_month.geojson',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m25',
      'name' : '30 Days, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_month.geojson',
      'autoUpdate': 15 * 60 * 1000
    }
  ],

  listFormats: [
    {
      'id': 'default',
      'name': 'Magnitude',
      'format': null
    },
    {
      'id': 'dyfi',
      'name': 'DYFI',
      'format': null
    },
    {
      'id': 'shakemap',
      'name': 'ShakeMap',
      'format': null
    },
    {
      'id': 'losspager',
      'name': 'PAGER',
      'format': null
    }
  ],

  overlays: [
    {
      'id': 'plates',
      'name': 'Plate Boundaries',
      'layer': null
    },
    {
      'id': 'faults',
      'name': 'U.S. Faults',
      'layer': null
    },
    {
      'id': 'ushazard',
      'name': 'U.S. Hazard',
      'layer': null
    }
  ],

  searchForm: '/earthquakes/search/',

  searchUrl: '/fdsnws/event/1/query',

  sorts: [
    {
      'id': 'newest',
      'name' : 'Newest first',
      'sort' : function (a, b) {
        return b.properties.time - a.properties.time;
      }
    },
    {
      'id': 'oldest',
      'name' : 'Oldest first',
      'sort' : function (a, b) {
        return a.properties.time - b.properties.time;
      }
    },
    {
      'id': 'largest',
      'name' : 'Largest magnitude first',
      'sort' : function (a, b) {
        return b.properties.mag - a.properties.mag;
      }
    },
    {
      'id': 'smallest',
      'name' : 'Smallest magnitude first',
      'sort' : function (a, b) {
        return a.properties.mag - b.properties.mag;
      }
    }
  ],

  timezones: [
    {
      'id': 'utc',
      'name': '<abbr title="Coordinated Universal Time">UTC</abbr>',
      'offset': 0
    },
    {
      'id': 'local',
      'name': 'Local System Time',
      'offset': new Date().getTimezoneOffset()
    }
  ],

  viewModes: [
    {
      'id': 'list',
      'name': 'List'
    },
    {
      'id': 'map',
      'name': 'Map'
    },
    {
      'id': 'settings',
      'name': 'Settings'
    },
    {
      'id': 'help',
      'name': 'Help'
    }
  ]
};


/**
 * Configuration for LatestEarthquakes interface.
 *
 * @param options {Object}
 * @param options.basemaps {Array<Object>}
 *     basemaps for map.
 *     each basemap object should have these properties:
 *       id {String} unique id
 *       name {String} display name
 *       layer {ILayer}
 *           leaflet layer
 * @param options.feeds {Array<Object>}
 *     pre-defined feeds for interface.
 *     each catalog object should have these properties:
 *       id {String} unique id
 *       name {String} display name
 *       url {String}
 *           url for catalog
 *       autoUpdate {Number}
 *           interval in milliseconds for auto update, or null to disable.
 * @param options.listFormats {Array<Object>}
 *     list formats.
 *     each list format object should have these properties:
 *       id {String} unique id
 *       name {String} display name
 *       format {ListFormat}
 *           object with method `DOMElement obj.format(EQ)`
 * @param options.model {Model}
 *     model defines currently selected configuration.
 *     used by Config to update selections in collections.
 * @param options.overlays {Array<Object>}
 *     overlays for map.
 *     each overlay object should have these properties:
 *       id {String} unique id
 *       name {String} display name
 *       layer {ILayer}
 *           leaflet layer
 * @param options.searchForm {String}
 *     url to search form.
 * @param options.searchUrl {String}
 *     base url for search api.
 * @param options.sorts {Array<Object>}
 *     catalog sort options.
 *     each catalog sort object should have these properties:
 *       id {String} unique id
 *       name {String} display name
 *       sort {Function}
 *           sort function for EQ objects.
 * @param options.timezones {Array<Object>}
 *     timezone options.
 *     each timezon object should have these properties:
 *       id {String} unique id
 *       name {String} display name
 *       offset {Number}
 *           timezone offset in minutes. 0 for utc.
 */
var Config = function (options) {
  var _this,
      _initialize,

      _search;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.model = options.model || Model();
    _this.options = {
      'basemap': Collection(options.basemaps),
      'feed': Collection(options.feeds),
      'listFormat': Collection(options.listFormats),
      'overlays': Collection(options.overlays),
      'sort': Collection(options.sorts),
      'timezone': Collection(options.timezones),
      'viewModes': Collection(options.viewModes)
    };

    // search object is added to feed collection
    _search = null;
    // set defaults, existing url settings
    _this.set(options.defaults);
  };

  /**
   * Free references.
   */
  _this.destroy = function () {
    if (_this === null) {
      return;
    }

    _this.basemaps.destroy();
    _this.feeds.destroy();
    _this.listFormats.destroy();
    _this.model = null;
    _this.overlays.destroy();
    _this.sorts.destroy();
    _this.timezones.destroy();
    _this.viewModes.destroy();
    _this = null;
  };

  /**
   * Get current configuration as object.
   *
   * @return {Object}
   *     object containing current settings, using object ids.
   */
  _this.get = function () {
    var collection,
        key,
        model,
        setting,
        settings,
        value;

    settings = {};
    model = _this.model.get();
    for (key in model) {
      value = model[key];

      if (key in _this.options) {
        collection = _this.options[key];
        if (key === 'overlays' || key === 'viewModes') {
          setting = _this.getIdMap(value);
        } else {
          setting = value.id;
        }
      } else if (key === 'autoUpdate' ||
          key === 'mapposition' ||
          key === 'restrictListToMap' ||
          key === 'search') {
        setting = value;
      } else {
        // not a url config option, skip to be safe
      }
      settings[key] = setting;
    }

    return settings;
  };

  /**
   * Convert array of values to object.
   *
   * @param values {Array<Object>}
   * @return {Object}
   *     with key for id of every Object in values,
   *     and values of true.
   */
  _this.getIdMap = function (values) {
    var map;

    map = {};
    values.forEach(function (item) {
      map[item.id] = true;
    });

    return map;
  };

  /**
   * Extract objects from collection using idMap.
   *
   * @param collection {Collection}
   *     collection with objects.
   * @param idMap {Object}
   *     object with keys that are ids of objects in collection,
   *     and boolean values.  When value is true, object with id is included
   *     in returned array.
   * @return {Array<Object>}
   *     array with matching objects.
   */
  _this.getValues = function (collection, idMap) {
    var id,
        object,
        values;

    values = [];
    for (id in idMap) {
      if (idMap[id]) {
        object = collection.get(id);
        if (object) {
          values.push(object);
        }
      }
    }

    return values;
  };

  /**
   * Update configuration using object.
   *
   * @param settings {Object}
   *     object with settings to set.
   *     for settings that are backed by a collection, the id of an object
   *     should be used in place of that object.
   */
  _this.set = function (settings) {
    var collection,
        key,
        setting,
        toset,
        value;

    toset = {};
    // translate setting values to model objects
    for (key in settings) {
      setting = settings[key];

      if (key in _this.options) {
        collection = _this.options[key];
        if (key === 'overlays' || key === 'viewModes') {
          // multi-select represented as an array of objects
          value = _this.getValues(collection, setting);
        } else if (key === 'feed') {
          value = collection.get(setting);
          if (!value) {
            if (settings.search && settings.search.id === setting) {
              // TODO: search should be part of feed collection...
              value = settings.search;
            } else {
              value = collection.data()[0];
            }
          }
        } else {
          value = collection.get(setting);
          if (!value) {
            // default to first item if setting does not exist
            value = collection.data()[0];
          }
        }
      } else if (key === 'autoUpdate' ||
          key === 'mapposition' ||
          key === 'restrictListToMap' ||
          key === 'search') {
        // TODO: validate
        value = setting;
      } else {
        // unknown config option, skip to be safe
        continue;
      }

      toset[key] = value;
    }

    _this.model.set(toset);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Config;
