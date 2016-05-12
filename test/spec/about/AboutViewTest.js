/* global chai, describe, it */
'use strict';

var AboutView = require('about/AboutView');

var expect = chai.expect;

describe('about/AboutView', function () {
  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof AboutView).to.equal('function');
    });
  });

  describe('About View', function () {
    var view;

    view = AboutView();

    view.render();

    it('Creates markup as expected', function () {
      expect(view.el).to.not.equal('');
      expect(view.el.querySelectorAll('ul').length).to.equal(3);
      expect(view.el.querySelectorAll('li').length).to.equal(13);
      expect(view.el.querySelectorAll('i').length).to.equal(4);
      expect(view.el.querySelectorAll('img').length).to.equal(3);
    });
  });
});
