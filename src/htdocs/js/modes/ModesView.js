'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');

var _DEFAULTS = {

};

var ModesView = function (options) {
  var _this,
      _initialize;

  _this = View(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
  }

  /**
   * Destroy all the things.
   */
   _this.destroy = Util.compose(function () {
     _initialize = null;
     _this = null;
   }, _this.destroy);

   _this.render = function () {

   };

   _initialize(options);
   options = null;
   return _this;
};

module.exports = ModesView;
