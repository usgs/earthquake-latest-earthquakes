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
  };

  /**
   * Deselect the event by resetting the "event" property on the model.
   *
   * Called when the close button is clicked.
   */
  _this.deselectEvent = function () {
    _this.model.set({
      'event': null
    });
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:event', _this.onEventSelect, _this);
    _closeButton.removeEventListener('click', _this.hideEventSummary);

    _closeButton = null;
    _formatter = null;
    _isVisible = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Deselects the selected event and hides the EventSummaryView
   *
   * Called when the close button is clicked.
   */
  _this.hideEventSummary = function () {
    _this.deselectEvent();
    _this.el.classList.remove('show');
    _isVisible = false;
  };

  /**
   * Called when the _this.model is updated with a new "event".
   *
   * Determines whether or not the EventSummaryView is visible, and then
   * calls render and passes in the new event.
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

  /**
   * Renders the EventSummaryView.
   *
   * Called when the "event" property is updated on the model.
   *
   * @param eq {Object}
   *    The "event" property from _this.model
   */
  _this.render = function (eq) {
    _this.el.innerHTML = '';
    _this.el.appendChild(_closeButton);
    _this.el.appendChild(_formatter.format(eq));
  };

  /**
   * Displays the EventSummaryView.
   *
   * Called when the "event" property is updated on the model.
   */
  _this.showEventSummary = function () {
    _this.el.classList.add('show');
    _isVisible = true;
  };


  _initialize(options);
  options = null;
  return _this;

};

module.exports = EventSummaryView;
