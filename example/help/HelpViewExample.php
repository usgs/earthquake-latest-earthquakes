<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'HelpViewExample';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="HelpViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="help-view-example"></div>
