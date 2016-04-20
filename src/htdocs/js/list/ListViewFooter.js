'use strict';

var Util = require('util/Util');

var _DEFAULTS = {

};

var ListViewFooter = function (options) {
  var _this,
      _initialize;

  _this = {};

  _initialize = function (options) {
    options = Util.extend{}, _DEFAULTS, options);
  };

  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ListViewFooter;
