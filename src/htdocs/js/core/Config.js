'use strict';

var Collection = require('mvc/Collection'),
    Util = require('util/Util');


var _DEFAULTS = {
};


/**
 * Configuration for LatestEarthquakes interface.
 *
 * @param options {Object}
 *     any values on the options object should be either:
 *     - a Collection
 *     - an array of Model-like objects (must have id property).
 */
var Config = function (options) {
  var _this,
      _initialize,

      _toDestroy;


  _this = {};

  _initialize = function (options) {
    var key,
        value;

    options = Util.extend({}, _DEFAULTS, options);

    // keep track of any created collections so they can be destroyed.
    _toDestroy = [];

    _this.options = {};
    for (key in options) {
      value = options[key];
      if (typeof value.data !== 'function') {
        // not already a collection
        value = Collection(value);
        // save so they can be destroyed
        _toDestroy.push(value);
      }
      _this.options[key] = value;
    }
  };

  /**
   * Free references.
   */
  _this.destroy = function () {
    if (_this === null) {
      return;
    }

    _toDestroy.forEach(function (collection) {
      collection.destroy();
    });
    _toDestroy = null;
    _this = null;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Config;
