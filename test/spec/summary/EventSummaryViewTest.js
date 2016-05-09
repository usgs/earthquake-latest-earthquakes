/* global chai, describe, it */
'use strict';

var EventSummaryView = require('summary/EventSummaryView');

var expect = chai.expect;

describe('summary/EventSummaryView', function () {

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof EventSummaryView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(EventSummaryView).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      var view;
      view = EventSummaryView();
      expect(view.destroy).to.not.throw(Error);
    });
  });

});
