/* global afterEach, beforeEach, chai, describe, it */
'use strict';


var LatestEarthquakesConfig = require('latesteqs/LatestEarthquakesConfig'),
    Model = require('mvc/Model'),
    SettingsView = require('settings/SettingsView');


var expect = chai.expect;
var settingsView;

describe('SettingsView', function () {

  beforeEach(function () {
    settingsView = SettingsView({
      el: document.createElement('div'),
      config: LatestEarthquakesConfig(),
      model: Model()
    });
    settingsView.render();
  });

  afterEach(function () {
    settingsView.destroy();
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof SettingsView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(SettingsView).to.not.throw(Error);
    });
  });

  describe('render', function () {
    it('generates all requisite checkbox/radio option views', function () {
      var checkboxOptions,
          content,
          radioOptions;

      content = settingsView.el.querySelector('.settings-content');
      checkboxOptions = content.querySelectorAll('.checkbox-options-view-content');
      radioOptions = content.querySelectorAll('.radio-options-view-content');

      expect(checkboxOptions.length).to.equal(3);
      expect(radioOptions.length).to.equal(5);
    });

    it('generates the search button', function () {
      var button,
          content,
          views;

      content = settingsView.el.querySelector('.settings-content');
      button = settingsView.el.querySelector('.search-button');
      views = content.querySelectorAll('section');
      expect(button.nodeName).to.equal('BUTTON');
    });
  });

});
