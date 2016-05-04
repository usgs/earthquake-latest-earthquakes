'use strict';

// TODO: use real List, Map, and Settings views
var Catalog = require('latesteqs/Catalog'),
    HelpView = require('help/HelpView'),
    LatestEarthquakesConfig = require('latesteqs/LatestEarthquakesConfig'),
    ListView = require('list/ListView'),
    MapView = require('map/MapView'),
    ModalView = require('mvc/ModalView'),
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
    'plates',
    'faults',
    'ushazard'
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

      _catalog,
      _config,
      _content,
      _helpView,
      _listView,
      _mapView,
      _modalView,
      _modesView,
      _settingsView,
      _urlManager;


  _this = View(options);

  _initialize = function (options) {
    var el;

    options = Util.extend({}, _DEFAULTS, options);
    el = _this.el;

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
        '</div>' +
        '<footer class="latest-earthquakes-footer"></footer>';

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

    _helpView = HelpView();

    _modalView = ModalView(_helpView.el, {
      title: 'Help'
    });

    _modalView.on('hide', _this.onModalHide, _this);

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

    _helpView.destroy();
    _listView.destroy();
    _mapView.destroy();
    _modalView.destroy();
    _modesView.destroy();
    _settingsView.destroy();

    _config.destroy();
    _catalog.destroy();

    // free references
    _catalog = null;
    _config = null;
    _content = null;
    _helpView = null;
    _listView = null;
    _mapView = null;
    _modesView = null;
    _settingsView = null;
    _this = null;
    _initialize = null;
    _urlManager = null;
  }, _this.destroy);

  /**
   * Updates the model when the ModalView is hidden.
   */
  _this.onModalHide = function () {
    var filtered,
        viewModes;

    viewModes = _this.model.get('viewModes');
    filtered = false;

    viewModes = viewModes.filter(function (mode) {
      if (mode.id === 'help') {
        filtered = true;
        return false;
      } else {
        return true;
      }
    });

    if (filtered) {
      _this.model.set({
        'viewModes': viewModes
      });
    }
  };

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
      if (mode === 'help') {
        _modalView.show();
        _helpView.render();
      }
    } else {
      _content.classList.remove(name);
      if (mode === 'help') {
        _modalView.hide();
      }
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = LatestEarthquakes;
