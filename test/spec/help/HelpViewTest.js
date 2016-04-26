/* global before, chai, describe, it */
'use strict';

var HelpView = require('help/HelpView');

var expect = chai.expect;

describe('help/HelpView', function () {
  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof HelpView).to.equal('function');
    });
  });

  describe('Help View', function () {
    var view;

    view = HelpView();

    view.render();

    it('Creates markup as expected', function () {
      expect(view.el).to.not.equal('');
      expect(view.el.querySelectorAll('ul').length).to.equal(3);
      expect(view.el.querySelectorAll('li').length).to.equal(12);
      expect(view.el.querySelectorAll('i').length).to.equal(4);
      expect(view.el.querySelectorAll('img').length).to.equal(3);
    });
  });
});
