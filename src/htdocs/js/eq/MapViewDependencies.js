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


	/**
	 *Patch leaflet with our sourcecode.
	 *We've needed extra funtionality that leaflet didn't have.
	 *The following routines override routines in Leaflet.
	 */

	//We changed setPosition to not overwrite translations.
	//Needed for diamond markers.
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

	//Modified for the box zooming from the zoom control
	L.Draggable.prototype._onDown = function (e) {
		if ((!L.Browser.touch &&
			(e.shiftKey || L.DomUtil.hasClass(this._dragStartTarget, 'leaflet-box-zooming'))) ||
			((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		L.DomEvent.preventDefault(e);
		L.DomEvent.stopPropagation(e);

		if (L.Draggable._disabled) { return; }

		this._simulateClick = true;

		if (e.touches && e.touches.length > 1) {
			this._simulateClick = false;
			clearTimeout(this._longPressTimeout);
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    el = first.target;

		if (L.Browser.touch && el.tagName.toLowerCase() === 'a') {
			L.DomUtil.addClass(el, 'leaflet-active');
		}

		this._moved = false;
		if (this._moving) { return; }

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

		//Touch contextmenu event emulation
		if (e.touches && e.touches.length === 1 && L.Browser.touch && this._longPress) {
			this._longPressTimeout = setTimeout(L.bind(function () {
				var dist = (this._newPos && this._newPos.distanceTo(this._startPos)) || 0;

				if (dist < L.Draggable.TAP_TOLERANCE) {
					this._simulateClick = false;
					this._onUp();
					this._simulateEvent('contextmenu', first);
				}
			}, this), 1000);
		}

		L.DomEvent.on(document, L.Draggable.MOVE[e.type], this._onMove, this);
		L.DomEvent.on(document, L.Draggable.END[e.type], this._onUp, this);
	};

	//Modified for the box zooming from the zoom control
	L.Map.BoxZoom.prototype._onMouseDown = function (e) {
		if ((!L.DomUtil.hasClass(this._container, 'leaflet-box-zooming') && !e.shiftKey) || ((e.which !== 1) && (e.button !== 1))) { return false; }

		L.DomUtil.disableTextSelection();

		this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

		this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._pane);
		L.DomUtil.setPosition(this._box, this._startLayerPoint);

		//TODO refactor: move cursor to styles
		this._container.style.cursor = 'crosshair';

		L.DomEvent
		    .on(document, 'mousemove', this._onMouseMove, this)
		    .on(document, 'mouseup', this._onMouseUp, this)
		    .preventDefault(e);

		this._map.fire('boxzoomstart');
	};

	//Modified for the box zooming from the zoom control
	L.Map.BoxZoom.prototype._onMouseMove = function (e) {
		var startPoint = this._startLayerPoint,
		    box = this._box,

		    layerPoint = this._map.mouseEventToLayerPoint(e),
		    offset = layerPoint.subtract(startPoint),

		    newPos = new L.Point(
		        Math.min(layerPoint.x, startPoint.x),
		        Math.min(layerPoint.y, startPoint.y));

		L.DomUtil.setPosition(box, newPos);

		// TODO refactor: remove hardcoded 4 pixels
		box.style.width  = (Math.max(0, Math.abs(offset.x) - 4)) + 'px';
		box.style.height = (Math.max(0, Math.abs(offset.y) - 4)) + 'px';
	};

	//Modified for the box zooming from the zoom control
	L.Map.BoxZoom.prototype._onMouseUp = function (e) {
		this._pane.removeChild(this._box);
		this._container.style.cursor = '';

		L.DomUtil.enableTextSelection();

		L.DomEvent
		    .off(document, 'mousemove', this._onMouseMove)
		    .off(document, 'mouseup', this._onMouseUp);

		var map = this._map,
		    layerPoint = map.mouseEventToLayerPoint(e);

		if (this._startLayerPoint.equals(layerPoint)) { return; }

		var bounds = new L.LatLngBounds(
		        map.layerPointToLatLng(this._startLayerPoint),
		        map.layerPointToLatLng(layerPoint));

		map.fitBounds(bounds);

		if (L.DomUtil.hasClass(this._container, 'leaflet-box-zooming')) {
			L.DomUtil.removeClass(this._container, 'leaflet-box-zooming');
		}

		map.fire('boxzoomend', {
			boxZoomBounds: bounds
		});
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

