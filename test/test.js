/* jshint global chai, mocha, sinon */

(function () {
  mocha.setup('bdd');
  require.config({
    baseUrl: '..',
  });

  require([
  ], function (
  ) {
    'use strict';
    // Add each test class here as they are implemented
    require([
      'spec/ExampleTest'
    ], function () {
      if (window.mochaPhantomJS) {
        window.mochaPhantomJS.run();
      } else {
        mocha.run();
      }
    });
  });
})();
