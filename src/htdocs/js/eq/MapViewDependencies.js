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

	//Patch leaflet with our sourcecode.
	L.DomUtil.setPosition = function (el, point, disable3D) {
				var previousTransform = null;

		el._leaflet_pos = point;

		if (!disable3D && L.Browser.any3d) {

		previousTransform = el.style[L.DomUtil.TRANSFORM] || '';

			if (previousTransform.indexOf('translate') !== -1) {
				// replace existing translate
				el.style[L.DomUtil.TRANSFORM] = previousTransform.replace(
					/translate(3d)?\([^\)]+\)/i,
					L.DomUtil.getTranslateString(point));
			} else {
				// insert translate before any other transforms (like rotate)
				el.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(point) + ' ' + previousTransform;
			}

			// workaround for Android 2/3 stability (https://github.com/CloudMade/Leaflet/issues/69)
			if (L.Browser.mobileWebkit3d) {
				el.style.WebkitBackfaceVisibility = 'hidden';
			}
		} else {
			el.style.left = point.x + 'px';
			el.style.top = point.y + 'px';
		}
	};

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

