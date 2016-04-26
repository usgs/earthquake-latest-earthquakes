/* global chai, describe, it, sinon */
'use strict';


var ListView = require('list/ListView');


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
    });
  });

  describe.skip('renderHeader', function () {
    it('works as expected', function () {
      // TODO :: usgs/earthquake-latest-earthquakes#63
    });
  });
});
