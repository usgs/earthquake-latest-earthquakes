/* global afterEach, beforeEach, chai, describe, it, sinon */
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

  describe('updateDesktopModel', function () {
    it('toggles the viewModes value based on given option', function () {
      var option;

      option = {
        'id': 'list',
        'name': 'List',
        'icon': 'list'
      };

      // Initially no items in model
      expect(modesView.model.get('viewModes').length).to.equal(0);

      // Now toggle an option and ensure it is in model
      modesView.updateDesktopModel(option);
      expect(modesView.model.get('viewModes').length).to.equal(1);
    });
  });

  describe('updateMobileModel', function () {
    it('toggles the viewModes value based on given option', function () {
      var obj;

      obj = {
        'id': 'settings',
        'name': 'settings',
        'icon': 'settings'
      };

      expect(modesView.model.get('viewModes').length).to.equal(0);

      modesView.updateMobileModel(obj);
      expect(modesView.model.get('viewModes').length).to.equal(1);
    });
  });

  describe('updateModel', function () {
    it('calls updateMobileModel when mobileCheck is true', function () {
      var spy,
          view;

      view = ModesView();

      sinon.stub(view, 'mobileCheck', function () {
        return true;
      });

      spy = sinon.spy(view, 'updateMobileModel');
      view.updateModel({});

      expect(spy.callCount).to.equal(1);
      view.destroy();
    });

    it('calls updateDesktopModel when mobileCheck is false', function () {
      var spy,
          view;

      view = ModesView();

      sinon.stub(view, 'mobileCheck', function () {
        return false;
      });

      spy = sinon.spy(view, 'updateDesktopModel');
      view.updateModel({});

      expect(spy.callCount).to.equal(1);
      view.destroy();
    });
  });
});
