'use strict';


var Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {

};

var _DEFAULT_FORMAT = {
  format: function (feature) {
    var pre;

    pre = document.createElement('pre');
    pre.classList.add('list-view-default-format');
    pre.innerHTML = JSON.stringify(feature, null, '  ');

    return pre;
  }
};


var ListView = function (options) {
  var _this,
      _initialize,

      _catalog,
      _content,
      _defaultListFormat,
      _footer,
      _header;


  options = Util.extend({}, options, _DEFAULTS);
  _this = View(options);

  _initialize = function (options) {
    _catalog = options.catalog || Collection();

    _defaultListFormat = options.listFormat || _this.model.get('listFormat') ||
        _DEFAULT_FORMAT;

    _this.createSkeleton();

    // Only listen for interesting change events
    _this.model.off('change', 'render', _this);
    _this.model.on('change:listFormat', 'render', _this);

    _catalog.on('reset', 'render', _this);
    _catalog.on('select', 'onSelect', _this);
    _catalog.on('deselect', 'onDeselect', _this);
  };


  _this.createSkeleton = function () {
    var el;

    el = _this.el;

    el.innerHTML = [
      '<header class="list-view-header"></header>',
      '<section class="list-view-content"></section>',
      '<footer class="list-view-footer"></footer>'
    ].join('');

    _header = el.querySelector('.list-view-header');
    _content = el.querySelector('.list-view-content');
    _footer = el.querySelector('.list-view-footer');

    _content.addEventListener('click', _this.onListClick, _this);
  };

  _this.destroy = Util.compose(function () {
    _this.model.off('change:listFormat', 'render', _this);
    _this.model.on('change', 'render', _this);

    _catalog.off('deselect', 'onDeselect', _this);
    _catalog.off('select', 'onSelect', _this);
    _catalog.off('reset', 'render', _this);

    _content.removeEventListener('click', _this.onListClick, _this);

    _content = null;
    _footer = null;
    _header = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.getClickedItem = function (startNode) {
    var item;

    item = startNode;

    if (item) {
      do {
        item = Util.getParentNode(item, 'li', _content);
      } while (item && !item.classList.contains('list-view-list-item'));
    }

    return item;
  };

  _this.onDeselect = function () {
    Array.prototype.forEach.call(_content.querySelectorAll('.selected'),
    function (node) {
      node.classList.remove('selected');
    });
  };

  _this.onListClick = function (evt) {
    var item;

    if (evt && evt.target) {
      item = _this.getClickedItem(evt.target);

      if (item) {
        console.log('Selecting item: ' + item.getAttribute('data-id'));
        _catalog.selectById(item.getAttribute('data-id'));
      }
    }
  };

  _this.onSelect = function () {
    var item,
        selected;

    selected = _catalog.getSelected();

    if (selected) {
      item = _content.querySelector('[data-id="' + selected.id + '"]');

      if (item) {
        item.classList.add('selected');
      }
    }
  };

  _this.render = function () {
    _this.renderHeader();
    _this.renderContent();
    _this.renderFooter();
  };

  _this.renderContent = function () {
    var data,
        list,
        listFormat;

    try {
      data = _catalog.data().slice(0) || [];
      listFormat = _this.model.get('listFormat') || _defaultListFormat;

      if (data.length === 0) {
        _content.innerHTML = '<p class="alert info">' +
            'No data to display.</p>';
      } else {
        list = document.createElement('ol');
        list.classList.add('list-view-list');

        data.forEach(function (feature) {
          var item;

          item = list.appendChild(document.createElement('li'));
          item.classList.add('list-view-list-item');
          item.setAttribute('data-id', feature.id);
          item.appendChild(listFormat.format(feature));
        });

        Util.empty(_content);
        _content.appendChild(list);
      }
    } catch (e) {
      _content.innerHTML = '<p class="alert error">' +
          'An error occurred rendering the list of events.\n' +
          '<!-- ' + (e.stack || e.message) + '-->' +
        '</p>';
    }
  };

  _this.renderFooter = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#64
    _footer.innerHTML = '<p>Here is the ListView footer!</p>';
  };

  _this.renderHeader = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#63
    _header.innerHTML = '<p>Here is the ListView header!</p>';
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
