/* global chai, describe, it, sinon */
'use strict';


var Catalog = require('latesteqs/Catalog'),
    ListView = require('list/ListView');


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
      var listFormat,
          view;

      view = ListView();
      listFormat = {
        format: {
          format: sinon.spy()
        }
      };

      view.model.set({'listFormat': listFormat});
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
        collection: catalog
      });

      catalog.on('reset', function () {
        expect(view.header.querySelector('.header-title').innerHTML).to.equal('USGS Magnitude 2.5+ Earthquakes, Past Week');
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
});
