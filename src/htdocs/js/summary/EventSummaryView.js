'use strict';

var Collection = require('mvc/Collection'),
    EventSummaryFormat = require('summary/EventSummaryFormat'),
    Util = require('util/Util'),
    View = require('mvc/View');

var _DEFAULTS = {};

var EventSummaryView = function (options) {
  var _this,
      _initialize,

      _formatter,
      _isVisible;

  _this = View(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _formatter = options.formatter || EventSummaryFormat();
    _isVisible = false;
    _this.catalog = options.catalog || Collection();

    _this.model.on('change:event', _this.render, _this);
    // remove this
    _this.catalog.on('reset', _this.onCatalogReset, _this);
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:event', _this.render, _this);

    _isVisible = null;
    _initialize = null;
    _this = null;
  }, _this.destroy);

  // TODO, remove this. It is only to set a selected event
  _this.onCatalogReset = function () {
    _this.model.set({
      'event': _this.catalog.data()[3]
    });
  };

  _this.render = function () {
    var eq;

    eq = _this.model.get('event');

    if (!eq) {
      _this.el.innerHTML = '';
      _this.el.classList.remove('show');
      _isVisible = false;
      return;
    }

    if (!_isVisible) {
      _this.el.classList.add('show');
      _isVisible = true;
    }

    _this.el.innerHTML = '';
    _this.el.appendChild(_formatter.format(eq));
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = EventSummaryView;
