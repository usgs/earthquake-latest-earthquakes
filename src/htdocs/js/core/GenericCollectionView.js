'use strict';


var Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  classPrefix: 'generic-collection-view',
  containerNodeName: 'ul',
  itemNodeName: 'li',
  noDataMessage: 'There is no data to display.',
  watchProperty: ''
};


/**
 * Base class to serve as an extension point for multiple views used in
 * the usgs/earthquake-latest-earthquakes project. This view accepts (among
 * other things) a collection and a model on the configuration options at
 * time of construction.
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
 * - createCollectionItemContent
 * - deselectAll
 * - renderFooter
 * - renderHeader
 * - setSelected
 *
 * @param options {Object}
 *     Configuration options for this view. See documentation on the
 *     `_initialize` method for complete details on all configuration
 *     options that may be provided.
 */
var GenericCollectionView = function (options) {
  var _this,
      _initialize,

      _classPrefix,
      _containerNodeName,
      _itemNodeName,
      _noDataMessage,

      _createScaffold,
      _onContentClick;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  /**
   * Constructor.
   *
   * @param options {Object}
   *     Configuration options for this view.
   * @param options.classPrefix {String}
   *     A prefix to add to each class that is added to generated HTMLElements
   *     in this view's default implementation.
   * @param options.collection {mvc/Collection}
   *     The collection for this view.
   * @param options.containerNodeName {String}
   *     The nodeName of the element to be created that will wrap all
   *     the items in the collection. For example: 'ul'
   * @param options.itemNodeName {String}
   *     The nodeName of the element to be created that will wrap each of
   *     the items in the collection. For example: 'li'
   * @param options.model {mvc/Model}
   *     The model for this view.
   * @param options.noDataMessage {String}
   *     A message to display when the collection is empty
   * @param options.watchProperty {String}
   *     The name of the property on the model to watch for changes and
   *     subsequently trigger `onEvent`.
   */
  _initialize = function (options) {
    _this.collection = options.collection || Collection();

    _classPrefix = options.classPrefix;
    _containerNodeName = options.containerNodeName;
    _itemNodeName = options.itemNodeName;
    _this.watchProperty = options.watchProperty;
    _noDataMessage = options.noDataMessage;

    _this.el.classList.add(_classPrefix);
    _this.createScaffold();

    _this.model.off('change', 'render', _this);
    if (_this.watchProperty) {
      _this.model.on('change:' + _this.watchProperty, 'onEvent', _this);
    }

    _this.collection.on('reset', 'render', _this);
    _this.collection.on('add', 'render', _this);
    _this.collection.on('remove', 'render', _this);
  };

  /**
   * Call _this.onContentClick when a click is fired. This is done so that
   * _this.onContentClick can be overridden in the sub classes.
   *
   */
  _onContentClick = function () {
    _this.onContentClick.apply(this, arguments);
  };

  /**
   * Called during initialization. Creates the base HTML structure into
   * which all rendering is later performed. Sets up event delegation on
   * `_this.content` to handle click events.
   *
   */
  _createScaffold = function () {
    var el;

    el = _this.el;

    el.innerHTML = [
      '<header class="', _classPrefix, '-header"></header>',
      '<section class="', _classPrefix, '-content"></section>',
      '<footer class="', _classPrefix, '-footer"></footer>'
    ].join('');

    _this.header = el.querySelector('.' + _classPrefix + '-header');
    _this.content = el.querySelector('.' + _classPrefix + '-content');
    _this.footer = el.querySelector('.' + _classPrefix + '-footer');

    _this.content.addEventListener('click', _this.onContentClick, _this);
  };


  /**
   * Creates the container element by which all the items in the collection
   * are wraped.
   *
   * @return {HTMLElement}
   *     An HTMLElement based on the configured `options.containerNodeName`
   *     property.
   */
  _this.createCollectionContainer = function (container) {
    container = container || document.createElement(_containerNodeName);
    container.classList.add(_classPrefix + '-container');
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
  _this.createCollectionItem = function (obj) {
    var item;

    item = document.createElement(_itemNodeName);
    item.classList.add(_classPrefix + '-item');

    if (obj) {
      item.setAttribute('data-id', obj.id);
      item.appendChild(_this.createCollectionItemContent(obj));
    }

    return item;
  };

  /**
   * APIMethod
   *
   * Creates the content for the given obj. Implementing classes will
   * likely want to override this method.
   *
   * @param obj {Object}
   *     The item from the collection for which to create the content.
   *
   * @return {HTMLElement}
   *     The content visualization for the given `obj`.
   */
  _this.createCollectionItemContent = function (obj) {
    var pre;

    pre = document.createElement('pre');
    pre.innerHTML = JSON.stringify(obj, null, '  ');

    return pre;
  };

  /**
<<<<<<< 7da20bbc8d25c6164e7c0bb54f365701ab62f134
   * Called during initialization. Creates the base HTML structure into
   * which all rendering is later performed. Sets up event delegation on
   * `_this.content` to handle click events.
   *
   */
  _this.createScaffold = function () {
    var el;

    el = _this.el;

    el.innerHTML = [
      '<header class="', _classPrefix, '-header"></header>',
      '<section class="', _classPrefix, '-content"></section>',
      '<footer class="', _classPrefix, '-footer"></footer>'
    ].join('');

    _this.header = el.querySelector('.' + _classPrefix + '-header');
    _this.content = el.querySelector('.' + _classPrefix + '-content');
    _this.footer = el.querySelector('.' + _classPrefix + '-footer');

    _this.content.addEventListener('click', _onContentClick);
  };

  /**
=======
>>>>>>> create scafolding is private
   * APIMethod
   *
   * Deselects all the items in `_this.content`. An implementing sub-class
   * may want to override this method if selection is not done by toggling
   * a "selected" class on the item element.
   *
   */
  _this.deselectAll = function () {
    Array.prototype.forEach.call(_this.content.querySelectorAll('.selected'),
    function (node) {
      if (node && node.classList) {
        node.classList.remove('selected');
      }
    });
  };

  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _this.content.removeEventListener('click', _this.onContentClick, _this);

    if (_this.watchProperty) {
      _this.model.off('change:' + _this.watchProperty, 'onEvent', _this);
    }
    _this.model.on('change', 'render', _this);

    _this.collection.off('reset', 'render', _this);
    _this.collection.off('add', 'render', _this);
    _this.collection.off('remove', 'render', _this);

    _onContentClick = null;

    _classPrefix = null;
    _containerNodeName = null;
    _this.watchProperty = null;
    _itemNodeName = null;
    _noDataMessage = null;

    _createScaffold = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Traverse a DOM from the startNode to the endNode looking for the clicked
   * item node that wraps the individual item from the collection.
   *
   * Note: An implementing sub-class may want to override this method if
   *       it also significantly changes the `createCollectionItem` method.
   *
   * @param startNode {HTMLElement}
   *     The starting point for the search.
   * @param endNode {HTMLElement}
   *     The ending point for the search.
   *
   * @return {HTMLElement|null}
   *     The element corresponding to the clicked item, or null if no such
   *     element was found.
   */
  _this.getClickedItem = function (startNode, endNode) {
    var item;

    item = startNode;

    while (item && !item.classList.contains(_classPrefix + '-item')) {
      item = Util.getParentNode(item.parentNode, _itemNodeName, endNode);
    }

    return item;
  };

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

    if (evt && evt.target) {
      item = _this.getClickedItem(evt.target, _this.content);

      if (item && _this.watchProperty) {
        obj = _this.collection.get(item.getAttribute('data-id'));
        _this.updateModel(obj);
      }
    }
  };

  /**
   * Called when the `_this.watchProperty` on `_this.model` is changed. Ensures
   * the proper corresponding rendered element(s) appear selected.
   *
   */
  _this.onEvent = function () {
    var value;

    if (_this.watchProperty) {
      value = _this.model.get(_this.watchProperty);
      _this.deselectAll();
      _this.setSelected(value);
    }
  };

  /**
   * Called when the collection is reset (primarily), or when items are added
   * to/removed from the collection. Renders the header, footer, and all
   * the content.
   *
   */
  _this.render = function () {
    _this.renderHeader();
    _this.renderContent();
    _this.renderFooter();
  };

  /**
   * Renders the content section for this view. If no data exists, renders
   * a the `_noDataMessage`. If an error occurs, renders a generic error
   * message. Otherwise, renders each item in the collection, delegating to
   * sub-methods.
   *
   */
  _this.renderContent = function () {
    var container,
        data;

    try {
      data = _this.collection.data().slice(0);

      if (data.length === 0) {
        _this.content.innerHTML = '<p class="alert info">' +
            _noDataMessage +
          '</p>';
      } else {
        container = _this.createCollectionContainer();

        data.forEach(function (obj) {
          container.appendChild(_this.createCollectionItem(obj));
        });

        Util.empty(_this.content);
        _this.content.appendChild(container);
        _this.onEvent(); // Make sure selected item remains selected
      }
    } catch (e) {
      _this.content.innerHTML = '<p class="alert error">' +
          'An error occurred while rendering.\n' +
          '<!-- ' + (e.stack || e.message) + ' -->' +
        '</p>';
    }
  };

  /**
   * APIMethod
   *
   * A hook allowing markup to be added to `_this.footer` section.
   */
  _this.renderFooter = function () {
    _this.footer.innerHTML = ''; // By default, no content
  };

  /**
   * APIMethod
   *
   * A hook allowing markup to be added to `_this.header` section.
   */
  _this.renderHeader = function () {
    _this.header.innerHTML = ''; // By default, no content
  };

  /**
   * APIMethod
   *
   * Method to update an element in `_this.content`, whose "data-id" attribute
   * matches the given value "id" attribute, to appear selected. An
   * implementing sub-class may want to override this method if selection is
   * not done by toggling a "selected" class on the item element.
   *
   * @param value {Mixed}
   *     Typically an object with an "id" attribute which corresponds the
   *     "data-id" attribute of some element in `_this.content`.
   *
   */
  _this.setSelected = function (value) {
    var item;

    if (value) {
      item = _this.content.querySelector('[data-id="' + value.id + '"]');

      if (item && item.classList) {
        item.classList.add('selected');
      }
    }
  };

  /**
   * Update the `watchProperty` of `_this.model` to be the given value.
   *
   * @param value {Object}
   *     The value to which to set the `watchProperty` on `_this.model`.
   */
  _this.updateModel = function (value) {
    var toSet;

    toSet = {};
    toSet[_this.watchProperty] = value;

    _this.model.set(toSet);
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = GenericCollectionView;
