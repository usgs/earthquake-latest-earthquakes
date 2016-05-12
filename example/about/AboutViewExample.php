<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'AboutViewExample';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
    <style>
      html,
      body {
        overflow: scroll;
      }
    </style>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="AboutViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="about-view-example" class="about-view"></div>
