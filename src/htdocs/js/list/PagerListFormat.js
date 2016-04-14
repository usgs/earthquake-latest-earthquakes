'use strict';


var DefaultListFormat = require('list/DefaultListFormat'),
    Formatter = require('core/Formatter'),
    Util = require('util/Util');


var _DEFAULTS = {
  idPrefix: 'pager-list-formatter'
};


/**
 * List formatter class for the PAGER layout. Extends DefaultListFormat.
 * Produces a formatted item with markup appropriate for those interested in
 * PAGER-type information.
 *
 * @see DefaultListFormat
 */
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

  /**
   * APIMethod.
   *
   * Uses the event "mmi" property to display a max-mmi value.
   *
   * @see DefaultListFormat#getAsideMarkup
   */
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

  /**
   * APIMethod.
   *
   * Uses the "alert" property to display the pager alert level value.
   *
   * @see DefaultListFormat#getCalloutMarkup
   */
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

  /**
   * APIMethod.
   *
   * Extends base class implementation to include a pager-list-item class.
   *
   * @see DefaultListFormat#getClasses
   */
  _this.getClasses = Util.compose(_this.getClasses, function (params) {
    params = params || {};
    params.classes = params.classes || [];

    params.classes.push('pager-list-item');

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


module.exports = PagerListFormat;
