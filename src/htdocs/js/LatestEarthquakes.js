'use strict';

var Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    View = require('mvc/View');


// TODO: use real versions of these views
var ListView = function (options) {
  var _this;

  _this = View(options);
  _this.render = function () {
    _this.el.innerHTML = 'list view';
  };
  return _this;
};

var MapView = function (options) {
  var _this;

  _this = View(options);
  _this.render = function () {
    _this.el.innerHTML = 'map view';
  };
  return _this;
};

var SettingsView = function (options) {
  var _this;

  _this = View(options);
  _this.render = function () {
    _this.el.innerHTML = 'settings view';
  };
  return _this;
};


var _DEFAULTS = {};

var _DEFAULT_MODES = {
  list: true,
  map: true,
  settings: false
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
          '<div class="latest-earthquakes-list"></div>' +
          '<div class="latest-earthquakes-map"></div>' +
          '<div class="latest-earthquakes-settings"></div>' +
        '</div>' +
        '<footer class="latest-earthquakes-footer">footer</footer>';

    _catalog = Collection();
    _this.model.set({
      catalog: _catalog
    }, {silent: true});

    _content = el.querySelector('.latest-earthquakes-content');

    _listView = ListView({
      el: el.querySelector('.latest-earthquakes-list'),
      model: _this.model
    });

    _mapView = MapView({
      el: el.querySelector('.latest-earthquakes-map'),
      model: _this.model
    });

    _settingsView = SettingsView({
      el: el.querySelector('.latest-earthquakes-settings'),
      model: _this.model
    });
  };

  /**
   * Free references.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    // destroy views
    _listView.destroy();
    _mapView.destroy();
    _settingsView.destroy();

    // destroy collection of eqs
    _catalog.destroy();

    // free references
    _catalog = null;
    _content = null;
    _listView = null;
    _mapView = null;
    _settingsView = null;
    _this = null;
  }, _this.destroy);


  /**
   * Apply current settings.
   */
  _this.render = function () {
    var settings,
        modes;

    settings = _this.model.get('settings') || {};

    // update modes
    modes = Util.extend({}, _DEFAULT_MODES, settings.modes);
    _this.setMode('list', modes.list);
    _this.setMode('map', modes.map);
    _this.setMode('settings', modes.settings);

    if (modes.list) {
      _listView.render();
    }
    if (modes.map) {
      _mapView.render();
    }
    if (modes.settings) {
      _settingsView.render();
    }
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
