'use strict';


var Collection = require('mvc/Collection'),
    Message = require('util/Message'),
    ModalView = require('mvc/ModalView'),
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

      _app,
      _autoUpdateIntervalHandler,
      _loadingMessage,
      _maxResults,
      _xhr;


  // catalog is a collection of earthquakes
  _this = Collection();
  _autoUpdateIntervalHandler = null;
  _xhr = null;


  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _loadingMessage = null;

    if (Util.isMobile()) {
      _maxResults = 500;
    } else {
      _maxResults = 2000;
    }

    _app = options.app;

    _this.model = options.model || Model();
    _this.model.on('change:feed', 'onFeedChange', _this);
    _this.model.on('change:sort', 'onSort', _this);
    _this.model.on('change:autoUpdate', 'setAutoUpdateInterval', _this);
    _this.on('loading', 'loading', _this);
    _this.on('reset', 'checkForEventInCollection', _this);

    // keep track of whether there was a load error
    _this.error = false;
  };

  /**
   * Checks the collection to see if the selected event exists in the
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

  _this.checkSearchLimit = function (url, data) {
    _this.trigger('loading');

    url = url.replace('query.geojson', 'count');
    data.format = 'geojson';

    _xhr = Xhr.ajax({
      url: url,
      data: data || null,
      success: _this.onCheckQuerySuccess,
      error: _this.onLoadError
    });
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
   * Creates link to return to search page.
   *
   * @param helpText {String}
   *    Text describing why to modify the search
   */
  _this.getDialogModifySearchAction = function (helpText) {
    var p;

    p = document.createElement('p');
    p.innerHTML = [
      '<a class="catalog-anchor" href="/earthquakes/search/', // TODO :: Configurable?
        window.location.hash, '">Modify Search</a>',
        '<small class="catalog-action-description">', helpText, '</small>'
    ].join('');

    return p;
  };

  /**
   * Revert Action Link
   *
   * @param dialog {ModalView}
   */
  _this.getDialogRevertAction = function (dialog) {
    var p;

    p = document.createElement('p');

    p.innerHTML = [
        '<p class="catalog-revert-wrapper">',
          '<button class="button-as-link revert">',
            'Show Realtime Data Instead',
          '</button>',
          '<small class="catalog-action-description">',
            '1 Day, Magnitude 2.5+ Worldwide',
          '</small>',
        '</p>'
      ].join('');

    p.querySelector('.revert').addEventListener('click',
      function () {
        _app.revertToDefaultFeed();
        dialog.hide();
      });

    return p;
  };

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
        _this.loadUrl(url, params, _this.onCheckFeedSuccess);
      } else {
        // search
        url = _this.model.get('searchUrl');
        params = feed.params;
        _this.checkSearchLimit(url, params);
      }
    } else {
      _this.onLoadError('no feed selected');
    }
  };

  /**
   * Load a Query
   */
  _this.loadQuery = function () {
    var feed,
        params,
        url;

    feed = _this.model.get('feed');
    url = _this.model.get('searchUrl');
    params = feed.params;

    _this.loadUrl(url, params, _this.onLoadSuccess);
  };

  /**
   * Load a catalog url.
   *
   * @param url {String}
   *     catalog url.
   * @param data {Object}
   *     optional, data for ajax call.
   * @callback {Object}
   *    callback for successful load
   */
  _this.loadUrl = function (url, data, callback) {
    // signal to listeners that a load is starting
    _this.trigger('loading');

    _xhr = Xhr.ajax({
      url: url,
      data: data || null,
      success: callback,
      error: _this.onLoadError
    });
  };

  /**
   * Callback for successful feed load.
   *
   * @param data {Object}
   *    Feed object.
   */
  _this.onCheckFeedSuccess = function (data) {
    var metadata;

    metadata = data.metadata;
    if (metadata.count > _maxResults) {
      _this.showClientMaxError(_this.onLoadSuccess, data);
    } else if (metadata.count === 0){
      _this.showNoDataError(_this.onLoadSuccess, data);
    } else {
      _this.onLoadSuccess(data);
    }
  };

  /**
   * Callback for Query call to check size.
   *
   * @param data {Object}
   *    count: int
   *      number of events in query.
   *    maxAllowed: int
   *      max number of events server will return
   */
  _this.onCheckQuerySuccess = function (data) {
    var count,
        max;

    count = data.count;
    max = data.maxAllowed;

    if (count > max) {
      _this.showServerMaxError(data);
      return;
    } else if (count > _maxResults) {
      _this.showClientMaxError(_this.loadQuery, data);
    } else if (count === 0){
      _this.showNoDataError(_this.loadQuery);
    } else {
      _this.loadQuery();
    }
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
    _this.showServerError();
    _this.error = err;
    _this.metadata = null;
    _this.reset([]);
  };

  /**
   * Called when catalog successfully loaded.
   */
  _this.onLoadSuccess = function (data/*, xhr*/) {
    if (_loadingMessage !== null) {
      _loadingMessage.hide();
      _loadingMessage = null;
    }

    if (data.metadata.hasOwnProperty('status') &&
        data.metadata.status !== 200) {
      _this.error = true;
      _this.showServiceError(data);
      return;
    }

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

  _this.loading = function () {
    if (_loadingMessage !== null) {
      _loadingMessage.hide();
      _loadingMessage = null;
    }

    _loadingMessage = Message({
        autoclose: 3000,
        container: document.querySelector('.latest-earthquakes-footer'),
        content:'Earthquakes loading',
        classes: ['map-message']
      });
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

  _this.showClientMaxError = function (callback, data) {
    var message,
        dialog;

    message = document.createElement('div');

    dialog = ModalView(message, {
      title: 'Caution',
      closable: false,
      classes: ['modal-warning', 'catalog'],
      buttons: [
        {
          callback: function () { dialog.hide(); callback(data);},
          classes:['Footer', 'continue'],
          text: 'Continue anyway',
          destroyOnHide: true
        }
      ]
    });

    message.innerHTML = [
      '<p>',
        'The current selection includes more earthquakes than your device ',
        'may be able to display.',
      '</p>',
      '<div class="downloads"></div>'
    ].join('');

    message.appendChild(_this.getDialogModifySearchAction(
        'We recommend at most ' + _maxResults + ' earthquakes for your ' +
        'device.'));
    message.appendChild(_this.getDialogRevertAction(dialog));

    dialog.show();
  };

  _this.showNoDataError = function (callback, data) {
    var message,
        dialog;

    message = document.createElement('div');

    dialog = ModalView(message, {
      title: 'Caution',
      closable: true,
      classes: ['modal-warning', 'catalog'],
      buttons: [
        {
          callback: function () {callback(data); dialog.hide();},
          classes:['Footer', 'continue'],
          text: 'Continue'

        }
      ]
    });

    message.innerHTML = [
      '<p>',
        'The current selection does not currently include any earthquakes.',
      '</p>',
      '<p>',
        'Earthquakes happen around the world all the time. Change your ',
        'options to view more earthquakes.',
      '</p>'
    ].join('');

    dialog.show();
  };

  _this.showServerMaxError = function (data) {
    var message,
        dialog;

    message = document.createElement('div');
    dialog = ModalView(message, {
      title: 'Error',
      closable: false,
      classes: ['modal-error', 'catalog'],
      destroyOnHide: true
    });

    message.innerHTML = [
      '<p>',
        'The current selection includes ', data.count, ' earthquakes, ',
        'which is more than the max allowed ', data.maxAllowed,
      '</p>'
    ].join('');

    message.appendChild(_this.getDialogModifySearchAction(
        'We recommend at most ' + _maxResults + ' earthquakes for your ' +
        'device.'));
    message.appendChild(_this.getDialogRevertAction(dialog));

    dialog.show();
  };

  /**
   * Method called if service request results in an error. This is generally a
   * 503 or 400 error indicating a bad request of some sort. This method will
   * display a modal dialog notifying the user of the error.
   *
   * This type of error is generally non-transient meaning subsequent requests
   * for this data will consistently fail. For this reason, the user has only
   * two courses of action in this dialog:
   *
   *   (1) Modify search (only if currently selected feed is a search)
   *   (2) Show realtime data instead
   *
   * @param response {JSONObject}
   *      Response sent from server. Should have a metadata child element that
   *      contains useful information for rendering the dialog.
   *
   * @see Catalog.js#_showServerError
   */
  _this.showServiceError = function (data) {
    var message,
        dialog;

    message = document.createElement('div');
    dialog = ModalView(message, {
      title: 'Error',
      closable: false,
      classes: ['modal-error', 'catalog'],
      destroyOnHide: true
    });

    message.innerHTML = [
        '<p>There was an error with your search:</p>',
        '<small>' + data.metadata.error + '</small>'
    ].join('');

    message.appendChild(_this.getDialogModifySearchAction(
        'See the error message above for details about why the current ' +
        'request failed and modify appropriately.'));
    message.appendChild(_this.getDialogRevertAction(dialog));

    dialog.show();
  };

  /**
     * Method called if the server does not respond to a request for data. This
     * is generally a default Apache 500 error. This method will display a modal
     * dialog notifying the user of the error.
     *
     * This type of error is generally transient meaning subsequent requests for
     * this data may actually succeed, but the server is currently busy or
     * otherwise unavailable. For this reason, the user is presented with three
     * courses of action in this dialog:
     *
     *   (1) Bookmark this page to try again later
     *   (2) Modify search (only if currently selected feed is a search)
     *   (3) Show realtime data instead
     *
     * @see Catalog.js#_showServiceError
     */
  _this.showServerError = function () {
    var dialog,
        message,
        supportsBookmark;

    message = document.createElement('div');
    supportsBookmark = window.sidebar ||
              (window.external&&window.external.AddFavorite);
    dialog = ModalView(message, {
      title: 'Error',
      closable: false,
      classes: ['modal-error', 'catalog'],
      destroyOnHide: true
    });

    message.innerHTML = [
      '<p>',
        'Your search could not be completed at this time, please try again ',
        'later.',
      '</p>',
      '<p>',
        (supportsBookmark) ? '<button class="button-as-link bookmark">' : '',
          'Bookmark This Page',
        (supportsBookmark) ? '</button>' : '',
        '<small class="catalog-action-description">',
          'Your search may be okay, but the system may be down for ',
          'maintenance. Bookmark this page to try again later.',
        '</small>',
      '</p>'
    ].join('');

    message.appendChild(_this.getDialogModifySearchAction(
        'See the error message above for details about why the current ' +
        'request failed and modify appropriately.'));
    message.appendChild(_this.getDialogRevertAction(dialog));

    if (supportsBookmark) {
      message.querySelector('.bookmark').addEventListener('click',
        function () {
          if (window.sidebar) { // FF
            window.sidebar.addPanel(window.location, document.title, '');
          } else if (window.external) { // IE
            window.external.AddFavorite(window.location, document.title);
          }
          // Don't hide dialog yet. User might not be done.
        }
      );
    }

    dialog.show();
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Catalog;
