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
      _maxResults;

  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _app = options.app || {};
    _maxResults = options.maxResults || 0;
  };

  _this.destroy = function () {
    _app = null;
    _maxResults = null;

    _initialize = null;
    _this = null;
  };

  /**
   * Bookmarks the current page
   */
  _this.addBookmark = function () {
    if (window.sidebar) { // FF
      window.sidebar.addPanel(window.location, document.title, '');
    } else if (window.external) { // IE
      window.external.AddFavorite(window.location, document.title);
    }
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
          callback: function () {
            dialog.hide();
            callback(data);
          },
          text: 'Continue anyway',
        }
      ],
      destroyOnHide: true
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
          callback: function () {
            callback(data);
            dialog.hide();
          },
          text: 'Continue'
        }
      ],
      destroyOnHide: true
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
    supportsBookmark = _this.supportsBookmark();
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
      message.querySelector('.bookmark').addEventListener(
          'click', _this.addBookmark);
    }

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
