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
      _header,
      _list;


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
      '<section class="list-view-content">',
        '<ol class="no-style list-view-list"></ol>',
      '</section>',
      '<footer class="list-view-footer"></footer>'
    ].join('');

    _header = el.querySelector('.list-view-header');
    _content = el.querySelector('.list-view-content');
    _list = el.querySelector('.list-view-list');
    _footer = el.querySelector('.list-view-footer');

    _list.addEventListener('click', _this.onListClick, _this);
  };

  _this.destroy = Util.compose(function () {
    _list.removeEventListener('click', _this.onListClick, _this);

    _content = null;
    _footer = null;
    _header = null;
    _list = null;

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

  };

  _this.renderFooter = function () {

  };

  _this.renderHeader = function () {

  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = ListView;
