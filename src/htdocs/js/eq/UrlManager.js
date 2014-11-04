/* global define, escape, unescape */
define([
], function(
) {
	'use strict';


	var UrlManager = {

		// strip URL hash from URL
	  getHash: function(url){

			if (typeof url === 'undefined' || url === null){
				url = window.location.hash;
			}

			if (url.indexOf('#') === -1) {
				return null;
			}

			var hash = url.substr(url.indexOf('#') + 1, url.length - url.indexOf('#'));

			// Fix URL encoding of settings hash
			hash = unescape(hash);

			return hash;
		},

		// get settings hash from settings object
		getSettingsHash: function(settings) {

			return JSON.stringify(settings);
		},

		// set hash using anonymous settings object
		setHash: function(settings) {

			var hash = UrlManager.getSettingsHash(settings);

			if (hash === null){
				return null;
			}

			// set the url hash based on settings
			window.location.hash = escape(hash);
		},

		// parse hash into anonymous object
		parseUrl: function(url){

			var hash = UrlManager.getHash(url);

			return JSON.parse(hash);
		},

		parseSettings: function(settings, search){

			// todo for loop
			var obj = {
					feed:              settings.feed,
					listFormat:        settings.listFormat,
					sort:              settings.sort,
					basemap:           settings.basemap,
					restrictListToMap: settings.restrictListToMap,
					timeZone:          settings.timeZone,
					mapposition:       settings.mapposition,
					overlays:          settings.overlays,
					viewModes:         settings.viewModes
			};


			if (search) {
				obj.feed = search.id;
				obj.autoUpdate = false ;
				obj.search = search;

				// Preserve map position too
				if (search.params.minlatitude && search.params.maxlatitude &&
						search.params.minlongitude && search.params.maxlongitude) {
					obj.mapposition = [
						[search.params.minlatitude, search.params.minlongitude],
						[search.params.maxlatitude, search.params.maxlongitude]
					];
				} else {
					obj.mapposition = [
						[-89.0, 0], [89.0, 360]
					];
				}

			} else {
				obj.autoUpdate = true;
			}

			return '#' + UrlManager.getSettingsHash(obj);
		}

	};

	return UrlManager;

});
