'use strict';

var DownloadView = require('mvc/view'),
    Model = require('mvc/Model'),
    Util = require('util/Util');

var _DEFAULTS = {

};

var ListViewHeader = function (options) {
  var _this,
      _initialize

      _earthquakeInfo,
      _numberEarthquakes,
      _title;

  _this = {};

  _initialize = function(options) {
    options = Util.extend({}, _DEFAULTS, optoins);

    _this.model = options.model || Model();
  };

  _this.destroy = Util.compose(function () {
    _earthquakeInfo = null;
    _numberEarthquakes = null;
    _title = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.listHeaderMarkup = function () {
    var buf,
        el;

    el = document.createElement('div');
    el.className = 'list-view-header';

    buf.push(
      '<div class="column one-of-one title"></div>',
      '<div class="column one-of-one number-of-earthquakes"></div>',
      '<div class="column one-of-one earthquake-info"></div>'
    );

    _title = _this.el.querySelector('.title');
    _numberEarthquakes = _this.el.querySelector('.number-of-earthquakes');
    _earthquakeInfo = _this.el.querySelector('.earthquake-info');
  };

  _this.numberOfEarthquakes = function () {

  };

  _this.onClick = function () {

  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ListViewHeader;
