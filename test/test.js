/* jshint global chai, mocha, sinon */
'use strict';

mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/ExampleTest');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
