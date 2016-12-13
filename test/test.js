/* global mocha */
'use strict';

mocha.setup('bdd');


// Add each test class here as they are implemented
require('./spec/about/AboutViewTest');

require('./spec/core/ConfigTest');
require('./spec/core/FormatterTest');
require('./spec/core/GenericCollectionViewTest');
require('./spec/core/MapUtilTest');
require('./spec/core/UrlManagerTest');

require('./spec/latesteqs/CatalogTest');
require('./spec/latesteqs/FeedWarningViewTest');
require('./spec/latesteqs/LatestEarthquakesTest');

require('./spec/list/DefaultListFormatTest');
require('./spec/list/DownloadViewTest');
require('./spec/list/DyfiListFormatTest');
require('./spec/list/ListViewTest');

require('./spec/list/PagerListFormatTest');
require('./spec/list/ShakeMapListFormatTest');

require('./spec/map/EarthquakeLayerTest');
require('./spec/map/LegendControlTest');
require('./spec/map/MapViewTest');
require('./spec/map/ScenarioLegendControlTest');

require('./spec/modes/ModesViewTest');

require('./spec/settings/CheckboxOptionsViewTest');
require('./spec/settings/RadioOptionsViewTest');
require('./spec/settings/SettingsViewTest');

require('./spec/summary/EventSummaryFormatTest');
require('./spec/summary/EventSummaryViewTest');

if (window.mochaPhantomJS) {
  window.mochaPhantomJS.run();
} else {
  mocha.run();
}
