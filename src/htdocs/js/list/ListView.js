'use strict';


var Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {

};


var ListView = function (options) {
  var _this,
      _initialize,

      _content,
      _footer,
      _header;


  options = Util.extend({}, options, _DEFAULTS);
  _this = View(options);

  _initialize = function (/*options*/) {
    _this.createSkeleton();
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
    _content.removeEventListener('click', _this.onListClick, _this);

    _content = null;
    _footer = null;
    _header = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.onListClick = function () {
    console.log('list clicked!');
  };

  _this.render = function () {
    _this.renderHeader();
    _this.renderContent();
    _this.renderFooter();
  };

  _this.renderContent = function () {
    var catalog,
        list,
        listFormat;

    catalog = _this.model.get('catalog');
    listFormat = _this.model.get('listFormat');

    try {
      if (!catalog || catalog.data().length === 0) {
        _content.innerHTML = '<p class="alert info">' +
            'No data to display.</p>';
      } else if (!listFormat) {
        _content.innerHTML = '<p class="alert info">' +
            'No list format configured. Here&rsquo;s a data dump&hellip;</p>' +
            '<pre>' + JSON.stringify(catalog.data(), null, '  ') + '</pre>';
      } else {
        list = document.createElement('ol');
        list.classList.add('list-view-list');

        (catalog.data() || []).slice(0).forEach(function (feature) {
          var item;

          item = list.appendChild(document.createElement('li'));
          item.setAttribute('data-id', feature.id);
          item.appendChild(listFormat.format(feature));
        });

        Util.empty(_content);
        _content.appendChild(list);
      }
    } catch (e) {
      _content.innerHTML = '<p class="alert error">An error occurred ' +
          'rendering the list of events.</p>';
    }
  };

  _this.renderFooter = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#64
  };

  _this.renderHeader = function () {
    // TODO :: usgs/earthquake-latest-earthquakes#63
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
