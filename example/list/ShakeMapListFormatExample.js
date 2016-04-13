'use strict';

var ShakeMapListFormat = require('list/ShakeMapListFormat');

var el,
    eq;

el = document.querySelector('#shakemap-list-format');

eq = {'type':'Feature',
  'properties':{
    'mag':4.6,
    'place':'250km WNW of Ferndale, California',
    'time':1459367264930,
    'updated':1459566427113,
    'tz':-480,
    'url':'http://earthquake.usgs.gov/earthquakes/eventpage/us20005dh8',
    'detail':'http://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us20005dh8.geojsonp',
    'felt':4,
    'cdi':2.2,
    'mmi':null,
    'alert':null,
    'status':'reviewed',
    'tsunami':0,
    'sig':326,
    'net':'us',
    'code':'20005dh8',
    'ids':',us20005dh8,nc72615020,',
    'sources':',us,nc,',
    'types':',cap,dyfi,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,',
    'nst':null,
    'dmin':2.394,
    'rms':1.22,
    'gap':178,
    'magType':'mb',
    'type':'earthquake',
    'title':'M 4.6 - 250km WNW of Ferndale, California'
    },
  'geometry':{
    'type':'Point',
    'coordinates':[-127.1833,40.9902,10]
    },
  'id':'us20005dh8'
};

el.innerHTML = ShakeMapListFormat(
    {'className': 'shakemap-list','idprefix': 'listview-1-'}).format(eq);
