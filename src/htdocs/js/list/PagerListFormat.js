'use strict';


var DefaultListFormat = require('list/DefaultListFormat'),
    Formatter = require('core/Formatter'),
    Util = require('util/Util');


var _DEFAULTS = {
  idPrefix: 'pager-list-formatter'
};


var PagerListFormat = function (options) {
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

  _this.getAsideMarkup = function (eq) {
    var markup,
        mmi;

    mmi = _this.getProperty(eq, 'mmi');

    if (mmi === null) {
      markup = '&ndash;';
    } else {
      mmi = _formatter.mmi(mmi);
      return '<span class="roman mmi mmi' + mmi + '">' + mmi + '</span>' +
        ' <abbr title="Modified Mercalli Intensity">MMI</abbr>';
    }

    return markup;
  };

  _this.getCalloutMarkup = function (eq) {
    var alert,
        markup;

    alert = _this.getProperty(eq, 'alert');

    if (alert === null) {
      markup = '&ndash;';
    } else {
      markup = '<span class="alert pager-alertlevel-' + alert.toLowerCase() +
          '">' + alert.substring(0, 1).toUpperCase() + '</span>';
    }

    return markup;
  };

  _this.getClasses = Util.compose(_this.getClasses, function (params) {
    params = params || {};
    params.classes = params.classes || [];

    params.classes.push('pager-list-item');

    return params;
  });

  _this.getHeaderMarkup = function (eq) {
    return _this.getProperty(eq, 'title');
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = PagerListFormat;
