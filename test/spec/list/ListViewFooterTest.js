/* global before, chai, describe, it */
'use strict';

var ListViewFooter = require('list/ListViewFooter');

var expect = chai.expect;

describe('list/ListViewFooter', function () {
  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof ListViewFooter).to.equal('function');
    });
  });

  describe('listFooterMarkup', function () {
    var footerView;

    before(function() {
      footerView = ListViewFooter();
    });

    it('returns markup', function () {
      expect(footerView.listFooterMarkup()).to.not.equal(null);
    });
  });
});
