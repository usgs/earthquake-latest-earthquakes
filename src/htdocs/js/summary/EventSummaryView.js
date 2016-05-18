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
      _isVisible,
      _onCloseButtonClick,
      _onEventSelect,
      _position,
      _positionChange,
      _startPosition;

  _this = View(options);


  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);

    _closeButton = document.createElement('button');
    _closeButton.classList.add('summary-close');
    _closeButton.innerHTML = 'x';

    _formatter = options.formatter || EventSummaryFormat();
    _isVisible = false;
    _position = 0;
    _positionChange = null;
    _startPosition = null;
    _this.catalog = options.catalog || Collection();

    _this.model.off('change', 'render', _this);

    _this.model.on('change:event', _onEventSelect, _this);
    _closeButton.addEventListener('click', _onCloseButtonClick);

    // touch (mobile) interactions
    _this.el.addEventListener('touchstart', _this.onDragStart, _this);
  };

  /**
   * Hides the EventSummaryView when the close button is clicked.
   */
  _onCloseButtonClick = function () {
    _this.hideEventSummary();
  };

  /**
   * Calls render() when an event is selected on the list/map
   */
  _onEventSelect = function () {
    _this.render();
  };

  /**
   * Deselect the event by resetting the "event" property on the model.
   */
  _this.deselectEvent = function () {
    _this.model.set({
      'event': null
    });
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:event', _onEventSelect, _this);
    _closeButton.removeEventListener('click', _onCloseButtonClick);

    _closeButton = null;
    _formatter = null;
    _isVisible = null;
    _onCloseButtonClick = null;
    _onEventSelect = null;

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
    _this.el.classList.remove('smoothing');
    _this.el.classList.remove('show');
    _isVisible = false;
  };

  /**
   * Called on "touchend" or "mouseup", removes event listeners
   * for mouse events or touch events that update the position
   * of the tablist-tab navigation.
   *
   * @param  {object} e,
   *         "mouseup" event OR "touchend" event
   */
  _this.onDragEnd = function (e) {
    if (e.type === 'touchend' || e.type === 'touchcancel') {
      _this.el.removeEventListener('touchmove', _this.onDragScroll, _this);
      _this.el.removeEventListener('touchend', _this.onDragEnd, _this);
      _this.el.removeEventListener('touchcancel', _this.onDragEnd, _this);
    }

    // if the drag is 5px or less, assume a click
    if (Math.abs(_positionChange) < 5 && e.target) {
      e.target.click();
      return;
    }

    // ease the close/return to starting position
    _this.el.classList.add('smoothing');

    if (_positionChange >= (_this.el.clientHeight * 1/3)) {
      _this.hideEventSummary();
    } else {
      _this.setTranslate(0);
    }

    window.setTimeout(function () {
      _this.setTranslate(0);
    }, 500);

    _positionChange = 0;
  };

  /**
   * Called on "mousemove", updates the scrollLeft position
   * on the nav slider that contains the tab elements.
   *
   * @param  {object} e,
   *         "mousemove" event
   */
  _this.onDragScroll = function (e) {
    var position,
        positionChange,
        type;

    type = e.type;

    if (type === 'touchmove') {
      position = e.touches[0].clientY;
    }

    positionChange = position - _startPosition;
    _positionChange = positionChange;
    // update the element's position as the user drags
    _this.setTranslate(positionChange);
  };

  /**
   * Called on "touchstart" or "mousedown", tracks the drag start position
   * and adds event listeners for mouse events or touch events that update
   * the position of the tablist-tab navigation.
   *
   * @param  {object} e,
   *         "mousedown" event OR "touchstart" event
   */
  _this.onDragStart = function (e) {

    if (e.type === 'touchstart') {
      // keeps mouse event from being delivered on touch events
      e.preventDefault();
      _startPosition = e.touches[0].clientY;
      _this.el.addEventListener('touchmove', _this.onDragScroll, _this);
      _this.el.addEventListener('touchend', _this.onDragEnd, _this);
      _this.el.addEventListener('touchcancel', _this.onDragEnd, _this);
    }

    // ease the close/return to starting position
    _this.el.classList.remove('smoothing');
  };

  /**
   * Determines whether or not the EventSummaryView is visible, and then
   * displays the selected event's information.
   *
   * Called when the "event" property is updated on the model.
   */
  _this.render = function () {
    var eq;

    eq = _this.model.get('event');

    if (!eq) {
      // clear and hide event summary
      _this.hideEventSummary();
      return;
    }

    if (!_isVisible) {
      _this.showEventSummary(eq);
    }

    _this.el.innerHTML = '';
    _this.el.appendChild(_closeButton);
    _this.el.appendChild(_formatter.format(eq));
  };

  /**
   * Update the position of the EventSummary div.
   *
   * @param {Number} position,
   *        the y-position of the slider
   */
  _this.setTranslate = function (position) {
    _this.el.style['-webkit-transform'] =
        'translate3d(0px, ' + position + 'px, 0px)';
    _this.el.style['-moz-transform'] =
        'translate3d(0px, ' + position + 'px, 0px)';
    _this.el.style['-ms-transform'] =
        'translate3d(0px, ' + position + 'px, 0px)';
    _this.el.style['-o-transform'] =
        'translate3d(0px, ' + position + 'px, 0px)';
    _this.el.style.transform = 'translate3d(0px, ' + position + 'px, 0px)';
  };

  /**
   * Toggles the EventSummaryView into view.
   */
  _this.showEventSummary = function () {
    _this.el.classList.add('smoothing');
    _this.el.classList.add('show');
    _isVisible = true;
  };


  _initialize(options);
  options = null;
  return _this;

};

module.exports = EventSummaryView;
