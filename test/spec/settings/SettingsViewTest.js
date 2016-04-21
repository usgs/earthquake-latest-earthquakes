/* global chai, describe, it */
'use strict';


var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    SettingsView = require('settings/SettingsView');


var expect = chai.expect;

describe('SettingsView', function () {

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof SettingsView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(SettingsView).to.not.throw(Error);
    });
  });
});