'use strict';

var DefaultListFormat = require('list/DefaultListFormat'),
    Formatter = require('core/Formatter'),
    Util = require('util/Util');

var _DEFAULTS = {

};

var ShakeMapListFormat = function (options) {
  var _this,
      _initialize,

      _formatter;

  options = Util.extend({}, _DEFAULTS, options);
  _this = DefaultListFormat(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _formatter = options.formatter || Formatter();
  };

  _this.destroy = function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  };

  _this.getCalloutMarkup = function (eq) {
    var mmi,
        markup;

    mmi = _this.getProperty(eq, 'mmi');

    if (mmi === null) {
      markup = '&ndash;';
    } else {
      mmi = _formatter.mmi(mmi);
      return '<span class="roman mmi mmi' + mmi + '">' + mmi + '</span>';
    }

    return markup;
  };

  _this.getClasses = Util.compose(_this.getClasses, function (params) {
    params = params || {};
    params.classes = params.classes || [];

    params.classes.push('shakemap-list-item');

    return params;
  });

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ShakeMapListFormat;
