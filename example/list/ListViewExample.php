<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'ListView';

  $NAVIGATION = true;

  $HEAD = '
    <link rel="stylesheet" href="/css/index.css"/>
    <style>
    #list-view-example {
      border: 1px solid #666;
    }
    .format-options > li {
      display: inline-block;
    }
    </style>
  ';

  $FOOT = '
    <script src="/js/bundle.js"></script>
    <script src="ListViewExample.js"></script>
  ';

  include 'template.inc.php';
}
?>

<p class="alert">
  The view itself appears in the visualization section below. The visualization
  includes borders between each list item and between the list
  header/content/footer, but the border around the entire view is added by the
  example in order to reflect what this view might look like within the
  application itself. Such borders (if desired) are expected to appear as part
  of the application scaffold.
</p>

<h2>Available Formats</h2>
<p>
  Click a format below to change how the list renders. Changes occur by
  setting the model property &ldquo;listFormat&rdquo; on the listView.
</p>
<ul class="no-style format-options">
  <li>
    <button class="confirm green" data-format="default-format">JSON</button>
  </li>
  <li><button data-format="magnitude-format">Magnitude</button></li>
  <li><button data-format="dyfi-format">DYFI</button></li>
  <li><button data-format="shakemap-format">ShakeMap</button></li>
  <li><button data-format="pager-format">PAGER</button></li>
</ul>

<h2>Visualization</h2>
<div id="list-view-example"></div>
