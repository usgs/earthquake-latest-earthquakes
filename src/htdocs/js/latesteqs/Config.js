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
      _initialize;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.basemaps = Collection(options.basemaps);
    _this.feeds = Collection(options.feeds);
    _this.listFormats = Collection(options.listFormats);
    _this.model = options.model || Model();
    _this.overlays = Collection(options.overlays);
    _this.searchForm = options.searchForm;
    _this.searchUrl = options.searchUrl;
    _this.sorts = Collection(options.sorts);
    _this.timezones = Collection(options.timezones);

    _this.basemaps.on('select', _this.onBasemapSelect);
    _this.feeds.on('select', _this.onFeedSelect);
    _this.listFormats.on('select', _this.onListFormatSelect);
    _this.model.on('change', _this.onModelChange);
    _this.sorts.on('select', _this.onSortSelect);
    _this.timezones.on('select', _this.onTimezoneSelect);
  };

  /**
   * Free references.
   */
  _this.destroy = function () {
    if (_this === null) {
      return;
    }

    _this.model.off('change', _this.onModelChange);

    _this.basemaps.destroy();
    _this.feeds.destroy();
    _this.listFormats.destroy();
    _this.model = null;
    _this.overlays.destroy();
    _this.sorts.destroy();
    _this.timezones.destroy();
    _this = null;
  };

  /**
   * Called when basemap collection selected changes.
   */
  _this.onBasemapSelect = function () {
    _this.model.set({
      'basemap': _this.basemaps.getSelected().id
    });
  };

  /**
   * Called when feeds collection selected changes.
   */
  _this.onFeedSelect = function () {
    _this.model.set({
      'feed': _this.feeds.getSelected().id
    });
  };

  /**
   * Called when listFormats collection selected changes.
   */
  _this.onListFormatSelect = function () {
    _this.model.set({
      'listFormat': _this.listFormats.getSelected().id
    });
  };

  /**
   * Called when model changes.
   *
   * Update collection selections.
   *
   * @param changed {Object}
   *     object with changed keys/values.
   */
  _this.onModelChange = function (changed) {
    var toSet;

    // anything that needs to be reset to a default
    toSet = {};

    if (!changed || changed.basemap) {
      Util.extend(toSet, _this.setSelected(_this.basemaps, 'basemap'));
    }
    if (!changed || changed.feed) {
      Util.extend(toSet, _this.setSelected(_this.feeds, 'feed'));
    }
    if (!changed || changed.listFormat) {
      Util.extend(toSet, _this.setSelected(_this.listFormats, 'listFormat'));
    }
    if (!changed || changed.sort) {
      Util.extend(toSet, _this.setSelected(_this.sorts, 'sort'));
    }
    if (!changed || changed.timezone) {
      Util.extend(toSet, _this.setSelected(_this.timezones, 'timezone'));
    }

    if (Object.keys(toSet).length > 0) {
      // updating to defaults
      _this.model.set(toSet);
    }
  };

  /**
   * Called when sorts collection selected changes.
   */
  _this.onSortSelect = function () {
    _this.model.set({
      'sort': _this.sorts.getSelected().id
    });
  };

  /**
   * Called when basemap collection selected changes.
   */
  _this.onTimezoneSelect = function () {
    _this.model.set({
      'timezone': _this.timezones.getSelected().id
    });
  };

  /**
   * Update the selected object in a collection based on its configured value
   *
   * @param collection {Collection}
   *     collection to update.
   * @param configKey {String}
   *     corresponding key in configuration with current setting.
   * @return {Object}
   *     null if collection was successfully set.
   *     Object with `configKey` set to id of first item in collection,
   *     if model selection not found as id of object in collection.
   */
  _this.setSelected = function(collection, configKey) {
    var id,
        obj,
        toSet;

    // get model setting
    id = _this.model.get(configKey);
    // corresponding collection object
    obj = collection.get(id);
    // whether anything needs to be set in model
    toSet = null;

    if (!obj) {
      // does not exist, use first as default
      obj = collection.data();
      if (obj.length > 0) {
        obj = obj[0];
        id = obj.id;
      } else {
        obj = null;
        id = null;
      }

      // update model to default
      toSet = {};
      toSet[configKey] = id;
    }

    collection.select(obj);

    return toSet;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Config;
