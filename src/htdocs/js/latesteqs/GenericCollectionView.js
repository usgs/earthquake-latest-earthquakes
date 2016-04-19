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


var GenericCollectionView = function (options) {
  var _this,
      _initialize,

      _classPrefix,
      _containerNodeName,
      _watchProperty,
      _itemNodeName,
      _noDataMessage;


  options = Util.extend({}, _DEFAULTS, options);
  _this = View(options);

  _initialize = function (options) {
    _this.collection = options.collection || Collection();

    _classPrefix = options.classPrefix;
    _containerNodeName = options.containerNodeName;
    _itemNodeName = options.itemNodeName;
    _watchProperty = options.watchProperty;
    _noDataMessage = options.noDataMessage;

    _this.createScaffold();

    _this.model.off('change', 'render', _this);
    if (_watchProperty) {
      _this.model.on('change:' + _watchProperty, 'onEvent', _this);
    }

    _this.collection.on('reset', 'render', _this);
    _this.collection.on('add', 'render', _this);
    _this.collection.on('remove', 'render', _this);
  };


  _this.createCollectionContainer = function () {
    var container;

    container = document.createElement(_containerNodeName);
    container.classList.add(_classPrefix + '-container');

    return container;
  };

  _this.createCollectionItem = function (obj) {
    var item;

    item = document.createElement(_itemNodeName);
    item.classList.add(_classPrefix + '-item');
    item.setAttribute('data-id', obj.id);

    item.appendChild(_this.createCollectionItemContent(obj));

    return item;
  };

  _this.createCollectionItemContent = function (obj) {
    var pre;

    pre = document.createElement('pre');
    pre.innerHTML = JSON.stringify(obj, null, '  ');

    return pre;
  };

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

    _this.content.addEventListener('click', _this.onContentClick, _this);
  };

  _this.deselectAll = function () {
    Array.prototype.forEach.call(_this.content.querySelectorAll('.selected'),
    function (node) {
      if (node && node.classList) {
        node.classList.remove('selected');
      }
    });
  };

  _this.destroy = Util.compose(function () {
    _this.content.removeEventListener('click', _this.onContentClick, _this);

    if (_watchProperty) {
      _this.model.off('change:' + _watchProperty, 'onEvent', _this);
    }
    _this.model.on('change', 'render', _this);

    _this.collection.off('reset', 'render', _this);
    _this.collection.off('add', 'render', _this);
    _this.collection.off('remove', 'render', _this);

// TODO :: Nullify all private vars ...

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.getClickedItem = function (startNode, endNode) {
    var item;

    item = startNode;

    while (item && !item.classList.contains(_classPrefix + '-item')) {
      item = Util.getParentNode(item.parentNode, _itemNodeName, endNode);
    }

    return item;
  };

  _this.onContentClick = function (evt) {
    var item,
        toSet;

    if (evt && evt.target) {
      item = _this.getClickedItem(evt.target, _this.content);

      if (item && _watchProperty) {
        toSet = {};
        toSet[_watchProperty] = _this.collection.get(item.getAttribute('data-id'));

        _this.model.set(toSet);
      }
    }
  };

  _this.onEvent = function () {
    var value;

    if (_watchProperty) {
      value = _this.model.get(_watchProperty);
      _this.deselectAll();
      _this.setSelected(value);
    }
  };

  _this.render = function () {
    _this.renderHeader();
    _this.renderContent();
    _this.renderFooter();
  };

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
      _this.content.innerHTMl = '<p class="alert error">' +
          'An error occurred while rendering.\n' +
          '<!-- ' + (e.stack || e.message) + ' -->' +
        '</p>';
    }
  };

  _this.renderFooter = function () {
    _this.footer.innerHTML = ''; // By default, no content
  };

  _this.renderHeader = function () {
    _this.header.innerHTML = ''; // By default, no content
  };

  _this.setSelected = function (value) {
    var item;

    if (value) {
      item = _this.content.querySelector('[data-id="' + value.id + '"]');

      if (item && item.classList) {
        item.classList.add('selected');
      }
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = GenericCollectionView;
