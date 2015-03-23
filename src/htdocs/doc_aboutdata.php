<?php
  if (!isset($TEMPLATE)) {
    $TITLE = 'About ANSS Comprehensive Catalog and Important Caveats';
    $HEAD = '<link rel="stylesheet" href="css/documentation.css"/>';
    $NAVIGATION = true;

    include 'template.inc.php';
  }
?>

<?php /* TABLE OF CONTENTS ----------------------------------------------- */ ?>

<h2>Table of Contents</h2>
<ul>
  <li><a href="#data-availability">Data Availability</a></li>
  <li><a href="#placenames">Placenames/ Labels</a></li>
  <li><a href="#magnitudes">Magnitudes</a></li>
  <li><a href="#map">Map</a></li>
  <li><a href="#map-layers">Map Layers</a></li>
  <li><a href="#contributing-networks">Contributing Networks</a></li>
  <li><a href="#network-contacts">Network Contacts</a></li>
  <li><a href="#references">References</a></li>
</ul>

<p>
  The <strong>ANSS Comprehensive Catalog (ComCat)</strong> contains earthquake
  source parameters (e.g. hypocenters, magnitudes, phase picks and amplitudes)
  and other products (e.g. moment tensor solutions, macroseismic information,
  tectonic summaries, maps) produced by contributing seismic networks. This
  comprehensive collection of seismic information will eventually replace the
  <a href="http://www.quake.geo.berkeley.edu/anss/catalog-search.html">
  ANSS composite catalog hosted by the Northern California Data Center</a>;
  however, historic regional seismic network catalogs have not yet been fully
  loaded.
</p>

<p>
  Important digital catalogs of earthquake source parameters (e.g. Centennial
  Catalog, Global Centroid Moment Tensor Catalog) are currently being loaded
  into ComCat. New and updated data is added to the catalog dynamically as
  sources publish or update products. Check back for updates.
</p>

<?php /* DATA AVAILABILITY ------------------------------------------------*/ ?>
<h2 id="data-availability" class="section-header">Data Availability</h2>

<p>
  Data Availability as of 2015-03-19:
</p>

<ul>
  <li>
    Realtime Earthquake Data Sources &amp; Contributing Networks from 2013-02-02
    to present
  </li>
  <li>
    NEIC <a href="/data/pde.php">PDE Preliminary Determination of Epicenters
    Bulletin</a>
    <ul>
      <li>
        Monthly from 1973-01-01 to 2011-03-31
      </li>
      <li>
        Weekly from 2011-04-01 to 2012-10-13
      </li>
      <li>
        Daily from 2012-10-14 to 2013-02-08
      </li>
    </ul>
  </li>
  <li>
    <a href="/earthquakes/shakemap/atlas.php">Shakemap Atlas</a> from 1923 to
    2011
  </li>
  <li>
    Wphase (Duputel) from 1990 to 2012
  </li>
  <li>
    ISCGEM
  </li>
  <li>
    GCMT (Global Centroid-Moment-Tensor)
  </li>
</ul>

<p>
  Currently loading (available soon):
</p>

<ul>
  <li>
    &ldquo;Official&rdquo; magnitudes
  </li>
</ul>

<?php /* PLACENAMES LABELS ----------------------------------------------- */ ?>
<h2 id="placenames" class="section-header">Placenames/Labels</h2>

<p>
  We use a <a href="http://www.geonames.org/"  target="_blank">GeoNames</a>
  dataset to reference populated places that are in close proximity to a
  seismic event.  GeoNames has compiled a list of cities in the United States
  where the population is 1,000 or greater (cities1000.txt).  This is the
  primary list that we use when selecting nearby places.  In order to provide
  the public with a better understanding for the location of an event we try to
  list a variety of places in our nearby places list.  This includes the closest
  known populated place in relation to the seismic event (which based on our
  dataset will have a population of 1,000 or greater).  We also include the next
  3 closest places that have a population of 10,000 or greater, and finally make
  sure to include the closest capital city to the seismic event.
</p>

<p>
  The reference point for the descriptive locations is usually either the City
  Hall of the town (or prominent intersection in the middle of town if there is
  no City Hall), but please refer to the GeoNames website for the most accurate
  information on their data.
</p>

