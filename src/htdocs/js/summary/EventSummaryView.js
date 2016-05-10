'use strict';

var Collection = require('mvc/Collection'),
    EventSummaryFormat = require('summary/EventSummaryFormat'),
    Util = require('util/Util'),
    View = require('mvc/View');

var _DEFAULTS = {};

var EventSummaryView = function (options) {
  var _this,
      _initialize,

      _closeButton,
      _formatter,
      _isVisible;

  _this = View(options);

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _closeButton = document.createElement('button');
    _closeButton.classList.add('summary-close');
    _closeButton.innerHTML = 'x';

    _formatter = options.formatter || EventSummaryFormat();
    _isVisible = false;
    _this.catalog = options.catalog || Collection();

    _this.model.off('change', 'render', _this);
    _this.model.on('change:event', _this.onEventSelect, _this);
    _closeButton.addEventListener('click', _this.hideEventSummary);

    // remove this v v
    _this.catalog.on('reset', _this.onCatalogReset, _this);
    // remove that ^ ^
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:event', _this.onEventSelect, _this);
    _closeButton.off('click', _this.hideEventSummary, _this);

    _isVisible = null;
    _initialize = null;
    _this = null;
  }, _this.destroy);

  // TODO, remove this. It is only to set a selected event
  _this.onCatalogReset = function () {
    var eqs;

    eqs = _this.catalog.data();
    if (eqs.length !== 0) {
      _this.model.set({
        'event': eqs[0]
      });
    }
  };

  /**
   * Determine whether or not the view is already visible and call render
   */
  _this.onEventSelect = function () {
    var eq;

    eq = _this.model.get('event');

    if (!eq) {
      _this.hideEventSummary();
      return;
    }

    if (!_isVisible) {
      _this.showEventSummary(eq);
    }

    _this.render(eq);
  };

  _this.deselectEvent = function () {
    _this.model.set({
      'event': null
    });
  };

  _this.hideEventSummary = function () {
    _this.deselectEvent();
    _this.el.classList.remove('show');
    _isVisible = false;
  };

  _this.showEventSummary = function () {
    _this.el.classList.add('show');
    _isVisible = true;
  };

  _this.render = function (eq) {
    _this.el.innerHTML = '';
    _this.el.appendChild(_closeButton);
    _this.el.appendChild(_formatter.format(eq));
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = EventSummaryView;
