<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'ShakeMapListFormat';
  // If you want to include section navigation.
  // The nearest _navigation.inc.php file will be used by default
  $NAVIGATION = true;
  // Stuff that goes at the top of the page (in the <head>) (i.e. <link> tags)
  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
        <style>
    #shakemap-list-format-example > ul {
      border: 1px solid #999;
    }
    #shakemap-list-format-example > ul > li + li {
      border-top: 1px solid #ccc;
    }
    </style>
  ';
  // Stuff that goes at the bottom of the page (i.e. <script> tags)
  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="ShakeMapListFormatExample.js"></script>
  ';
  include 'template.inc.php';
}
?>

<div id="shakemap-list-format-example"></div>