<p>
  If there is no nearby city within 300 kilometers (or if the nearby cities
  database is unavailable for some reason), the
  <a href="/learn/topics/flinn_engdahl.php">Flinn-Engdahl (F-E)</a> seismic and
  geographical regionalization scheme is used. The boundaries of these regions
  are defined at one-degree intervals and therefore differ from irregular
  political boundaries. For example, F-E region 545 (Northern Italy) also
  includes small parts of France, Switzerland, Austria and Slovenia and F-E
  region 493 (Chesapeake Bay Region) includes all of the State of Delaware, plus
  parts of the District of Columbia, Maryland, New Jersey, Pennsylvania and
  Virginia. Beginning with January 2000, the 1995 revision to the F-E code has
  been used in the QED and PDE listings.
</p>

<p>
  As an agency of the U.S. Government, we are expected to use the names and
  spellings approved by the
  <a href="http://earth-info.nga.mil/gns/html/" target="_blank">U.S. Board on
  Geographic Names</a>. Any requests to approve additional names should be made
  to the U.S. Board on Geographic Names.
</p>

<?php /* MAGNITUDES ------------------------------------------------------ */ ?>
<h2 id="magnitudes" class="section-header">Magnitudes</h2>

<p>
  The magnitude reported is that which the U.S. Geological Survey considers
  official for this earthquake, and was the best available estimate of the
  earthquake’s size, at the time that this page was created. Other magnitudes
  associated with web pages linked from here are those determined at various
  times following the earthquake with different types of seismic data. Although
  they are legitimate estimates of magnitude, the U.S. Geological Survey does
  not consider them to be the preferred "official" magnitude for the event.
</p>

<ul>
  <li>
    <a href="/earthquakes/eventpage/terms.php">More information about magnitudes
    and magnitude types</a>
  </li>
  <li>
    <a href="/aboutus/docs/020204mag_policy.php">U.S. Geological Survey
    Earthquake Magnitude Policy</a>
  </li>
</ul>

<?php /* MAP ------------------------------------------------------------- */ ?>
<h2 id="map" class="section-header">Map</h2>

<dl class="vertical">
  <dt>Map Projection</dt>
  <dd>
    The earthquake map projection is Web Mercator.
  </dd>

  <dt>Map Reference Model</dt>
  <dd>
    The reference model is WGS-84.
  </dd>

  <dt>Map Software</dt>
  <dd>
    Interactive map interface powered by
    <a href="http://leafletjs.com/" target="_blank">Leaflet</a>.
  </dd>

</dl>

<?php /* MAP LAYERS ------------------------------------------------------ */ ?>
<h2 id="map-layers" class="section-header">Map Layers</h2>

