'use strict';

// TODO: use real List, Map, and Settings views
var
    AboutView = require('about/AboutView'),
    Catalog = require('latesteqs/Catalog'),
    EventSummaryView = require('summary/EventSummaryView'),
    LatestEarthquakesConfig = require('latesteqs/LatestEarthquakesConfig'),
    ListView = require('list/ListView'),
    MapView = require('map/MapView'),
    ModesView = require('modes/ModesView'),
    SettingsView = require('settings/SettingsView'),
    UrlManager = require('latesteqs/LatestEarthquakesUrlManager'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  config: null,
  settings: null
};

var _DEFAULT_SETTINGS = {
  autoUpdate: [
    'autoUpdate'
  ],
  basemap: 'grayscale',
  feed: '1day_m25',
  listFormat: 'default',
  mapposition: [
    // "conterminous" us
    [60.0, -150.0],
    [10.0, -50.0]
  ],
  overlays: [
    'plates'
  ],
  restrictListToMap: [
    'restrictListToMap'
  ],
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

      _aboutView,
      _catalog,
      _config,
      _content,
      _eventSummaryView,
      _listView,
      _mapView,
      _modesView,
      _settingsView,
      _urlManager;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);
    el = _this.el;

    _modesView = ModesView();

    if (_modesView.mobileCheck()) {
      _DEFAULT_SETTINGS.viewModes = {
        list: true,
        map: false,
        settings: false,
        help: false
      };
    }

    el.classList.add('latest-earthquakes');
    el.innerHTML =
        '<header class="latest-earthquakes-header">' +
          '<div class="latest-earthquakes-flex">' +
            '<a href="/" class="latest-earthquakes-logo">' +
              '<img src="/theme/images/usgs-logo.svg" alt="USGS"/>' +
            '</a>' +
          '</div>' +
          '<div class="latest-earthquakes-modes"></div>' +
        '</header>' +
        '<div class="latest-earthquakes-content">' +
          '<div class="latest-earthquakes-list">'+
            '<div class="list-view"></div>' +
          '</div>' +
          '<div class="latest-earthquakes-map">'+
            '<div class="map-view"></div>' +
          '</div>' +
          '<div class="latest-earthquakes-settings">'+
            '<div class="settings-view"></div>' +
          '</div>' +
          '<div class="latest-earthquakes-about">' +
            '<div class="about-view"></div>' +
          '</div>' +
        '</div>' +
        '<footer class="latest-earthquakes-footer">' +
          '<div class="event-summary-view"></div>' +
        '</footer>';

    _content = el.querySelector('.latest-earthquakes-content');

    // depends on config
    _catalog = Catalog({
      model: _this.model
    });

    _config = LatestEarthquakesConfig(Util.extend({}, options.config, {
      'event': _catalog
    }));

    _modesView = ModesView({
      collection: _config.options.viewModes,
      el: el.querySelector('.latest-earthquakes-modes'),
      model: _this.model
    });
    _modesView.render();

    _listView = ListView({
      el: el.querySelector('.list-view'),
      collection: _catalog,
      model: _this.model
    });

    _mapView = MapView({
      el: el.querySelector('.map-view'),
      catalog: _catalog,
      model: _this.model
    });

    _settingsView = SettingsView({
      el: el.querySelector('.settings-view'),
      catalog: _catalog,
      model: _this.model
    });

    _aboutView = AboutView({
      el: el.querySelector('.about-view'),
      model: _this.model
    });

    _eventSummaryView = EventSummaryView({
      el: el.querySelector('.event-summary-view'),
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

    _aboutView.destroy();
    _listView.destroy();
    _mapView.destroy();
    _modesView.destroy();
    _settingsView.destroy();

    _config.destroy();
    _catalog.destroy();

    // free references
    _catalog = null;
    _config = null;
    _content = null;
    _aboutView = null;
    _listView = null;
    _mapView = null;
    _modesView = null;
    _settingsView = null;
    _this = null;
    _initialize = null;
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
    modes = (_this.model.get('viewModes') || []).map(function (mode) {
      return mode.id;
    });

    _config.options.viewModes.data().forEach(function (mode) {
      _this.setMode(mode.id, (modes.indexOf(mode.id) !== -1));
    });
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
      _modesView.el.classList.add(name);
    } else {
      _content.classList.remove(name);
      _modesView.el.classList.remove(name);
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = LatestEarthquakes;
