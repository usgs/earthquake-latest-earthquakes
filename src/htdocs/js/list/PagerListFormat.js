'use strict';


var Formatter = require('core/Formatter'),
    Util = require('util/Util');


var _DEFAULTS = {

};


var PagerListFormat = function (options) {
  var _this,
      _initialize,

      _formatter;


  _this = {
    format: null
  };

  _initialize = function (/*options*/) {
    options = Util.extend({}, _DEFAULTS, options);

    _formatter = options.formatter || Formatter();
  };


  _this.destroy = function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  };

  /**
   * Format an item for the list.
   *
   * @param eq {Object}
   *     a feature object (not model) from the summary feed.
   * @return {DOMElement}
   *     dom element with formatted information.
   */
  _this.format = function (eq) {
    var container;

    container = document.createElement('pre');
    container.innerHTML = JSON.stringify(eq, null, '  ');

    return container;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = PagerListFormat;
