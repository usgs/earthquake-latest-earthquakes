/* global chai, describe, it, sinon */
'use strict';


var Catalog = require('latesteqs/Catalog'),
    Collection = require('mvc/Collection'),
    MetadataView = require('list/MetadataView'),
    Model = require('mvc/Model');


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

  describe('displaySearchParameters', function () {
    it('creates list of search parameters from feed', function (done) {
      var catalog,
          view;

      catalog = Catalog();
      catalog.loadUrl('/feeds/2.5_week.geojson');

      view = MetadataView({
        collection: catalog,
        model: Model({
          feed: {
            'id': '123456789',
            'name' : 'Search Results',
            'isSearch': true,
            'params': {
              'test1': 'value1',
              'test2': 'value2',
              'test3': 'value3',
              'test4': 'value4'
            }
          }
        })
      });

      catalog.on('reset', function () {
        expect(view.el.querySelectorAll('.feed-metadata-list dt').length)
            .to.equal(1);
        expect(view.el.querySelectorAll('.search-parameter-list dt').length)
            .to.equal(4);

        view.destroy();
        done();
      });
    });
  });

  describe('formatCountInfo', function () {
    var view;

    view = MetadataView();

    it('shows X of Y earthquakes if restrict is true', function () {
      expect(view.formatCountInfo(9, 3, true)).to.equal('3 of 9 earthquakes in map area.');
    });

    it('shows Y earthquakes if restrict is False', function () {
      expect(view.formatCountInfo(9, 3, false)).to.equal('9 earthquakes.');
    });

    view.destroy();
  });

  describe('onButtonClick', function () {
    it('shows the modal dialog', function () {
      var stub,
          view;

      view = MetadataView({
        collection: Collection(),
        model: Model()
      });

      stub = sinon.stub(view.downloadModal, 'show', function () { return; });
      view.onButtonClick();

      expect(stub.callCount).to.equal(1);
    });
  });

  describe('onSearchButtonClick', function () {
    it('calls setWindowLocation', function () {
      var stub,
          view;

      view = MetadataView({
        collection: Collection(),
        model: Model()
      });

      stub = sinon.stub(view, 'setWindowLocation', function () { return; });
      view.onSearchButtonClick();

      expect(stub.callCount).to.equal(1);
    });
  });

  describe('onSearchButtonClick', function () {
    it('calls setWindowLocation', function () {
      var url,
          view;

      view = MetadataView({
        collection: Collection(),
        model: Model()
      });

      url = '#test';
      view.setWindowLocation(url);

      expect(window.location.hash).to.equal('#test');
    });
  });

  describe('render', function () {
    it('shows the metadata view', function (done) {
      var catalog,
          countStub,
          displayStub,
          dateTimeStub,
          view;

      catalog = Catalog();
      catalog.loadUrl('/feeds/2.5_week.geojson');
      catalog.metadata = {
        count: 72,
        generated: 1500572838000
      };

      view = MetadataView({
        collection: catalog,
        model: Model({
          feed: {
            'id': '123456789',
            'name' : 'Search Results',
            'isSearch': true,
            'params': {
              'test1': 'value1',
              'test2': 'value2',
              'test3': 'value3',
              'test4': 'value4'
            }
          }
        })
      });

      countStub = sinon.stub(view, 'formatCountInfo', function () {
        return;
      });

      dateTimeStub = sinon.stub(view.formatter, 'datetime', function () {
        return;
      });

      displayStub = sinon.stub(view, 'displaySearchParameters', function () {
        return;
      });

      view.render();

      catalog.on('reset', function () {
        expect(countStub.called).to.equal(true);
        expect(dateTimeStub.called).to.equal(true);
        expect(displayStub.called).to.equal(true);
        expect(view.downloadTitleEl.innerHTML).to.equal('Search Results');
        expect(view.titleEl.innerHTML).to.equal('Search Results');
        done();
      });
    });
  });





});
