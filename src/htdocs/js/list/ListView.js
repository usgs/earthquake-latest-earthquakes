'use strict';


var Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {

};


var ListView = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, options, _DEFAULTS);
  _this = View(options);

  _initialize = function (/*options*/) {

  };


  _this.destroy = Util.compose(function () {

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.render = function () {
    _this.renderHeader();
    _this.renderContent();
    _this.renderFooter();
  };

  _this.renderContent = function () {

  };

  _this.renderFooter = function () {

  };

  _this.renderHeader = function () {

  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
