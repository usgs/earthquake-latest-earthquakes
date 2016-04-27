'use strict';

var RadioOptionsView = require('settings/RadioOptionsView'),
    Util = require('util/Util');


// These defaults override defaults configured in settings/RadioOptionsView
var _DEFAULTS = {
  classPrefix: 'checkbox-options-view',
  inputType: 'checkbox'
};


/**
 * Serves as a resuable view to display configuration options. This view
 * accepts (among other things) a collection and a model on the configuration
 * options at time of construction.
 *
 * The collection provides a list of all items for the collection view to
 * render. The view listens to "add", "remove", and "reset" events on the
 * provided collection and calls the render method when such events occur.
 * The view does not listen to select/deselect on the collection...
 *
 * The model provides information regarding the currently selected values
 * for various properties. By default, this view only listens for changes to
 * the configured `options.watchProperty` property, and when that property
 * changes, the view calls its `onEvent` method.
 *
 * All messaging to/from this view should occur view events/method calls on
 * the provided model.
 *
 * Implementing sub-classes may override any public method for customized
 * behavior, however, typical extension points may involve overriding the
 * following methods:
 *
 * - deselectAll
 * - setSelected
 *
 * @param options {Object}
 *     Configuration options for this view. See documentation on the
 *     `_initialize` method for complete details on all configuration
 *     options that may be provided.
 */
var CheckboxOptionsView = function (options) {
  var _this,
      _initialize,

      _watchProperty;


  options = Util.extend({}, _DEFAULTS, options);
  _this = RadioOptionsView(options);

  /**
   * Constructor.
   *
   * @param options {Object}
   *     Configuration options for this view.
   * @param options.collection {mvc/Collection}
   *     The collection for this view.
   * @param options.containerNodeName {String}
   *     The nodeName of the element to be created that will wrap all
   *     the items in the collection. For example: 'ul'
   * @param options.model {mvc/Model}
   *     The model for this view.
   * @param options.watchProperty {String}
   *     The name of the property on the model to watch for changes and
   *     subsequently trigger `onEvent`.
   */
  _initialize = function (options) {
    _watchProperty = options.watchProperty;
  };


  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _watchProperty = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Method to update an element in `_this.content`, whose id
   * matches the given value "id" attribute, to appear selected.
   *
   * @param objs {Array<Mixed>}
   *     Typically an array of objects with an "id" attribute which corresponds
   *     to the "id" attribute of some input in `_this.content`.
   *
   */
  _this.setSelected = function (objs) {
    var id,
        el;

    if (!objs) {
      return;
    }

    // select each checkbox
    objs.forEach(function (obj) {
      id = obj.id;
      el = _this.content.querySelector('[data-id="' + id + '"] > input');

      if (el) {
        el.checked = true;
      }
    });
  };

  /**
   * Update model based on newly clicked item in the options view. If
   * the clicked item was previously set as a value on the `watchProperty` for
   * `_this.model` then that item is removed from the `watchProperty` value;
   * otherwise the item is added to the `watchProperty` value.
   *
   * This method is called by onContentClick.
   *
   * @param obj {Object}
   *     Configuration option that was clicked
   */
  _this.updateModel = function (obj) {
    var index,
        properties,
        toSet;

    toSet = {};
    properties = _this.model.get(_watchProperty);

    if (properties) {
      toSet[_watchProperty] = properties.slice(0);
    } else {
      toSet[_watchProperty] = [];
    }

    // check model already contains selected object
    index = toSet[_watchProperty].indexOf(obj);
    if (index === -1) {
      // does not contain object, add it
      toSet[_watchProperty].push(obj);
    } else {
      // contains object, remove it
      toSet[_watchProperty].splice(index, 1);
    }

    _this.model.set(toSet);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = CheckboxOptionsView;
