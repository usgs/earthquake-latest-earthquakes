/* global afterEach, beforeEach, chai, describe, it. sinon */
'use strict';

var LatestEarthquakes = require('latesteqs/LatestEarthquakes'),
    ModalView = require('mvc/ModalView'),
    Model = require('mvc/Model');

var expect = chai.expect;

var latestEarthquakes,
    model;

model = Model({
  'viewModes': [
    {
      'id': 'settings',
      'name': 'settings',
      'icon': 'settings'
    },
    {
     'id': 'help',
     'name': 'Help',
     'icon': 'help_outline'
    }
  ]
});

describe.skip('latesteqs/LatestEarthquakes', function () {
  beforeEach(function () {
    try {
      latestEarthquakes = LatestEarthquakes({
        model: model,
        settings: {
          viewModes: [
            'settings',
            'help'
          ]
        }
      });
    } catch (e) {
      console.log(e.stack);
    }
  });

  afterEach(function () {
    try {
      latestEarthquakes.destroy();
    } catch (e) {

    }
  });

  describe('onModalHide', function () {
    it('updates the model correctly', function () {
      latestEarthquakes.onModalHide();
      expect(model.get('viewModes').length).to.equal(1);
      expect(model.get('viewModes')[0].id).to.equal('settings');
    });
  });

  describe('setMode', function () {
    it('sets mode correctly', function () {
      latestEarthquakes.setMode('help', true);
      /* jshint -W030 */
      expect(latestEarthquakes.el.querySelector('.latest-earthquakes-content')
          .classList.contains('mode-help')).to.be.true;
      /* jshint +W030 */
      /* jshint -W030 */
      //expect(latestEarthquakes.el.querySelector('.mode-help')).to.not.be.null;
      /* jshint +W030 */
    });

    it('does not have help mode set', function () {
      latestEarthquakes.setMode('help', false);
      /* jshint -W030 */
      expect(latestEarthquakes.el.querySelector('.latest-earthquakes-content')
          .classList.contains('mode-help')).to.be.false;
      /* jshint +W030 */
    });
  });
});
