<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'DownloadView';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="DownloadViewExample.js"></script>
  ';

  include 'template.inc.php';
}

?>

<div id="download-view-example"></div>
