<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'Checkbox Options View';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/lib/leaflet-0.7.7/leaflet.js"></script>
    <script src="/js/bundle.js"></script>
    <script src="CheckboxOptionsViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="checkbox-options-view-example"></div>
