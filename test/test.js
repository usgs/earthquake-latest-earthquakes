/* jshint global chai, mocha, sinon */
'use strict';

mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/EventSummaryFormatTest');
require('./spec/ExampleTest');
require('./spec/FormatterTest');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
