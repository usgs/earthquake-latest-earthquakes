'use strict';


var GenericCollectionView = require('core/GenericCollectionView'),
    Util = require('util/Util');


var _DEFAULTS = {
  classPrefix: 'modes-view',
  watchProperty: 'viewModes'
};

/**
 * Checks the size of the browser window to see if it is in a mobile
 * environment or not.
 */
var _mobileCheck = function () {
  var mobile,
      mobileWidth,
      width;

  mobile = false;
  mobileWidth = 640;
  width = window.innerWidth || document.body.clientWidth;

  if (width <= mobileWidth) {
    mobile = true;
  }

  return mobile;
};

var _getModes = function (viewModes, obj) {
  var i,
      index,
      modes;

  if (_mobileCheck()) {
    modes = [obj];
  } else {
    if (obj.id === 'help') {
      modes = [{'id': 'help'}];
    } else {

      index = -1;
      modes = [];

      for (i = 0; i < viewModes.length; i++) {
        if (obj.id !== viewModes[i].id && viewModes[i].id !== 'help') {
          // contains object, remove it
          modes.push(viewModes[i]);
        } else if (obj.id === viewModes[i].id) {
          index = i;
        }
      }

      if (index === -1) {
        // does not contain object, add it
        modes.push(obj);
      } else if (modes.length === 0) {
        modes.push({'id': 'help'});
      }
    }
  }
  return modes;
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
   * updates model based on view port size.
   *
   * @param obj {Object}
   *     Configuration option that was clicked
   */
  _this.updateModel = function (obj) {
    _this.model.set(
      {
        'viewModes': _getModes(_this.model.get('viewModes'), obj)
      }
    );
  };


  options = null;
  return _this;
};


ModesView.getModes = _getModes;
ModesView.mobileCheck = _mobileCheck;

module.exports = ModesView;
