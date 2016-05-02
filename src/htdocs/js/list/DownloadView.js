'use strict';


var Collection = require('mvc/Collection'),
    Util = require('util/Util'),
    View = require('mvc/View');


var _DEFAULTS = {
  formats: [
    {
      title:'ATOM',
      description:'For Web Applications',
      search: null,
      extension:'.atom'
    },
    {
      title:'CSV',
      description:'For spreadsheets',
      search: 'csv',
      extension:'.csv'
    },
    {
      title:'GeoJson',
      description:'For web applications',
      search: 'geojson',
      extension:'.geojson'
    },
    {
      title:'KML - Color by Age',
      description:'For google maps',
      search: 'kml&kmlcolorby=age',
      extension:'_age.kml'
    },
    {
      title:'KML - Color by Age (animated)',
      description:'For google maps',
      search: 'kml&kmlcolorby=age&kmlanimated=true',
      extension:'_age_animated.kml'
    },
    {
      title:'KML - Color by Depth',
      description:'For google maps',
      search: 'kml&kmlcolorby=depth',
      extension:'_depth.kml'
    },
    {
      title:'KML - Color by Depth (animated)',
      description:'For google maps',
      search: 'kml&kmlcolorby=depth&kmlanimated=true',
      extension:'_depth_animated.kml'
    },
    {
      title:'QuakeML',
      description:'For google maps',
      search: 'quakeml',
      extension:'.quakeml'
    }]
};


/**
 * Produces a view to download feeds.
 */
var DownloadView = function (options) {
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
   * @params options.model
   * @params options.collection
   * @params options.formats
   *    An array of objects which contain:
   *    title: {string}
   *      the title of the download file.
   *    description: {string}
   *      a description of why the file should be used.
   *    search: {string}
   *      the search code to be used if the url is a query
   *    extension: {string}
   *      the extension of the file to be downloaded if the url is a feed
   */
  _initialize = function (options) {
    _this.collection = options.collection || Collection();
    _formats = options.formats;

    _this.collection.on('reset', 'render', _this);
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
    var downloads,
        markup;

    markup = [];

    if (_this.collection.metadata !== undefined &&
        _this.collection.metadata !== null &&
        _this.collection.metadata.url !== null)
    {
      downloads = _this.getDownloadLinks();

      markup.push('<ul class="download-view">');

      for (var i = 0; i < downloads.length; i++) {
        markup.push(
          '<li> <a class="download" href="' +
          downloads[i].href +
          '">' +
          downloads[i].title +
          '</a>'
        );
        if (downloads[i].description) {
            markup.push(
              '<span class="download-description"> (' +
              downloads[i].description +
              ')</span>'
            );
          }
        markup.push('</li>');
      }
      markup.push('</ul>');
    } else {
      markup.push('No data to download');
    }

    _this.el.innerHTML = markup.join('');
  };

  /**
   * gets an array of download link objects,
   *  based on the formats passed in,
   *  differing by whether there's a feed or query url.
   *
   * @returns array of download link objects.
   */
  _this.getDownloadLinks = function () {
    var downloads,
        format,
        href,
        len,
        search,
        replace,
        url;

    downloads = [];
    url = _this.collection.metadata.url;
    len = _formats.length;

    if (url.substr(-'.geojson'.length) === '.geojson') {
      search = false;
      replace = '.geojson';
    } else {
      search = true;
      replace = 'geojson';
    }

    for (var i = 0; i < len; i++) {
      format = _formats[i];
      if (search && format.search !== null) {
        href = url.replace(/&callback=[\w]+/, '')
            .replace('&jsonerror=true', '');
        href = href.replace(replace, format.search);
        downloads.push(
          {
            'title': format.title,
            'href': href,
            'description': format.description
          });
      } else if (!search) {
        href = url.replace(replace, '') + format.extension;
        downloads.push(
          {
            'title': format.title,
            'href': href,
            'description': format.description
          });
      }
    }

    return downloads;
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = DownloadView;
