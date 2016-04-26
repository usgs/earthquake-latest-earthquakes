'use strict';

var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');

var _DEFAULTS = {
  classPrefix: 'radio-options-view',
  containerNodeName: 'ol',
  watchProperty: ''
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
var RadioOptionsView = function (options) {
  var _this,
      _initialize,

      _classPrefix,
      _containerNodeName,
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
    _classPrefix = options.classPrefix;
    _containerNodeName = options.containerNodeName;
    _watchProperty = options.watchProperty;
  };

  /**
   * Deselects all the radio button inputs in `_this.content`.
   *
   */
  _this.deselectAll = function () {
    Array.prototype.forEach.call(
      _this.content.querySelectorAll('input[type=radio]'),
      function (radio) {
        radio.checked = false;
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
   * Creates the container element by which all the items in the collection
   * are wrapped.
   *
   * @return {HTMLElement}
   *     An HTMLElement based on the configured `options.containerNodeName`
   *     property.
   */
  _this.createCollectionContainer = function () {
    var container;

    container = document.createElement(_containerNodeName);
    container.classList.add(_classPrefix);
    container.classList.add('no-style');

    return container;
  };

  /**
   * Creates and populates an element for the individual given `obj`.
   *
   * @param obj {Object}
   *     The item from the collection for which to create the element.
   *
   * @return {HTMLElement}
   *     An HTMLElement based on the configured `options.itemNodeName`
   *     property.
   */
  _this.createCollectionItemContent = function (obj) {
    var fragment,
        input,
        label;

    fragment = document.createDocumentFragment();

    input = document.createElement('input');
    input.setAttribute('name', _watchProperty);
    input.setAttribute('type', 'radio');
    input.setAttribute('value', obj.id);
    input.setAttribute('aria-labelledby', _watchProperty + '-' + obj.id);

    label = document.createElement('label');
    label.setAttribute('id', _watchProperty + '-' + obj.id);
    label.innerHTML = obj.name;

    fragment.appendChild(input);
    fragment.appendChild(label);

    return fragment;
  };

  /**
   * Method to update an element in `_this.content`, whose id
   * matches the given value "id" attribute, to appear selected.
   *
   * @param value {Mixed}
   *     Typically an object with an "id" attribute which corresponds to the
   *     "id" attribute of some input in `_this.content`.
   *
   */
  _this.setSelected = function (obj) {
    var id,
        el;

    if (!obj) {
      return;
    }

    id = obj.id;
    el = _this.content.querySelector('[data-id="' + id + '"] > input');

    if (el) {
      el.checked = true;
    }
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = RadioOptionsView;
