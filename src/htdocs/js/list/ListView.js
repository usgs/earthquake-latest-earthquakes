'use strict';


var Accordion = require('accordion/Accordion'),
    Collection = require('mvc/Collection'),
    DownloadView = require('list/DownloadView'),
    Formatter = require('core/Formatter'),
    GenericCollectionView = require('core/GenericCollectionView'),
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

      _downloadButton,
      _downloadModal,
      _downloadView,
      _filteredCollection,
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
    // save reference to unfiltered data
    _filteredCollection = Collection();
    _this.filterEnabled = false;
    _this.mapEnabled = false;
    _noDataMessage = options.noDataMessage;

    _this.model.on('change:listFormat', 'render', _this);
    _this.model.on('change:timezone', 'render', _this);
    _this.model.on('change:restrictListToMap', 'onRestrictListToMap', _this);
    _this.collection.on('reset', 'onCollectionReset', _this);
    _filteredCollection.on('reset', 'render', _this);

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
   * Normalize bounds by shifting the point(latlng) left or right,
   * until the point is within the offset bounds
   *
   * @param bounds {4x4 Array [southWest, northEast] or LatLngBounds object}
   * @param latlng {Array [lat,lng]}
   * @return true if bounds contain [lat,lng], false otherwise.
   */
  _this.boundsContain = function(bounds, latlng) {
    var difference,
        latitude,
        longitude,
        maxLatitude,
        maxLongitude,
        minLatitude,
        minLongitude;

    latitude = latlng[0];
    longitude = latlng[1];

    maxLatitude = bounds[1][0];
    minLatitude = bounds[0][0];

    maxLongitude = bounds[1][1];
    minLongitude = bounds[0][1];

    difference = maxLongitude - minLongitude;

    // check latitude values
    if (latlng[0] > maxLatitude || latlng[0] < minLatitude) {
      return false;
    }

    // longitude spans more than 360 (latitude bounds were checked)
    if (difference >= 360) {
      return true;
    }

    // normalize point to be between longitude bounds
    if (minLongitude < longitude && maxLongitude < longitude) {
      while (minLongitude < longitude && maxLongitude < longitude) {
        longitude = longitude - 360;
      }
    } else if (minLongitude > longitude && maxLongitude > longitude) {
      while (minLongitude > longitude && maxLongitude > longitude) {
        longitude = longitude + 360;
      }
    }

    // test with adjusted bounds
    if (longitude <= maxLongitude && longitude >= minLongitude) {
      return true;
    }

    return false;
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

    _this.model.off('change:listFormat', 'render', _this);
    _this.model.off('change:timezone', 'render', _this);
    _this.model.off('change:restrictListToMap', 'onRestrictListToMap', _this);
    _this.collection.off('reset', 'onCollectionReset', _this);
    _filteredCollection.off('reset', 'render', _this);

    _downloadButton = null;
    _downloadModal = null;
    _downloadView = null;
    _filteredCollection = null;
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
   * Filter list of events and return only what is inside the map bounds
   *
   * @param items {Array}
   *     array of events
   *
   * @return {Array}
   *     filtered events that are within the map bounds
   */
  _this.filterEvents = function (items) {
    var bounds,
        coordinates,
        i,
        item,
        events,
        len;

    // if map is hidden then return all events
    if (!_this.mapEnabled) {
      return items;
    }

    events = [];
    bounds = _this.model.get('mapposition');

    // loop through all events, check against map bounds
    for (i = 0, len = items.length; i < len; i++) {
      item = items[i];
      coordinates = item.geometry.coordinates;
      if (_this.boundsContain(bounds, [coordinates[1], coordinates[0]])) {
        events.push(item);
      }
    }

    return events;
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
   * Shows download view when button is clicked.
   */
  _this.onButtonClick = function () {
    _downloadModal.show();
  };

  /**
   * Sync the Catalog collection with the filtered list collection.
   *
   * This is called when the catalog collection is set, so that the
   * two collections stay in sync.
   *
   */
  _this.onCollectionReset = function () {
    var data;

    data = _this.collection.data().slice(0) || [];

    if (_this.filterEnabled) {
      _filteredCollection.reset(_this.filterEvents(data));
    } else {
      _filteredCollection.reset(data);
    }
  };

  /**
   * Called when the map position changes.
   *
   * If the map is visible, then filter by the current map extents. Otherwise
   * the currently filtered collection should remain unchanged.
   *
   */
  _this.onMapPositionChange = function () {
    var data,
        viewModes;

    // check if map is visible
    _this.mapEnabled = false;
    viewModes = _this.model.get('viewModes') || [];
    for (var i = 0; i < viewModes.length; i++) {
      if (viewModes[i].id === 'map') {
        _this.mapEnabled = true;
      }
    }

    // map is on (filter all events by extents)
    if (_this.mapEnabled) {
      data = _this.filterEvents(_this.collection.data().slice(0));
      _filteredCollection.reset(data);
    }
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
      _this.model.on('change:mapposition', _this.onMapPositionChange, _this);
      _this.onMapPositionChange();
    } else {
      // stop double renders from creating multiple bindings
      if (!_this.filterEnabled) {
        return;
      }
      _this.filterEnabled = false;
      _this.model.off('change:mapposition', _this.onMapPositionChange, _this);
      _this.onCollectionReset();
    }
  };

  /**
   * Renders each item in the filtered collection.
   *
   * Displays the _noDataMessage when all data has been filtered,
   * or the collection is empty.
   *
   */
  _this.renderContent = function () {
    var container,
        data;

    try {
      data = _filteredCollection.data().slice(0);

      if (data.length === 0) {
        _this.content.innerHTML = '<p class="alert info">' +
            _noDataMessage +
          '</p>';
      } else {
        container = _this.createCollectionContainer();

        data.forEach(function (obj) {
          container.appendChild(_this.createCollectionItem(obj));
        });

        Util.empty(_this.content);
        _this.content.appendChild(container);
        _this.onEvent(); // Make sure selected item remains selected
      }
    } catch (e) {
      _this.content.innerHTML = '<p class="alert error">' +
          'An error occurred while rendering.\n' +
          '<!-- ' + (e.stack || e.message) + ' -->' +
        '</p>';
    }
  };

  /**
   * Override render to get a referene to current list format,
   * and configure timezone before rendering.
   */
  _this.render = Util.compose(function () {
    var listFormat,
        timezoneOffset;

    listFormat = _this.model.get('listFormat');
    if (listFormat) {
      listFormat = listFormat.format;

      // set current timezone setting
      timezoneOffset = _this.model.get('timezone');
      if (timezoneOffset) {
        listFormat.setTimezoneOffset(timezoneOffset.offset);
      }
    } else {
      listFormat = _DEFAULT_FORMAT;
    }

    _listFormat = listFormat;
  }, _this.render);

  /**
   * Render the footer information for this view into `_this.footer`.
   */
  _this.renderFooter = function () {
    _this.footer.innerHTML =
      '<h4>Didn&apos;t find what you were looking for?</h4>' +
        '<ul>' +
          '<li>' +
            'Check your &ldquo;Settings&rdquo;.' +
          '</li>' +
          '<li>' +
            '<a href="/earthquakes/map/doc_whicheqs.php">' +
              'Which earthquakes are included on the map and ' +
              'list?' +
            '</a>' +
          '</li>' +
          '<li>' +
            '<a href="/earthquakes/eventpage/unknown#tellus">' +
              'Felt something not shown – report it here.' +
            '</a>' +
          '</li>' +
      '</ul>';
  };

  /**
   * Render the header information.
   */
  _this.renderHeader = function () {
    var displayCount,
        headerCount,
        headerTitle,
        metadata,
        restrict,
        totalCount,
        updateTime;

    metadata = _this.collection.metadata || {};
    headerTitle = _this.model.get('feed').name;
    totalCount = metadata.hasOwnProperty('count') ? metadata.count : '&ndash;';
    displayCount = _filteredCollection.data().length;
    restrict = _this.model.get('restrictListToMap');
    headerCount = _this.formatCountInfo(totalCount, displayCount, restrict);
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
