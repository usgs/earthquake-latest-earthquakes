/* global define */
define([
	'leaflet',
	'map/MouseOverLayer',
	'map/SimpleAbstractLayer',
	'map/MousePosition',
	'map/ZoomControl',
	'map/EqIcon',
	'eq/LegendControl'
], function (
	L,
	MouseOverLayer,
	SimpleAbstractLayer,
	MousePosition,
	ZoomControl,
	EqIcon,
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
		EqIcon: EqIcon,
		LegendControl: LegendControl
	};

});

