'use strict';

var ShakeMapListFormat = require('list/ShakeMapListFormat');

var el,
    eq;

el = document.querySelector('#shakemap-list-format-example');

eq = {
  'type':'Feature',
    'properties':{'mag':5.5,
      'place':'99km SSE of San Felipe,Mexico',
      'time':1459123975010,
      'updated':1459658210982,
      'tz':-480,
      'url':'http://earthquake.usgs.gov/earthquakes/eventpage/us20005ct5',
      'detail':'http://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us20005ct5.geojsonp',
      'felt':3,
      'cdi':2,
      'mmi':4.31,
      'alert':'green',
      'status':'reviewed',
      'tsunami':0,
      'sig':466,
      'net':'us',
      'code':'20005ct5',
      'ids':',us20005ct5,gcmt20160328001255,',
      'sources':',us,gcmt,',
      'types':',cap,dyfi,geoserve,impact-text,losspager,moment-tensor,nearby-cities,origin,phase-data,shakemap,tectonic-summary,',
      'nst':null,
      'dmin':0.917,
      'rms':0.95,
      'gap':107,
      'magType':'mww',
      'type':'earthquake',
      'title':'M 5.5 - 99km SSE of San Felipe, Mexico'
      },
    'geometry':{
      'type':'Point',
      'coordinates':[-127.1833,40.9902,10]
      },
    'id':'us20005dh8'
};

el.appendChild(ShakeMapListFormat(
    {'idprefix': 'listview-1-', 'settings': {}}).format(eq));
