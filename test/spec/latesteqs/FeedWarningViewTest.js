/*global chai, describe, it, sinon */
'use strict';

var FeedWarningView = require('latesteqs/FeedWarningView');

var expect = chai.expect;

describe('latesteqs/FeedWarningView', function () {
  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof FeedWarningView).to.equal('function');
    });
  });

  describe('getDialogModifySearchAction', function () {
    it('returns a paragraph', function () {
      var helpText,
          p;

      helpText = 'HelpText';
      p = FeedWarningView().getDialogModifySearchAction(helpText);

      expect(p.innerHTML).to.contain('catalog-anchor');
      expect(p.innerHTML).to.contain(helpText);
    });
  });

  describe('getDialogRevertAction', function () {
    it('returns a paragraph', function () {
      var app,
          dialog,
          spy,
          p;

      app = {};
      dialog = {};
      app.revertToDefaultFeed = function() {};
      dialog.hide = function() {};
      p = FeedWarningView({app: app}).getDialogRevertAction(dialog);
      spy = sinon.spy(app, 'revertToDefaultFeed');

      expect(p.innerHTML).to.contain('catalog-revert-wrapper');
      p.querySelector('.revert').click();
      expect(spy.callCount).to.equal(1);
    });
  });

  describe('showClientMaxError', function () {
    it('creates a dialog', function () {
      var app,
          button,
          feedWarningView,
          data,
          dialog,
          spy;

      app = {};
      feedWarningView = FeedWarningView();
      data = {};
      app.callback = function () {};
      spy = sinon.spy(app, 'callback');
      feedWarningView.showClientMaxError(app.callback, data);
      dialog = document.querySelector('.modal');
      /* jshint -W030 */
      expect(dialog).to.not.be.null;
      /* jshint +W030 */
      button = document.querySelector('.modal-footer > button');
      button.click();
      expect(spy.callCount).to.equal(1);
    });
  });

  describe('showServerMaxError', function () {
    it('creates a dialog', function () {
      var app,
          button,
          feedWarningView,
          data,
          dialog;

      app = {};
      app.revertToDefaultFeed = function () {};
      feedWarningView = FeedWarningView({app: app});
      data = {
        count: 20001,
        maxAllowed: 20000
      };

      feedWarningView.showServerMaxError(data);
      dialog = document.querySelector('.modal');
      /* jshint -W030 */
      expect(dialog).to.not.be.null;
      /* jshint +W030 */

      button = document.querySelector('.revert');
      button.click();
    });
  });

});
