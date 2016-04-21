'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');

var _DEFAULTS = {};


var SettingsView = function (options) {
  var _this,
      _initialize,

      _watchProperty;


  _this = View(options);
  options = Util.extend({}, _DEFAULTS, options);


  _initialize = function (/*options*/) {
    // initialize the view
  };

  /**
   * Frees resources associated with this view.
   */
  _this.destroy = Util.compose(function () {
    _watchProperty = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Renders the view, called on model change
   */
  _this.render = function () {
    // Impelementations should update the view based on the current
    // model properties.
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = SettingsView;
