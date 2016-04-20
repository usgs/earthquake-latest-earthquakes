'use strict';

var Util = require('util/Util');

var _DEFAULTS = {

};

var ListViewFooter = function (options) {
  var _this,
      _initialize;

  _this = {};

  _initialize = function (options) {
    options = Util.extend{}, _DEFAULTS, options);
  };

  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  _this.listFooterMarkup = function () {
    var buf,
        el;

    el = document.createElement('div');
    el.className = 'list-view-footer';

    buf = [];

    buf.push(
      '<h5>Didn\'t find what you were looking for?</h5>',
      '<ul class="help no-style">',
        '<li>',
          'Check your &ldquo;Settings&rdquo;.',
        '</li>',
        '<li>',
          '<a href="/earthquakes/map/doc_whicheqs.php">',
            'Which earthquakes are included on the map and ',
            'list?',
          '</a>',
        '</li>',
        '<li>',
          '<a href="/earthquakes/eventpage/unknown#impact_tellus">',
            'Felt something not shown – report it here.',
          '</a>',
        '</li>',
      '</ul>'
    );

    el.innerHTML = buf.join('');
    return el;
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ListViewFooter;
