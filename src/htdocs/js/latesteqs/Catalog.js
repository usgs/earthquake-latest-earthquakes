'use strict';


var Collection = require('mvc/Collection'),
    Message = require('util/Message'),
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

      _autoUpdateIntervalHandler,
      _xhr;


  // catalog is a collection of earthquakes
  _this = Collection();
  _autoUpdateIntervalHandler = null;
  _xhr = null;

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _this.model = options.model || Model();
    _this.model.on('change:feed', 'onFeedChange', _this);
    _this.model.on('change:sort', 'onSort', _this);
    _this.model.on('change:autoUpdate', 'setAutoUpdateInterval', _this);
    _this.on('reset', 'checkForEventInCollection', _this);

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

    _this.model.off('change:feed', 'onFeedChange', _this);
    _this.model.off('change:sort', 'sort', _this);
    _this.model.off('change:autoUpdate', 'setAutoUpdateInterval', _this);
    _this.off('reset', 'checkForEventInCollection', _this);

    if (_autoUpdateIntervalHandler !== null) {
      clearInterval(_autoUpdateIntervalHandler);
      _autoUpdateIntervalHandler = null;
    }

    if (_xhr !== null) {
      _xhr.abort();
      _xhr = null;
    }

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

    _xhr = Xhr.ajax({
      url: url,
      data: data || null,
      success: _this.onLoadSuccess,
      error: _this.onLoadError
    });
  };

  _this.onFeedChange = function () {
    _this.load();
    _this.setAutoUpdateInterval();
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
    _this.reset(data.features, {'silent': true});
    // sort will trigger a reset on the collection
    _this.onSort();
    Message({
        autoclose: 3000,
        container: document.querySelector('.latest-earthquakes-footer'),
        content:'Earthquakes updated',
        classes: ['map-message', 'info']
      });
  };

  /**
   * Checks the colleciton to see if the selected event exists in the
   * collection. When the event no longer exists, the model is updated.
   */
  _this.checkForEventInCollection = function () {
    var eq;

    eq = _this.model.get('event');
    if (!eq) {
      return;
    }

    // if event does not exist in the new collection, update model
    if (!_this.get(eq.id)) {
      _this.model.set({
        'event': null
      });
    }
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

  /**
   * turns on/off AutoUpdate.
   *  If Auto Update is turned on, and a feed is being used,
   *    and the feed allows autoupdate, then we turn on autoupdate
   *    based on the interval in the feed.
   */
  _this.setAutoUpdateInterval = function () {
    var feed;

    if (_autoUpdateIntervalHandler !== null) {
      //remove any existing interval
      clearInterval(_autoUpdateIntervalHandler);
      _autoUpdateIntervalHandler = null;
    }

    if (_this.model.get('autoUpdate') && _this.model.get('autoUpdate')[0]) {

      feed = _this.model.get('feed');
      if (feed.hasOwnProperty('autoUpdate') && feed.autoUpdate) {
        _autoUpdateIntervalHandler = setInterval(
          _this.load, feed.autoUpdate
        );
      }
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Catalog;
