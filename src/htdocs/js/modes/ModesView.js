'use strict';


var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');


var _DEFAULTS = {
  classPrefix: 'modes-view',
  watchProperty: 'viewModes'
};


var ModesView = function (options) {
  var _this;


  options = Util.extend({}, _DEFAULTS, options);
  _this = GenericCollectionView(options);


  /**
   * Creates content for view.
   *
   * @param obj {Object}
   *    Configuration object
   */
  _this.createCollectionItemContent = function (obj) {
    var icon;

    icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.setAttribute('title', obj.name || 'Icon');
    icon.innerHTML = obj.icon || 'crop_square';

    return icon;
  };

  /**
   * Adds selected class to icons when selected
   *
   * @param objs {Array<Object>}
   *    An array of objects each with an "id" attribute corresponding to the
   *    "data-id" attribute of some element in `_this.content`.
   */
  _this.setSelected = function (objs) {
    var el,
        id;

    if (!objs) {
      return;
    }

    objs.forEach(function (obj) {
      id = obj.id;
      el = _this.content.querySelector('[data-id="' + id + '"]');

      if (el) {
        el.classList.add('selected');
      }
    });
  };

  /**
   * Checks the size of the browser window to see if it is in a mobile
   * environment or not.
   */
  _this.mobileCheck = function () {
    var height,
        mobile,
        mobileHeight,
        mobileWidth,
        width;

    mobile = false;
    mobileHeight = 736;
    mobileWidth = 414;
    height = window.innerHeight || document.body.clientHeight;
    width = window.innerWidth || document.body.clientWidth;

    if (height <= mobileHeight || width <= mobileWidth) {
      mobile = true;
    }

    return mobile;
  };

  /**
   * Update model based on newly clicked item in the options view. If
   * the clicked item was previously set as a value on the `watchProperty` for
   * `_this.model` then that item is removed from the `watchProperty` value;
   * otherwise the item is added to the `watchProperty` value.
   *
   * This method is called by onContentClick.
   *
   * @param obj {Object}
   *     Configuration option that was clicked
   */
  _this.updateModel = function (obj) {
    var i,
        index,
        items,
        properties,
        toSet;

    if (obj.id === 'help') {
      _this.model.set({
        'viewModes': [
          {
            'id': 'help'
          }
        ]
      });
      return;
    }

    toSet = {};
    properties = _this.model.get(_this.watchProperty);

    if (properties) {
      items = properties.slice(0);
    } else {
      items = [];
    }

    index = -1;
    toSet[_this.watchProperty] = [];
    // check if model already contains selected object
    for (i = 0; i < items.length; i++) {
      if (obj.id !== items[i].id && items[i].id !== 'help') {
        // contains object, remove it
        toSet[_this.watchProperty].push(items[i]);
      } else if (obj.id === items[i].id) {
        index = i;
      }


    if (index === -1) {
      // does not contain object, add it
      toSet[_this.watchProperty].push(obj);
    } else if (toSet[_this.watchProperty].length === 0) {
      toSet[_this.watchProperty].push({'id': 'help'});
    }
  };

  /**
   * Updates the model with the selected mode and closes other modes.
   *
   * @param obj {Object}
   *    Configuration option that was clicked
   */
  _this.updateMobileModel = function (obj) {
    _this.model.set({
      'viewModes': [
        {
          'id': obj.id,
          'name': obj.name,
          'icon': obj.icon
        }
      ]
    });
  };


  options = null;
  return _this;
};


module.exports = ModesView;
