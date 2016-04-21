/* global afterEach, beforeEach, chai, describe, it */
'use strict';


var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    RadioOptionsView = require('settings/RadioOptionsView');


var expect = chai.expect;

var radioOptionsView;

describe('RadioOptionsView', function () {

  beforeEach(function () {
    radioOptionsView = RadioOptionsView({
      el: document.createElement('div'),
      collection: Collection([
        {
          'id': 1,
          'name': 'Option 1'
        },
        {
          'id': 2,
          'name': 'Option 2'
        }
      ]),
      model: Model({
        'feeds': {id: 2}
      }),
      watchProperty: 'feeds'
    });
    radioOptionsView.render();
  });

  afterEach(function () {
    radioOptionsView.destroy();
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof RadioOptionsView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(RadioOptionsView).to.not.throw(Error);
    });
  });

  describe('render', function () {
    it('creates a list of checkbox options', function () {
      var options;

      options = [];
      options = radioOptionsView.el.querySelectorAll('input[type=radio]');

      expect(options.length).to.be.equal(2);
    });

    it('selects an input based on the model value', function () {
      var input;

      input = radioOptionsView.el.querySelector('input:checked');

      expect(input.getAttribute('id')).to.be.equal('feeds-2');
    });
  });

  describe('deselectAll', function () {
    it('deselects all checkbox options', function () {
      var input;

      radioOptionsView.deselectAll();
      input = radioOptionsView.el.querySelector('input:checked');

      expect(input).to.be.equal(null);
    });
  });

  describe('setSelected', function () {
    it('selects the correct checkbox option', function () {
      var input;

      input = [];
      radioOptionsView.setSelected({id: 1});
      input = radioOptionsView.el.querySelector('input:checked');

      expect(input.getAttribute('id')).to.equal('feeds-1');
    });
  });
});
