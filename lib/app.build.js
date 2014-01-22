({

	dir: "../htdocs/compiled",

	baseUrl: "../htdocs/js",

	paths: {
		"leaflet": "../lib/leaflet/leaflet"
	},

	shim: {
		"leaflet": {
			exports: "L"
		}
	},

	modules: [
		{
			name: "index",
			include:[
				"../lib/require/require"
			],
			excludeShallow: [
				"eq/MapViewDependencies",
				"map/*",
				"leaflet"
			]
		},
		{
			name: "eq/MapViewDependencies",
			excludeShallow: [
				"mvc/*",
				"eq/Format"
			]
		}
	]

})

