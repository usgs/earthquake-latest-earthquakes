/* global define */
define([
	'leaflet',
	'mvc/View',
	'mvc/Util',
	'eq/Format'
], function(
	L,
	Util,
	View,
	Format
) {
	'use strict';


// Copyright 2012 Ardhi Lukianto
		// https://github.com/ardhi/Leaflet.MousePosition
		L.Control.MousePosition = L.Control.extend({
			options: {
				position: 'bottomright',
				separator: ' : ',
				emptyString: 'Unavailable',
				lngFirst: false,
				numDigits: 3,
				lngFormatter: Format.longitude,
				latFormatter: Format.latitude
			},

			onAdd: function (map) {
				this._container = L.DomUtil.create('div', 'leaflet-control-background leaflet-control-mouseposition');
				L.DomEvent.disableClickPropagation(this._container);
				map.on('mousemove', this._onMouseMove, this);
				this._container.innerHTML=this.options.emptyString;
				return this._container;
		  },

			onRemove: function (map) {
				map.off('mousemove', this._onMouseMove);
			},

			_onMouseMove: function (e) {
				var lng = L.Util.formatNum(e.latlng.lng, this.options.numDigits);
				// need to correct for rollover of map if user scrolls
				if(lng >= 0) {
					lng=((lng+180)%360)-180;
				} else {
					lng=(((lng+180)+(Math.ceil(Math.abs(lng+180)/360)*360))%360)-180;
				}
				var lat = L.Util.formatNum(e.latlng.lat, this.options.numDigits);
				if (this.options.lngFormatter) {
					lng = this.options.lngFormatter(lng);
				}
				if (this.options.latFormatter) {
					lat = this.options.latFormatter(lat);
				}
				var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
				this._container.innerHTML = value;
			}

		});

		L.control.mousePosition = function (options) {
			return new L.Control.MousePosition(options);
		};

		return L.Control.MousePosition;
});
