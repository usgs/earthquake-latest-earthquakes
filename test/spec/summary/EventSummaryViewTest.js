/* global afterEach, beforeEach, chai, describe, it, sinon */
'use strict';

var EventSummaryView = require('summary/EventSummaryView'),
    Model = require('mvc/Model');

var expect = chai.expect;

describe('summary/EventSummaryView', function () {
  var model,
      view;

  afterEach(function () {
    try {
      view.destroy();
    } catch (e) {
      /* Ignore, already destroyed */
    }
  });

  beforeEach(function () {
    model = Model({});
    view = EventSummaryView({
      model: model
    });
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof EventSummaryView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(EventSummaryView).to.not.throw(Error);
    });
  });

  describe('deselectEvent', function () {
    it('deselects the currently selected event on the model', function () {
      var eq;

      sinon.stub(view, 'render', function () {});
      eq = {'id': 'us1234'};
      model.set({
        'event': eq
      });

      expect(model.get('event').id).to.equal(eq.id);
      view.deselectEvent();
      expect(model.get('event')).to.equal(null);
    });
  });

  describe('hideEventSummary', function () {
    it('hides EventSummaryView.el', function () {

      view.el.classList.add('show');
      expect(view.el.className).to.equal('show');

      view.hideEventSummary();
      expect(view.el.className).to.equal('');
    });
  });

  describe('showEventSummary', function () {
    it('shows EventSummaryView.el', function () {

      expect(view.el.classList.contains('show')).to.equal(false);

      view.showEventSummary();
      expect(view.el.classList.contains('show')).to.equal(true);
    });
  });

  describe('render', function () {
    it('displays the currently selected event', function () {
      var spy;

      spy = sinon.spy(view, 'render');
      model.set({
        'event': {
          'id': 'us1234',
          'properties': {},
          'geometry': {
            'coordinates': []
          }
        }
      });

      expect(spy.callCount).to.equal(1);
      expect(view.el.querySelectorAll('button').length).to.equal(1);
    });
  });

});
