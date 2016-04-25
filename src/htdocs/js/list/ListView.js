'use strict';


var Accordion = require('accordion/Accordion'),
    GenericCollectionView = require('core/GenericCollectionView'),
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

      _listFormat;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);

  /**
   * Constructor
   *
   * See documentation for core/GenericCollectionView#_initialize for details.
   *
   * @see core/GenericCollectionView#_initialize
   */
  _initialize = function (/*options*/) {
    _this.model.on('change:listFormat', 'render', _this);
    _this.model.on('change:timezone', 'render', _this);
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
    _this.model.off('change:listFormat', 'render', _this);
    _this.model.off('change:timezone', 'render', _this);

    _listFormat = null;
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
   *
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
   * Render the header information for this view into `_this.header`.
   *
   */
  _this.renderHeader = function () {
    var collection,
        displayCount,
        headerTitle,
        restrict,
        totalCount;

    metadata = _this.collection.metadata;
    headerTitle = metadata.title;
    totalCount = metadata.count;
    displayCount = _this.collection.data().length;
    updateTime = metadata.generated;

    restrict = _this.model.get('restrictListToMap');

    if (restrict) {
      info = displayCount + ' of ' + totalCount + ' in map area.';
    } else {
      info = totalCount + ' earthquakes';
    }



    _this.header.innerHTML =
      '<div class="column title">' +
        '<h3>' + headerTitle + '</h3>',
      '</div>'
      '<div class="column number-of-earthquakes">',
        '<p>' + info + '</p>' +
      '</div>' +
      '<div class="column one-of-one earthquake-info">' +
        'More Info' +
      '</div>';
  };



  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
