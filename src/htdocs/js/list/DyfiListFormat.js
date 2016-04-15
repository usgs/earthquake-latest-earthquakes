'use strict';

var DefaultListFormat = require('list/DefaultListFormat'),
    Formatter = require('core/Formatter'),
    Util = require('util/Util');

var _DEFAULTS = {

};

var DyfiListFormat = function (options) {
  var _this,
      _initialize,

      _formatter;

  options = Util.extend({}, _DEFAULTS, options);
  _this = DefaultListFormat(options);

  _initialize = function (options) {
    _formatter = options.formatter || Formatter();
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = DyfiListFormat;
