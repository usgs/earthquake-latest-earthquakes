/* global afterEach, beforeEach, chai, describe, it */
'use strict';

var Collection = require('mvc/Collection'),
    Model = require('mvc/Model'),
    ModesView = require('modes/ModesView');

var expect = chai.expect;

var modesView;

describe('modes/ModesView', function () {
  beforeEach(function () {
    modesView = ModesView({
      el: document.createElement('div'),
      collection: Collection([
        {
          'id': 'list',
          'name': 'List',
          'icon': 'list'
        },
        {
          'id': 'map',
          'name': 'Map',
          'icon': 'language'
        },
        {
          'id': 'settings',
          'name': 'settings',
          'icon': 'settings'
        },
        {
          'id': 'help',
          'name': 'Help',
          'icon': 'help_outline'
        }
      ]),
      model: Model({
        'viewModes': [{id: 'help'}]
      }),
      watchProperty: 'viewModes'
    });
    modesView.render();
  });

  afterEach(function () {
    modesView.destroy();
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof ModesView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(ModesView).to.not.throw(Error);
    });
  });

  describe('createCollectionItemContent', function () {
    it('creates icons', function () {
      var options;

      options = [];
      options = modesView.el.querySelectorAll('i');

      expect(options.length).to.be.equal(4);
    });

    it('selects a mode based on the model value', function () {
      var icon;

      icon = modesView.el.querySelector('i');

      expect(icon.innerHTML).to.be.equal('list');
    });
  });

  describe('setSelected', function () {
    it('selects the correct mode', function () {

    })
  });
});
