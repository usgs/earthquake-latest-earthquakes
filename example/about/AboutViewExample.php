<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'AboutViewExample';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="AboutViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="about-view-example"></div>
