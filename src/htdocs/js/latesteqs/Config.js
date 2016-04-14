'use strict';

var Collection = require('mvc/Collection'),
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
      'url' : '/earthquakes/feed/v1.0/summary/2.5_day.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '1day_all',
      'name' : '1 Day, All Magnitudes Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/all_day.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m45',
      'name' : '7 Days, Magnitude 4.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_week.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m25',
      'name' : '7 Days, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_week.geojsonp',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_all',
      'name' : '7 Days, All Magnitudes Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/all_week.geojsonp',
      'autoUpdate': 60 * 1000
    },
    // Added Significant feed here
    {
      'id': '30day_sig',
      'name': '30 Days, Significant Worldwide',
      'url': '/earthquakes/feed/v1.0/summary/significant_month.geojsonp',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m45',
      'name' : '30 Days, Magnitude 4.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_month.geojsonp',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m25',
      'name' : '30 Days, Magnitude 2.5+ Worldwide',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_month.geojsonp',
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
    _this.overlays = Collection(options.overlays);
    _this.searchForm = options.searchForm;
    _this.searchUrl = options.searchUrl;
    _this.sorts = Collection(options.sorts);
    _this.timezones = Collection(options.timezones);
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
    _this.overlays.destroy();
    _this.sorts.destroy();
    _this.timezones.destroy();
    _this = null;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Config;
