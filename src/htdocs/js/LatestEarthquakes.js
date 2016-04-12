'use strict';

var Util = require('util/Util');


var _DEFAULTS = {};


/**
 * The Latest Earthquakes application entry point.
 */
var LatestEarthquakes = function (options) {
  var _this,
      _initialize;


  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
    _this.el = options.el;

    _this.el.innerHTML = 'Latest earthquakes';
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = LatestEarthquakes;
