/* global afterEach, beforeEach, chai, describe, it */
'use strict';

var LatestEarthquakes = require('latesteqs/LatestEarthquakes'),
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
     'name': 'About',
     'icon': 'help_outline'
    }
  ]
});

describe('latesteqs/LatestEarthquakes', function () {
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

  describe('setMode', function () {
    it('sets mode correctly', function () {
      latestEarthquakes.setMode('help', true);
      /* jshint -W030 */
      expect(latestEarthquakes.el.querySelector('.latest-earthquakes-content')
          .classList.contains('mode-help')).to.be.true;
      /* jshint +W030 */
    });

    it('does not have help mode set', function () {
      latestEarthquakes.setMode('settings', false);
      /* jshint -W030 */
      expect(latestEarthquakes.el.querySelector('.latest-earthquakes-content')
          .classList.contains('mode-settings')).to.be.false;
      /* jshint +W030 */
    });
  });
});
