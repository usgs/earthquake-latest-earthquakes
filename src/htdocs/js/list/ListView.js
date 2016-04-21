'use strict';


var GenericCollectionView = require('core/GenericCollectionView'),
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
      _initialize;


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

    listFormat = _this.model.get('listFormat');
    if (listFormat) {
      listFormat = listFormat.format;
    } else {
      listFormat = _DEFAULT_FORMAT;
    }

    return listFormat.format(obj);
  };

  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _this.model.off('change:listFormat', 'render', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Render the footer information for this view into `_this.footer`.
   *
   */
  _this.renderFooter = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#64
    _this.footer.innerHTML = '<p>TODO :: Here is the ListView footer!</p>';
  };

  /**
   * Render the header information for this view into `_this.header`.
   *
   */
  _this.renderHeader = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#63
    _this.header.innerHTML = '<p>TODO :: Here is the ListView header!</p>';
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
