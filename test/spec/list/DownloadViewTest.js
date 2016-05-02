/* global chai, describe, it */
'use strict';

var Catalog = require('latesteqs/Catalog'),
    DownloadView = require('list/DownloadView'),
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
      var catalog,
          view;

      catalog = Catalog();
      catalog.loadUrl('/feeds/2.5_week.geojson');
      view = DownloadView({
        model: catalog.model,
        collection: catalog
      });

      /* jshint -W030 */
      expect(view._formats).to.not.be.null;
      /* jshint +W030 */
    });
  });

  describe('render', function () {
    it('displays completed anchors', function () {
      var catalog,
          model,
          elements,
          view;

      model = Model({
        metadata:
        {
          url:
          'earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
        }
      });

      catalog = Catalog();
      catalog.metadata = {
          url:
          'earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson'
        };

      view = DownloadView({collection: catalog});

      view.render();
      elements = view.el.querySelectorAll('.download');
      expect(elements[0].text).to.equal('ATOM');
      expect(elements[1].href).to.equal(
        'http://localhost:8061/earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv');
    });
  });

});
