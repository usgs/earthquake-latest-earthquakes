/* global before, chai, describe, it */
'use strict';

var HelpView = require('help/HelpView');

var expect = chai.expect;

describe.skip('help/HelpView', function () {
  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof HelpView).to.equal('function');
    });
  });

  describe('Help View', function () {
    var view;

    before(function () {
      view = HelpView();
    });

    it('returns markup', function () {
      expect(view.helpView()).to.not.equal(null);
    });
  });
});
