<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'EventSummaryFormat';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="EventSummaryFormatExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div id="event-summary-format-example"></div>
