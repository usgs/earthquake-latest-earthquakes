'use strict';

var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');

var _DEFAULTS = {};


var RadioOptionsView = function (options) {
  var _this,
      _initialize,

      _watchProperty;


  _this = GenericCollectionView(options);
  options = Util.extend({}, _DEFAULTS, options);

  _initialize = function (options) {
    // defines which setting to configure
    _watchProperty = options.watchProperty || '';

    _this.render();
  };

  _this.deselectAll = function () {
    Array.prototype.forEach.call(
        _this.el.querySelectorAll('input[type=checkbox]'),
        function (checkbox) {
          checkbox.checked = false;
        }
      );
  };

  _this.destroy = Util.compose(function () {
    _watchProperty = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


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
        li.innerHTML = '<input type="checkbox" id="id-' + item.id +
              '" value="' + item.id + '" name="' + _watchProperty + '" />' +
            '<label for="id-' + item.id + '">' + item.name + '</label>';
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

  // select multiple options
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
      el = _this.el.querySelector('#id-' + id);

      if (el) {
        el.checked = true;
      }
    });
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = RadioOptionsView;
