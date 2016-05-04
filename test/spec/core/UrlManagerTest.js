/* global after, before, chai, describe, it, sinon */
'use strict';


var Config = require('core/Config'),
    Events = require('util/Events'),
    Model = require('mvc/Model'),
    UrlManager = require('core/UrlManager');


var expect = chai.expect;


describe('core/UrlManager', function () {
  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof UrlManager).to.equal('function');
    });
  });

  describe('getModelSettings', function () {
    var config,
        manager,
        model;

    before(function () {
      config = Config({
        test: [
          {id: 'a'},
          {id: 'b'}
        ]
      });

      model = Model({
        test: config.options.test.get('b')
      });

      manager = UrlManager({
        config: config,
        model: model
      });
    });

    after(function () {
      manager.destroy();
      config.destroy();
      model.destroy();
    });

    it('translates config objects to ids', function () {
      expect(manager.getModelSettings().test).to.equal('b');
    });
  });

  describe('onHashChange', function () {
    it('calls setModelSettings with getUrlSettings', function () {
      var manager,
          settings;

      settings = {'test': 1};
      manager = UrlManager({
        config: Config(),
        model: Model()
      });
      sinon.stub(manager, 'getUrlSettings', function () {
        return settings;
      });
      sinon.stub(manager, 'setModelSettings', function () {});

      manager.onHashChange();
      expect(manager.setModelSettings.calledOnce).to.equal(true);
      expect(manager.setModelSettings.getCall(0).args[0]).to.equal(settings);

      manager.setModelSettings.restore();
      manager.getUrlSettings.restore();
      manager.destroy();
    });
  });

  describe('onModelChange', function () {
    it('calls setUrlSettings with getModelSettings', function () {
      var manager,
          settings;

      settings = {'test': 1};
      manager = UrlManager({
        config: Config(),
        model: Model()
      });
      sinon.stub(manager, 'getModelSettings', function () {
        return settings;
      });
      sinon.stub(manager, 'setUrlSettings', function () {});

      manager.onModelChange();
      expect(manager.setUrlSettings.calledOnce).to.equal(true);
      expect(manager.setUrlSettings.getCall(0).args[0]).to.equal(settings);

      manager.setUrlSettings.restore();
      manager.getModelSettings.restore();
      manager.destroy();
    });
  });


  describe('parseHash', function () {
    var manager;

    before(function () {
      manager = UrlManager({
        config: Config(),
        model: Model()
      });
    });

    after(function () {
      manager.destroy();
      manager = null;
    });

    it ('parses urlencoded json objects', function () {
      var json,
          object,
          parsed;


      object = {
        'a': 1,
        'b': 2
      };
      json = '#' + encodeURIComponent(JSON.stringify(object));
      parsed = manager.parseHash(json);
      expect(parsed).to.deep.equal(object);
    });

    it('adds missing closing curly brace', function () {
      var json,
          parsed;

      json = '#' + encodeURIComponent('{"a": 1,"b": 2');
      parsed = manager.parseHash(json);
      expect(parsed).to.deep.equal({a: 1, b: 2});
    });
  });

  describe('setModelSettings', function () {
    var config,
        manager,
        model;

    before(function () {
      config = Config({
        test: [
          {id: 'a'},
          {id: 'b'}
        ]
      });

      model = Model({
        exists: true,
        test: null
      });

      manager = UrlManager({
        config: config,
        model: model
      });
    });

    after(function () {
      manager.destroy();
      config.destroy();
      model.destroy();
    });

    it('translates config ids to objects', function () {
      sinon.stub(model, 'set', function () {});
      manager.setModelSettings({
        test: 'a'
      });
      expect(model.set.getCall(0).args[0].test.id).to.equal('a');
      manager.setModelSettings({
        test: 'c'
      });
      expect(model.set.getCall(1).args[0].test).to.equal(null);
      model.set.restore();
    });

    it('blocks new properties when not allowed', function () {
      var arg;
      sinon.stub(model, 'set', function () {});
      manager.setModelSettings({
        exists: 'exists',
        notexists: 'notexists'
      }, false);
      arg = model.set.getCall(0).args[0];
      expect(arg.exists).to.equal('exists');
      expect('notexists' in arg).to.equal(false);
      model.set.restore();
    });

    it('allows new properties when allowed', function () {
      var arg;
      sinon.stub(model, 'set', function () {});
      manager.setModelSettings({
        exists: 'exists',
        notexists: 'notexists'
      }, true);
      arg = model.set.getCall(0).args[0];
      expect(arg.exists).to.equal('exists');
      expect(arg.notexists).to.equal('notexists');
      model.set.restore();
    });
  });

  describe('start', function () {
    it('adds hashchange listener', function () {
      var manager;

      sinon.spy(Events, 'on');
      manager = UrlManager({
        config: Config(),
        model: Model()
      });
      expect(Events.on.calledOnce).to.equal(false);
      manager.start()
      expect(Events.on.calledOnce).to.equal(true);
      expect(Events.on.getCall(0).args).to.deep.equal(
          ['hashchange', 'onHashChange', manager]);
      Events.on.restore();
      manager.destroy();
    });

    it('adds model listener', function () {
      var manager,
          model;

      model = Model();
      sinon.spy(model, 'on');
      manager = UrlManager({
        config: Config(),
        model: model
      });
      manager.start()
      expect(model.on.calledOnce).to.equal(true);
      expect(model.on.getCall(0).args).to.deep.equal(
          ['change', 'onModelChange', manager]);
      model.on.restore();
      manager.destroy();
    });
  });

  describe('stop', function () {
    it('removes hashchange listener', function () {
      var manager;

      sinon.spy(Events, 'off');
      manager = UrlManager({
        config: Config(),
        model: Model()
      });
      manager.start();
      manager.destroy();
      expect(Events.off.calledOnce).to.equal(true);
      expect(Events.off.getCall(0).args).to.deep.equal(
          ['hashchange', 'onHashChange', manager]);
    });

    it('removes model listener', function () {
      var manager,
          model;

      model = Model();
      sinon.spy(model, 'off');
      manager = UrlManager({
        config: Config(),
        model: model
      });
      manager.start();
      manager.destroy();
      expect(model.off.calledOnce).to.equal(true);
      expect(model.off.getCall(0).args).to.deep.equal(
          ['change', 'onModelChange', manager]);
      model.off.restore();
    });
  });
});
