'use strict';

var Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    Xhr = require('util/Xhr');


var _DEFAULTS = {
  config: null,
  model: null
};


/**
 * Latest earthquakes catalog.
 *
 * Extends collection, and handles Config and Settings logic for
 * loading feed/search and autoUpdate.
 */
var Catalog = function (options) {
  var _this,
      _initialize,

      _config,
      _model;

  // catalog is a collection of earthquakes
  _this = Collection();

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _config = options.config;
    _model = options.model;

    if (_model) {
      _model.on('change:feed', 'load', _this);
    }

    // TODO: handle autoUpdate

    // keep track of whether there was a load error
    _this.error = false;
  };


  /**
   * Free event listeners and references.
   */
  _this.destroy = Util.compose(function () {
    if (_this === null) {
      return;
    }

    if (_model) {
      _model.off('change:feed', 'load', _this);
    }

    _config = null;
    _model = null;
    _this = null;
  }, _this.destroy);

  /**
   * Fetch catalog based on config and model.
   */
  _this.load = function () {
    var feed,
        id,
        search;

    if (!_model || !_config) {
      throw new Error('Catalog.load requires model and config');
    }
    id = _model.get('feed');
    feed = _config.feeds.get(id);

    if (feed) {
      _this.loadUrl(feed.url);
      return;
    }

    search = _model.get('search');
    if (search && search.id === id) {
      feed = Util.extend({}, search);
      // TODO: build search URL, check count, etc
      // eventually call loadUrl with search url.
    }

    // set default feed (which will trigger a call to load)
    feed = _config.feeds.data()[0];
    _model.set({feed: feed.id});
  };

  /**
   * Load a catalog url.
   *
   * @param url {String}
   *     catalog url.
   * @param data {Object}
   *     optional, data for ajax call.
   */
  _this.loadUrl = function (url, data) {
    Xhr.ajax({
      url: url,
      data: data,
      success: _this.onLoadSuccess,
      error: _this.onLoadError
    });
  };

  /**
   * Called when catalog fails to load.
   */
  _this.onLoadError = function (err/*, xhr */) {
    // TODO: check error info on xhr object.
    _this.error = err;
    _this.reset([]);
  };

  /**
   * Called when catalog successfully loaded.
   */
  _this.onLoadSuccess = function (data/*, xhr*/) {
    _this.error = false;
    _this.reset(data.features);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Catalog;
