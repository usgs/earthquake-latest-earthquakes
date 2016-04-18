'use strict';

// TODO: use real List, Map, and Settings views
var Catalog = require('latesteqs/Catalog'),
    Config = require('latesteqs/Config'),
    Events = require('util/Events'),
    ListView = require('mvc/View'),
    MapView = require('mvc/View'),
    SettingsView = require('mvc/View'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  catalog: null,
  config: null,
  settings: null
};

var _DEFAULT_MODES = {
  list: true,
  map: true,
  settings: false
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
  sort: 'newest',
  timeZone: 'utc',
  viewModes: _DEFAULT_MODES
};


/**
 * The Latest Earthquakes application entry point.
 *
 * @param options {Object}
 *     passed to View.
 */
var LatestEarthquakes = function (options) {
  var _this,
      _initialize,

      _catalog,
      _config,
      _content,
      _listView,
      _mapView,
      _settingsView;


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

    _config = Config(Util.extend({}, options.config, {
      model: _this.model
    }));
    _content = el.querySelector('.latest-earthquakes-content');


    // depends on config
    _catalog = Catalog({
      config: _config,
      model: _this.model
    });

    _listView = ListView({
      el: el.querySelector('.latest-earthquakes-list'),
      catalog: _catalog,
      config: _config,
      model: _this.model
    });
    // TODO: delete this once using the real list view
    _catalog.on('reset', function () {
      _listView.el.innerHTML = '<pre>' +
          JSON.stringify(_catalog.data(), null, 2) +
          '</pre>';
    });

    _mapView = MapView({
      el: el.querySelector('.latest-earthquakes-map'),
      catalog: _catalog,
      config: _config,
      model: _this.model
    });

    _settingsView = SettingsView({
      el: el.querySelector('.latest-earthquakes-settings'),
      catalog: _catalog,
      config: _config,
      model: _this.model
    });

    // load default settings, also triggers initial render
    _this.model.set(Util.extend({},
        _DEFAULT_SETTINGS,
        options.settings,
        _this.getUrlSettings()));

    // update if URL changes
    Events.on('hashchange', _this.onHashChange);
  };

  /**
   * Free references.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    Events.off('hashchange', _this.onHashChange);

    // destroy views
    _listView.destroy();
    _mapView.destroy();
    _settingsView.destroy();

    // destroy collection of eqs
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
  }, _this.destroy);

  /**
   * Get any settings from the URL.
   *
   * @return {Object}
   *     object with any settings that appear in the URL.
   */
  _this.getUrlSettings = function () {
    return _this.parseHash(window.location.hash);
  };

  /**
   * Called when hash changes.
   *
   * Loads settings from url.
   */
  _this.onHashChange = function () {
    // TODO: handle nested settings more gracefully
    _this.model.set(_this.getUrlSettings());
  };

  /**
   * Parse a URL hash fragment.
   *
   * @param hash {String}
   *     uri encoded json string.
   */
  _this.parseHash = function (hash) {
    var parsed;

    parsed = {};
    if (hash) {
      // remove leading hash fragment
      hash = decodeURI(hash.replace('#', ''));
      try {
        parsed = JSON.parse(hash);
      } catch (e) {
        // some emails strip the last encoded '}'
        try {
          parsed = JSON.parse(hash + '}');
        } catch (e) {
          // ignore
        }
      }
    }

    return parsed;
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
    modes = Util.extend({}, _DEFAULT_MODES, _this.model.get('viewModes'));
    _this.setMode('list', modes.list);
    _this.setMode('map', modes.map);
    _this.setMode('settings', modes.settings);

    // TODO: Update url
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
