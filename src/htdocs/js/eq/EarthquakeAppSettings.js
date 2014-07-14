/* global define */
define([
	'mvc/Util',
	'mvc/Events',
	'eq/Settings'
], function (
	Util,
	Events,
	Settings
) {
	'use strict';


	var hostname = document.location.hostname,
	    searchHost = '',
	    feedHost = '',
	    tileHost = '';

	if (hostname.indexOf('earthquake.usgs.gov') > -1) {
		searchHost = 'http://comcat.cr.usgs.gov';
	} else if (hostname.indexOf('usgs.gov') < 0) {
		searchHost = 'http://comcat.cr.usgs.gov';
		feedHost = 'http://earthquake.usgs.gov';
		tileHost = 'http://earthquake.usgs.gov';
	}

	var DEFAULT_SETTINGS = {

		// key to localStorage
		storageKey: '_MOBILE_EARTHQUAKE_APP_',

		// app settings
		searchHost: searchHost,
		timeZone: 'local', // local, epicenter, or utc
		autoUpdate: false, // true, or false
		restrictListToMap: true, // true or false

		// default to bounds set by map (conterminous US)
		mapposition: null,

		feeds: [
			{
				'id': '1day_m25',
				'name' : '1 Day, Magnitude 2.5+ Worldwide',
				'url' : feedHost + '/earthquakes/feed/v1.0/summary/2.5_day.geojsonp',
				'autoUpdate': 60 * 1000
			},
			{
				'id': '1day_all',
				'name' : '1 Day, All Magnitudes Worldwide',
				'url' : feedHost + '/earthquakes/feed/v1.0/summary/all_day.geojsonp',
				'autoUpdate': 60 * 1000
			},
			{
				'id': '7day_m45',
				'name' : '7 Days, Magnitude 4.5+ Worldwide',
				'url' : feedHost + '/earthquakes/feed/v1.0/summary/4.5_week.geojsonp',
				'autoUpdate': 60 * 1000
			},
			{
				'id': '7day_m25',
				'name' : '7 Days, Magnitude 2.5+ Worldwide',
				'url' : feedHost + '/earthquakes/feed/v1.0/summary/2.5_week.geojsonp',
				'autoUpdate': 60 * 1000
			},
			{
				'id': '7day_all',
				'name' : '7 Days, All Magnitudes Worldwide',
				'url' : feedHost + '/earthquakes/feed/v1.0/summary/all_week.geojsonp',
				'autoUpdate': 60 * 1000
			},
			// Added Significant feed here
			{
				'id': '30day_sig',
				'name': '30 Days, Significant Worldwide',
				'url': feedHost + '/earthquakes/feed/v1.0/summary/significant_month.geojsonp',
				'autoUpdate': 15 * 60 * 1000
			},
			{
				'id': '30day_m45',
				'name' : '30 Days, Magnitude 4.5+ Worldwide',
				'url' : feedHost + '/earthquakes/feed/v1.0/summary/4.5_month.geojsonp',
				'autoUpdate': 15 * 60 * 1000
			},
			{
				'id': '30day_m25',
				'name' : '30 Days, Magnitude 2.5+ Worldwide',
				'url' : feedHost + '/earthquakes/feed/v1.0/summary/2.5_month.geojsonp',
				'autoUpdate': 15 * 60 * 1000
			}
		],

		sorts: [
			{
				'id': 'newest',
				'name' : 'Newest first',
				'sort' : function (a, b) {
					return b.properties.time - a.properties.time;
				}
			},
			{
				'id': 'oldest',
				'name' : 'Oldest first',
				'sort' : function (a, b) {
					return a.properties.time - b.properties.time;
				}
			},
			{
				'id': 'largest',
				'name' : 'Largest magnitude first',
				'sort' : function (a, b) {
					return b.properties.mag - a.properties.mag;
				}
			},
			{
				'id': 'smallest',
				'name' : 'Smallest magnitude first',
				'sort' : function (a, b) {
					return a.properties.mag - b.properties.mag;
				}
			}
		],

		basemaps: [
			{
				'id': 'grayscale',
				'name': 'Grayscale',
				'url': tileHost + '/basemap/tiles/grayscale/{z}/{y}/{x}.jpg',
				'attribution': '',
				'sources': [
					{
						'zoom': 0,
						'url': tileHost + '/basemap/tiles/grayscale/{z}/{y}/{x}.jpg',
						'format': null
					},
					{
						'zoom': 9,
						'url': 'http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.jpg',
						'format': null
					}
				]
			},
			{
				'id': 'terrain',
				'name': 'Terrain',
				'url': tileHost + '/basemap/tiles/natgeo_hires/{z}/{y}/{x}.jpg',
				'attribution': '',
				'sources': [
					{
						'zoom': 0,
						'url': tileHost + '/basemap/tiles/natgeo_hires/{z}/{y}/{x}.jpg',
						'format': null
					},
					{
						'zoom': 9,
						'url': 'http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.jpg',
						'format': null
					}
				]
			},
			{
				'id': 'street',
				'name': 'Street',
				'url': 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
				'attribution': '',
				'subdomains': '1234'
			},
			{
				'id': 'satellite',
				'name': 'Satellite',
				'url': 'http://otile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg',
				'attribution': '',
				'subdomains': '1234'
			}
		],

		overlays: [
			{
				'id': 'plates',
				'name': 'Plate Boundaries',
				'url': tileHost + '/basemap/tiles/plates/{z}/{x}/{y}.png',
				'zindex': 5,
				// TODO :: Find proper attribution for this layer.
				'attribution': 'USGS'
			},
			{
				'id': 'faults',
				'name': 'U.S. Faults',
				'tileUrl': tileHost + '/basemap/tiles/faults/{z}/{x}/{y}.png',
				'dataUrl': tileHost + '/basemap/tiles/faults/{z}/{x}/{y}.grid.json?callback={cb}',
				'zindex': 4,
				// TODO :: Find proper attribution for this layer.
				'attribution': 'USGS',
				'className': 'MouseOverLayer',
				'tiptext': '{NAME}'
			},
			{
				'id': 'ushazard',
				'name': 'U.S. Hazard',
				'url': tileHost + '/basemap/tiles/ushaz/{z}/{y}/{x}.png',
				'format': 'ArcCache',
				'zindex': 3,
				'opacity': 0.6,
				'attribution': ''
			}
		],

		jumpLocations: [
			{
				name:'California',
				value:'california',
				lat1:42,
				long1:-125,
				lat2:32,
				long2:-113
			},
			{
				name:'Alaska',
				value:'alaska',
				lat1:72,
				long1:-175,
				lat2:50,
				long2:-129
			},
			{
				name:'Hawaii',
				value:'hawaii',
				lat1:22,
				long1:-160,
				lat2:18,
				long2:-154
			},
			{
				name:'Puerto Rico',
				value:'puertorico',
				lat1:20,
				long1:-70,
				lat2:16,
				long2:-62
			},
			{
				name:'U.S.',
				value:'us',
				lat1:50.0,
				long1:-125,
				lat2:24.6,
				long2:-65.0
			},
			{
				name:'World',
				value:'world'
			}
		]

	};

	var EarthquakeAppSettings = function (options) {
		var _this = this,
		    _options = Util.extend({}, DEFAULT_SETTINGS, options);

		// set defaults
		_options.defaults = Util.extend({},
			// automatic defaults
			{
				feed: _options.feeds[0].id,
				search: null,
				sort: _options.sorts[0].id,
				basemap: _options.basemaps[0].id,
				autoUpdate: _options.autoUpdate,
				restrictListToMap: _options.restrictListToMap,
				timeZone: _options.timeZone,
				mapposition: _options.mapposition,
				// overlay status, off by default
				overlays: {plates: true},
				viewModes: {
					list: true,
					map: true,
					settings: false,
					help: false
				}
			},

			// allow override of defaults
			_options.defaults
		);


		// extend Settings
		Settings.call(this, _options);


		/**
		 * @param key {String} optional, type of options to return.
		 * @return options[key] if key is provided, otherwise options.
		 */
		this.getOptions = function (key) {
			if (key) {
				return _options[key];
			} else {
				return _options;
			}
		};

		this.removeOption = function (key, option) {
			var options = this.get(key),
			    o, i, len;
			if (options && options.length) {
				len = options.length;
				for (i = 0; i < len; i++) {
					 o = options[i];
					if (o.id === option.id) { break; }
				}
				var removed = options.splice(i, 1);
				if (removed && removed.length) {
					this.set({key: options});
				}
			}
		};

		/**
		 * @return selected feed.
		 */
		this.getFeed = function () {
			var current = _this.get('feed');

			// check predefined feeds
			for (var i=0, len=_options.feeds.length; i<len; i++) {
				var f = _options.feeds[i];
				if (f.id === current) {
					return f;
				}
			}

			// check custom search
			var search = _this.get('search');
			if (search !== null && search.id === current) {
				return search;
			}

			// default to first feed
			_this.set({feed: _options.feeds[0].id});
			return _options.feeds[0];
		};

		/**
		 * @return selected sort.
		 */
		this.getSort = function () {
			var current = _this.get('sort');
			// check predefined sorts
			for (var i=0, len=_options.sorts.length; i<len; i++) {
				var s = _options.sorts[i];
				if (s.id === current) {
					return s;
				}
			}
			// default to first sort
			return _options.sorts[0];
		};

		/**
		 * @return selected basemap.
		 */
		this.getBasemap = function () {
			var current = _this.get('basemap');
			// check predefined basemaps
			for (var i=0, len=_options.basemaps.length; i<len; i++) {
				var b = _options.basemaps[i];
				if (b.id === current) {
					return b;
				}
			}
			// default to first basemap
			return _options.basemaps[0];
		};

		/**
		 * @return array of enabled overlays.
		 */
		this.getOverlays = function () {
			var current = _this.get('overlays');
			var overlays = [];
			// check predefined overlays
			for (var i=0, len=_options.overlays.length; i<len; i++) {
				var o = _options.overlays[i];
				if (current.hasOwnProperty(o.id) && current[o.id]) {
					overlays.push(o);
				}
			}
			return overlays;
		};

	};

	return EarthquakeAppSettings;

});
