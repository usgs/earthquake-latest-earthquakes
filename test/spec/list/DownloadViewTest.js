/* global chai, describe, it */
'use strict';

var DownloadView = require('list/DownloadView'),
    Model = require('mvc/Model');

var expect = chai.expect;

describe('list/DownloadView', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof DownloadView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(DownloadView).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      var view;

      view = DownloadView();

      expect(view.destroy).to.not.throw(Error);
    });
  });

  describe('initialize', function () {
    it('displays list', function () {
      var view;

      view = DownloadView();

      expect(view.el.querySelector('.csv').text).to.equal(
          'CSV');
    });
  });

  describe('render', function () {
    it('displays completed anchors', function () {
      var model,
          view;

      model = Model({
        metadata:
        {
          url:
          'earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
        }
      });

      view = DownloadView({model:model});

      view.render();
      expect(view.el.querySelector('.csv').href).to.equal(
        'http://localhost:8061/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv');
    });
  });

});