<dl class="vertical">
  <dt>Grayscale Map</dt>
  <dd>
    <p>
      This layer is from an Esri GIS service titled “Light Gray Canvas”.  This
      minimal map is used as the default because it loads more quickly in the
      browser than the other maps, and it emphasizes the earthquakes.
      <a href="http://www.arcgis.com/home/item.html?id=8b3d38c0819547faa83f7b7aca80bd76"
          target="_blank">
          Detailed information about this map is on the Esri website</a>.
    </p>

    <p>
      Sources: Esri, DeLorme, NAVTEQ.
    </p>
  </dd>

  <dt>Terrain Map</dt>
  <dd>
    <p>
      This layer is from an Esri GIS service titled “National Geographic World
      Map”.  The map was developed by National Geographic and Esri and reflects
      the distinctive National Geographic cartographic style in a multi-scale
      reference map of the world.  <a href="http://www.arcgis.com/home/item.html?id=b9b1b422198944fbbd5250b3241691b6"  target="_blank">
      Detailed information about this map is on the Esri website</a>.
    </p>
    <p>
      Sources: National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS,
      NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC.
    </p>
  </dd>

  <dt>Street Map</dt>
  <dd>
    <p>
      Map tiles courtesy <a href="http://www.mapquest.com/"  target="_blank">
      MapQuest</a>. Portions of the data courtesy
      <a href="http://www.nasa.gov"  target="_blank">NASA/JPL-Caltech</a> and
      <a href="http://www.fsa.usda.gov/FSA/"  target="_blank">U.S. Dept. of
      Agriculture</a>, Farm Service Agency.
    </p>
  </dd>

  <dt>Satellite Map</dt>
  <dd>
    <p>
      Map tiles courtesy <a href="http://www.mapquest.com/"  target="_blank">
      MapQuest</a>. Portions of the data courtesy
      <a href="http://www.nasa.gov"  target="_blank">NASA/JPL-Caltech</a> and
      <a href="http://www.fsa.usda.gov/FSA/"  target="_blank">U.S. Dept. of
      Agriculture</a>, Farm Service Agency.
    </p>
  </dd>

  <dt>Plate Boundaries</dt>
  <dd>
    <p>
      This data was acquired from the <a href="http://peterbird.name/publications/2003_PB2002/2003_PB2002.htm"  target="_blank">
      Peter Bird Plate Boundary Dataset</a>. NOTE: Included plate boundaries
      were chosen appropriately based on scale.
    </p>
  </dd>

  <dt>U.S. Faults</dt>
  <dd>
    <p>
      The data used for these features was acquired from the
      <a href="https://geohazards.usgs.gov/hazfaults/map2008.php">Hazard Faults
      Database for the United States</a>. See the <a href="/hazards/qfaults/">
      Quaternary Fault and Fold Database of the United States</a> for more
      information.
    </p>

    <h4 class="subheader">
      Known hazardous faults and fault zones in California and Nevada
    </h4>

    <p>
      The
      <a href="http://pubs.usgs.gov/of/1996/532/fig25ss.gif" target="_blank">
      known active fault segments in California and Nevada can be seen in Figure
      25</a> of <a href="http://pubs.usgs.gov/of/1996/532/"  target="_blank">
      USGS Open-File Report 96-532: National Seismic Hazard Maps, June 1996:
      Documentation</a> by Arthur Frankel, Charles Mueller, Theodore Barnhard,
      David Perkins, E.V. Leyendecker, Nancy Dickman, Stanley Hanson, and
      Margaret Hopper.
    </p>

    <p>
      For northern California, the potential sources of earthquakes larger than
      magnitude 6 are documented in
      <a href="http://pubs.usgs.gov/of/1996/0705/" target="_blank">
      Open-File Report 96-705: Database of Potential Sources for Earthquakes
      Larger than Magnitude 6 in Northern California</a> by the Working Group on
      Northern California Earthquake Potential (chaired by Jim Lienkaemper).
    </p>

    <p>
      For the state as a whole, see
      <a href="http://pubs.er.usgs.gov/publication/ofr96706" target="_blank">
      USGS Open-File Report 96-706: Probabilistic seismic hazard assessment for
      the State of California</a> by Petersen, M. D., Bryant, W.A., Cramer,
      C.H., Cao, T., Reichle, M.S., Frankel, A.D., Lienkaemper, J.J., McCrory,
      P.A., and Schwartz, D.P, 1996 (published jointly as
      <a href="http://www.conservation.ca.gov/cgs/rghm/psha/ofr9608/"
          target="_blank">
      California Division of Mines and Geology Open-File Report 96-08</a>.  The
      faults and fault zones described in these reports are known to have been
      active in the last 2 million years and are thought to pose a measurable
      hazard.
    </p>

    <p>
      For California the faults on the individual zoomed-in and special maps
      come from the three categories of faults believed to have been active in
      the last 700,000 years shown on the “Preliminary Fault Activity Map of
      California” by C.W. Jennings (1992, California Division of Mines and
      Geology Open-File Report 92-03). This map has been superseded by Jennings,
      C.W., 1994, Fault activity map of California and adjacent areas, with
      locations and ages of recent volcanic eruptions: California Division of
      Mines and Geology, Geologic Data Map No. 6, map scale 1:750,000.
    </p>

    <p>
      For Nevada the faults on the individual zoomed-in and special maps come
      from USGS Open-File Report 96-532 mentioned above.
    </p>

    <p>
      For more information on files and images discussed above visit the
      <a href="/hazards/products/conterminous/1996/documentation/">1996 Hazard
      Maps Documentation Page</a>.
    </p>
  </dd>

  <dt>U.S. Hazards</dt>
  <dd>
    <p>
      US hazard is from the <a href="/hazards/">USGS Seismic Hazard Mapping
      Project (NSHM)</a>
    </p>
  </dd>
</dl>

<?php /* CONTRIBUTING NETWORKS ------------------------------------------- */ ?>
<h2 id="contributing-networks" class="section-header">
  Realtime Earthquake Data Sources &amp; Contributing Networks
</h2>

<h3 id="contributors-us">U.S., International, and Offshore Regions</h3>

<ul>
  <li>
    <a href="/regional/neic/" target="_blank">National Earthquake Information
    Center (NEIC)</a>
  </li>
  <li>
    <a href="http://wcatwc.arh.noaa.gov/" target="_blank">West Coast &amp;
    Alaska Tsunami Warning Center</a>
  </li>
  <li>
    <a href="http://ptwc.weather.gov/" target="_blank">Pacific Tsunami Warning
    Center</a>
  </li>
</ul>

<h3 id="contributors-ak">Alaska</h3>

<ul>
  <li>
    <a href="http://www.aeic.alaska.edu/" target="_blank">Alaska Earthquake
    Information Center (AEIC)</a>
  </li>
  <li>
    <a href="http://www.avo.alaska.edu/" target="_blank">Alaska Volcano
    Observatory</a>
  </li>
</ul>

<h3 id="contributors-ceus">Central and Southeastern U.S.</h3>

<p>
  Cooperative Central and Southeast U.S. Seismic Network
  CERI/SLU/VPI/USC/&hellip;
</p>

<p>
  The participating institutions are:
</p>

<ul>
  <li>
    Delaware Geological Survey
  </li>
  <li>
    <a href="http://www.mgs.md.gov/seismics/" target="_blank">Maryland
    Geological Survey Seismic Network</a>
  </li>
  <li>
    <a href="http://www.ceri.memphis.edu/" target="_blank">University of Memphis
    - Center of Earthquake Research and Information (CERI)</a>
  </li>
  <li>
    <a href="http://www.eas.slu.edu/eqc/" target="_blank">Saint Louis University
    (SLU)</a>
  </li>
  <li>
    <a href="http://www.tva.gov/" target="_blank">University of
    Tennessee/Tennessee Valley Authority - Joint Institute for Energy and
    Environment</a>
  </li>
  <li>
    <a href="http://www.seis.sc.edu/projects/SCSN/index.html" target="_blank">
    University of South Carolina (USC) Seismology</a>
  </li>
  <li>
    <a href="http://www.geol.vt.edu/outreach/vtso/" target="_blank">Virginia
    Tech (VPI)</a>
  </li>
</ul>

<h3 id="contributors-hi">Hawaii</h3>

<ul>
  <li>
    <a href="http://hvo.wr.usgs.gov/" target="_blank">Hawaiian Volcano
    Observatory Network</a>
  </li>
</ul>

<h3 id="contributors-nn">Nevada</h3>

<ul>
  <li>
    <a href="http://www.seismo.unr.edu/" target="_blank">University of Nevada,
    Reno, Seismological Laboratory</a>
  </li>
</ul>

<h3 id="contributors-ld">Northeast</h3>

<a href="http://www.ldeo.columbia.edu/LCSN/" target="_blank">
  Lamont-Doherty Cooperative Seismographic Network (LCSN)
</a>

<p>
  The participating institutions are:
</p>

<ul>
  <li>
    <a href="http://www.ldeo.columbia.edu/" target="_blank">Lamont-Doherty Earth
    Observatory of Columbia University</a>
  </li>
  <li>
    <a href="http://www.seismo.nrcan.gc.ca/" target="_blank">Geological Survey
    of Canada</a>
  </li>
  <li>
    <a href="http://www.dnr.state.oh.us/OhioSeis/" target="_blank">Ohio Seismic
    Network</a>
  </li>
  <li>
    <a href="http://www.gp.uwo.ca/welcome.html" target="_blank">Southern Ontario
    Seismic Network</a>
  </li>
</ul>

<h3 id="contributors-nc">Northern California</h3>

<ul>
  <li>
    <a href="http://www.ncedc.org/ncsn/" target="_blank">Northern California
    Seismic Network (NCSN)</a>
  </li>
  <li>
    <a href="http://seismo.berkeley.edu/bdsn/" target="_blank">Berkeley Digital
    Seismic Network (BDSN)</a>
  </li>
</ul>

<p>
  The participating institutions are:
</p>

<ul>
  <li>
    <a href="/regiona/nca/">U.S. Geological Survey, Menlo Park</a>
  </li>
  <li>
    <a href= "http://seismo.berkeley.edu/bdsn/" target="_blank">University of
    California, Berkeley, Seismological Laboratory</a>
  </li>
  <li>
    Data archive at <a href="http://www.ncedc.org/" target="_blank">Northern
    California Earthquake Data Center (NCEDC)</a>
  </li>
</ul>

<h3 id="contributors-pt">Pacific Northwest</h3>

<a href="http://www.pnsn.org/" target="_blank">Pacific Northwest Seismograph
Network</a>

<p>
  The participating institutions are:
</p>

<ul>
  <li>
    <a href="http://www.ess.washington.edu" target="_blank">University of
    Washington, Dept. of Earth and Space Sciences</a>
  </li>
  <li>
    <a href="http://ceoas.oregonstate.edu/research/gg/" target="_blank">Oregon
    State University Geophysics Group</a>
  </li>
  <li>
    <a href="http://darkwing.uoregon.edu/~dogsci/2/main.htm" target="_blank">
    University of Oregon Dept. of Geology</a>
  </li>
</ul>

<h3 id="contributors-pr">Puerto Rico</h3>

<ul>
  <li>
    <a href="http://redsismica.uprm.edu/english/" target="_blank">University of
    Puerto Rico, Puerto Rico Seismic Network</a>
  </li>
</ul>

<h3 id="contributors-ci">Southern California</h3>

<p>
  Southern California Seismic Network (SCSN).
</p>

<p>
  The participating institutions are:
</p>

<ul>
  <li>
    <a href="/regional/sca/" target="_blank">U.S. Geological Survey, Pasadena
    </a>
  </li>
  <li>
    <a href="http://www.seismolab.caltech.edu/" target="_blank">California
    Institute of Technology, Seismological Laboratory</a>
  </li>
  <li>
    <a href="http://eqinfo.ucsd.edu" target="_blank">University of California,
    San Diego</a>
  </li>
  <li>
    Data archive at <a href="http://www.data.scec.org/" target="_blank">Southern
    California Earthquake Data Center (SCEDC)</a>
  </li>
</ul>

<h3 id="contributors-uu">Utah and Yellowstone</h3>

<ul>
  <li>
    <a href="http://www.seis.utah.edu/" target="_blank">University of Utah
    Seismograph Stations, Salt Lake City</a>
  </li>
</ul>

<h3 id="contributors-other">All members of the &hellip;</h3>

<ul>
  <li>
    <a href="/research/monitoring/anss/" target="_blank">Advanced National
    Seismic System (ANSS)</a>
  </li>
</ul>

<?php /* CONTACTS -------------------------------------------------------- */ ?>
<h2 id="network-contacts" class="section-header">Network Contacts</h2>

<h3 id="contacts-neic">National Earthquake Information Center (NEIC)</h3>

<address>
  U.S. Geological Survey<br />
  National Earthquake Information Center<br />
  Box 25046, DFC, MS 967<br />
  Denver, Colorado 80225
</address>

<p>
  Earthquake Information Line: 303-273-8500 (24x7 Operations)<br />
  Fax: 303-273-8450<br />
  Web Page: <a href="/regional/neic/" target="_blank">
  http://earthquake.usgs.gov/regional/neic/</a>
</p>

<h3 id="contact-ak">Alaska Earthquake Information Center (AEIC)</h3>

<address>
  Alaska Earthquake Information Center (AEIC)<br />
  Geophysical Institute<br />
  University of Alaska Fairbanks<br />
  903 Koyukuk Drive<br />
  Fairbanks, AK 99775-7320
</address>

<p>
  Voice: 907-474-7320<br />
  Fax: 907-474-7125<br />
  Web Page: <a href="http://www.aeic.alaska.edu/" target="_blank">
  http://www.aeic.alaska.edu/</a><br />
  E-mail: <a href="mailto:webmaster@giseis.akaska.edu">
  webmaster@giseis.akaska.edu</a>
</p>

<h3 id="contacts-atwc">
  West Coast and Alaska Tsunami Warning Center/NOAA/NWS
</h3>

<address>
  West Coast and Alaska Tsunami Warning Center/NOAA/NWS<br />
  910 S. Felton St.<br />
  Palmer, AK 99645
</address>

<p>
  Web Page: <a href="http://wcatwc.arh.noaa.gov/" target="_blank">
  http://wcatwc.arh.noaa.gov/</a><br /> E-mail:
  <a href="mailto:wcatwc@wcatwc.gov">wcatwc@wcatwc.gov</a>
</p>

<h3 id="contacts-nmsn">Cooperative New Madrid Seismic Network</h3>

<address>
  Center for Earthquake Research and Information<br />
  Campus Box 526590<br />
  The University of Memphis<br />
  Memphis, TN 38152
</address>

<p>
  Voice: 901-678-2007<br />
  Fax: 901-678-4734<br />
  Web Page: <a href="http://www.ceri.memphis.edu/" target="_blank">
  http://www.ceri.memphis.edu/</a><br />
  E-mail: <a href="mailto:withers@ceri.memphis.edu">withers@ceri.memphis.edu</a>
</p>

<h3 id="contacts-imwsm">Inter-Mountain West Seismic Networks</h3>

<address>
  Earthquake Studies Office<br />
  Montana Bureau of Mines and Geology<br />
  1300 West Park Street<br />
  Butte, MT 59701-8997
</address>

<p>
  Voice: 406-496-4332<br />
  Fax: 406-496-4451<br />
  Web Page: <a href="http://mbmgquake.mtech.edu/" target="_blank">
  http://mbmgquake.mtech.edu/</a><br />
  E-mail: <a href="mailto:mstickney@mtech.edu">mstickney@mtech.edu</a>
</p>

<address>
  Nevada Seismological Laboratory<br />
  University of Nevada, Reno<br />
  Reno, Nevada
</address>

<p>
  Voice: 775-784-4975<br />
  Fax: 775-784-4165<br />
  Web Page: <a href="http://www.seismo.unr.edu/" target="_blank">
  http://www.seismo.unr.edu/</a>
</p>

<address>
  University of Utah Seismograph Stations<br />
  135 South 1460 East<br />
  Salt Lake City, Utah 84112-0111
</address>

<p>
  Voice: 801-581-6274<br />
  Fax: 801-585-5585<br />
  Web Page: <a href="http://www.seis.utah.edu/" target="_blank">
  http://www.seis.utah.edu/</a><br />
  E-mail: <a href="mailto:webmaster@seis.utah.edu">webmaster@seis.utah.edu</a>
</p>

<h3 id="contacts-hi">Hawaiian Volcano Observatory Network</h3>

<address>
  U.S. Geological Survey<br />
  Hawaiian Volcano Observatory<br />
  P O Box 51<br />
  Hawaii National Park, Hawaii 96718
</address>

<p>
  Voice: 808-967-7328<br />
  Fax: 808-967-8890<br />
  Web Page: <a href="http://hvo.wr.usgs.gov/" target="_blank">
  http://hvo.wr.usgs.gov/</a><br /> Web Page:
  <a href="http://hvo.wr.usgs.gov/seismic/volcweb/earthquakes/" target="_blank">
  http://elsei.wr.usgs.gov/results/seismic/recenteqs/</a><br />
  E-mail: <a href="mailto:hvowebmaster@hvo.wr.usgs.gov">
  hvowebmaster@hvo.wr.usgs.gov</a>
</p>

<h3 id="contacts-ptwc">Pacific Tsunami Warning Center</h3>

<address>
  U.S. Dept. of Commerce<br />
  91-270 Fort Weaver Road<br />
  EWA Beach, HI 96706-2928
</address>

<p>
  Voice: 808-689-8207<br />
  Web Page: <a href="http://ptwc.weather.gov" target="_blank">
  http://ptwc.weather.gov</a><br /> E-mail:
  <a href="mailto:webmaster@ptwc.noaa.gov">webmaster@ptwc.noaa.gov</a>
</p>

<h3 id="contacts-ld">Northeast</h3>

<address>
  Lamont-Doherty Cooperative Seismographic Network (LCSN)<br />
  Lamont-Doherty Earth Observatory of Columbia University<br />
  Palisades, NY 10964
</address>

<p>
  Voice: 845-365-8365<br />
  Fax: 845-365-8150<br />
  Web Page: <a href="http://www.ldeo.columbia.edu/LCSN/" target="_blank">
  http://www.ldeo.columbia.edu/LCSN/</a><br /> E-mail:
  <a href="mailto:jha@ldeo.columbia.edu">jha@ldeo.columbia.edu</a>
</p>

<address>
  Weston Observatory<br />
  Dept. of Geology and Geophysics, Boston College<br />
  381 Concord Road Weston, MA 02493-1340
</address>

<p>
  Voice: 617-552-8300<br />
  Fax: 617-552-8388<br />
  Web Page: <a href="http://www.bc.edu/bc_org/avp/cas/wesobs/" target="_blank">
  http://www.bc.edu/bc_org/avp/cas/wesobs/</a><br /> E-mail:
  <a href="mailto:weston.observatory@bc.edu">weston.observatory@bc.edu</a>
</p>

<h3 id="contacts-nc">Northern California Seismic Network</h3>

<address>
  U.S. Geological Survey<br />
  Seismology Section<br />
  345 Middlefield Road - MS 977<br />
  Menlo Park, CA 94025
</address>

<p>
  Earthquake Info: 650-329-4025<br />
  Voice: 650-329-4085<br />
  Fax: 650-329-5163<br />
  Web Page: <a href="/regional/nca/">Earthquake Hazards Science Center</a><br />
  E-mail: <a href="mailto:ncsn@andreas.wr.usgs.gov">ncsn@andreas.wr.usgs.gov</a>
</p>

<address>
  U.C. Berkeley Seismological Laboratory<br />
  207 McCone Hall<br />
  U.C. Berkeley<br />
  Berkeley, CA 94720-4760
</address>

<p>
  Earthquake Info: 510-642-2160<br />
  Voice: 510-642-3977<br />
  Fax: 510-643-5811<br />
  Web Page: <a href="http://seismo.berkeley.edu/bdsn/" target="_blank">
  http://seismo.berkeley.edu/bdsn//</a><br /> E-mail:
  <a href="mailto:www@seismo.berkeley.edu">www@seismo.berkeley.edu</a>
</p>

<h3 id="contacts-pnw">Pacific Northwest Seismic Network</h3>

<address>
  University of Washington, Dept. of Earth and Space Sciences<br />
  Box 351310<br />
  Seattle, WA 98195-1310
</address>

<p>
  Earthquake Info: 206-543-7010<br />
  Voice: 206-685-8180 (lab) or 206-543-1190 (department)<br />
  Fax: 206-543-0489<br />
  Web Page: <a href="http://www.pnsn.org/" target="_blank">
  http://www.ess.washington.edu/SEIS/PNSN/welcome.html</a><br />
  E-mail: <a href="mailto:seis_info@ess.washington.edu">
  seis_info@ess.washington.edu</a>
</p>

<h3 id="contacts-pr">Puerto Rico Seismic Network</h3>

<address>
  Puerto Rico Seismic Network<br />
  Department of Geology<br />
  University of Puerto Rico at Mayag&uuml;ez<br />
  PO Box 9017<br />
  Mayag&uuml;ez, PR 00681-9017
</address>

<p>
  Voice: 787-833-8433<br />
  Fax: 787-265-1684<br />
  Web Page: <a href="http://redsismica.uprm.edu/english/" target="_blank">
  http://redsismica.uprm.edu/english/</a><br /> E-mail:
  <a href="mailto:staff@rmsismo.uprm.edu">staff@redsismica.uprm.edu</a>
</p>

<h3 id="contacts-ci">Southern California Seismic Network</h3>

<address>
  Southern California Seismic Network<br />
  U.S. Geological Survey - Caltech Seismological Laboratory<br />
  Pasadena, California
</address>

<p>
  EQ Info: 626/395-6977<br />
  Voice: 626/583-7823 or 626/395-6919<br />
  Fax: 626/583-7827<br />
  Web Page: <a href="/regional/sca/" >http://earthquake.usgs.gov/regional/sca/
  </a><br /> Web Page:
  <a href="http://www.seismolab.caltech.edu/" target="_blank">
  http://www.seismolab.caltech.edu/</a>
</p>

<?php /* REFERENCES------------------------------------------------------- */ ?>
<h2 id="references" class="section-header">References</h2>

<ul class="referencelist">
  <li>
    Young, J.B., Presgrave, B.W., Aichele, H., Wiens, D.A. and Flinn, E.A.,
    1996, The Flinn-Engdahl Regionalisation Scheme: the 1995 revision,
    Physics of the Earth and Planetary Interiors, v. 96, p. 223-297.
  </li>
  <li>
    Flinn, E.A., Engdahl, E.R. and Hill, A.R., 1974, Seismic and
    geographical regionalization, Bulletin of the Seismological Society of
    America, vol. 64, p. 771-993.
  </li>
  <li>
    Flinn, E.A., and Engdahl, E.R., 1965, A proposed basis for geographical
    and seismic regionalization, Reviews of Geophysics, vol. 3, p. 123-149.
  </li>
</ul>
