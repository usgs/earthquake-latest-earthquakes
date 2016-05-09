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
   * Bounds contain test that accounts for leaflets handling for longitude.
   *
   * When initial bounds.contains fails: shifts bounds left or right,
   * until northEast is less than one world to the right of test point and repeats test.
   *
   * @param bounds {4x4 Array [southWest, northEast] or LatLngBounds object}
   * @param latlng {leaflet LatLng}
   * @return true if bounds contain latlng, before or after normalization, false otherwise.
   */
  _this.boundsContain = function(bounds, latlng) {
    // longitude may be off by world(s), adjust east bound to (just) right of test point
    var maxLatitude,
        maxLongitude,
        minLatitude,
        minLongitude;

    maxLatitude = bounds[1][0];
    maxLongitude = bounds[1][1];
    minLatitude = bounds[0][0];
    minLongitude = bounds[0][1];

    //adjust the bounds
    if (minLongitude > 180) {
      while (minLongitude > 180) {
        minLongitude = minLongitude - 360;
      }
    } else if (minLongitude < -180) {
      while (minLongitude < -180) {
        minLongitude = minLongitude + 360;
      }
    }

    if (maxLongitude > 180) {
      while (maxLongitude > 180) {
        maxLongitude = maxLongitude - 360;
      }
    } else if (maxLongitude < -180) {
      while (maxLongitude < -180) {
        maxLongitude = maxLongitude + 360;
      }
    }

    // map extents cross date/time line
    if (minLongitude > maxLongitude) {
      if (latlng[0] <= maxLatitude && latlng[0] >= minLatitude &&
          (latlng[1] <= maxLongitude || latlng[1] >= minLongitude)) {
        return true;
      }
    }

    // now test with adjusted bounds
    if (latlng[0] <= maxLatitude && latlng[0] >= minLatitude &&
        latlng[1] <= maxLongitude && latlng[1] >= minLongitude) {

      return true;
    }

    // TODO, remove
    console.log('maxLongitude: ' + maxLongitude + ', minLongitude: ' + minLongitude);
    console.log('lat: ' + latlng[0] + ', lng: ' + latlng[1]);

    return false;
  };

  _this.filterCollection = function (data) {
    var bounds,
        items;

    // filter based on map extents, or remove filtering
    bounds = this.model.get('mapposition');
    items = _this.filterEvents(data, bounds);

    return items;
  };

  /**
   * Filter list of events and return only what is inside the map bounds
   *
   * @param items {Array}
   *     array of events
   * @param bounds {Array}
   *     map bounds
   *
   * @return {Array}
   *     filtered events that are within the map bounds
   */
  _this.filterEvents = function (items, bounds) {
    var coordinates,
        i,
        item,
        events,
        len;

    if (!_this.mapEnabled) {
      return items;
    }

    events = [];

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

  // TODO, sync the two collections
  _this.onCollectionReset = function () {
    var data;

    data = _this.collection.data().slice(0) || [];

    if (_this.filterEnabled) {
      _filteredCollection.reset(_this.filterCollection(data));
    } else {
      _filteredCollection.reset(data); // triggers onMapPositionChange
    }
  };

  /**
   * Filters the catalog based on the current map extents.
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
   * Called when the map position changes
   * Reset the filtered array with the original feed's array of events.
   *
   * If the restrictListToMap filter is applied, then filter the events
   */
  _this.onMapPositionChange = function () {
    var data,
        viewModes;

    if (!_this.filterEnabled) {
      return;
    }

    // assume map is disabled
    _this.mapEnabled = false;

    viewModes = _this.model.get('viewModes') || [];
    for (var i = 0; i < viewModes.length; i++) {
      if (viewModes[i].id === 'map') {
        _this.mapEnabled = true;
      }
    }

    if (_this.mapEnabled) {
      // filter is on, map is on (filter all events by extents)
      data = _this.filterCollection(_this.collection.data().slice(0));
    } else {
      // filter is on, map is off (use currently filtered collection)
      data = _filteredCollection.data().slice(0);

    }

    _filteredCollection.reset(data);
  };

  /**
   * Renders the content section for this view. If no data exists, renders
   * a the `_noDataMessage`. If an error occurs, renders a generic error
   * message. Otherwise, renders each item in the collection, delegating to
   * sub-methods.
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



  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
