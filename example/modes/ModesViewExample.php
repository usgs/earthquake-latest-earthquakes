<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'ModesViewExample';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="ModesViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="modes-view-example"></div>
