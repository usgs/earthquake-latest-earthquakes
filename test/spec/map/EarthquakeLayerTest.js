/* global afterEach, beforeEach, chai, describe, it, L, sinon */
'use strict';


var EarthquakeLayer = require('map/EarthquakeLayer');


var expect = chai.expect;


describe('map/EarthquakeLayer', function () {

  describe('constructor', function () {
    it('is a function', function () {
      expect(typeof EarthquakeLayer).to.equal('function');
    });

    it('can be destroyed', function () {
      var view;

      view = EarthquakeLayer();

      expect(view.destroy).to.not.throw(Error);
    });
  });

  describe('_initialize', function () {
    it('binds to collection reset', function () {
      var view;

      view = EarthquakeLayer();
      sinon.spy(view, 'render');
      expect(view.render.calledOnce).to.equal(false);
      view.collection.trigger('reset');
      expect(view.render.calledOnce).to.equal(true);
      view.destroy();
    });

    it('binds to model change:event', function () {
      var view;

      view = EarthquakeLayer();
      sinon.spy(view, 'onSelect');
      expect(view.onSelect.calledOnce).to.equal(false);
      view.model.trigger('change:event');
      expect(view.onSelect.calledOnce).to.equal(true);
      view.destroy();
    });
  });

  describe('addTo', function () {
    it('calls map.addLayer', function () {
      var map,
          view;

      map = {
        addLayer: sinon.spy()
      };
      view = EarthquakeLayer();
      view.addTo(map);
      expect(map.addLayer.getCall(0).args[0]).to.equal(view);
      view.destroy();
    });
  });

  describe('getLatLng', function () {
    it('gets lat/lng from event', function () {
      var view;

      view = EarthquakeLayer();
      expect(view.getLatLng({
        geometry: {
          coordinates: [1, 2, 3]
        }
      }, -180, 180)).to.deep.equal([2, 1]);
      view.destroy();
    });

    it('normalizes longitude', function () {
      var view;

      view = EarthquakeLayer();
      expect(view.getLatLng({
        geometry: {
          coordinates: [1, 2, 3]
        }
      }, -540, -180)).to.deep.equal([2, -359]);
      view.destroy();
    });
  });

  describe('getMarker', function () {
    it('gets the marker', function () {
      var eq,
          latLng,
          marker,
          pos,
          view;

      eq = {
        id: 'testid',
      };
      latLng = {};
      pos = {};
      view = EarthquakeLayer();
      view.map = {
        latLngToLayerPoint: function () {
          return pos;
        }
      };
      sinon.stub(L.DomUtil, 'setPosition', function () {});
      sinon.stub(view, 'setMarkerClasses', function () {});
      marker = view.getMarker(eq, latLng);

      // sets data-id attribute
      expect(marker.getAttribute('data-id')).to.equal('testid');
      // uses setPosition
      expect(L.DomUtil.setPosition.calledOnce).to.equal(true);
      expect(L.DomUtil.setPosition.getCall(0).args[0]).to.equal(marker);
      expect(L.DomUtil.setPosition.getCall(0).args[1]).to.equal(pos);
      // uses setMarkerClasses
      expect(view.setMarkerClasses.calledOnce).to.equal(true);
      expect(view.setMarkerClasses.getCall(0).args[0]).to.equal(eq);
      expect(view.setMarkerClasses.getCall(0).args[1]).to.equal(marker);

      L.DomUtil.setPosition.restore();
      view.setMarkerClasses.restore();
      view.destroy();
    });
  });

  describe('onAdd', function () {
    it('adds view element to overlay pane', function () {
      var overlayPane,
          map,
          view;

      overlayPane = document.createElement('div');
      map = {
        getPanes: function () {
          return {
            overlayPane: overlayPane
          };
        },
        on: sinon.spy(),
        off: sinon.spy()
      };
      view = EarthquakeLayer();
      sinon.stub(view, 'onZoomEnd', function () {});
      sinon.stub(view, 'render', function () {});
      view.onAdd(map);

      expect(overlayPane.firstChild).to.equal(view.el);
      expect(map.on.getCall(0).args[0]).to.equal('viewreset');
      expect(map.on.getCall(0).args[1]).to.equal(view.render);
      expect(map.on.getCall(1).args[0]).to.equal('zoomend');
      expect(map.on.getCall(1).args[1]).to.equal(view.onZoomEnd);
      expect(view.map).to.equal(map);
      expect(view.onZoomEnd.calledOnce).to.equal(true);
      expect(view.render.calledOnce).to.equal(true);
      view.destroy();
    });
  });

  describe('onClick', function () {
    it('sets model "event" property', function () {
      var obj,
          target,
          view;

      obj = {};
      target = document.createElement('div');
      target.setAttribute('data-id', 'testid');

      view = EarthquakeLayer();
      sinon.stub(view.collection, 'get', function () {
        return obj;
      });
      sinon.stub(view.model, 'set', function () {});

      view.onClick({
        target: target
      });
      expect(view.collection.get.getCall(0).args[0]).to.equal('testid');
      expect(view.model.set.getCall(0).args[0].event).to.equal(obj);
      view.destroy();
    });

    it('sets model "event" property to null', function () {
      var obj,
          target,
          view;

      obj = {};
      target = document.createElement('div');

      view = EarthquakeLayer();
      sinon.stub(view.collection, 'get', function () {
        return obj;
      });
      sinon.stub(view.model, 'set', function () {});

      view.onClick({
        target: target
      });
      expect(view.collection.get.calledOnce).to.equal(false);
      expect(view.model.set.getCall(0).args[0].event).to.equal(null);
      view.destroy();
    });
  });

  describe('onRemove', function () {
    var map,
        overlayPane,
        view;

    view = EarthquakeLayer();
    overlayPane = document.createElement('div');
    overlayPane.appendChild(view.el);
    map = {
      getPanes: function () {
        return {
          overlayPane: overlayPane
        };
      },
      off: sinon.spy()
    };

    view.onRemove(map);
    expect(overlayPane.children.length).to.equal(0);
    expect(map.off.callCount).to.equal(2);
    expect(map.off.getCall(0).args[0]).to.equal('viewreset');
    expect(map.off.getCall(0).args[1]).to.equal(view.render);
    expect(map.off.getCall(1).args[0]).to.equal('zoomend');
    expect(map.off.getCall(1).args[1]).to.equal(view.onZoomEnd);
    expect(view.map).to.equal(null);
    view.destroy();
  });

  describe('onSelect', function () {
    it('selects', function () {
      var view;

      view = EarthquakeLayer();

      view.el.innerHTML =
          '<div class="selected" data-id="1"></div>' +
          '<div class="selected" data-id="2"></div>' +
          '<div class="selected" data-id="3"></div>';
      expect(view.el.querySelectorAll('.selected').length).to.equal(3);

      view.model.set({
        event: {
          id: 1
        }
      });
      expect(view.el.querySelectorAll('.selected').length).to.equal(1);

      view.model.set({
        event: null
      });
      expect(view.el.querySelectorAll('.selected').length).to.equal(0);

      view.destroy();
    });
  });

  describe('render', function () {

  });

  describe('setMarkerClasses', function () {
    var el,
        view;

    beforeEach(function () {
      el = document.createElement('div');
      view = EarthquakeLayer();
    });

    afterEach(function () {
      el = null;
      view.destroy();
    });

    it('sets classes for earthquakes', function () {
      view.setMarkerClasses({
        properties: {
          mag: 2.5,
          // 30 minutes old
          time: new Date().getTime() - 1800000,
          type: 'earthquake'
        }
      }, el);
      expect(el.classList.contains('eq-age-hour')).to.equal(true);
      expect(el.classList.contains('eq-mag-2')).to.equal(true);
      expect(el.classList.contains('eq-type-eq')).to.equal(true);
    });

    it('sets classes and styles for non-earthquakes', function () {
      view.setMarkerClasses({
        properties: {
          mag: null,
          // 90 days old
          time: new Date().getTime() - 7776000000,
          type: 'quarry blast'
        }
      }, el);
      expect(el.classList.contains('eq-age-older')).to.equal(true);
      expect(el.classList.contains('eq-mag-unknown')).to.equal(true);
      expect(el.classList.contains('eq-type-other')).to.equal(true);
      expect(el.style.transform).to.equal(
          'rotate(45deg) scale(0.7071, 0.7071)');
    });
  });

});
