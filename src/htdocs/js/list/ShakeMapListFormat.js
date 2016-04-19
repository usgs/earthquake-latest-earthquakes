'use strict';

var DefaultListFormat = require('list/DefaultListFormat'),
    Formatter = require('core/Formatter'),
    Util = require('util/Util');

var _DEFAULTS = {

};

/**
 * List formatter class for the ShakeMap layout. Extends DefaultListFormat.
 * Produces a formatted item with markup appropriate for those interested in
 * ShakeMap-type information.
 *
 * @see DefaultListFormat
 */
var ShakeMapListFormat = function (options) {
  var _this,
      _initialize,

      _formatter;

  options = Util.extend({}, _DEFAULTS, options);
  _this = DefaultListFormat(options);

  _initialize = function (options) {
    _formatter = options.formatter || Formatter();
  };

  _this.destroy = function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  };

  /**
   * APIMethod.
   *
   * Uses the event "mmi" property to display a max-mmi value.
   *
   * @see DefaultListFormat#getCalloutMarkup
   */
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

  /**
   * APIMethod.
   *
   * Extends base class implementation to include a shakemap-list-item class.
   *
   * @see DefaultListFormat#getClasses
   */
  _this.getClasses = Util.compose(_this.getClasses, function (params) {
    params = params || {};
    params.classes = params.classes || [];

    params.classes.push('shakemap-list-item');

    return params;
  });

  /**
   * APIMethod.
   *
   * Uses the "title" property to display the event header value.
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

module.exports = ShakeMapListFormat;
