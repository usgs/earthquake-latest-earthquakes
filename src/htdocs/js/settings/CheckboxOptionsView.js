'use strict';

var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');

var _DEFAULTS = {};

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


  _this = GenericCollectionView(options);
  options = Util.extend({}, _DEFAULTS, options);


  /**
   * Constructor.
   *
   * @param options {Object}
   *     Configuration options for this view.
   * @param options.collection {mvc/Collection}
   *     The collection for this view.
   * @param options.model {mvc/Model}
   *     The model for this view.
   * @param options.watchProperty {String}
   *     The name of the property on the model to watch for changes and
   *     subsequently trigger `onEvent`.
   */
  _initialize = function (options) {
    // defines which setting to configure
    _watchProperty = options.watchProperty || '';
  };

  /**
   * Deselects all the items in `_this.content`. An implementing sub-class
   * may want to override this method if selection is not done by toggling
   * a "selected" class on the item element.
   *
   */
  _this.deselectAll = function () {
    Array.prototype.forEach.call(
      _this.content.querySelectorAll('input[type=checkbox]'),
      function (checkbox) {
        checkbox.checked = false;
      }
    );
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
   * Called when the collection is reset (primarily), or when items are added
   * to/removed from the collection. Renders the content.
   *
   */
  _this.render = function () {
    var items,
        list;

    items = _this.collection.data().slice(0) || [];

    if (items.length) {
      list = document.createElement('ol');
      list.classList.add('checkbox-options-view');
      list.classList.add('no-style');
      items.forEach(function (item) {
        var li;
        li = list.appendChild(document.createElement('li'));
        li.classList.add(_watchProperty);
        li.setAttribute('data-id', item.id);
        li.innerHTML = '<input type="checkbox"' +
              ' id="' + _watchProperty + '-' + item.id + '"' +
              ' value="' + item.id + '"' +
              ' name="' + _watchProperty + '" />' +
            '<label for="' + _watchProperty + '-' + item.id + '">' +
              item.name +
            '</label>';
      });
      // append list to the DOM
      _this.content.appendChild(list);
      // set the selected collection item
      _this.setSelected(_this.model.get(_watchProperty));
    } else {
      _this.content.innerHTML = '<p class="alert error">There are no options ' +
          'to display</p>';
    }
  };

  /**
   * Method to update an element in `_this.content`, whose id
   * matches the given value "id" attribute, to appear selected.
   *
   * @param value Array<{Mixed}>
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

    if (!objs.length) {
      throw new Error('The settings model property: ' + _watchProperty +
          ' should be represented as an array of objects.');
    }

    // select each checkbox
    Array.prototype.forEach.call(objs, function (obj) {
      id = obj.id;
      el = _this.content.querySelector('#' + _watchProperty + '-' + id);

      if (el) {
        el.checked = true;
      }
    });
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = CheckboxOptionsView;
