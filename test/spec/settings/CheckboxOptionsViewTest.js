/* global afterEach, beforeEach, chai, describe, it */
'use strict';


var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    CheckboxOptionsView = require('settings/CheckboxOptionsView');


var expect = chai.expect;

var checkboxOptionsView;

describe('CheckboxOptionsView', function () {

  beforeEach(function () {
    checkboxOptionsView = CheckboxOptionsView({
      el: document.createElement('div'),
      collection: Collection([
        {
          'id': 1,
          'name': 'Option 1'
        },
        {
          'id': 2,
          'name': 'Option 2'
        },
        {
          'id': 3,
          'name': 'Option 3'
        }
      ]),
      model: Model({
        'overlays': [{id: 3}]
      }),
      watchProperty: 'overlays'
    });
  });

  afterEach(function () {
    checkboxOptionsView.destroy();
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof CheckboxOptionsView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(CheckboxOptionsView).to.not.throw(Error);
    });
  });

  describe('render', function () {
    it('creates a list of checkbox options', function () {
      var options;

      options = [];
      options = checkboxOptionsView.el.querySelectorAll('input[type=checkbox]');

      expect(options.length).to.be.equal(3);
    });

    it('selects an input based on the model value', function () {
      var input;

      input = checkboxOptionsView.el.querySelector('input:checked');

      expect(input.getAttribute('id')).to.be.equal('id-3');
    });
  });

  describe('deselectAll', function () {
    it('deselects all checkbox options', function () {
      var input;

      checkboxOptionsView.deselectAll();
      input = checkboxOptionsView.el.querySelector('input:checked');

      expect(input).to.be.equal(null);
    });
  });

  describe('setSelected', function () {
    it('selects the correct checkbox option', function () {
      var input;

      input = [];
      checkboxOptionsView.deselectAll();
      checkboxOptionsView.setSelected([
        {'id': 1},
        {'id': 2}
      ]);
      input = checkboxOptionsView.el.querySelectorAll('input:checked');

      expect(input.length).to.equal(2);
      expect(input[0].getAttribute('id')).to.equal('id-1');
      expect(input[1].getAttribute('id')).to.equal('id-2');
    });
  });
});