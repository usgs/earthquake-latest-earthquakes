/* global SEARCH_PATH */
'use strict';


var Collection = require('mvc/Collection'),
    DownloadView = require('list/DownloadView'),
    Formatter = require('core/Formatter'),
    GenericCollectionView = require('core/GenericCollectionView'),
    ModalView = require('mvc/ModalView'),
    Util = require('util/Util');


var _DEFAULTS = {
  noDataMessage: 'There are no events in the current feed.',
};


/**
 * Produces a view to download feeds.
 */
var MetadataView = function (options) {
  var _initialize,
      _this;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);

  /**
   * Constructor. Initializes a new MetadataView.
   *
   * @params options {Object}
   *    Configuration options. May Include:
   * @params options.collection
   * @params options.formatter
   * @params options.model
   */
  _initialize = function (options) {
    _this.collection = options.collection || Collection();
    _this.formatter = options.formatter || Formatter();

    _this.model.off('change', 'render', _this);
    _this.model.on('change:feed', 'displaySearchParameters', _this);

    // TODO, make configurable, to start open
    _this.el.innerHTML =
        '<dl class="feed-metadata-list">' +
          '<dt>Last Updated</dt>' +
          '<dd class="feed-update-time"></dd>' +
        '</dl>' +
        '<button class="download-button blue" type="button">Download</button>' +
        '<div class="search-parameter-view"><div>';

    _this.downloadButtonEl = _this.el.querySelector('.download-button');
    _this.downloadButtonEl.addEventListener('click',
        _this.onDownloadButtonClick);
    _this.feedUpdateTimeEl = _this.el.querySelector('.feed-update-time');
    _this.searchButtonEl = document.createElement('button');
    _this.searchButtonEl.addEventListener('click',
        _this.onSearchButtonClick);
    _this.searchButtonEl.classList.add('search-button');
    _this.searchButtonEl.classList.add('blue');
    _this.searchButtonEl.innerHTML = 'Modify Search';
    _this.searchParameterViewEl =
        _this.el.querySelector('.search-parameter-view');

    // Create DownloadView
    _this.downloadView = DownloadView({
      model: _this.model,
      collection: _this.collection
    });

    // Create Modal for DownloadView
    _this.downloadModal = ModalView(_this.downloadView.el, {
      title: 'Download'
    });
  };

  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    if (!_this) {
      return;
    }
    _this.downloadButtonEl.removeEventListener('click',
        _this.onDownloadButtonClick);
    _this.searchButtonEl.removeEventListener('click',
        _this.onSearchButtonClick);
    _this.model.on('change', 'render', _this);
    _this.model.off('change:feed', 'displaySearchParameters', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Loop through all search parameters and display with
   * "modify search" button
   */
  _this.displaySearchParameters = function () {
    var buf,
        feed,
        key,
        params;

    feed = this.model.get('feed') || {};

    // only display if feed is a search
    if (feed.isSearch) {
      buf = [];
      params = feed.params;

      for (key in params) {
        buf.push(
          '<dt>' + key + '</dt>' +
          '<dd>' + params[key] + '</dd>'
        );
      }

      // Add search parameters with search button
      Util.empty(_this.searchParameterViewEl);
      _this.searchParameterViewEl.innerHTML =
          '<h4>Search Parameters</h4>' +
          '<dl class="search-parameter-list">' + buf.join('') + '</dl>';
      _this.searchParameterViewEl.appendChild(_this.searchButtonEl);
    }
  };

  /**
   * Show download view when button is clicked.
   */
  _this.onDownloadButtonClick = function () {
    _this.downloadModal.show();
  };

  /**
   * Called when search button is clicked
   */
  _this.onSearchButtonClick = function () {
    _this.setWindowLocation(SEARCH_PATH + window.location.hash);
  };

  /**
   * Render the view.
   */
  _this.render = function () {
    var metadata,
        updateTime;

    metadata = _this.collection.metadata || {};
    updateTime = _this.formatter.datetime(metadata.generated);

    // Update feed/search metadata
    _this.feedUpdateTimeEl.innerHTML = updateTime;

    // Update search parameters
    _this.displaySearchParameters();
  };

  /**
   * Redirect page to specified URL
   *
   * @param string (url)
   *        The URL where the page should be redirected
   */
  _this.setWindowLocation = function (url) {
    window.location = url;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = MetadataView;
