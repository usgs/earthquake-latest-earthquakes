/* global chai, describe, it */
'use strict';


var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    CheckboxOptionsView = require('settings/CheckboxOptionsView');


var expect = chai.expect;

var checkboxOptionsView;

describe('CheckboxOptionsView', function () {

  beforeAll(function () {
    checkboxOptionsView = CheckboxOptionsView({
      el: document.createElement('div'),
      collection: Collection([
        Model({
          'id': 'id-1',
          'name': 'Option 1'
        }),
        Model({
          'id': 'id-2',
          'name': 'Option 2'
        }),
        Model({
          'id': 'id-3',
          'name': 'Option 3'
        })
      ]),
      model: Model({
        'overlays': 'id-3'
      }),
      section: 'overlays'
    });
  });

  afterAll(function () {
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
    };
  });

  describe('deselectAll', function () {
    it('deselects all checkbox options', function () {
      var input;

      checkboxOptionsView.deselectAll();
      input = checkboxOptionsView.el.querySelector('input:checked');

      expect(input.getAttribute('id')).to.be.undefined;
    });
  });

  describe('setSelected', function () {
    it('selects the correct checkbox option', function () {
      var input;

      input = [];
      checkboxOptionsView.setSelected([
        {'id': 'id-1'},
        {'id': 'id-2'}
      ]);
      input = checkboxOptionsView.el.querySelectorAll('input:checked');

      expect(input.length).to.equal(2);
      expect(input[0].getAttribute('id')).to.equal('id-1');
      expect(input[1].getAttribute('id')).to.equal('id-2');
    });
  });
});