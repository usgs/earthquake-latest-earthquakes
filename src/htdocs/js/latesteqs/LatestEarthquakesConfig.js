'use strict';

var Config = require('core/Config'),
    DefaultListFormat = require('list/DefaultListFormat'),
    DyfiListFormat = require('list/DyfiListFormat'),
    Grayscale = require('leaflet/layer/Grayscale'),
    PagerListFormat = require('list/PagerListFormat'),
    Satellite = require('leaflet/layer/Satellite'),
    ShakeMapListFormat = require('list/ShakeMapListFormat'),
    Street = require('leaflet/layer/Street'),
    TectonicPlates = require('leaflet/layer/TectonicPlates'),
    Terrain = require('leaflet/layer/Terrain'),
    UsFault = require('leaflet/layer/UsFault'),
    UsHazard = require('leaflet/layer/UsHazard'),
    Util = require('util/Util');


var _DEFAULTS = {

  autoUpdate: [
    {
      'id': 'autoUpdate',
      'name': 'Auto Update'
    }
  ],

  basemap: [
    {
      'id': 'grayscale',
      'name': 'Grayscale',
      'layer': Grayscale()
    },
    {
      'id': 'terrain',
      'name': 'Terrain',
      'layer': Terrain({
        'provider': Terrain.NATGEO
      })
    },
    {
      'id': 'street',
      'name': 'Street',
      'layer': Street()
    },
    {
      'id': 'satellite',
      'name': 'Satellite',
      'layer': Satellite()
    }
  ],

  'event': {},

  feed: [
    {
      'id': '1day_m25',
      'name' : '1 Day - M2.5+ U.S./M4.5+ World',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_day.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '1day_all',
      'name' : '1 Day - All Mags U.S./M4.5+ World',
      'url' : '/earthquakes/feed/v1.0/summary/all_day.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m45',
      'name' : '7 Days - M4.5+ U.S. and World',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_week.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_m25',
      'name' : '7 Days - M2.5+U.S./M4.5+  World',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_week.geojson',
      'autoUpdate': 60 * 1000
    },
    {
      'id': '7day_all',
      'name' : '7 Days - All Mags U.S./M4.5+  World',
      'url' : '/earthquakes/feed/v1.0/summary/all_week.geojson',
      'autoUpdate': 60 * 1000
    },
    // Added Significant feed here
    {
      'id': '30day_sig',
      'name': '30 Days - Significant U.S. and World',
      'url': '/earthquakes/feed/v1.0/summary/significant_month.geojson',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m45',
      'name' : '30 Days - M4.5+ U.S. and World',
      'url' : '/earthquakes/feed/v1.0/summary/4.5_month.geojson',
      'autoUpdate': 15 * 60 * 1000
    },
    {
      'id': '30day_m25',
      'name' : '30 Days - M2.5+ U.S./M4.5+ World',
      'url' : '/earthquakes/feed/v1.0/summary/2.5_month.geojson',
      'autoUpdate': 15 * 60 * 1000
    }
  ],

  listFormat: [
    {
      'id': 'default',
      'name': 'Magnitude',
      'format': DefaultListFormat()
    },
    {
      'id': 'dyfi',
      'name': 'DYFI',
      'format': DyfiListFormat()
    },
    {
      'id': 'shakemap',
      'name': 'ShakeMap',
      'format': ShakeMapListFormat()
    },
    {
      'id': 'losspager',
      'name': 'PAGER',
      'format': PagerListFormat()
    }
  ],

  viewModes: [
    {
      'id': 'list',
      'name': 'List',
      'icon': '&#xE896;'
    },
    {
      'id': 'map',
      'name': 'Map',
      'icon': '&#xE894;'
    },
    {
      'id': 'settings',
      'name': 'Settings',
      'icon': '&#xE8B8;'
    },
    {
      'id': 'help',
      'name': 'About',
      'icon': '&#xE8FD;'
    }
  ],

  overlays: [
    {
      'id': 'plates',
      'name': 'Plate Boundaries',
      'layer': TectonicPlates({
        'zIndex':5
      })
    },
    {
      'id': 'faults',
      'name': 'U.S. Faults',
      'layer': UsFault({
        tileOpts: {
          'zIndex': 4
        }
      })
    },
    {
      'id': 'ushazard',
      'name': 'U.S. Hazard',
      'layer': UsHazard({
        'opacity': 0.6,
        'zIndex': 3
      })
    }
  ],

  restrictListToMap: [
    {
      'id': 'restrictListToMap',
      'name': 'Only List Earthquakes Shown on Map'
    }
  ],

  sort: [
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

  timezone: [
    {
      'id': 'utc',
      'name': '<abbr title="Coordinated Universal Time">UTC</abbr>',
      'offset': 0
    },
    {
      'id': 'local',
      'name': 'Local System Time',
      'offset': -1 * new Date().getTimezoneOffset()
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
var LatestEarthquakesConfig = function (options) {
  var _this;


  _this = Config(Util.extend({}, _DEFAULTS, options));


  options = null;
  return _this;
};


module.exports = LatestEarthquakesConfig;
