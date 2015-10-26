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
        el.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(point) +
            ' ' + previousTransform;
      }

      // workaround for Android 2/3 stability
      // (https://github.com/CloudMade/Leaflet/issues/69)
      if (L.Browser.mobileWebkit3d) {
        el.style.WebkitBackfaceVisibility = 'hidden';
      }
    } else {
      el.style.left = point.x + 'px';
      el.style.top = point.y + 'px';
    }
  };

  // Modified for the box zooming from the zoom control
  // Only changes are the inclusion of the test for leaflet-box-zooming
  L.Draggable.prototype._onDown = function (e) {
    this._moved = false;

    if ((e.shiftKey || (this._dragStartTarget &&
          L.DomUtil.hasClass(this._dragStartTarget, 'leaflet-box-zooming'))) ||
          ((e.which !== 1) && (e.button !== 1) && !e.touches)) {
        return;
      }

    L.DomEvent.stopPropagation(e);

    if (L.Draggable._disabled) {
      return;
    }

    L.DomUtil.disableImageDrag();
    L.DomUtil.disableTextSelection();

    if (this._moving) {
      return;
    }

    var first = e.touches ? e.touches[0] : e;

    this._startPoint = new L.Point(first.clientX, first.clientY);
    this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

    L.DomEvent
        .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
        .on(document, L.Draggable.END[e.type], this._onUp, this);
  };

  L.Map.BoxZoom.prototype.addHooks = function () {
    L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
    L.DomEvent.on(this._container, 'touchstart', this._onMouseDown, this);
  };

  L.Map.BoxZoom.prototype.removeHooks = function () {
    L.DomEvent.off(this._container, 'mousedown', this._onMouseDown);
    L.DomEvent.off(this._container, 'touchstart', this._onMouseDown);
    this._moved = false;
  };

  L.Map.BoxZoom.prototype._onMouseDown = function (e) {
    this._moved = false;

    if ((!L.DomUtil.hasClass(this._container, 'leaflet-box-zooming') &&
        !e.shiftKey) || ((e.which !== 1) && (e.button !== 1))) {
      return false;
    }

    L.DomUtil.disableTextSelection();
    L.DomUtil.disableImageDrag();

    this._startLayerPoint = this._map.mouseEventToLayerPoint(e);

    L.DomEvent
        .on(document, 'mousemove', this._onMouseMove, this)
        .on(document, 'touchmove', this._onMouseMove, this)
        .on(document, 'mouseup', this._onMouseUp, this)
        .on(document, 'touchend', this._onMouseUp, this)
        .on(document, 'keydown', this._onKeyDown, this);
  };

  L.Map.BoxZoom.prototype._onMouseUp = function (e) {
    this._finish();

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

    map.fire('boxzoomend', {boxZoomBounds: bounds});
  };

  L.Map.BoxZoom.prototype._finish = function () {
    if (this._moved) {
      this._pane.removeChild(this._box);
      this._container.style.cursor = '';
    }

    L.DomUtil.enableTextSelection();
    L.DomUtil.enableImageDrag();

    L.DomEvent
        .off(document, 'mousemove', this._onMouseMove)
        .off(document, 'touchmove', this._onMouseMove)
        .off(document, 'mouseup', this._onMouseUp)
        .off(document, 'touchend', this._onMouseUp)
        .off(document, 'keydown', this._onKeyDown);
  };

  L.Map.mergeOptions({
    scrollWheelZoomNotifier: true
  });
  L.Map.ScrollWheelZoomNotifier = L.Map.ScrollWheelZoom.extend({
    _performZoom: function () {
      L.Map.ScrollWheelZoom.prototype._performZoom.apply(this, arguments);
      this._map.fire('scrollWheelZoomEnd');
    }
  });
  L.Map.addInitHook('addHandler', 'scrollWheelZoomNotifier', L.Map.ScrollWheelZoomNotifier);

  var oldSetView = L.Map.prototype.setView;
  L.Map.prototype.setView = function (center, zoom, options) {
    if (typeof options !== 'object') {
      options = {};
    }

    options.zoom = options.zoom || {};
    options.zoom.animate = false;

    options.pan = options.pan || {};
    options.pan.animate = false;

    return oldSetView.call(this, center, zoom, options);
  };

  var oldOnZoomTransitionEnd = L.Map.prototype._onZoomTransitionEnd;
  L.Map.prototype._onZoomTransitionEnd = function () {
    oldOnZoomTransitionEnd.apply(this, arguments);
    this.fire('zoomtransitionend');
  };

  L.Map.mergeOptions({
    doubleClickZoomNotifier: true
  });
  L.Map.DoubleClickZoomNotifier = L.Map.DoubleClickZoom.extend({
    _onDoubleClick: function () {
      L.Map.DoubleClickZoom.prototype._onDoubleClick.apply(this, arguments);
      this._map.fire('doubleclickzoomend');
    }
  });
  L.Map.addInitHook('addHandler', 'doubleClickZoomNotifier', L.Map.DoubleClickZoomNotifier);



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
