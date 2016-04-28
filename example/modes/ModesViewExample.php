<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'ModesViewExample';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
    <style>
      .modes-view-container {
        background-color: #000;
      }
    </style>
  ';

  $FOOT = '
    <script src="/lib/leaflet-0.7.7/leaflet.js"></script>
    <script src="/js/bundle.js"></script>
    <script src="ModesViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="modes-view-example"></div>
