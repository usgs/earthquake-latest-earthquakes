/* global define, ltIE9 */
define([
  'mvc/Util',
  'mvc/View'
], function(Util, View) {
  'use strict';


  // ----------------------------------------------------------------------
  // Private static variables
  // ----------------------------------------------------------------------

  var MIN_DESKTOP_WIDTH = 640;
  var DEVICE_MODE_DESKTOP = 'device-mode-desktop';
  var DEVICE_MODE_MOBILE = 'device-mode-mobile';
  var WINDOW_RESIZE_TIMEOUT = 350;

  /**
   * This view is used to create the view toggle near the top of the
   * application. When in mobile device mode, each view is mutually exclusive
   * of the other. In desktop device mode, multiple views can coexist.
   *
   * If multiple views are displayed in desktop device mode and the window is
   * made smaller (thus changing into mobile device mode), only the most
   * preferred view remains visible, the other views are turned off. This
   * precedence is reflected by the order of the "modes" array given in the
   * "options" configuration. The last option listed is most preferred.
   *
   * When switching from mobile device mode to desktop device mode, the current
   * view remains visible. No attempt is made to return the application to the
   * same set of views it had the last time the application was in desktop
   * device mode.
   *
   * @param options {Object}
   *      Configuration parameters. See _initialize implementation for details.
   */
  var ModesView = function (options) {
    // Extend this class to be an MVC View.
    View.call(this);

    // ----------------------------------------------------------------------
    // Private member variables
    // ----------------------------------------------------------------------

    var _this = this,
        _deviceMode = null,
        _windowResizeTimer = null,
        _options = null,
        _el = null,
        _modesViewInitalized = false;

    // ----------------------------------------------------------------------
    // Public methods
    // ----------------------------------------------------------------------
    // See also: mvc/View.js mvc/Events.js

    /**
     * Updates the rendering for this view. Sets rendered checkbox state to
     * match the current enabled state for the modes variables in the options.
     *
     * This method is called whenever this view triggers the modechange event.
     */
    this.render = function () {
      for (var id in _options.modes) {
        var mode = _options.modes[id];
        mode.checkbox.checked = mode.enabled;
      }
    };

    /**
     * Fetches the current status of whether each mode is currently enabled or
     * not.
     *
     * @return {Object}
     *      An object hash of mode ids pointing to a boolean indicating if
     *      that mode is currently enabled or not.
     */
    this.getStatus = function () {
      var s = {};
      for (var id in _options.modes) {
        var mode = _options.modes[id];
        s[id] = mode.enabled;
      }
      return s;
    };

    /**
     * Sets the status for each mode then triggers a modechange event.
     *
     * @param s {Object}
     *      An object hash containing modeIds pointing to boolean status.
     *      i.e.
     *      {
     *          'map': true,
     *          'list': true,
     *          'settings': true
     *      }
     */
    this.setStatus = function (s) {
      var obj = Util.extend({},
          {'map': true, 'list': true, 'settings': false, 'help': false}, s);

      for (var id in _options.modes) {
        var mode = _options.modes[id];
        mode.enabled = obj[id] || false;
      }

      _options.settings.set({viewModes: _this.getStatus()}, (_modesViewInitalized === true) ? {force: true} : {silent: true});
    };

    // ----------------------------------------------------------------------
    // Private methods
    // ----------------------------------------------------------------------

    /**
     * Initialize the new ModesView object. This method is called at time of
     * instantiation.
     *
     * @param options {Object}
     *      Configuration options.
     */
    var _initialize = function (options) {
      var i = null, panels = null, len = null,
          setDisabled = false, mode = null,
          viewModes = null;

      _options = Util.extend({}, {
        modes: {
          map: {title: 'Map', enabled: true},
          list: {title: 'List', enabled: true},
          settings: {title: 'Options', enabled: false},
          help: {title: 'Help', enabled: false}
        },
        // nav: display order in GUI, from L-R
        // panel: precedence order for mobile devices (settings > list > map)
        order: {
          nav: ['list', 'map', 'settings', 'help'],
          panel: ['settings', 'list', 'map', 'help']
        }
      }, options);

      panels = _options.order.panel;
      len = panels.length;
      viewModes = _options.settings.get('viewModes') || {};

      _el = _this._el;
      _el.className = 'modesView';

      // Create the view in the DOM (_this._el)
      _createView();

      _deviceMode = _determineDeviceMode();

      // Add some event bindings
      Util.addEvent(window, 'resize', _onWindowResize);
      _options.settings.on('change:viewModes', _this.render);

      // Trim initial modes to a single mode on mobile
      if (_deviceMode === DEVICE_MODE_MOBILE) {
        for (i = 0; i < len; i++) {
          mode = panels[i];
          if (setDisabled === true) {
            viewModes[mode] = false;
          } else if (viewModes[mode] === true) {
            setDisabled = true;
          }
        }
      }

      // load saved state
      _this.setStatus(viewModes);
      _modesViewInitalized = true;
    };

    /**
     * Event handler for when a mode checkbox is changed.
     *
     * @param e ChangeEvent
     *      The change event that occurred that triggered this method call.
     */
    var _onChange = function(e) {
      var ev = Util.getEvent(e),
          id,
          mode;

      // was help clicked?
      if (ev.target.id === 'mode-help-checkbox') {

        // help was clicked... disable all else and enable help
        for (id in _options.modes) {
          mode = _options.modes[id];
          if (ev.target === mode.checkbox) {
            mode.enabled = true;
            mode.checkbox.checked = true;
          } else {
            mode.enabled = false;
            mode.checkbox.checked = false;
          }
        }
        _options.settings.set({viewModes: _this.getStatus()});
        return;
      }

      // help was not clicked...
      for (id in _options.modes) {
        mode = _options.modes[id];

        // always disable help
        if (mode.title === 'Help') {
          mode.enabled = false;
          mode.checkbox.checked = false;
        } else {
          if (_deviceMode === DEVICE_MODE_DESKTOP) {
            mode.enabled = mode.checkbox.checked;
          } else {
            if (ev.target === mode.checkbox) {
              mode.enabled = mode.checkbox.checked;
            } else {
              mode.enabled = false;
            }
          }
        }
      }

      // check to see if all are disabled (non-mobile only)
      var noneSelected = true;
      if (_deviceMode === DEVICE_MODE_DESKTOP) {
        for (id in _options.modes) {
          if (_options.modes[id].enabled === true) {
            noneSelected = false;
            break;
          }
        }
      } else {
        noneSelected = false;
      }

      // nothing is selected... enable help
      if (noneSelected) {
        _options.modes.help.enabled = true;
        _options.modes.help.checkbox.checked = true;
      }
      options.settings.set({viewModes: _this.getStatus()});
    };


    /**
     * Creates the initial view to render.
     */
    var _createView = function () {
      // build checkboxes
      var _list = _el.appendChild(document.createElement('ol'));
      for (var i = 0, len = _options.order.nav.length; i < len; i ++) {
        var id = _options.order.nav[i],
            mode = _options.modes[id],
            li = _list.appendChild(document.createElement('li')),
            htmlid = 'mode-' + id + '-checkbox',
            checkbox = document.createElement('input'),
            label = document.createElement('label');

        checkbox.id = htmlid;
        checkbox.type = 'checkbox';
        checkbox.checked = mode.enabled;

        label.setAttribute('for', htmlid);
        label.setAttribute('class', 'modeIcon ' + id);
        label.setAttribute('title', mode.title);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(mode.title));
        Util.addEvent(label, 'click', _onChange);

        mode.checkbox = checkbox;
        li.appendChild(label);
      }
    };


    /**
     * Wrapper function that triggers on window.resize event. This method
     * schedules a windowResizeEnd event that triggers when the window stops
     * being resized.
     *
     * @param evt {WindowEvent}
     *      The window resize event that caused this method call.
     *
     * @see WINDOW_RESIZE_TIMEOUT
     */
    var _onWindowResize = function (evt) {
      if (_windowResizeTimer !== null) {
        clearTimeout(_windowResizeTimer);
      }
      _windowResizeTimer = setTimeout(function () {
        _onWindowResizeEnd(evt); }, WINDOW_RESIZE_TIMEOUT);
    };

    /**
     * Checks current window size to determine if mode is mobile or desktop.
     * If mode changed based on window size, adjust options.modes.enabled
     * appropriately and trigger a mode change event.
     *
     * @param windowEvent {WindowEvent}
     *      The last window resize event to occur before this event was
     *      triggered.
     */
    var _onWindowResizeEnd = function (/*windowEvent*/) {
      var newMode = null;

      if (_windowResizeTimer !== null) {
        clearTimeout(_windowResizeTimer);
        _windowResizeTimer = null;
      }

      newMode = _determineDeviceMode();
      if (newMode !== _deviceMode) {
        _deviceMode = newMode;
        var uncheckBoxes = false;

        for (var i = 0, len = _options.order.panel.length; i < len; i ++) {
          var id = _options.order.panel[i],
            mode = _options.modes[id];
          if (uncheckBoxes) {
            mode.enabled = false;
          } else if (mode.enabled) {
            uncheckBoxes = true;
          }
        }

        _options.settings.set({viewModes: _this.getStatus()});
      }
    };

    /**
     * @return {String}
     *      The inferred device mode based on the current window width.
     */
    var _determineDeviceMode = function () {
      var _ltIE9;
      if(typeof(ltIE9) === 'undefined') {
         _ltIE9 = false;
      } else {
        _ltIE9 = ltIE9;
      }
      var w = window.innerWidth, mode = DEVICE_MODE_MOBILE;
      if (w >= MIN_DESKTOP_WIDTH && !ltIE9) {
        mode = DEVICE_MODE_DESKTOP;
      }
      return mode;
    };

    // Initialize the view
    _initialize(options);
  };

  return ModesView;

});
