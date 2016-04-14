<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'PagerListFormat';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
    <style>
    #pager-list-format-example > ul {
      border: 1px solid #999;
    }
    #pager-list-format-example > ul > li + li {
      border-top: 1px solid #ccc;
    }
    </style>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="PagerListFormatExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="pager-list-format-example"></div>
