<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'Radio Options View';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="RadioOptionsViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<ul id="radio-options-view-example"></ul>
