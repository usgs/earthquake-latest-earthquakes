<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'Checkbox Options View';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="CheckboxOptionsViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<ul id="checkbox-options-view-example"></ul>
