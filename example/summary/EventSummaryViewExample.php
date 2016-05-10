<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'EventSummaryView';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
    <style>

    </style>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="EventSummaryViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<div class="event-summary-view" id="event-summary-view-example"></div>

