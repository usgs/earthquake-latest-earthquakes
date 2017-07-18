'use strict';


var Accordion = require('accordion/Accordion'),
    Collection = require('mvc/Collection'),
    DownloadView = require('list/DownloadView'),
    Formatter = require('core/Formatter'),
    GenericCollectionView = require('core/GenericCollectionView'),
    ModalView = require('mvc/ModalView'),
    Util = require('util/Util');


var _DEFAULTS = {};


/**
 * Produces a view to download feeds.
 */
var MetadataView = function (options) {
  var _initialize,
      _this;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);

  /**
   * Constructor. Initializes a new DownLoadView.
   *
   * @params options {Object}
   *    Configuration options. May Include:
   * @params options.model
   * @params options.collection
   */
  _initialize = function (options) {
    _this.collection = options.collection || Collection();
    _this.formatter = options.formatter || Formatter();

    _this.collection.on('reset', 'render', _this);
    _this.model.off('change', 'render', _this);
    _this.model.on('change:feed', 'displaySearchParameters', _this);

    _this.createSkeleton();
  };


  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _this.downloadButton.removeEventListener('click', _this.onButtonClick);
    _this.model.on('change', 'render', _this);
    _initialize = null;
    _this = null;
  }, _this.destroy);


  _this.createSkeleton = function () {
    _this.el.classList.add('accordion');
    // TODO, make configurable, to start open
    _this.el.classList.add('accordion-closed');
    _this.el.innerHTML =
      '<h3 class="header-title"></h3>' +
      '<span class="header-count accordion-toggle"></span>' +
      '<div class="accordion-content header-info-content">' +
        '<dl class="search-parameter-list"></dl>' +
        '<button class="download-button blue" type="button">' +
          'Download' +
        '</button>' +
      '</div>';

    Accordion({
      el: _this.el
    });

    _this.titleEl = _this.el.querySelector('.header-title');
    _this.countEl = _this.el.querySelector('.header-count');
    _this.downloadButtonEl = _this.el.querySelector('button');
    _this.searchParameterListEl =
        _this.el.querySelector('.search-parameter-list');

    _this.downloadView = DownloadView({
      model: _this.model,
      collection: _this.collection
    });

    _this.downloadModal = ModalView(_this.downloadView.el, {
      title: 'Download'
    });

    _this.downloadButtonEl.addEventListener('click', _this.onButtonClick);
  };


  /**
   * Shows download view when button is clicked.
   */
  _this.onButtonClick = function () {
    _this.downloadModal.show();
  };


  /**
   * Formats earthquake count information
   *
   * @param number (totalCount)
   *    number of total earthquakes.
   * @param number (displayCount)
   *    Number of earthquakes visable on map.
   * @param boolean (restrict)
   *    true or false.
   */
  _this.formatCountInfo = function (totalCount, displayCount, restrict) {
    var countInfo;

    if (restrict) {
      countInfo = displayCount + ' of ' + totalCount +
          ' earthquakes in map area.';
    } else {
      countInfo = totalCount + ' earthquakes.';
    }

    return countInfo;
  };

  /**
   * Return all filtered data.
   *
   * @return {Array}
   *    An array of features.
   */
  _this.getDataToRender = function () {
    var data;

    data = _this.collection.data().slice(0);

    if (_this.filterEnabled) {
      data = _this.filterEvents(data);
    }

    return data;
  };

  /**
   * Renders the view.
   */
  _this.render = function () {
    var displayCount,
        headerCount,
        headerTitle,
        metadata,
        totalCount,
        updateTime;

    metadata = _this.collection.metadata || {};
    headerTitle = _this.model.get('feed').name;
    totalCount = metadata.hasOwnProperty('count') ? metadata.count : '&ndash;';
    displayCount = _this.getDataToRender().length;
    headerCount = _this.formatCountInfo(totalCount, displayCount,
        _this.filterEnabled);
    updateTime = _this.formatter.datetime(metadata.generated, false);

    _this.titleEl.innerHTML = headerTitle;
    _this.countEl.innerHTML = headerCount;

    _this.displaySearchParameters();
  };


  _this.displaySearchParameters = function () {
    var buf,
        feed,
        key,
        metadata,
        params,
        updateTime;

    buf = [];
    feed = this.model.get('feed') || {};
    params = feed.params;

    if (feed.isSearch) {
      for(key in params) {
        buf.push(
          '<dt>' + key + '</dt>' +
          '<dd>' + params[key] + '</dd>'
        );
      }
    }

    metadata = _this.collection.metadata || {};
    updateTime = _this.formatter.datetime(metadata.generated, false);
    if (updateTime) {
      buf.push(
        '<dt>updated</dt>' +
        '<dd>' + updateTime + '</dd>'
      );
    }

    _this.searchParameterListEl.innerHTML = '<dl>' + buf.join('') + '</dl>';
   };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = MetadataView;
