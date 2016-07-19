'use strict';

var UrlManager = require('core/UrlManager'),
    Util = require('util/Util');


var _DEFAULTS = {
  hiddenSettings: [
    'searchForm',
    'searchUrl'
  ]
};


/**
 * LatestEarthquakes specific Url Manager.
 *
 * Hides settings that should not appear in url.
 * Manages "search" setting by adding to feeds collection.
 *
 * @param options {Object}
 *     passed to UrlManager.
 * @param options.hiddenSettings {Array<String>}
 *     array of setting names to be hidden from url.
 */
var LatestEarthquakesUrlManager = function (options) {
  var _this,
      _initialize,

      _hiddenSettings,
      _parent,
      _search;


  _this = UrlManager(options);
  // copy all parent class methods before overriding below.
  _parent = Util.extend({}, _this);


  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _hiddenSettings = options.hiddenSettings;
    _search = null;
  };

  /**
   * Upconverts old boolean bookmarks to arrays.
   *
   * {'setting': true} --> {'setting': ['setting']}
   * AND
   * {'setting': false} --> {'setting': []}
   *
   * Note : This method converts the object in-place, but also returns
   *        a reference to that object.
   *
   * @param settings {Object}
   *     The object of settings.
   * @param key {String}
   *     The name of the setting to upconvert.
   *
   * @return {Object}
   *     A reference to the given settings
   */
  _this.convertBooleanToArray = function (settings, key) {
    var value;

    if (settings.hasOwnProperty(key) && typeof settings[key] === 'boolean') {
      value = [];

      if (settings[key] === true) {
        value.push(key);
      }

      settings[key] = value;
    }

    return settings;
  };

  /**
   * Free references.
   */
  _this.destroy = function () {
    if (_parent === null) {
      return;
    }

    _parent.destroy();
    _parent = null;
    _this = null;
  };

  /**
   * Prevent hidden settings from being returned by getModelSettings.
   *
   * @param settings {Object}
   *     model settings.
   * @return {Object}
   *     same object with settings removed.
   */
  _this.getModelSettings = Util.compose(_this.getModelSettings, function (settings) {
    _this.hideSettings(settings);
    return settings;
  });

  _this.getUrlSettings = Util.compose(_this.getUrlSettings, function (settings) { 
    _this.convertBooleanToArray(settings, 'restrictListToMap');
    _this.convertBooleanToArray(settings, 'autoUpdate');

    return settings;
  });

  /**
   * Delete hidden settings from the settings object.
   *
   * @param settings {Object}
   *     settings object with settings to delete.
   * @return {Object}
   *     the same `settings` object with settings removed.
   */
  _this.hideSettings = function (settings) {
    // remove these keys
    _hiddenSettings.forEach(function (name) {
      delete settings[name];
    });
    return settings;
  };

  /**
   * Intercept setModelSettings calls.
   *
   * Ensure "search" object is added to feeds collection.
   * Ensure hidden settings are not updated on model.
   */
  _this.setModelSettings = function (settings, allowNewProperties) {
    var feeds;

    // intercept settings to add/remove search from feed collection
    if (settings.search) {
      feeds = _this.config.options.feed;

      if (_search !== null) {
        feeds.remove(_search);
      }

      _search = settings.search;
      if (_search !== null) {
        feeds.add(_search);
      }
    }

    // remove these keys
    if (!allowNewProperties) {
      _this.hideSettings(settings);
    }

    // now call parent setModelSettings method.
    _parent.setModelSettings(settings, allowNewProperties);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = LatestEarthquakesUrlManager;
