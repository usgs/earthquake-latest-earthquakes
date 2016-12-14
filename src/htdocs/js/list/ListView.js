/* global SCENARIO_MODE */
'use strict';


var Accordion = require('accordion/Accordion'),
    DownloadView = require('list/DownloadView'),
    Formatter = require('core/Formatter'),
    GenericCollectionView = require('core/GenericCollectionView'),
    MapUtil = require('core/MapUtil'),
    ModalView = require('mvc/ModalView'),
    Util = require('util/Util');


var _DEFAULT_FORMAT,
    _DEFAULTS;

_DEFAULT_FORMAT = {
  format: function (feature) {
    var pre;

    pre = document.createElement('pre');
    pre.classList.add('list-view-default-format');
    pre.innerHTML = JSON.stringify(feature, null, '  ');

    return pre;
  }
};

_DEFAULTS = {
  classPrefix: 'list-view',
  containerNodeName: 'ol',
  noDataMessage: 'There are no events in the current feed.',
  watchProperty: 'event'
};


/**
 * A class for rendering a collection of features from a summary feed as a
 * list. Extends the core/GenericCollectionView class. There are two primary
 * differences between this class and its parent:
 *
 * (1) Changes to the model's "listFormat" method also triggers a re-render
 *     of the entire collection.
 * (2) The createCollectionItemContent delegates to the configured listFormat
 *     in order to generate the content. If no listFormat is provided, a
 *     based JSON.stringify format is used instead.
 *
 * @see core/GenericCollectionView
 */
