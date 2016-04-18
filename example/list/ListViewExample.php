<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'ListView';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="ListViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="list-view-example"></div>
