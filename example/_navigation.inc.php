<?php
  echo navGroup('Core',
    navItem('/core/GenericCollectionViewExample.php', 'GenericCollectionView')
  );

  echo navGroup('About',
    navItem('/about/AboutViewExample.php', 'AboutView')
  );

  echo navGroup('List',
    navItem('/list/DefaultListFormatExample.php', 'DefaultListFormat') .
    navItem('/list/DownloadViewExample.php', 'DownloadView') .
    navItem('/list/DyfiListFormatExample.php', 'DyfiListFormat') .
    navItem('/list/ListViewExample.php', 'ListView') .
    navItem('/list/PagerListFormatExample.php', 'PagerListFormat') .
    navItem('/list/ShakeMapListFormatExample.php', 'ShakeMapListFormat')
  );

  echo navGroup('Map',
    navItem('/map/EarthquakeLayerExample.php', 'EarthquakeLayer') .
    navItem('/map/LegendControlExample.php', 'LegendControl')
  );

  echo navGroup('Modes',
    navItem('/modes/ModesViewExample.php', 'ModesView')
  );

  echo navGroup('Settings',
    navItem('/settings/CheckboxOptionsViewExample.php', 'CheckboxOptionsView') .
    navItem('/settings/RadioOptionsViewExample.php', 'RadioOptionsView') .
    navItem('/settings/SettingsViewExample.php', 'SettingsView')
  );

  echo navGroup('Summary',
    navItem('/summary/EventSummaryFormatExample.php', 'EventSummaryFormat') .
    navItem('/summary/EventSummaryViewExample.php', 'EventSummaryView')
  );
?>
