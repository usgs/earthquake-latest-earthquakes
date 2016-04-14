/* global mocha */
'use strict';

mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/EventSummaryFormatTest');

require('./spec/core/FormatterTest');

require('./spec/list/DefaultListFormatTest');
require('./spec/list/PagerListFormatTest');



if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
