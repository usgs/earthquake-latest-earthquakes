/**
 * This class creates a simple toggle view. The toggle view has a toggle control
 * and toggle-able content. Clicking the toggle control will show/hide the
 * toggle-able content.
 *
 */
/* global define */
define([
  'mvc/View',
  'mvc/Util'
], function (
  View,
  Util
) {
  'use strict';


  var CSS_EXPANDED_CLASS = 'toggle-expanded';

  var DEFAULTS = {
    expanded: false,

    header: null,

    control: 'Click to Toggle',
    controlClasses: [],

    content: 'Default Toggle Content',
    contentClasses: [],
  };

  var ToggleView = function (options) {
    // Extend options with defaults
    this._options = Util.extend({}, DEFAULTS, options);

    // Call parent constructor
    View.call(this, this._options);

    this._createViewSkeleton();
    Util.addClass(this._el, 'toggle');
    if (this._options.expanded) {
      Util.addClass(this._el, CSS_EXPANDED_CLASS);
    }

    this.setHeader(this._options.header, true);
    this.setControl(this._options.control, true);
    this.setContent(this._options.content, true);
    this.render();
  };

  ToggleView.prototype = Util.extend({}, View.prototype, {
    _createViewSkeleton: function () {
      var i = 0, len = 0,
          controlClasses = this._options.controlClasses,
          contentClasses = this._options.contentClasses;

      this._headerElement =
          this._el.appendChild(document.createElement('header'));
      Util.addClass(this._headerElement, 'toggle-header');

      this._controlElement =
          this._headerElement.appendChild(document.createElement('button'));
      Util.addClass(this._controlElement, 'toggle-control');

      for (i = 0, len = controlClasses.length; i < len; i++) {
        Util.addClass(this._controlElement, controlClasses[i]);
      }

      this._contentElement =
          this._el.appendChild(document.createElement('div'));
      Util.addClass(this._contentElement, 'toggle-content');

      for (i = 0, len = contentClasses.length; i < len; i++) {
        Util.addClass(this._contentElement, contentClasses[i]);
      }

      Util.addEvent(this._controlElement, 'click', (function (tv) {
        return function (/*evt*/) {
          if (Util.hasClass(tv._el, CSS_EXPANDED_CLASS)) {
            Util.removeClass(tv._el, CSS_EXPANDED_CLASS);
          } else {
            Util.addClass(tv._el, CSS_EXPANDED_CLASS);
          }
        };
      })(this));
    },




    setHeader: function (header, deferRender) {
      this._header = header;

      if (!deferRender) {
        this.render();
      }
    },

    /**
     * @param control {String}
     *      Text to use on the control element
     * @param deferRender {Boolean} Optional.
     *      Do not render after setting content. Default false.
     */
    setControl: function (control, deferRender) {
      this._control = control;

      if (!deferRender) {
        this.render();
      }
    },

    /**
     * @param content {String|DOMElement}
     *      Content to show/hide in the view
     * @param deferRender {Boolean} Optional.
     *      Do not render after setting content. Default false.
     */
    setContent: function (content, deferRender) {
      this._content = content;

      if (!deferRender) {
        this.render();
      }
    },

    render: function () {
      Util.empty(this._headerElement);

      this._controlElement.innerHTML = this._control;
      this._headerElement.appendChild(this._controlElement);

      if (this._header instanceof Node) {
        this._headerElement.appendChild(this._header);
      }

      if (this._content instanceof Node) {
        Util.empty(this._contentELement);
        this._contentElement.appendChild(this._content);
      } else {
        this._contentElement.innerHTML = this._content;
      }

      return this;
    }
  });

  return ToggleView;
});
