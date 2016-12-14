<?php
  if (!isset($TEMPLATE)) {
    // Defines the $CONFIG hash of configuration variables
    include_once '../conf/config.inc.php';

    if ($SCENARIO_MODE) {
      $TITLE = 'Scenario Earthquakes';
    } else {
      $TITLE = 'Latest Earthquakes';
    }

    $HEAD = '
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

      <link rel="stylesheet" href="/theme/site/earthquake/index.css"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Merriweather:400,400italic,700|Source+Sans+Pro:400,300,700"/>
      <link rel="stylesheet" href="/lib/leaflet-0.7.7/leaflet.css"/>
      <link rel="stylesheet" href="css/index.css"/>

      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <meta name="format-detection" content="address=no"/>
      <meta name="format-detection" content="telephone=no"/>

      <script id="_fed_an_ua_tag" async="async" src="/lib/Universal-Federated-Analytics-Min.1.0.js?agency=DOI&amp;subagency=USGS&amp;pua=UA-7320779-1"></script>
    ';
    $FOOT =
      /* create list & map with config. */
      '<script>' .
        'var SCENARIO_MODE = ' . json_encode($SCENARIO_MODE) . ';' .
        'var SEARCH_PATH = ' . json_encode($SEARCH_PATH) . ';' .
      '</script>
      <script src="/lib/leaflet-0.7.7/leaflet.js"></script>
      <script src="js/index.js"></script>
    ';

    include 'minimal.inc.php';
  }
?>

<main role="main" id="latest-earthquakes">
  <noscript>
    <p>
      Javascript must be enabled to view our earthquake maps.
      To access USGS earthquake information without using javascript, use our
      <a href="/earthquakes/feed/v1.0/summary/2.5_day.atom">
        Magnitude 2.5+ Earthquakes, Past Day ATOM Feed
      </a> or our other <a href="/earthquakes/feed/">earthquake feeds</a>.
    </p>
  </noscript>
</main>
