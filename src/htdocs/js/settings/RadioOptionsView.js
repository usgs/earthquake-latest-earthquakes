'use strict';

var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');


// These defaults override defaults configured in core/GenericCollectionView
var _DEFAULTS = {
  classPrefix: 'radio-options-view',
  containerNodeName: 'ol',
  inputType: 'radio',
  title: null
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
 &
 * @see core/GenericCollectionView
 */
var RadioOptionsView = function (options) {
  var _this,
      _initialize;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);

  /**
   * Constructor.
   *
   * @param options {Object}
   *     Configuration options for this view. In addition to what is defined
   *     in {core/GenericCollectionView}, options may include the following:
   * @param options.inputType {String}
   *     They value to use for the "type" attribute when creating the
   *     inputs for this view.
   *
   * @see core/GenericCollectionView
   */
  _initialize = function (options) {
    _this.inputType = options.inputType;
    _this.title = options.title;
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
    input.setAttribute('name', _this.watchProperty);
    input.setAttribute('type', _this.inputType);
    input.setAttribute('value', obj.id);
    input.setAttribute('id', _this.watchProperty + '-' + obj.id);

    label = document.createElement('label');
    label.setAttribute('for', _this.watchProperty + '-' + obj.id);
    label.innerHTML = obj.name;

    fragment.appendChild(input);
    fragment.appendChild(label);

    return fragment;
  };

  /**
   * Deselects all the inputs in `_this.content`.
   *
   */
  _this.deselectAll = function () {
    Array.prototype.forEach.call(
      _this.content.querySelectorAll('input[type="' + _this.inputType + '"]'),
      function (input) {
        input.checked = false;
      }
    );
  };

  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Called via event delegation when the user clicks anywhere withing
   * `_this.content`. Finds the clicked element and uses its "data-id"
   * attribute to find the corresponding item in the collection and then
   * selects the `_this.watchProperty` on `_this.model` to that item.
   *
   *
   * @param evt {ClickEvent}
   *     The event the caused this method to be called.
   */
  _this.onContentClick = function (evt) {
    var item,
        obj;

    if (evt && evt.target && evt.target.nodeName === 'INPUT') {
      item = _this.getClickedItem(evt.target, _this.content);

      if (item && _this.watchProperty) {
        obj = _this.collection.get(item.getAttribute('data-id'));
        _this.updateModel(obj);
      }
    }
  };

  _this.renderHeader = function () {
    if (!_this.title) {
      return;
    }
    _this.header.innerHTML = '<h4>' + _this.title + '</h4>'; // By default, no content
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
