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

  describe.skip('createSkeleton', function () {
    it('creates expected compontents', function () {
      var view;

      view = ListView();
      view.createSkeleton();

      /* jshint -W030 */
      expect(view.el.querySelector('.list-view-header')).to.not.be.null;
      expect(view.el.querySelector('.list-view-content')).to.not.be.null;
      expect(view.el.querySelector('.list-view-footer')).to.not.be.null;
      /* jshint +W030 */

      view.destroy();
    });
  });

  describe.skip('getClickedItem', function () {
    it('finds the correct item', function () {
      var clickTarget,
          container,
          expectedResult,
          result,
          view;

      view = ListView();
      container = document.createElement('div');
      container.innerHTML = [
        '<div>',
          '<h2></h2>',
          '<div>',
            '<ul>',
              '<li class="list-view-list-item">',
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
      expectedResult = container.querySelector('.list-view-list-item');

      result = view.getClickedItem(clickTarget, container);
      expect(result).to.equal(expectedResult);

      view.destroy();
    });
  });

  describe.skip('onListClick', function () {
    // TODO
  });

  describe.skip('render', function () {
    it('calls sub-render methods', function () {
      var view;

      view = ListView();

      sinon.spy(view, 'renderHeader');
      sinon.spy(view, 'renderContent');
      sinon.spy(view, 'renderFooter');

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

  describe.skip('renderContent', function () {
    // TODO
  });

  describe.skip('renderFooter', function () {
    // TODO
  });

  describe.skip('renderHeader', function () {
    // TODO
  });
});
