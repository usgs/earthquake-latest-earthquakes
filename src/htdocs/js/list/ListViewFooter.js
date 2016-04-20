'use strict';

var Util = require('util/Util');

var _DEFAULTS = {

};

/**
 * Sets up list footer.
 * @param options {object}
 */
var ListViewFooter = function (options) {
  var _this,
      _initialize;

  _this = {};

  _initialize = function (options) {
    options = Util.extend({}, _DEFAULTS, options);
  };

  _this.destroy = Util.compose(function () {
    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Creates markup for list footer
   */
  _this.listFooterMarkup = function () {
    var buf,
        el;

    el = document.createElement('div');
    el.className = 'list-view-footer';

    buf = [];

    buf.push(
      '<dl class="help no-style">',
        '<dt>Didn\'t find what you were looking for?</dt>',
        '<dd>',
          'Check your &ldquo;Settings&rdquo;.',
        '</dd>',
        '<dd>',
          '<a href="/earthquakes/map/doc_whicheqs.php">',
            'Which earthquakes are included on the map and ',
            'list?',
          '</a>',
        '</dd>',
        '<dd>',
          '<a href="/earthquakes/eventpage/unknown#impact_tellus">',
            'Felt something not shown – report it here.',
          '</a>',
        '</dd>',
      '</dl>'
    );

    el.innerHTML = buf.join('');
    return el;
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = ListViewFooter;
