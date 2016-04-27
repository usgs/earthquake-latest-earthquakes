'use strict';

var Events = require('util/Events'),
    Util = require('util/Util');


var _DEFAULTS = {
  defaults: null
};


/**
 * UrlManager reads/writes settings in URL.
 *
 * @param options {Object}
 * @param options.config {Config}
 *     configuration options.
 * @param options.defaults {Object}
 *     default settings (url style).
 * @param options.model {Model}
 *     configuration model.
 */
var UrlManager = function (options) {
  var _this,
      _initialize,

      _defaults,
      _started;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _defaults = options.defaults;

    _this.model = options.model;
    _this.config = options.config;
  };


  /**
   * Unbind events and free references.
   */
  _this.destroy = function () {
    if (_this === null) {
      // already destroyed
      return;
    }
    _this.stop();
    _this = null;
  };

  /**
   * Get settings from model.
   *
   * @return {Object}
   *     object with settings from model.
   *     any objects that have associated config option collections
   *     are replaced with ids.
   */
  _this.getModelSettings = function () {
    var config,
        i,
        key,
        len,
        model,
        setting,
        settings,
        value;

    config = _this.config;
    model = _this.model.get();

    settings = {};
    for (key in model) {
      value = model[key];
      setting = null;
      if (key in config.options) {
        if (Array.isArray(value)) {
          // multi-select
          setting = {};
          for (i = 0, len = value.length; i < len; i++) {
            setting[value[i].id] = true;
          }
        } else if (value && value.id) {
          setting = value.id;
        }
      } else {
        // non-collection and non-object setting
        setting = value;
      }
      settings[key] = setting;
    }

    return settings;
  };

  /**
   * Get settings from URL.
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
    _this.setModelSettings(_this.getUrlSettings(), false);
  };

  /**
   * Called when model changes.
   *
   * Store settings in url.
   */
  _this.onModelChange = function () {
    _this.setUrlSettings(_this.getModelSettings());
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
        // some email clients strip the last encoded '}'
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
   * Update model based on settings.
   *
   * @param settings {Object}
   *     settings to set.
   * @param allowNewProperties {Boolean}
   *     default false.
   *     add new properties to model that do not already exist,
   *     or have a config option collection.
   */
  _this.setModelSettings = function (settings, allowNewProperties) {
    var collection,
        config,
        i,
        key,
        model,
        setting,
        toSet,
        value;

    config = _this.config;
    model = _this.model.get();

    toSet = {};
    for (key in settings) {
      setting = settings[key];
      value = null;
      if (key in config.options) {
        // collection based-setting
        collection = config.options[key];
        if (setting !== null && typeof setting === 'object') {
          value = [];
          for (i in setting) {
            if (setting[i] === true) {
              value.push(collection.get(i));
            }
          }
        } else if (typeof setting === 'string') {
          // treat as id for object in collection
          value = collection.get(setting);
        }
      } else if (!(key in model) && allowNewProperties !== true) {
        // ignore settings not already in model
        continue;
      } else {
        // non-collection and non-object setting
        value = setting;
      }
      toSet[key] = value;
    }

    _this.model.set(toSet);
  };

  /**
   * Update url based on settings.
   *
   * @param settings {Object}
   *     settings to store in url.
   */
  _this.setUrlSettings = function (settings) {
    var encoded;

    encoded = encodeURI(JSON.stringify(settings));
    window.location = '#' + encoded;
  };

  /**
   * Set defaults, and start listening to hashchange and model change events.
   */
  _this.start = function () {
    if (_started) {
      return;
    }
    // initialize model based on defaults and current url
    _this.setModelSettings(Util.extend({},
        _defaults,
        _this.getUrlSettings()), true);

    // update if URL changes
    Events.on('hashchange', 'onHashChange', _this);
    _this.model.on('change', 'onModelChange', _this);
    _started = true;
  };

  /**
   * Stop listening to hashchange and model change events.
   */
  _this.stop = function () {
    if (!_started) {
      return;
    }
    Events.off('hashchange', 'onHashChange', _this);
    _this.model.off('change', 'onModelChange', _this);
    _started = false;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = UrlManager;
