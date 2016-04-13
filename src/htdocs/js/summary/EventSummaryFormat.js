'use strict';

var Util = require('util/Util');

var _DEFAULTS = {

};

var EventSummaryFormat = function (options) {
  var _this,
      _initialize;

  _initialize = function(options) {
    options = Util.extend({}, _DEFAULTS, options);
  };

  _this.destroy = Util.compose(function () {
    _this = null;
    _initialize = null;
  }, _this.destroy);

  _this.format = function (eq) {

  };

  options = null;
  return _this;
};

module.exports = EventSummaryFormat();
