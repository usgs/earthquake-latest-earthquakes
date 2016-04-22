'use strict';

// TODO: use real List, Map, and Settings views
var Catalog = require('latesteqs/Catalog'),
    Config = require('latesteqs/LatestEarthquakesConfig'),
    ListView = require('list/ListView'),
    MapView = require('map/MapView'),
    SettingsView = require('mvc/View'),
    UrlManager = require('latesteqs/LatestEarthquakesUrlManager'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  config: null,
  settings: null
};

var _DEFAULT_SETTINGS = {
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
  searchForm: '/earthquakes/search/',
  searchUrl: '/fdsnws/event/1/query.geojson',
  sort: 'newest',
  timezone: 'utc',
  viewModes: {
    list: true,
    map: true,
    settings: false,
    help: false
  }
};


/**
 * The Latest Earthquakes application entry point.
 *
 * @param options {Object}
 *     passed to View.
 *
 * @param options.config {OBject}
 *     overrides for default config (collections of basemaps, etc)
 * @param options.settings {Object}
 *     overrides for default settings (default basemap, etc).
 */
var LatestEarthquakes = function (options) {
  var _this,
      _initialize,

      _catalog,
      _config,
      _content,
      _listView,
      _mapView,
      _settingsView,
      _urlManager;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);
    el = _this.el;

    el.classList.add('latest-earthquakes');
    el.innerHTML =
        '<header class="latest-earthquakes-header">header</header>' +
        '<div class="latest-earthquakes-content">' +
          '<div class="latest-earthquakes-list">list</div>' +
          '<div class="latest-earthquakes-map">map</div>' +
          '<div class="latest-earthquakes-settings">settings</div>' +
        '</div>' +
        '<footer class="latest-earthquakes-footer">footer</footer>';

    _content = el.querySelector('.latest-earthquakes-content');

    // depends on config
    _catalog = Catalog({
      model: _this.model
    });

    _config = Config(Util.extend({}, options.config, {
      'event': _catalog
    }));

    _listView = ListView({
      el: el.querySelector('.latest-earthquakes-list'),
      collection: _catalog,
      model: _this.model
    });

    _mapView = MapView({
      el: el.querySelector('.latest-earthquakes-map'),
      catalog: _catalog,
      model: _this.model
    });

    _settingsView = SettingsView({
      el: el.querySelector('.latest-earthquakes-settings'),
      catalog: _catalog,
      model: _this.model
    });

    _urlManager = UrlManager({
      config: _config,
      defaults: Util.extend({}, _DEFAULT_SETTINGS, options.settings),
      model: _this.model
    });

    // triggers initial model update (leading to render)
    _urlManager.start();
  };

  /**
   * Free references.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    _urlManager.destroy();

    _listView.destroy();
    _mapView.destroy();
    _settingsView.destroy();

    _catalog.destroy();
    _config.destroy();

    // free references
    _catalog = null;
    _config = null;
    _content = null;
    _listView = null;
    _mapView = null;
    _settingsView = null;
    _this = null;
    _urlManager = null;
  }, _this.destroy);


  /**
   * Apply current settings.
   *
   * @param changed {Object}
   *     object with keys that changed, or null to force render.
   */
  _this.render = function (/*changed*/) {
    var modes;

    // update modes
    modes = _this.model.get('viewModes') || {};
    _this.setMode('list', modes.list);
    _this.setMode('map', modes.map);
    _this.setMode('settings', modes.settings);
  };

  /**
   * Enable/Disable a mode.
   *
   * @param mode {String}
   *     name of mode.
   * @param enable {Boolean}
   *     whether mode should be enabled.
   */
  _this.setMode = function (mode, enable) {
    var name;

    name = 'mode-' + mode;
    if (enable) {
      _content.classList.add(name);
    } else {
      _content.classList.remove(name);
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = LatestEarthquakes;
