'use strict';

var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');

var _DEFAULTS = {};


var RadioOptionsView = function (options) {
  var _this,
      _initialize,

      _section;


  _this = GenericCollectionView(options);
  options = Util.extend({}, _DEFAULTS, options);

  _initialize = function (options) {
    // defines which setting to configure
    _section = options.section || '';

    _this.render();
  };

  _this.deselectAll = function () {
    var radios;

    radios = [];
    radios = _this.el.querySelectorAll('input[type=checkbox]');

    radios.forEach(function (radio) {
      radio.checked = false;
    });
  };

  _this.destroy = Util.compose(function () {
    _section = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);


  _this.render = function () {
    var items,
        list;

    items = _collection.data().slice(0) || [];

    if (items.length) {
      list = document.createElement('ol');
      list.classList.add('checkbox-options-view');
      list.classList.add('no-style');
      items.forEach(function (item) {
        var li;
        li = list.appendChild(document.createElement('li'));
        li.classList.add(_section);
        li.setAttribute('data-id', item.id);
        li.innerHTML = '<input type="checkbox" id="id-' + item.id + '" value="' + item.id +
              '" name="' + _section + '" />' +
            '<label for="id-' + item.id + '">' + item.name + '</label>';
      });
      // append list to the DOM
      _this.el.appendChild(list);
      // set the selected collection item
      _this.setSelected(_this.model.get(_section));
    } else {
      _this.el.innerHTML = '<p class="alert error">There are no options to ' +
          'display</p>';
    }

  };

  // select multiple options
  _this.setSelected = function (objs) {
    var id,
        el;

    if (!objs) {
      return;
    }

    // select each checkbox
    objs.forEach(function (obj) {
      id = obj.get('id');
      el = document.querySelector('id-' + id);

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
