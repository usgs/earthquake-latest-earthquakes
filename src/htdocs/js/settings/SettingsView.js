'use strict';

var CheckboxOptionsView = require('settings/CheckboxOptionsView'),
    Config = require('latesteqs/Config'),
    RadioOptionsView = require('settings/RadioOptionsView'),
    Util = require('util/Util'),
    View = require('mvc/View');

var _DEFAULTS = {};


var SettingsView = function (options) {
  var _this,
      _initialize,

      _watchProperty;


  _this = View(options);
  options = Util.extend({}, _DEFAULTS, options);


  _initialize = function (/*options*/) {
    // initialize the view
    _this.createSkeleton();
  };

  _this.createSkeleton = function () {
    _this.el.innerHTML =
        '<section class="settings-header"></section>' +
        '<section class="settings-content"></section>' +
        '<section class="settings-footer"></section>';

    _this.header = _this.el.querySelector('.settings-header');
    _this.content = _this.el.querySelector('.settings-content');
    _this.footer = _this.el.querySelector('.settings-footer');
  };

  /**
   * Frees resources associated with this view.
   */
  _this.destroy = Util.compose(function () {
    _watchProperty = null;

    _initialize = null;
    _this = null;
  }, _this.destroy);

  /**
   * Renders the view, called on model change
   */
  _this.render = function () {
    _this.renderHeader();
    _this.renderContent();
    _this.renderFooter();
  };

  _this.renderContent = function () {
    var autoUpdateEl,
        feedsEl,
        filterMapEl,
        listFormatEl,
        listSortEl,
        mapLayersEl,
        mapOverlaysEl,
        timezoneEl;

    // create sections
    autoUpdateEl = document.createElement('section');
    feedsEl = document.createElement('section');
    filterMapEl = document.createElement('section');
    listFormatEl = document.createElement('section');
    listSortEl = document.createElement('section');
    mapLayersEl = document.createElement('section');
    mapOverlaysEl = document.createElement('section');
    timezoneEl = document.createElement('section');

    // append sections to _this.content
    _this.content.appendChild(autoUpdateEl);
    _this.content.appendChild(feedsEl);
    _this.content.appendChild(filterMapEl);
    _this.content.appendChild(listFormatEl);
    _this.content.appendChild(listSortEl);
    _this.content.appendChild(mapLayersEl);
    _this.content.appendChild(mapOverlaysEl);
    _this.content.appendChild(timezoneEl);

    // build options views
    RadioOptionsView({
      el: feedsEl,
      collection: Config().options.feed,
      model: _this.model,
      title: 'Earthquakes',
      watchProperty: 'feeds'
    });

    RadioOptionsView({
      el: listFormatEl,
      collection: Config().options.listFormat,
      model: _this.model,
      title: 'List Format',
      watchProperty: 'listFormats'
    });

    RadioOptionsView({
      el: listSortEl,
      collection: Config().options.sort,
      model: _this.model,
      title: 'List Sort Order',
      watchProperty: 'sorts'
    });

    RadioOptionsView({
      el: mapLayersEl,
      collection: Config().options.basemap,
      model: _this.model,
      title: 'Map Layers',
      watchProperty: 'basemaps'
    });

    CheckboxOptionsView({
      el: mapOverlaysEl,
      collection: Config().options.overlays,
      model: _this.model,
      watchProperty: 'overlays'
    });

  };

  _this.renderFooter = function () {
    // TODO, anything??
  };

  _this.renderHeader = function () {
    _this.header.innerHTML = '<h3>Settings</h3>' +
        '<small>Bookmark to return to map/list with the same settings</small>';
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = SettingsView;
