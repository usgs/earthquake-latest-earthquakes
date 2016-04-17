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

  _this.getAsideMarkup = function (eq) {
    var felt,
        responses;

    felt = _this.getProperty(eq, 'felt');

    if ( felt !== null) {
      if (felt !== 1) {
        responses = felt + ' responses';
      } else {
        responses = felt + ' responses';
      }
    } else {
      responses = '&ndash; responses';
    }

    return '<span class="responses">' + responses + '</span>';
  };


  _this.getCalloutMarkup = function (eq) {
    var cdi,
        felt,
        mmiClass;

    felt = _this.getProperty(eq,'felt');

    if (felt === null) {
      cdi = '&ndash;';
      mmiClass = 'no-dyfi';
    } else {
      cdi = _this.getProperty(eq,'cdi');
      cdi = _formatter.mmi(cdi);
      mmiClass = 'roman mmi mmi' + cdi;
    }

    return '<span class="' + mmiClass + '">' + cdi + '</span>';
  };

  _this.getClasses = Util.compose(_this.getClasses, function (params) {
    params = params || {};
    params.classes = params.classes || [];

    params.classes.push('dyfi-list-item');

    return params;
  });

  /**
   * APIMethod.
   *
   * Uses the "place" property to display the event header value.
   *
   * @see DefaultListFormat#getHeaderMarkup
   */
  _this.getHeaderMarkup = function (eq) {
    return _this.getProperty(eq, 'title');
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = DyfiListFormat;
