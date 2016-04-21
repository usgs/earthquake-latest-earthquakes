/* global mocha */
'use strict';

mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/summary/EventSummaryFormatTest');

require('./spec/core/ConfigTest');
require('./spec/core/FormatterTest');
require('./spec/core/GenericCollectionViewTest');
require('./spec/core/UrlManagerTest');

require('./spec/help/HelpViewTest');

require('./spec/latesteqs/CatalogTest');

require('./spec/list/DefaultListFormatTest');
require('./spec/list/DyfiListFormatTest');
require('./spec/list/ListViewTest');
require('./spec/list/PagerListFormatTest');
require('./spec/list/ShakeMapListFormatTest');

require('./spec/settings/CheckboxOptionsViewTest');
require('./spec/settings/RadioOptionsViewTest');


if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
