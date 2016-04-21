/* global chai, describe, it, sinon */
'use strict';

var Collection = require('mvc/Collection'),
    Config = require('core/Config');


var expect = chai.expect;


describe('core/Config', function () {
  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof Config).to.equal('function');
    });

    it('accepts pre-defined collection', function () {
      var config,
          test;

      test = Collection([
        {
          id: 1
        },
        {
          id: 2
        }
      ]);

      config = Config({
        test: test
      });
      expect(config.options.test).to.equal(test);
      config.destroy();
    });

    it('converts options to collections', function () {
      var config,
          test;

      test = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];

      config = Config({
        test: test
      });
      expect(config.options.test.get(1)).to.equal(test[0]);
      expect(config.options.test.get(2)).to.equal(test[1]);
      config.destroy();
    });

    it('destroys created collections', function () {
      var config,
          test,
          spy;

      test = [
        {
          id: 1
        },
        {
          id: 2
        }
      ];

      config = Config({
        test: test
      });
      spy = sinon.spy(config.options.test, 'destroy');
      config.destroy();
      expect(spy.calledOnce).to.equal(true);
    });
  });
});
