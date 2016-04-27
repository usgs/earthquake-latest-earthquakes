'use strict';

var Config = require('latesteqs/LatestEarthquakesConfig'),
    Model = require('mvc/Model'),
    SettingsView = require('settings/SettingsView');

var autoUpdate,
    basemaps,
    feeds,
    listFormats,
    overlays,
    restrictListToMap,
    sorts,
    timezone,
    config,
    el,
    settingsView;

config = Config();
el = document.querySelector('#settings-view-example');

autoUpdate = config.options.autoUpdate.data();
basemaps = config.options.basemap.data();
feeds = config.options.feed.data();
listFormats = config.options.listFormat.data();
overlays = config.options.overlays.data();
restrictListToMap = config.options.restrictListToMap.data();
sorts = config.options.sort.data();
timezone = config.options.timezone.data();

settingsView = SettingsView({
  el: el,
  config: Config(),
  model: Model({
    'autoUpdate': [autoUpdate[0]],
    'basemap': basemaps[1],
    'feed': feeds[1],
    'restrictListToMap': [restrictListToMap[0]],
    'listFormat': listFormats[1],
    'overlay': [overlays[1],overlays[2]],
    'sort': sorts[1],
    'timezone': timezone[1]
  })
});

settingsView.render();
