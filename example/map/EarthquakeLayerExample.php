<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'EarthquakeLayer Example';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/lib/leaflet-0.7.7/leaflet.css"/>
    <link rel="stylesheet" href="/css/index.css"/>
    <style>
      #earthquake-layer-example > .map {
        width: 100%;
        height: 480px;
      }
    </style>
  ';

  $FOOT = '
    <script src="/lib/leaflet-0.7.7/leaflet.js"></script>
    <script src="/js/bundle.js"></script>
    <script src="EarthquakeLayerExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="earthquake-layer-example"></div>
