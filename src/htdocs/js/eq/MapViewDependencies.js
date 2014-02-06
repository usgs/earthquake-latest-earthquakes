/* global define */
define([
	'leaflet',
	'map/MouseOverLayer',
	'map/SimpleAbstractLayer',
	'map/MousePosition',
	'map/ZoomControl',
	'eq/LegendControl'
], function (
	L,
	MouseOverLayer,
	SimpleAbstractLayer,
	MousePosition,
	ZoomControl,
	LegendControl
) {
	'use strict';

	// container for MapView dependencies for simpler compilation
	return {
		L: L,
		MouseOverLayer: MouseOverLayer,
		SimpleAbstractLayer: SimpleAbstractLayer,
		MousePosition: MousePosition,
		ZoomControl: ZoomControl,
		LegendControl: LegendControl
	};

});

