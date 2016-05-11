'use strict';


var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
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

      _parent;


  // catalog is a collection of earthquakes
  _this = Collection();
  _parent = Util.extend({}, _this);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.model = options.model || Model();
    _this.model.on('change:feed', 'load', _this);
    _this.model.on('change:sort', 'onSort', _this);

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

    _this.model.off('change:feed', 'load', _this);
    _this.model.off('change:sort', 'sort', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Fetch catalog based on config and model.
   */
  _this.load = function () {
    var feed,
        params,
        url;

    feed = _this.model.get('feed');
    if (feed) {
      if (feed.url) {
        // feed
        url = feed.url;
        params = null;
      } else {
        // search
        url = _this.model.get('searchUrl');
        params = feed.params;
      }

      _this.loadUrl(url, params);
      return;
    } else {
      _this.onLoadError('no feed selected');
    }
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
    // signal to listeners that a load is starting
    _this.trigger('loading');

    Xhr.ajax({
      url: url,
      data: data || null,
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
    _this.metadata = null;
    _this.reset([]);
  };

  /**
   * Called when catalog successfully loaded.
   */
  _this.onLoadSuccess = function (data/*, xhr*/) {
    _this.error = false;
    _this.metadata = data.metadata;
    _this.reset(data.features);
  };

  /**
   * Sorts the data.
   *
   * @param method {Object}
   *        the selected settings sort object from the model
   */
  _this.onSort = function () {
    var method;

    method = _this.model.get('sort');

    if (method && method.sort) {
      _this.sort(method.sort);
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Catalog;
