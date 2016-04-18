/* global mocha */
'use strict';

mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/summary/EventSummaryFormatTest');

require('./spec/core/FormatterTest');

require('./spec/latesteqs/CatalogTest');

require('./spec/list/DefaultListFormatTest');
require('./spec/list/PagerListFormatTest');
require('./spec/list/ShakeMapListFormatTest');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