var ListView = function (options) {
  var _this,
      _initialize,

      _bounds,
      _downloadButton,
      _downloadModal,
      _downloadView,
      _formatter,
      _headerCount,
      _headerTitle,
      _headerUpdateTime,
      _listFormat,
      _noDataMessage,

      _createScaffold;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);

  /**
   * Constructor
   *
   * See documentation for core/GenericCollectionView#_initialize for details.
   *
   * @see core/GenericCollectionView#_initialize
   */
  _initialize = function (options) {
    _formatter = options.formatter || Formatter();
    _noDataMessage = options.noDataMessage;

    _this.filterEnabled = false;
    _this.mapEnabled = false;

    _this.model.on('change:listFormat', 'render', _this);
    _this.model.on('change:timezone', 'render', _this);
    _this.model.on('change:restrictListToMap', 'onRestrictListToMap', _this);
    _this.footer.addEventListener('click', _this.onFooterClick);

    _createScaffold();
  };

  /**
   * Creates scaffolding for list view header.
   */
  _createScaffold = function () {
    _this.header.classList.add('accordion');
    _this.header.classList.add('accordion-closed');

    _this.header.innerHTML =
      '<h3 class="header-title"></h3>' +
      '<span class="header-count accordion-toggle"></span>' +
      '<div class="accordion-content header-info-content">' +
        '<p class="header-update-time"></p>' +
        '<button class="download-button blue" type="button">' +
          'Download Earthquakes' +
        '</button>' +
      '</div>';

    Accordion({
      el: _this.header
    });

    _headerTitle = _this.header.querySelector('.header-title');
    _headerCount = _this.header.querySelector('.header-count');
    _headerUpdateTime = _this.header.querySelector('.header-update-time');
    _downloadButton = _this.header.querySelector('button');

    _downloadView = DownloadView({
      model: _this.model,
      collection: _this.collection
    });

    _downloadModal = ModalView(_downloadView.el, {
      title: 'Download'
    });

    _downloadButton.addEventListener('click', _this.onButtonClick);
  };

  /**
   * APIMethod
   *
   * Delegates to the listFormat indicated by the model to generate the
   * content for the specifc event feature.
   *
   * @override core/GenericCollectionView#createCollectionItemContent
   */
  _this.createCollectionItemContent = function (obj) {
    var listFormat;

    listFormat = _listFormat;
    if (!listFormat) {
      listFormat = _this.model.get('listFormat');
      if (listFormat) {
        listFormat = listFormat.format;
      } else {
        listFormat = _DEFAULT_FORMAT;
      }
    }

    return listFormat.format(obj);
  };

  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _downloadButton.removeEventListener('click', _this.onButtonClick);
    _this.footer.removeEventListener('click', _this.onFooterClick);

    _this.model.off('change:listFormat', 'render', _this);
    _this.model.off('change:timezone', 'render', _this);
    _this.model.off('change:restrictListToMap', 'onRestrictListToMap', _this);

    _bounds = null;
    _downloadButton = null;
    _downloadModal = null;
    _downloadView = null;
    _formatter = null;
    _headerCount = null;
    _headerTitle = null;
    _headerUpdateTime = null;
    _listFormat = null;

    _createScaffold = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Filter list of events and return only what is inside the map bounds.
   * If the map is not visible use the previously available bounds.
   *
   * @param items {Array}
   *     array of events
   *
   * @return {Array}
   *     filtered events that are within the map bounds
   */
  _this.filterEvents = function (items) {
    var events,
        i,
        viewModes;

    // check if map is visible
    _this.mapEnabled = false;
    viewModes = _this.model.get('viewModes') || [];
    for (i = 0; i < viewModes.length; i++) {
      if (viewModes[i].id === 'map') {
        _this.mapEnabled = true;
      }
    }

    // if the map is enabled, check the bounds
    if (_this.mapEnabled) {
      _bounds = _this.model.get('mapposition');
    }

    // if map is hidden then return all events
    if (!_bounds) {
      return items;
    }

    // loop through all events, check against map bounds
    events = [];
    events = items.filter(function (item) {
      var coordinates;
      coordinates = item.geometry.coordinates;
      return MapUtil.boundsContain(_bounds, [coordinates[1], coordinates[0]]);
    });

    return events;
  };

  _this.onFooterClick = function (e) {
    var target;

    target = e.target;
    if (target.classList.contains('settings-link')) {
      _this.onSettingsLinkClick();
    }
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
   * Shows download view when button is clicked.
   */
  _this.onButtonClick = function () {
    _downloadModal.show();
  };

  /**
   * Sets up the mapposition:change binding that filters the list to the
   * map extents.
   *
   * Handles the initial filtering on the Catalog collection when the
   * "restrictListToMap" setting is enabled, and resets the filtering
   * when the "restrictListToMap" setting is disabled.
   *
   */
  _this.onRestrictListToMap = function () {
    var restrictListToMap;

    restrictListToMap = _this.model.get('restrictListToMap');

    if (restrictListToMap && restrictListToMap.length === 1) {
      // stop double renders from creating multiple bindings
      if (_this.filterEnabled) {
        return;
      }
      _this.filterEnabled = true;
      _this.model.on('change:mapposition', _this.render, _this);
    } else {
      // stop double renders from creating multiple bindings
      if (!_this.filterEnabled) {
        return;
      }
      _this.filterEnabled = false;
      _this.model.off('change:mapposition', _this.render, _this);
    }

    _this.render();
  };

  /**
   * Updates model
   */
  _this.onSettingsLinkClick = function () {
    _this.model.set(
      {
        'viewModes': [
          {
            'id':'settings'
          }
        ]
      }
    );
  };

  /**
   * Override render to get a referene to current list format,
   * and configure timezone before rendering.
   */
  _this.render = Util.compose(function () {
    var listFormat,
        timezone;

    listFormat = _this.model.get('listFormat');
    if (listFormat) {
      listFormat = listFormat.format;

      // set current timezone setting
      timezone = _this.model.get('timezone');
      if (timezone) {
        listFormat.setTimezoneOffset(timezone.offset);
      }
    } else {
      listFormat = _DEFAULT_FORMAT;
    }

    _listFormat = listFormat;
  }, _this.render);

  /**
   * Render the footer information for this view into `_this.footer`.
   * The footer is formatted based on if scenario mode is selected or not.
   */
  _this.renderFooter = function () {
    var footer;

    footer =
      '<h4>Didn&apos;t find what you were looking for?</h4>' +
      '<ul>' +
        '<li>' +
          'Check your <a href="javascript:void(null);" ' +
          'class="settings-link">Settings</a>.' +
        '</li>' +
        (!SCENARIO_MODE ?
        '<li>' +
          '<a href="/data/comcat/data-availability.php">' +
            'Which earthquakes are included on the map and list?' +
          '</a>' +
        '</li>' +
        '<li>' +
          '<a href="/earthquakes/eventpage/unknown#tellus">' +
            'Felt something not shown – report it here.' +
          '</a>' +
        '</li>': '') +
      '</ul>';
    _this.footer.innerHTML = footer;
  };

  /**
   * Render the header information.
   */
  _this.renderHeader = function () {
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
    updateTime = _formatter.datetime(metadata.generated, false);

    _headerTitle.innerHTML = headerTitle;
    _headerCount.innerHTML = headerCount;
    _headerUpdateTime.innerHTML = 'Updated: ' + updateTime;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
