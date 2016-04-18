<?php
  echo navGroup('Summary',
    navItem('/summary/EventSummaryFormatExample.php', 'EventSummaryFormat')
  );

  echo navGroup('List',
    navItem('/list/DefaultListFormatExample.php', 'DefaultListFormat') .
    navItem('/list/DyfiListFormatExample.php', 'DyfiListFormat') .
    navItem('/list/ListViewExample.php', 'ListView') .
    navItem('/list/PagerListFormatExample.php', 'PagerListFormat') .
    navItem('/list/ShakeMapListFormatExample.php', 'ShakeMapListFormat')
  );

?>
