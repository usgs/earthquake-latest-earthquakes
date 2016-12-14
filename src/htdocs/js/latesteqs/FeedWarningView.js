/* global SCENARIO_MODE, SEARCH_PATH */
'use strict';

var ModalView = require('mvc/ModalView'),
    Util = require('util/Util');

var _DEFAULTS = {
  app: null,
  maxResults: null
};

var FeedWarningView = function (options) {
  var _this,
      _initialize,

      _app,
      _maxResults,

      _onDialogHide;

  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _app = options.app || {};
    _maxResults = options.maxResults || 0;

    _this.callback = null;
    _this.data = null;
    _this.dialog = null;
  };

  /**
   * Hides the dialog and executes the callback.
   *
   * Triggered by _this.dialog.hide()
   */
  _onDialogHide = function () {
    _this.hide();
    _this.onDialogContinue();
  };

  /**
   * Bookmarks the current page
   */
  _this.addBookmark = function () {
    if (window.sidebar) { // FF
      window.sidebar.addPanel(window.location, document.title, '');
    } else if (window.external && window.external.AddFavorite) { // IE
      window.external.AddFavorite(window.location, document.title);
    }
  };

  /**
   * Cleans up
   */
  _this.destroy = function () {
    _onDialogHide = null;

    _app = null;
    _maxResults = null;

    _initialize = null;
    _this = null;
  };

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
      '<a class="catalog-anchor" href="', SEARCH_PATH,
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
        dialog.hide();
        _app.revertToDefaultFeed();
      });

    return p;
  };

  /**
   * Hides dialog and unbinds event
   */
  _this.hide = function () {
    if (_this.dialog) {
      _this.dialog.off('hide', _onDialogHide);
      _this.dialog.hide();
      _this.dialog = null;
    }
  };

  /**
   * Executes the callback, when a callback exists for the
   * "Continue anyway" option
   *
   * Called when the "continue anyway" button is clicked, or the modal is
   * closed without selecting any of the available options.
   */
  _this.onDialogContinue = function () {
    if (_this.callback) {
      _this.callback(_this.data);
    }
  };

  /**
   * Displays a modal dialog to the user indicating that the feed may be too
   * large to display in the browser.
   *
   * @param callback {Function}
   *      function to execute when "continue anyway" button is clicked
   *
   * @param data {Object}
   *      data to be passed to the callback
   */
  _this.showClientMaxError = function (callback, data) {
    var message;

    _this.callback = callback;
    _this.data = data;

    message = document.createElement('div');

    _this.dialog = ModalView(message, {
      title: 'Caution',
      closable: false,
      classes: ['modal-warning', 'catalog'],
      buttons: [
        {
          callback: function () {
            _this.hide();
            _this.onDialogContinue();
          },
          text: 'Continue anyway',
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
    message.appendChild(_this.getDialogRevertAction(_this.dialog));

    _this.dialog.show();
    _this.dialog.on('hide', _onDialogHide);
  };

  /**
   * Displays a modal dialog to the user indicating that there is no data in
   * the currently loaded feed/search.
   *
   * @param callback {Function}
   *      function to execute when "continue anyway" button is clicked
   *
   * @param data {Object}
   *      data to be passed to the callback
   */
  _this.showNoDataError = function (callback, data) {
    var message;

    _this.callback = callback;
    _this.data = data;

    message = document.createElement('div');

    _this.dialog = ModalView(message, {
      title: 'Caution',
      closable: true,
      classes: ['modal-warning', 'catalog'],
      buttons: [
        {
          callback: function () {
            _this.hide();
            _this.onDialogContinue();
          },
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

    _this.dialog.show();
    _this.dialog.on('hide', _onDialogHide);
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
    var message,
        supportsBookmark;

    message = document.createElement('div');
    supportsBookmark = _this.supportsBookmark();
    _this.dialog = ModalView(message, {
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
    message.appendChild(_this.getDialogRevertAction(_this.dialog));

    if (supportsBookmark) {
      message.querySelector('.bookmark').addEventListener(
          'click', _this.addBookmark);
    }

    _this.dialog.show();
  };


  /**
   * Displays a modal dialog to the user if the query was too large to return
   *
   * @param data {Object}
   *      json response with error data
   */
  _this.showServerMaxError = function (data) {
    var message;

    message = document.createElement('div');
    _this.dialog = ModalView(message, {
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
    message.appendChild(_this.getDialogRevertAction(_this.dialog));

    _this.dialog.show();
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
    var message;

    message = document.createElement('div');
    _this.dialog = ModalView(message, {
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
    message.appendChild(_this.getDialogRevertAction(_this.dialog));

    _this.dialog.show();
  };

  /**
   * Determines whether the current browser has the capacity to prompt
   * the user to save a bookmark
   *
   * @return {boolean}
   *       returns true if the user can be prompted to save a bookmark
   */
  _this.supportsBookmark = function () {
    return window.sidebar || (window.external && window.external.AddFavorite);
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = FeedWarningView;
