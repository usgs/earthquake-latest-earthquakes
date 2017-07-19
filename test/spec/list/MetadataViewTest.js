/* global chai, describe, it */
'use strict';


// var Catalog = require('latesteqs/Catalog'),
//     Collection = require('mvc/Collection'),
//     MetadataView = require('list/MetadataView'),
//     Model = require('mvc/Model');

var MetadataView = require('list/MetadataView');


var expect = chai.expect;


describe('list/MetadataView', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof MetadataView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(MetadataView).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      var view;

      view = MetadataView();

      expect(view.destroy).to.not.throw(Error);
    });
  });

  // describe('renderHeader', function () {
  //   it('creates header markup as expected', function (done) {
  //     var catalog,
  //         view;

  //     catalog = Catalog({
  //       model: Model({
  //         sort: {
  //           'id': 'newest',
  //           'name' : 'Newest first',
  //           'sort' : function (a, b) {
  //             return b.properties.time - a.properties.time;
  //           }
  //         }
  //       })
  //     });

  //     view = MetadataView({
  //       collection: catalog,
  //       model: Model({
  //         feed: {
  //           'id': '7day_m25',
  //           'name' : '7 Days, Magnitude 2.5+ Worldwide',
  //           'url' : '/earthquakes/feed/v1.0/summary/2.5_week.geojson',
  //           'autoUpdate': 60 * 1000
  //         }
  //       })
  //     });

  //     catalog.on('reset', function () {
  //       expect(view.header.querySelector('.header-title').innerHTML).to.equal('7 Days, Magnitude 2.5+ Worldwide');
  //       expect(view.header.querySelector('.header-count').innerHTML).to.equal('245 earthquakes.');
  //       expect(view.header.querySelector('.header-update-time').innerHTML).to.equal('Updated: 2016-04-12 21:50:46 (UTC)');

  //       view.destroy();
  //       done();
  //     });

  //     catalog.loadUrl('/feeds/2.5_week.json', null, catalog.onLoadSuccess);

  //   });
  // });

  // describe('formatCountInfo', function () {
  //   var view;

  //   view = MetadataView();

  //   it('shows X of Y earthquakes if restrict is true', function () {
  //     expect(view.formatCountInfo(9, 3, true)).to.equal('3 of 9 earthquakes in map area.');
  //   });

  //   it('shows Y earthquakes if restrict is False', function () {
  //     expect(view.formatCountInfo(9, 3, false)).to.equal('9 earthquakes.');
  //   });

  //   view.destroy();
  // });

  // describe('filterEvents', function () {
  //   var data,
  //       model,
  //       view;

  //   model = Model({
  //     'mapposition': [
  //       [10, -130], // southwest
  //       [30, -110] // northeast
  //     ],
  //     'viewModes': [{'id': 'list'}]
  //   });

  //   view = MetadataView({
  //     model: model
  //   });

  //   data = [
  //     {

  //       geometry: {
  //         coordinates: [
  //           -120, 20, 0
  //         ]
  //       }
  //     },
  //     {
  //       geometry: {
  //         coordinates: [
  //           -155, 65, 0
  //         ]
  //       }
  //     }
  //   ];

  //   it('does NOT filter events when the map is disabled', function () {
  //     expect(view.filterEvents(data).length).to.equal(2);
  //   });

  //   it('filters events when a map is enabled', function () {
  //     model.set({
  //       'viewModes': [{'id': 'map'}]
  //     });
  //     expect(view.filterEvents(data).length).to.equal(1);
  //   });
  // });

  // describe('onRestrictListToMap', function () {
  //   var spy,
  //       view;

  //   view = MetadataView();
  //   spy = sinon.spy(view, 'onRestrictListToMap');
  //   view.model.set({
  //     'restrictListToMap': []
  //   });

  //   it('is triggered by a setting change', function () {
  //     expect(spy.callCount).to.equal(1);
  //   });

  //   spy.restore();
  //   view.destroy();
  // });

  // describe('getDataToRender', function () {
  //   it('gets the filtered data from the collection to render', function () {
  //     var collection,
  //         data,
  //         view;

  //     collection = Collection([
  //       {'id': 'item-1', 'value': 'value-1'},
  //       {'id': 'item-2', 'value': 'value-2'},
  //       {'id': 'item-3', 'value': 'value-3'}
  //     ]);

  //     view = MetadataView({collection: collection});
  //     sinon.stub(view, 'filterEvents', function () {
  //       return 'filterEvents';
  //     });

  //     view.filterEnabled = false;
  //     data = view.getDataToRender();
  //     expect(data.length).to.equal(collection.data().length);

  //     view.filterEnabled = true;
  //     data = view.getDataToRender();
  //     expect(data).to.equal('filterEvents');

  //     view.destroy();
  //   });
  // });

});
