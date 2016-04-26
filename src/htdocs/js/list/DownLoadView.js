'use strict';

var Util = require('util/Util'),
    View = require('mvc/View');

var _DEFAULTS = {
  formats: [
    {
      title:'ATOM',
      description:'For Web Applications',
      className: 'atom',
      extension:'.atom'
    },
    {
      title:'CSV',
      description:'For spreadsheets',
      className: 'csv',
      extension:'.csv'
    },
    {
      title:'GeoJson',
      description:'For web applications',
      className: 'geojson',
      extension:'.geojson'
    },
    {
      title:'KML - Color by Age',
      description:'For google maps',
      className: 'age-kml',
      extension:'_age.kml'
    },
    {
      title:'KML - Color by Age (animated)',
      description:'For google maps',
      className: 'age-animated-kml',
      extension:'_age_animated.kml'
    },
    {
      title:'KML - Color by Depth',
      description:'For google maps',
      className: 'depth-kml',
      extension:'_depth.kml'
    },
    {
      title:'KML - Color by Depth (animated)',
      description:'For google maps',
      className: 'depth-animated-kml',
      extension:'_depth_animated.kml'
    },
    {
      title:'QuakeML',
      description:'For google maps',
      className: 'quakeml',
      extension:'.quakeml'
    }]
};

/**
 * Produces a view to download feeds.
 */
var DownLoadView = function (options) {
  var _initialize,
      _formats,
      _this;

  options = Util.extend({}, _DEFAULTS, options);

  _this = View(options);

  /**
   * Constructor. Initializes a new DownLoadView.
   *
   * @params options {Object}
   *    Configuration options. May Include:
   * @params options.formats
   *    An array of objects which contain:
   *    title: {string}
   *      the title of the download file.
   *    description: {string}
   *      a description of why the file should be used.
   *    extension: {string}
   *      the extension of the file to be downloaded.
   */
  _initialize = function (options) {
    var element,
        format,
        markup;

    _formats = options.formats;

    markup = '<ul class="download-view">';

    for(var i = 0, len = _formats.length; i < len; i++) {
      format = _formats[i];

      markup += '<li> <a class="download ' +
        format.className +
        '">' +
        format.title +
        '</a>';
      if (format.description) {
          markup += '<span class="download-description ' +
          format.className +
          '"> (' +
          format.description +
          ')</span>';
        }
      markup += '</li>';
    }
    markup += '</ul>';

    element = document.createElement('span');
    element.innerHTML = markup;
    _this.el.appendChild(element);
  };

  /**
   * Frees resources associated with this view.
   *
   */
  _this.destroy = Util.compose(function () {
    _formats = null;
    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * render
   *    Renders the view.
   */
  _this.render = function () {
    var el,
        format,
        url;

    url = _this.model.get('metadata').url.replace('.geojson', '');

    for (var i = 0, len = _formats.length; i < len; i++) {
      format = _formats[i];
      el = _this.el.querySelector('.' + format.className);
      el.setAttribute('href', url + format.extension);
    }
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = DownLoadView;
