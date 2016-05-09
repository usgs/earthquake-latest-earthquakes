/* global chai, describe, it, sinon */
'use strict';


var Catalog = require('latesteqs/Catalog'),
    ListView = require('list/ListView'),
    Model = require('mvc/Model');


var expect = chai.expect;


describe('list/ListView', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof ListView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(ListView).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      var view;

      view = ListView();

      expect(view.destroy).to.not.throw(Error);
    });
  });

  describe('createCollectionItemContent', function () {
    it('tries to use the listFormat from the model', function () {
      var view;

      view = ListView();
      sinon.spy(view.model, 'get');

      view.createCollectionItemContent();
      expect(view.model.get.callCount).to.equal(1);

      view.model.get.restore();
      view.destroy();
    });

    it('delegates to the listFormat', function () {
      var feed,
          listFormat,
          view;

      view = ListView();
      listFormat = {
        format: {
          format: sinon.spy()
        }
      };
      feed = {
        'id': '7day_m25',
        'name' : '7 Days, Magnitude 2.5+ Worldwide',
        'url' : '/earthquakes/feed/v1.0/summary/2.5_week.geojson',
        'autoUpdate': 60 * 1000
      };

      view.model.set({
        'feed': feed,
        'listFormat': listFormat
      });
      view.createCollectionItemContent();

      expect(listFormat.format.format.callCount).to.equal(1);

      view.destroy();
    });
  });

  describe('renderFooter', function () {
    it('creates footer markup as expected', function () {
      var view;

      view = ListView();
      view.renderFooter();

      expect(view.footer.innerHTML).to.not.equal('');
      expect(view.footer.querySelectorAll('li').length).to.equal(3);

      view.destroy();
    });
  });

  describe('renderHeader', function () {
    it('creates header markup as expected', function (done) {
      var catalog,
          view;

      catalog = Catalog();

      view = ListView({
        collection: catalog,
        model: Model({
          feed: {
            'id': '7day_m25',
            'name' : '7 Days, Magnitude 2.5+ Worldwide',
            'url' : '/earthquakes/feed/v1.0/summary/2.5_week.geojson',
            'autoUpdate': 60 * 1000
          }
        })
      });

      catalog.on('reset', function () {
        expect(view.header.querySelector('.header-title').innerHTML).to.equal('7 Days, Magnitude 2.5+ Worldwide');
        expect(view.header.querySelector('.header-count').innerHTML).to.equal('245 earthquakes.');
        expect(view.header.querySelector('.header-update-time').innerHTML).to.equal('Updated: 2016-04-12 21:50:46 (UTC)');

        view.destroy();
        done();
      });

      catalog.loadUrl('/feeds/2.5_week.json');

    });
  });

  describe('formatCountInfo', function () {
    var view;

    view = ListView();

    it('shows X of Y earthquakes if restrict is true', function () {
      expect(view.formatCountInfo(9, 3, true)).to.equal('3 of 9 earthquakes in map area.');
    });

    it('shows Y earthquakes if restrict is False', function () {
      expect(view.formatCountInfo(9, 3, false)).to.equal('9 earthquakes.');
    });

    view.destroy();
  });

  describe('boundsContain', function () {
    var bounds,
        view;

    view = ListView();
    bounds = [
      [10, -130], // southwest
      [30, -110] // northeast
    ];

    it('contains the point', function () {
      expect(view.boundsContain(bounds, [20, -120])).to.be.true;
      expect(view.boundsContain(bounds, [10, -120])).to.be.true;
      expect(view.boundsContain(bounds, [20, -130])).to.be.true;
    });

    it('does NOT contain the point', function () {
      expect(view.boundsContain(bounds, [40, -140])).to.be.false;
      expect(view.boundsContain(bounds, [40, -120])).to.be.false;
      expect(view.boundsContain(bounds, [20, -140])).to.be.false;
    });

    view.destroy();
  });

  describe('filterEvents', function () {
    var data,
        bounds,
        model,
        view;

    model = Model({
      'mapposition': [
        [10, -130], // southwest
        [30, -110] // northeast
      ]
    });

    view = ListView({
      model: model
    });

    data = [
      {
        geometry: {
          coordinates: [
            -120, 20, 0
          ]
        }
      },
      {
        geometry: {
          coordinates: [
            -155, 65, 0
          ]
        }
      }
    ];

    it('filters events', function () {
      view.mapEnabled = true;
      expect(view.filterEvents(data).length).to.equal(1);
    });

    it('does NOT filter events when the map is disabled', function () {
      view.mapEnabled = false;
      model.set({
        'viewModes': [{'id': 'list'}]
      });
      expect(view.filterEvents(data).length).to.equal(2);
    });
  });

  describe('onCollectionReset', function () {
    var spy,
        stub,
        view;

    view = ListView();
    stub = sinon.stub(view, 'render', function () {} );
    spy = sinon.spy(view, 'onCollectionReset');
    view.collection.reset(['a', 'b', 'c']);

    it('is triggered by a collection reset', function () {
      expect(spy.callCount).to.equal(1);
    });

    spy.restore();
    view.destroy();
  });

  describe('onMapPositionChange', function () {
    var bounds,
        spy,
        view;

    view = ListView();
    spy = sinon.spy(view, 'onMapPositionChange');

    // restrict list to map, by enabling restrictListToMap
    view.model.set({
      'restrictListToMap': [{'id': 'restrictListToMap'}]
    });

    // update bounds with change:mapposition on model
    bounds = [[20, -20],[22, -22]];
    view.model.set({
      'mapposition': bounds
    });

    it('is triggered by a map position change', function () {
      expect(spy.secondCall.args[0]).to.equal(bounds);
    });

    spy.restore();
    view.destroy();
  });

  describe('onRestrictListToMap', function () {
    var spy,
        view;

    view = ListView();
    spy = sinon.spy(view, 'onRestrictListToMap');
    view.model.set({
      'restrictListToMap': []
    });

    it('is triggered by a setting change', function () {
      expect(spy.callCount).to.equal(1);
    });

    spy.restore();
    view.destroy();
  });

});
