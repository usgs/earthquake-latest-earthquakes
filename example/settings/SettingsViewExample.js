'use strict';

var Config = require('latesteqs/Config'),
    Model = require('mvc/Model'),
    SettingsView = require('settings/SettingsView');

var el,
    settingsView;

el = document.querySelector('#settings-view-example');

settingsView = SettingsView({
  el: el,
  config: Config(),
  model: Model({
    'basemaps': {id: 'terrain'},
    'feeds': {id: '7day_m25'},
    'listFormats': {id: 'dyfi'},
    'overlays': [{id: 'faults'}, {id: 'ushazard'}],
    'sorts': {id: 'oldest'},
    'timezones': {id: 'local'}
  })
});

settingsView.render();
