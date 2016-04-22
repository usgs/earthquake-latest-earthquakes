'use strict';

var Util = require('util/Util');


var _DEFAULTS = {};


/**
 * Class info and constructor parameters.
 */
var EarthquakeMarker = function (options) {
  var _this,
      _initialize;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = EarthquakeMarker;
