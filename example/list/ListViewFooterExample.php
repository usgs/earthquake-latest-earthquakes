<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'ListViewFooterExample';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="ListViewFooterExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="list-view-footer-example"></div>
