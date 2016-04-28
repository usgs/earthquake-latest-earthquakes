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
  });

  describe('setSelected', function () {
    it('ssets selected class', function () {
      modesView.setSelected();
      expect(modesView.el.classList.contains('selected'));
    });
  });

  describe('updateModel', function () {
    it('deselects mode in  the model', function () {
      modesView.updateModel({id: 'help'});

      var modes = modesView.model.get('viewModes');

      expect(modes.length).to.equal(0);
    });

    it('selects a mode in the model', function () {
      modesView.updateModel({id: 'settings'});

      var modes = modesView.model.get('viewModes');

      expect(modes.length).to.equal(2);
      expect(modes[0].id).to.equal('help');
      expect(modes[1].id).to.equal('settings');
    });
  });
});
