/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';


var Collection = require('mvc/Collection'),
    GenericCollectionView = require('core/GenericCollectionView');


var expect = chai.expect;


describe('core/GenericCollectionView', function () {
  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof GenericCollectionView).to.equal('function');
    });

    it('can be instantiated', function () {
        expect(GenericCollectionView).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      var view;

      view = GenericCollectionView();

      expect(view.destroy).to.not.throw(Error);
    });

    it('creates the scaffolding', function () {
      var view;

      view = GenericCollectionView();

      expect(view.header).to.be.instanceOf(HTMLElement);
      expect(view.content).to.be.instanceOf(HTMLElement);
      expect(view.footer).to.be.instanceOf(HTMLElement);

      view.destroy();
    });
  });

  describe('createCollectionContainer', function () {
    it('returns an HTMLElement', function () {
      var result,
          view;

      view = GenericCollectionView();
      result = view.createCollectionContainer();

      expect(result).to.be.instanceOf(HTMLElement);
    });
  });

  describe('createCollectionItem', function () {
    var view;

    afterEach(function () {
      view.destroy();
    });

    beforeEach(function () {
      view = GenericCollectionView();
    });


    it('returns an HTMLElement', function () {
      var result;

      result = view.createCollectionItem();
      expect(result).to.be.instanceOf(HTMLElement);
    });

    it('returns an element with a data-id attribute', function () {
      var id,
          result;

      id = 'expected-id';
      result = view.createCollectionItem({id: id});
      expect(result.getAttribute('data-id')).to.equal(id);
    });

    it('calls sub-method to create content', function () {
      sinon.spy(view, 'createCollectionItemContent');

      view.createCollectionItem({});
      expect(view.createCollectionItemContent.callCount).to.equal(1);

      view.createCollectionItemContent.restore();
    });
  });

  describe('createCollectionItemContent', function () {
    it('returns an HTMLElement', function () {
      var result,
          view;

      view = GenericCollectionView();
      result = view.createCollectionItemContent();

      expect(result).to.be.instanceOf(HTMLElement);
      view.destroy();
    });
  });

  describe('getClickedItem', function () {
    it('finds the correct item', function () {
      var clickTarget,
          container,
          expectedResult,
          result,
          view;

      view = GenericCollectionView();
      container = document.createElement('div');
      container.innerHTML = [
        '<div>',
          '<h2></h2>',
          '<div>',
            '<ul>',
              '<li class="generic-collection-view-item">',
                '<ol>',
                  '<li>',
                    '<span class="click-target"></span>',
                  '</li>',
                '</ol>',
              '</li>',
            '</ul>',
          '</div>',
        '</div>'
      ];

      clickTarget = container.querySelector('.click-target');
      expectedResult = container.querySelector('.generic-collection-view-item');

      result = view.getClickedItem(clickTarget, container);
      expect(result).to.equal(expectedResult);

      view.destroy();
    });
  });

  describe('onContentClick', function () {
    it('finds the item and sets the property', function () {
      var spy,
          stub,
          view;

      view = GenericCollectionView({
        watchProperty: 'test-property'
      });

      stub = sinon.stub(view, 'getClickedItem', function () {
        var item;

        item = document.createElement('div');
        item.setAttribute('data-id', 'expected-element');

        return item;
      });

      spy = sinon.spy(view.model, 'set');

      view.onContentClick({target: true});

      expect(stub.callCount).to.equal(1);
      expect(spy.callCount).to.equal(1);
      expect(spy.calledWith({'test-property': 'expected-element'}));

      stub.restore();
      spy.restore();
      view.destroy();
    });
  });

  describe('onEvent', function () {
    it('calls sub-methods appropriately', function () {
      var createView,
          destroyView,
          view;

      createView = function (params) {
        view = GenericCollectionView(params);
        sinon.spy(view.model, 'get');
        sinon.spy(view, 'deselectAll');
        sinon.spy(view, 'setSelected');
      };

      destroyView = function () {
        view.model.get.restore();
        view.deselectAll.restore();
        view.setSelected.restore();
        view.destroy();
      };

      createView();
      view.onEvent();

      // Nothing should happen yet because not watching anything
      expect(view.model.get.callCount).to.equal(0);
      expect(view.deselectAll.callCount).to.equal(0);
      expect(view.setSelected.callCount).to.equal(0);

      destroyView();
      createView({watchProperty: 'example-property'});
      view.onEvent();

      // Should be called now ...
      expect(view.model.get.callCount).to.equal(1);
      expect(view.deselectAll.callCount).to.equal(1);
      expect(view.setSelected.callCount).to.equal(1);
    });
  });

  describe('render', function () {
    it('calls sub-methods', function () {
      var view;

      view = GenericCollectionView();

      sinon.stub(view, 'renderHeader');
      sinon.stub(view, 'renderContent');
      sinon.stub(view, 'renderFooter');

      view.render();

      expect(view.renderHeader.callCount).to.equal(1);
      expect(view.renderContent.callCount).to.equal(1);
      expect(view.renderFooter.callCount).to.equal(1);

      view.renderHeader.restore();
      view.renderContent.restore();
      view.renderFooter.restore();
      view.destroy();
    });
  });

  describe('renderContent', function () {
    it('renders a no data message', function () {
      var noDataMessage,
          view;

      noDataMessage = 'No Data';
      view = GenericCollectionView({noDataMessage: noDataMessage});
      view.renderContent();

      expect(view.content.innerHTML).to.equal([
        '<p class="alert info">',
          noDataMessage,
        '</p>'
      ].join(''));

      view.destroy();
    });

    it('does not throw an error', function () {
      var originalCollection,
          view;

      view = GenericCollectionView();
      originalCollection = view.collection;
      view.collection = null; // To trigger an error

      expect(view.renderContent).to.not.throw(Error);
      expect(view.content.querySelectorAll('.error').length).to.equal(1);

      view.collection = originalCollection;
      view.destroy();
    });

    it('creates content and ensures selected', function () {
      var collection,
          view;

      collection = Collection([
        {'id': 'item-1', 'value': 'value-1'},
        {'id': 'item-2', 'value': 'value-2'},
        {'id': 'item-3', 'value': 'value-3'}
      ]);

      view = GenericCollectionView({collection: collection});
      sinon.spy(view, 'createCollectionContainer');
      sinon.spy(view, 'createCollectionItem');
      sinon.spy(view, 'onEvent');
      view.renderContent();

      expect(view.createCollectionContainer.callCount).to.equal(1);
      expect(view.createCollectionItem.callCount).to.equal(3);
      expect(view.onEvent.callCount).to.equal(1);
      expect(view.content.querySelectorAll('li').length).to.equal(3);

      view.destroy();
    });
  });

  describe('renderFooter', function () {
    it('has such a method and does nothing', function () {
      var view;

      view = GenericCollectionView();

      expect(view).to.respondTo('renderFooter');
      view.renderFooter();
      expect(view.footer.innerHTML).to.equal('');

      view.destroy();
    });
  });

  describe('renderHeader', function () {
    it('has such a method and does nothing', function () {
      var view;

      view = GenericCollectionView();

      expect(view).to.respondTo('renderHeader');
      view.renderHeader();
      expect(view.header.innerHTML).to.equal('');

      view.destroy();
    });
  });

  describe('setSelected', function () {
    it('adds the selected class to the correct item', function () {
      var view;

      view = GenericCollectionView();
      view.content.innerHTML = [
        '<span data-id="item-1">Item 2</span>',
        '<span data-id="item-2">Item 2</span>',
        '<span data-id="item-3">Item 3</span>'
      ];

      view.setSelected({'id': 'item-2'});

      expect(view.content.querySelectorAll('.selected').length).to.equal(1);
      expect(view.content.querySelector('.selected').getAttribute('data-id'))
          .to.equal('item-2');

      view.destroy();
    });
  });
});
