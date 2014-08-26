/* global define */
define([
	'mvc/View',
	'mvc/Util',
	'mvc/Events',
	'mvc/Application'
], function(
	View,
	Util,
	Events,
	Application
) {
	'use strict';

	var L, SimpleAbstractLayer, LegendControl;

	var DEFAULT_OPTIONS = {
		bounds: [[60.0, -150.0], [10.0, -50.0]],
		world: [[70.0, 20.0],[-70.0, 380.0]]
	};

	var AGE_HOUR = 60 * 60 * 1000;
	var AGE_DAY = AGE_HOUR * 24;
	var AGE_WEEK = AGE_DAY * 7;
	//var AGE_MONTH = AGE_DAY * 30; // Close enough

	var AGE_HOUR_CLASS = 'eq-age-hour';
	var AGE_DAY_CLASS = 'eq-age-day';
	var AGE_WEEK_CLASS = 'eq-age-week';
	var AGE_MONTH_CLASS = 'eq-age-month';

	var MAG_7_CLASS = 'eq-mag-7'; // M7.0+
	var MAG_6_CLASS = 'eq-mag-6';
	var MAG_5_CLASS = 'eq-mag-5';
	var MAG_4_CLASS = 'eq-mag-4';
	var MAG_3_CLASS = 'eq-mag-3';
	var MAG_2_CLASS = 'eq-mag-2';
	var MAG_1_CLASS = 'eq-mag-1'; // M1.0+
	var MAG_0_CLASS = 'eq-mag-0'; // Less than M1.0 (includes negatives)
	var MAG_UNKNOWN_CLASS = 'eq-mag-unknown'; // NULL/Unknown

	// class name and styles used for earthquake type events
	var TYPE_EARTHQUAKE_CLASS = 'eq-icon';
	//var TYPE_EARTHQUAKE_STYLES = [];

	// class name and styles used for non-earthquake type events
	var TYPE_NONEARTHQUAKE_CLASS = 'non-eq-icon';
	var TYPE_NONEARTHQUAKE_STYLES = [
		'-webkit-transform: rotate(45deg) scale(0.7071,0.7071)',
		'-moz-transform: rotate(45deg) scale(0.7071,0.7071)',
		'-ms-transform: rotate(45deg) scale(0.7071,0.7071)',
		'transform: rotate(45deg) scale(0.7071,0.7071)'
	];

	var SEQUENCE = 0;

	var MapView = function (options) {

		View.call(this, options);
		Util.addClass(this._el, 'mapView');

		var _options = Util.extend({}, options, DEFAULT_OPTIONS),
		    _collection = _options.collection,
		    _initialized = false,
		    _shown = false,
		    _this = this,
		    _eqLayer = null,
		    _map = null,
		    _idprefix = 'mapview-' + (++SEQUENCE) + '-',
		    _lastDataRender = null,
		    _currentLayer = null,
		    //_legendControl = null,
		    _zoomControl = null;

		// cache for created layers/overlays
		var _layers = {};
		var _overlays = {};

		var _getLayer = function(layer) {
			if (!_layers.hasOwnProperty(layer.id)) {
				_layers[layer.id] = new SimpleAbstractLayer(layer);
				_layers[layer.id].setZIndex(1);
			}
			return _layers[layer.id];
		};

		var _getOverlay = function(overlay) {
			if (!_overlays.hasOwnProperty(overlay.id)) {
				if (overlay.className && L.hasOwnProperty(overlay.className)) {
					_overlays[overlay.id] = new L[overlay.className](overlay);
				} else {
					_overlays[overlay.id] = new SimpleAbstractLayer(overlay);
				}
				if (overlay.hasOwnProperty('zindex')) {
					_overlays[overlay.id].setZIndex(overlay.zindex);
				}
			}
			return _overlays[overlay.id];
		};

		// initialize guard
		var _initializing = false;

		var _initialize = function (/*callback*/) {
			// initialize guard
			if (_initializing) {
				return;
			}
			_initializing = true;

			var mapdiv = _this._el.appendChild(document.createElement('div'));
			mapdiv.innerHTML = '<p class="loading"><img src="' +
					Application.LOADING_SPINNER +
					'" alt="" width="16" height="16"/> Loading ...</p>';

			require([
				'eq/MapViewDependencies'
			], function(d) {
				L = d.L;
				SimpleAbstractLayer = d.SimpleAbstractLayer;
				LegendControl = d.LegendControl;

				mapdiv.innerHTML = '';

				// create the map
				_map = L.map(mapdiv, {
					worldCopyJump: false,
					inertia: false,
					markerZoomAnimation: false,
					zoomControl: false,
					attributionControl: false
					doubleClickZoom: false  // Using doubleClickZoomNotifier instead
				});
				_map.world = _options.world;

				// set initial extent
				_setView();
				_setOverlays();
				_setLayer();

				// update when settings change
				_options.settings.on('change:feed', _setFeedView);
				_options.settings.on('change:overlays', _setOverlays);
				_options.settings.on('change:basemap', _setLayer);
				_options.settings.on('change:mapposition', _setView);
				_map.on('locationerror', _onLocationError);
				_map.on('zoomend', _onMapZoomEnd);
				_map.fire('zoomend'); // Add initial zoom class to map container
				_shown = true;
				_this.trigger('mapshown');

				_map.on('click', function(e) {
					// marker clicks = select
					if (e.originalEvent) {
						// on ie8, originalEvent still missing target property
						e = Util.getEvent(e.originalEvent);
						if (e.target && e.target.id) {
							var eid = e.target.id.replace(_idprefix, '');
							if (eid !== e.target.id) {
								var item = _collection.get(eid);
								if (item) {
									_collection.select(item);
									return;
								}
							}
						}
					}
					// otherwise = deselect
					_collection.deselect();
				});

				_zoomControl = L.control.zoomControl(_options.settings);

				// This updates earthquake marker placements
				_map.on('moveend', _onMapMoveEnd, this);

				// This saves the map state in the URL
				_map.on('boxzoomend', _userInteraction);
				_map.on('dragend', _userInteraction);
				_map.on('dblclick', _userInteraction);
				_zoomControl.on('zoominteraction', _userInteraction);

				// add layer group that will hold earthquake markers
				_eqLayer = L.layerGroup().addTo(_map);

				// zoom controls
				_zoomControl.addTo(_map);

				// map scale
				_map.addControl(new L.Control.Scale({'position':'bottomleft'}));

				// add earthquake age legend
				_map.addControl(new LegendControl());

				// mouse position coords
				L.control.mousePosition().addTo(_map);

				// ready to render now
				_initialized = true;
				_this.render();
			});
		};

		var _onLocationError = function (e) {
			Events.trigger('locationError', e);
		};

		var _setView = function() {
			// get saved bounds, use default if none exists
			var mapposition = _options.settings.get('mapposition');
			if (mapposition === null) {
				mapposition = _options.bounds;
			}

			// using old center & zoom? update settings accordingly
			if (mapposition.center !== undefined && mapposition.zoom !== undefined) {
				_map.setView(mapposition.center, mapposition.zoom);
				_save(_map.getBounds());
				return;
			}

			// has a shown map even moved? don't change if not
			var b = new L.LatLngBounds(mapposition);
			if (_shown && b.equals(_map.getBounds())) {
				return;
			}

			// calculate the zoom from the saved bounds and set the view
			// As of this version, Leaflet fails to return the same bounds as the ones
			// it sets (_map.fitBounds(_map.getBounds() will change the map position).
			// This series of calculations will get a variety of different possible
			// bounds and use the average of them.  It is very dirty and hacky, but at
			// the moment it works.  This should only be happening on page reload and
			// "reset to defaults".
			_map.fitBounds(new L.LatLngBounds(mapposition));
			b = new L.LatLngBounds(mapposition);
			var tr = _map.latLngToLayerPoint(b.getNorthEast()),
			    bl = _map.latLngToLayerPoint(b.getSouthWest()),
			    cen = new L.Point((bl.x + tr.x) / 2, (bl.y + tr.y) / 2),
			    latlng = _map.layerPointToLatLng(cen),
			    zoom = _map.getBoundsZoom(mapposition),
			    zoomOut = _map.getBoundsZoom(b.pad(-0.005)),
			    zoomIn = _map.getBoundsZoom(b.pad(0.005)),
			    zoomPrime = _map.getBoundsZoom(mapposition, true),
			    zoomOutPrime = _map.getBoundsZoom(b.pad(-0.005), true),
			    zoomInPrime = _map.getBoundsZoom(b.pad(0.005), true);

			_map.setView(latlng, Math.round((zoom + zoomOut + zoomIn + zoomPrime +
					zoomOutPrime + zoomInPrime) / 6), true);
		};

		var _userInteraction = function () {
			_save(_map.getBounds());
		};

		var _save = function(bounds) {
			_options.settings.set({
				'mapposition' : [
					[bounds.getSouthWest().lat, bounds.getSouthWest().lng],
					[bounds.getNorthEast().lat, bounds.getNorthEast().lng]
				]
			});
		};

		var _setFeedView = function () {
			var feed = _options.settings.getFeed();
			if (feed.hasOwnProperty('minlatitude') &&
					feed.hasOwnProperty('minlongitude') &&
					feed.hasOwnProperty('maxlatitude') &&
					feed.hasOwnProperty('maxlongitude')) {
				_map.fitBounds([
					[
						feed.minlatitude,
						feed.minlongitude
					],
					[
						feed.maxlatitude,
						feed.maxlongitude
					]
				]);
			} else if (feed.hasOwnProperty('isSearch') && feed.isSearch) {

				// Custom feed without bounds, zoom to "world"
				_map.fitBounds(_options.world);
			}
		};

		var _setLayer = function() {
			var layer = _options.settings.getBasemap(),
					layerObj = _getLayer(layer);

			if (_currentLayer !== layerObj && _currentLayer !== null) {
				_map.removeLayer(_currentLayer);
			}
			_currentLayer = layerObj;
			_map.addLayer(_currentLayer, true);
		};

		var _setOverlays = function() {
			var overlays = _options.settings.getOverlays();

			// keep track of which overlays on are the map
			var onMap = {};

			// add current overlays
			for (var i=0; i<overlays.length; i++) {
				var overlayObj = _getOverlay(overlays[i]);
				_map.addLayer(overlayObj);
				onMap[overlays[i].id] = true;
			}

			// remove existing overlays that are no longer selected
			for (var id in _overlays) {
				if (!onMap.hasOwnProperty(id)) {
					_map.removeLayer(_overlays[id]);
				}
			}
		};

		var _onMapZoomEnd = function (/*zoom_end_event*/) {
			var currentZoom = _map.getZoom();

			var zoomClassEl = Util.getParentNode(_this._el, 'ARTICLE', null);
			if (currentZoom > 10) {
				Util.addClass(zoomClassEl, 'zoomedin');
				Util.removeClass(zoomClassEl, 'zoomednormal');
				Util.removeClass(zoomClassEl, 'zoomedout');
			} else if (currentZoom > 5) {
				Util.addClass(zoomClassEl, 'zoomednormal');
				Util.removeClass(zoomClassEl, 'zoomedin');
				Util.removeClass(zoomClassEl, 'zoomedout');
			} else {
				Util.addClass(zoomClassEl, 'zoomedout');
				Util.removeClass(zoomClassEl, 'zoomedin');
				Util.removeClass(zoomClassEl, 'zoomednormal');
			}
		};

		var _onMapMoveEnd = function(/*e*/) {
			if (_map === null || _eqLayer === null ||
					_map.getSize().equals(new L.Point(0, 0))) {
				return;
			}

			// move earthquake markers to either side of map center
			var layers = _eqLayer._layers,
			    renderWindow = _getRenderWindow(),
			    lngmin = renderWindow.min,
			    lngmax = renderWindow.max;

			// loop over earthquakes
			for (var i in layers) {
				if (layers.hasOwnProperty(i)) {
					var layer = layers[i],
					    layerLatLng = layer.getLatLng(),
					    layerLng = layerLatLng.lng;

					// check if out of view port
					if (layerLng > lngmax || layerLng < lngmin) {

						// change position
						layerLatLng.lng = _normalize(layerLatLng.lng, lngmin, lngmax);
						layer.setLatLng(layerLatLng);
					}
				}
			}
		};

		var _normalize = function (longitude, min, max) {
			while (longitude > max) { longitude -= 360; }
			while (longitude < min) { longitude += 360; }
			return longitude;
		};

		var _getRenderWindow = function () {
			var bounds = _map.getBounds(),
			    sw = bounds.getSouthWest(),
			    ne = bounds.getNorthEast(),
			    lng0 = sw.lng,
			    lng1 = ne.lng,
			    // center of map in longitude
			    lngcenter = (lng0 + lng1) / 2,
			    // markers between min and center are positioned left of center
			    lngmin = lngcenter - 180,
			    // markers between max and center are positioned right of center
			    lngmax = lngcenter + 180;

			return {min:lngmin, max:lngmax};
		};

		var _addMarkersToMap = function(items) {
			var renderWindow = _getRenderWindow();

			// loops through events in the collection, adds markers to map
			for(var i=items.length-1; i>=0; i--) {
				_eqLayer.addLayer(_buildMarker(items[i], {normalize:renderWindow}));
			}
		};

		var _buildMarker = function (item, options) {

			// takes a geojson feature and builds a marker to place on the map
			var properties = item.properties,
			    geometry   = item.geometry.coordinates,
			    now        = new Date().getTime(),
			    latitude   = geometry[1],
			    longitude  = geometry[0],
			    time       = properties.time,
			    age        = now - time,
			    ageClass   = AGE_MONTH_CLASS,
			    magnitude  = properties.mag, // mag may be null
			    magClass   = MAG_UNKNOWN_CLASS, // if mag is null, this is good
			    type       = properties.type,
			    iconClass  = TYPE_EARTHQUAKE_CLASS,
			    iconStyles = [];

			if (age <= AGE_HOUR) {
				ageClass = AGE_HOUR_CLASS;
			} else if (age <= AGE_DAY) {
				ageClass = AGE_DAY_CLASS;
			} else if (age <= AGE_WEEK) {
				ageClass = AGE_WEEK_CLASS;
			}

			if (magnitude >= 7.0) {
				magClass = MAG_7_CLASS;
			} else if (magnitude >= 6.0) {
				magClass = MAG_6_CLASS;
			} else if (magnitude >= 5.0) {
				magClass = MAG_5_CLASS;
			} else if (magnitude >= 4.0) {
				magClass = MAG_4_CLASS;
			} else if (magnitude >= 3.0) {
				magClass = MAG_3_CLASS;
			} else if (magnitude >= 2.0) {
				magClass = MAG_2_CLASS;
			} else if (magnitude >= 1.0) {
				magClass = MAG_1_CLASS;
			} else if (magnitude < 1.0) {
				magClass = MAG_0_CLASS;
			}

			if (type !== 'earthquake' && type !== 'induced or triggered event') {
				iconClass = TYPE_NONEARTHQUAKE_CLASS;
				iconStyles = TYPE_NONEARTHQUAKE_STYLES;
			}

			if (options.normalize && options.normalize.hasOwnProperty('min') &&
					options.normalize.hasOwnProperty('max')) {
				longitude = _normalize(longitude, options.normalize.min,
						options.normalize.max);
			}

			var marker = new L.Marker(new L.LatLng(latitude, longitude), {
				icon: new L.EqIcon({
					className: iconClass,
					iconId: _idprefix+item.id,
					iconClasses: [ageClass, magClass],
					iconStyles: iconStyles
				}),
				zIndexOffset: parseInt(time/1000, 10)
			});

			return marker;
		};

		/**
		 * Bounds contain test that accounts for leaflets handling for longitude.
		 *
		 * When initial bounds.contains fails: shifts bounds left or right,
		 * until northEast is less than one world to the right of test point and repeats test.
		 *
		 * @param bounds {4x4 Array [southWest, northEast] or LatLngBounds object}
		 * @param latlng {leaflet LatLng}
		 * @return true if bounds contain latlng, before or after normalization, false otherwise.
		 */
		this.boundsContain = function(bounds, latlng) {

			if (Util.isArray(bounds)) {
				bounds = new L.LatLngBounds(bounds);
			}

			if (Util.isArray(latlng)) {
				latlng = new L.LatLng(latlng[0], latlng[1]);
			}

			// simple test
			if (bounds.contains(latlng)) {
				return true;
			}

			// longitude may be off by world(s), adjust east bound to (just) right of test point
			while (bounds._northEast.lng > latlng.lng + 360) {
				bounds._northEast.lng -= 360;
				bounds._southWest.lng -= 360;
			}
			while (bounds._northEast.lng < latlng.lng) {
				bounds._northEast.lng += 360;
				bounds._southWest.lng += 360;
			}

			// now test with adjusted bounds
			return bounds.contains(latlng);
		};

		var _collectionSelect = function(selected, options) {
			var id = selected.id;
			var row = document.getElementById(_idprefix + id);
			Util.addClass(row, 'selected');

			if (options && options.reset) {
				return;
			}
			_this.panToFeature(selected);
		};

		//private select

		//public pan to
		this.panToFeature = function(selected) {
			// make sure it's visible in the map area
			if (_map !== null) {
				var geometry = selected.geometry.coordinates,
				    latitude = geometry[1],
				    longitude = geometry[0],
				    latlng = new L.LatLng(latitude, longitude);

				if (!_this.boundsContain(_map.getBounds(), latlng)) {

					// eq not in view, recenter
					var pad = 5;
					var bounds = new L.LatLngBounds(
							[Math.max(latitude-pad, -90), Math.max(longitude-pad, -180)],
							[Math.min(latitude+pad,	90), Math.min(longitude+pad,	180)]);

					if (bounds.intersects(_map.getBounds())) {

						// zoomed in and nearby, pan instead of zooming out
						_map.panTo(latlng);
					} else {

						// zoom to box around eq
						_map.fitBounds(bounds);
					}
				}
			}
		};

		var _collectionDeselect = function(selected) {
			var id = selected.id,
			    row = document.getElementById(_idprefix + id);
			Util.removeClass(row, 'selected');
		};

		_collection.on('select', _collectionSelect);
		_collection.on('deselect', _collectionDeselect);

		/**
			* @return {LatLngBounds}
			*			If this view has been initialized with a map, returns the
			*			current map bounds. If no map exists, then just returns null.
			*/
		this.getBounds = function () {
				if (_map) {
					return _map.getBounds();
				}
				return null;
		};

		this.wasShown = function() {
			return _shown;
		};

		this.render = function(force){
			if (!_initialized) {
				_initialize();
				return;
			}

			_map.invalidateSize();

			if (!force && _lastDataRender !== null &&
					_lastDataRender.generated === _collection.generated &&
					_lastDataRender.url === _collection.url) {
				return;
			}

			// keep track of last updated to avoid unnecessary re-renders
			_lastDataRender = {
				generated: _collection.generated,
				url: _collection.url
			};

			_eqLayer.clearLayers();
			_addMarkersToMap(_collection.data());

			var selected = _collection.getSelected();
			if (selected !== null) {
				_collectionSelect(selected);
			}
		};

		this.getMap = function () {
			return _map;
		};

		this.isInitialized = function () {
			return _initialized;
		};
	};
	return MapView;
});
