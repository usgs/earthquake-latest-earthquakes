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
 * @param options {Object}
 *     Configuration options for this view. See documentation on the
 *     `_initialize` method for complete details on all configuration
 *     options that may be provided.
 *
 * @see settings/RadioOptionsView
 */
var CheckboxOptionsView = function (options) {
  var _this;


  options = Util.extend({}, _DEFAULTS, options);
  _this = RadioOptionsView(options);


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
        items,
        properties,
        toSet;

    toSet = {};
    properties = _this.model.get(_this.watchProperty);

    if (properties) {
      toSet[_this.watchProperty] = properties.slice(0);
    } else {
      toSet[_this.watchProperty] = [];
    }

    // check model already contains selected object
    //index = toSet[_watchProperty].indexOf(obj);

    index = -1;
    items = toSet[_watchProperty];

    for (var i = 0; i < items.length; i++) {
      if (obj.id === items[i].id) {
        index = i;
      }
    }

    if (index === -1) {
      // does not contain object, add it
      toSet[_this.watchProperty].push(obj);
    } else {
      // contains object, remove it
      toSet[_this.watchProperty].splice(index, 1);
    }

    _this.model.set(toSet);
  };


  options = null;
  return _this;
};


module.exports = CheckboxOptionsView;
