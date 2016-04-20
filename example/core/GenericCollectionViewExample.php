<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'GenericCollectionView';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="GenericCollectionViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>


<div id="generic-collection-view-example"></div>
