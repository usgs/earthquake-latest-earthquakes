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
        viewModes: []
      })
    });
  });

  afterEach(function () {
    try {
      modesView.destroy();
    } catch (e) {
      // already destroyed...
    }
  });

  describe('constructor', function () {
    it('is defined', function () {
      expect(typeof ModesView).to.equal('function');
    });

    it('can be instantiated', function () {
      expect(ModesView).to.not.throw(Error);
    });

    it('can be destroyed', function () {
      expect(modesView.destroy).to.not.throw(Error);
    });
  });

  describe('createCollectionItemContent', function () {
    it('creates icons', function () {
      var info,
          result;

      info = {
        id: 'test-icon',
        name: 'Test Icon',
        icon: 'test'
      };

      result = modesView.createCollectionItemContent(info);

      expect(result.nodeName.toUpperCase()).to.equal('I');
      expect(result.classList.contains('material-icons')).to.equal(true);
      expect(result.getAttribute('title')).to.equal(info.name);
      expect(result.innerHTML).to.equal(info.icon);
    });
  });

  describe('setSelected', function () {
    it('sets selected class', function () {
      var item;

      // Need to do this to generate _this.content
      modesView.renderContent();
      // Select the "help" item
      modesView.setSelected([{id: 'help'}]);

      item = modesView.el.querySelector('[data-id="help"]');

      /* jshint -W030 */
      expect(item).to.not.be.null;
      expect(item.classList.contains('selected')).to.be.true;
      /* jshint +W030 */
    });
  });

  describe('updateModel', function () {
    it('sets videModes on model correctly', function () {
      modesView.updateModel([{'id': 'map'}]);

      expect(modesView.model.get('viewModes')).to.deep.equal([[{'id': 'map'}]]);
    });
  });
});
