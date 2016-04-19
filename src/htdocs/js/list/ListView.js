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


var ListView = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);

  _initialize = function (/*options*/) {
    _this.model.on('change:listFormat', 'render', _this);
  };


  _this.createCollectionItemContent = function (obj) {
    var listFormat;

    listFormat = _this.model.get('listFormat') || _DEFAULT_FORMAT;

    return listFormat.format(obj);
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:listFormat', 'render', _this);

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.renderFooter = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#64
    _this.footer.innerHTML = '<p>TODO :: Here is the ListView footer!</p>';
  };

  _this.renderHeader = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#63
    _this.header.innerHTML = '<p>TODO :: Here is the ListView header!</p>';
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
