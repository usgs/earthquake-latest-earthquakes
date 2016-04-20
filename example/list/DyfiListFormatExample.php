<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'DyfiListFormat';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
    <style>
    #dyfi-list-format-example > ul {
      border: 1px solid #999;
    }
    #dyfi-list-format-example > ul > li + li {
      border-top: 1px solid #ccc;
    }
    </style>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="DyfiListFormatExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<p class="alert">
  Note: Borders added on the example page in order to highlight DOM element
  extents, margin and padding. Borders are not included as part of the format
  style. If borders are desired, this list itself should add such borders.
</p>
<div id="dyfi-list-format-example"></div>
