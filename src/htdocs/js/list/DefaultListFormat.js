'use strict';


var Formatter = require('core/Formatter'),
    Util = require('util/Util');


var _DEFAULTS = {
  idPrefix: 'default-list-formatter'
};


/**
 * Base class from which other list formatting classes may extend. Provides
 * basic DOM structure with content consistent with magnitude formatting.
 * Additionally, this class provides some basic utility for working with
 * GeoJSON "Feature"s represented in a summary feed.
 *
 * A sub-class may extend this by overriding either the "format" method to have
 * total control of the formatting, but if the basic structure is acceptable,
 * the sub-class may extend only what content is included in each section. There
 * are the following four sections
 *
 * - getAsideMarkup(Feature) :: String
 * - getCalloutMarkup(Feature) :: String
 * - getHeaderMarkup(Feature) :: String
 * - getSubheaderMarkup(Feature) :: String
 *
 */
var DefaultListFormatter = function (options) {
  var _this,
      _initialize,

      _formatter,
      _idPrefix;


  _this = {
    destroy: null,
    format: null,
    getAsideMarkup: null,
    getCalloutMarkup: null,
    getClasses: null,
    getHeaderMarkup: null,
    getId: null,
    getProperty: null,
    getSubheaderMarkup: null
  };

  /**
   * Constructor. Initializes a new DefaultListFormatter. Uses the provided
   * formatter or creates its own.
   *
   * @param options {Object}
   *     Configuration options. May include:
   * @param options.idPrefix {String}
   *     A prefix to prepend to each formatted items id property.
   * @param options.formatter {Formatter}
   *     A Formatter used for formatting simple values.
   */
  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _idPrefix = options.idPrefix;
    _formatter = options.formatter || Formatter();
  };


  /**
   * Frees resources associated with this list formatter instance.
   *
   */
  _this.destroy = function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  };

  /**
   * APIMethod
   *
   * Basic method for formatting a Feature into an HTMLElement. May be
   * overridden by sub-classes for custom layout.
   *
   * @param eq {Feature}
   *     A feature containing event information from the summary feed.
   *
   * @return {HTMLElement}
   *     An HTMLElement containing formatted information for this eq Feature.
   */
  _this.format = function (eq) {
    var item;

    item = document.createElement('div');
    item.id = _this.getId(eq);
    _this.getClasses({eq: eq, classes: []}).classes.forEach(
    function (className) {
      item.classList.add(className);
    });

    item.innerHTML = [
      '<span class="list-callout">', _this.getCalloutMarkup(eq), '</span>',
      '<h1 class="list-header">', _this.getHeaderMarkup(eq), '</h1>',
      '<h2 class="list-subheader">', _this.getSubheaderMarkup(eq), '</h2>',
      '<aside class="list-aside">', _this.getAsideMarkup(eq), '</aside>'
    ].join('');

    return item;
  };

  /**
   * APIMethod
   *
   * @param eq {Feature}
   *     A feature containing event information from the summary feed.
   *
   * @return {String}
   *     The value to display as the item's "aside" information.
   */
  _this.getAsideMarkup = function (eq) {
    var depth;

    try {
      depth = eq.geometry.coordinates[2];
    } catch (e) {
      depth = null;
    }

    return _formatter.depth(depth, 'km');
  };

  /**
   * APIMethod
   *
   * @param eq {Feature}
   *     A feature containing event information from the summary feed.
   *
   * @return {String}
   *     The value to display as the item's "callout" information.
   */
  _this.getCalloutMarkup = function (eq) {
    return _formatter.magnitude(_this.getProperty(eq, 'mag'));
  };

  /**
   * APIMethod
   *
   * Determines a list of classes to include on the formatted item.
   *
   * @param params {Object}
   *     An object containing the following properties:
   * @param params.eq {Feature}
   *     The event information for which to get classes.
   * @param params.classes {Array}
   *     A an array of classes to include in addition to what this function
   *     produces.
   *
   * @return {Object}
   *     A reference to the given original (but augmented) params object.
   */
  _this.getClasses = function (params) {
    var classes,
        eq;

    params = params || {};
    eq = params.eq || {};
    classes = params.classes || [];

    classes.push('eq-list-item');

    if (_this.getProperty(eq, 'sig') >= 600) {
      classes.push('bigger');
    } else if (_this.getProperty(eq, 'mag') >= 4.5) {
      classes.push('big');
    }

    params.classes = classes;

    return params;
  };

  /**
   * APIMethod
   *
   * @param eq {Feature}
   *     A feature containing event information from the summary feed.
   *
   * @return {String}
   *     The value to display as the item's "header" information.
   */
  _this.getHeaderMarkup = function (eq) {
    return _this.getProperty(eq, 'place') || 'Unknown Event';
  };

  /**
   * Helper method.
   *
   * @param eq {Feature}
   *     The event information for which to generate an id.
   *
   * @return {String}
   *     The string to use as the formatted HTMLElement's "id" property.
   */
  _this.getId = function (eq) {
    return _idPrefix + '-' + eq.id;
  };

  /**
   * Helper method.
   *
   * Safely gets a property of an event {Feature}.
   *
   * @param eq {Feature}
   *     The event information on which to look for the property.
   * @param property {String}
   *     The name of the property to get.
   *
   * @return {Mixed}
   *     The value of the named property if one exists on the given eq, or
   *     null if no such property exists. Note: Other than null-checks, the
   *     value is returned unchanged from what is on the given eq.
   */
  _this.getProperty = function (eq, property) {
    var properties;

    eq = eq || {};
    properties = eq.properties || {};

    return properties.hasOwnProperty(property) ? properties[property] : null;
  };

  /**
   * APIMethod
   *
   * @param eq {Feature}
   *     A feature containing event information from the summary feed.
   *
   * @return {String}
   *     The value to display as the item's "subheader" information.
   */
  _this.getSubheaderMarkup = function (eq) {
    return _formatter.datetime(new Date(_this.getProperty(eq, 'time')));
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = DefaultListFormatter;
