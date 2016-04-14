'use strict';


var Formatter = require('core/Formatter'),
    Util = require('util/Util');


var _DEFAULTS = {
  idPrefix: 'default-list-formatter'
};


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

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _idPrefix = options.idPrefix;
    _formatter = options.formatter || Formatter();
  };


  _this.destroy = function () {
    _formatter = null;

    _initialize = null;
    _this = null;
  };

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

  _this.getAsideMarkup = function (eq) {
    var depth;

    try {
      depth = eq.geometry.coordinates[2];
    } catch (e) {
      depth = null;
    }

    return _formatter.depth(depth, 'km');
  };

  _this.getCalloutMarkup = function (eq) {
    return _formatter.magnitude(_this.getProperty(eq, 'mag'));
  };

  _this.getClasses = function (params) {
    var classes,
        eq;

    params = params || {};
    eq = params.eq || {};
    classes = params.classes || [];

    classes = ['eq-list-item'];

    if (_this.getProperty(eq, 'sig') >= 600) {
      classes.push('bigger');
    } else if (_this.getProperty(eq, 'mag') >= 4.5) {
      classes.push('big');
    }

    params.classes = classes;

    return params;
  };

  _this.getHeaderMarkup = function (eq) {
    return _this.getProperty(eq, 'place') || 'Unknown Event';
  };

  _this.getId = function (eq) {
    return _idPrefix + '-' + eq.id;
  };

  _this.getProperty = function (eq, property) {
    var properties;

    eq = eq || {};
    properties = eq.properties || {};

    return properties.hasOwnProperty(property) ? properties[property] : null;
  };

  _this.getSubheaderMarkup = function (eq) {
    return _formatter.datetime(new Date(_this.getProperty(eq, 'time')));
  };



  _initialize(options);
  options = null;
  return _this;
};


module.exports = DefaultListFormatter;
