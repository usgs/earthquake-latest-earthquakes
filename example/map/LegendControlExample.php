<?php

  if (!isset($TEMPLATE)) {
    $TITLE = 'Example for ZoomTo Control';
    $HEAD = '
      <link rel="stylesheet" href="/lib/leaflet-0.7.7/leaflet.css"/>
      <link rel="stylesheet" href="/css/index.css"/>
      <style>
        .map {
          height: 400px;
          width: 100%;
        }
      </style>
    ';
    $FOOT = '
      <script src="/lib/leaflet-0.7.7/leaflet.js"></script>
      <script src="/js/bundle.js"></script>
      <script src="LegendControlExample.js"></script>
    ';
    include 'template.inc.php';
  }
?>

<div class="map"></div>
