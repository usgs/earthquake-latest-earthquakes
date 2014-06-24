require.config({
	baseUrl: 'js',
//	urlArgs: 'stamp='+(new Date()).getTime(), /* Remove for production */
	paths: {
		leaflet: '../leaflet/dist/leaflet-src',
		localStorage: '../lib/localStorage',
		JSON: '../lib/JSON'
	},
	shim: {
		leaflet: {exports: 'L'},
		localStorage: {exports: 'localStorage'},
		JSON: {exports: 'JSON'}
	}
});



var _application;

require(
	['eq/EarthquakeApp'],
	function(EarthquakeApp) {
		'use strict';

		_application = new EarthquakeApp({
			el: document.getElementById('application')
		});

	}
);



var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-7320779-1']);
_gaq.push(['_gat.anonymizeIp']);
_gaq.push(['_trackPageview']);
(function () {
	'use strict';

	var ga = document.createElement('script');
	ga.async = true;
	ga.src = 'http://www.google-analytics.com/ga.js';
	document.querySelector('script').parentNode.appendChild(ga);
})();
