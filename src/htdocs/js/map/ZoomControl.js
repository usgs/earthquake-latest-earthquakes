/* global define */
define([
	'leaflet',
	'mvc/View',
	'mvc/Util'
], function(
	L,
	View,
	Util
) {
	'use strict';


	var locations;

	L.Control.ZoomControl = L.Control.extend({

		includes: L.Mixin.Events,

		options: {
			position: 'topright'
		},

		onAdd: function (map) {
			var className = 'leaflet-zoomControl',
		    container = L.DomUtil.create('div', className);

			this._map = map;

			this._map.on('locationfound', function (/*evt*/) {
				this.fire('zoominteraction');
			}, this);
			this._map.on('scrollWheelZoomEnd', function (/*evt*/) {
				this.fire('zoominteraction');
			}, this);
			this._map.on('doubleclickzoomend', function (/*evt*/) {
				this.fire('zoominteraction');
			}, this);


			locations = this.options.getOptions('jumpLocations');

			if(locations) {
				this._createJumpList('Jump to', className + '-jump', container, this._setZoom, this);
			}
			this._createButton('-', 'Zoom out', className + '-out', container, this._zoomOut, this);
			this._createButton('+', 'Zoom in', className + '-in', container, this._zoomIn, this);
			this._createButton('', 'Box Zoom', className + '-box', container, this._boxZoom, this);

			return container;
		},

		_zoomIn: function (e) {
			this._map.zoomIn(e.shiftKey ? 3 : 1);
			this.fire('zoominteraction');
		},

		_zoomOut: function (e) {
			this._map.zoomOut(e.shiftKey ? 3 : 1);
			this.fire('zoominteraction');
		},

		_boxZoom: function (/*e*/) {
			if (L.DomUtil.hasClass(this._map._container, 'leaflet-box-zooming')) {
				L.DomUtil.removeClass(this._map._container, 'leaflet-box-zooming');
			} else {
				L.DomUtil.addClass(this._map._container, 'leaflet-box-zooming');
			}
		},

		_setZoom: function (e) {
			e = Util.getEvent(e);
			var option = e.target.value;
			var index = e.target.selectedIndex;

			// account for zoom to and geolocation (if appropriate) in dropdown indexes
			if (navigator.geolocation) {
				index -= 2;
			} else {
				index -= 1;
			}

			// catch jump to option
			if(option === 'jump') {
				return;
			}

			// handle world
			if (option === 'world') {
				this._map.fitBounds(this._map.world);
				this.fire('zoominteraction');
			} else if (option === 'geolocate') { // handle my location
				this._map.locate({setView: true, maxZoom: 8});
				// Note :: Do not fire zoominteraction here, we want to wait until the
				//         map successfully performs the geolocation, then fire after
				//         that, so we'll also listen to the map "locationfound" event,
				//         but this is done seperately
			} else {
				this._map.fitBounds([[locations[index].lat1, locations[index].long1],
						[locations[index].lat2, locations[index].long2]]);
				this.fire('zoominteraction');
			}

			// reset list
			e.target.selectedIndex = 0;
		},


		_createButton: function (html, title, className, container, fn, context) {
			var link = L.DomUtil.create('a', className, container);
			link.innerHTML = html;
			link.href = '#';
			link.title = title;

			var stop = L.DomEvent.stopPropagation;

			L.DomEvent
				.on(link, 'click', stop)
				.on(link, 'mousedown', stop)
				.on(link, 'dblclick', stop)
				.on(link, 'click', L.DomEvent.preventDefault)
				.on(link, 'click', fn, context);

			return link;
		},

		_createJumpList: function (title, className, container, fn, context) {
			var jumpList = L.DomUtil.create('select', className + 'list', container),
			    option;

			option = document.createElement('OPTION');
			option.text = 'Zoom to...';
			option.value = 'jump';
			jumpList.options.add(option);

			if(navigator.geolocation) {
				option = document.createElement('OPTION');
				option.text = 'My Location';
				option.value = 'geolocate';
				jumpList.options.add(option);
			}

			for(var i = 0; i < locations.length; ++i) {
				option = document.createElement('OPTION');
				option.text = locations[i].name;
				option.value = locations[i].value;
				jumpList.options.add(option);
			}

			//Disable propagation for old style mouse/touch
			//Includes ie11
			L.DomEvent.disableClickPropagation(container);

			//Disable propagation for ie11/microsoft touch
			L.DomEvent
				.on(jumpList, 'change', fn, context)
				.on(jumpList, 'pointerdown', function (e) {
					var evt = e ? e:window.event;
					evt.returnValue = false;
					evt.cancelBubble = true;
				});
		}

	});

	L.control.zoomControl = function (options) {
		return new L.Control.ZoomControl(options);
	};

	return L.Control.ZoomControl;
});
