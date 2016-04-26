'use strict';


var Accordion = require('accordion/Accordion'),
    DownloadView = require('mvc/View'), //TODO: use download view
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
      _formatter,
      _headerCount,
      _headerTitle,
      _headerUpdateTime,
      _listFormat,

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
    _this.model.on('change:listFormat', 'render', _this);
    _this.model.on('change:timezone', 'render', _this);
    _createScaffold();
  };

  /**
   * Creates scaffolding for list view header.
   */
  _createScaffold = function () {
    _this.header.classList.add('accordion');
    _this.header.classList.add('accordion-closed');

    _this.header.innerHTML =
      '<h4 class="header-title"></h4>' +
      '<h5 class="header-count accordion-toggle"></h5>' +
      '<div class="accordion-content header-info-content">' +
        '<p class="header-update-time"></p>' +
        '<button type="button">Download</button>' +
      '</div>';

    Accordion({
      el: _this.header
    });

    _headerTitle = _this.header.querySelector('.header-title');
    _headerCount = _this.header.querySelector('.header-count');
    _headerUpdateTime = _this.header.querySelector('.header-update-time');
    _downloadButton = _this.header.querySelector('button');

    _downloadView = DownloadView({
      model: _this.model
    });

    //delet this later
    _downloadView.render = function () {
      _downloadView.el.innerHTML = '<pre>' +
          JSON.stringify(_this.model.get('feed'), null, '  ') +
        '</pre>';
    };

    _downloadView.render();

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
      '<h3>Didn&apos;t find what you were looking for?</h3>' +
        '<ul class="no-style">' +
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
    headerTitle = metadata.title || 'Latest Earthquakes';
    totalCount = metadata.hasOwnProperty('count') ? metadata.count : '&ndash;';
    displayCount = _this.collection.data().length;
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



  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
