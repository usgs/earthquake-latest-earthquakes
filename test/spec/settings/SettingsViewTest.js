/* global afterEach, beforeEach, chai, describe, it */
'use strict';


var Collection = require('mvc/Collection'),
    LatestEarthquakesConfig = require('latesteqs/LatestEarthquakesConfig'),
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
      var content,
          views;

      content = settingsView.el.querySelector('.settings-content');
      views = content.querySelectorAll('section');
      expect(views.length).to.equal(8);
    });
  });

});