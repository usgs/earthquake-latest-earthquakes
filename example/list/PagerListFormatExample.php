<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'PagerListFormat';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="PagerListFormatExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="pager-list-format-example"></div>
