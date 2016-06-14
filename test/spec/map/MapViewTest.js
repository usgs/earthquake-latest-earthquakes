/* global afterEach, beforeEach, chai, describe, it, L, sinon */
'use strict';

var MapView = require('map/MapView'),
    Model = require('mvc/Model');

var expect = chai.expect;

var model = {
  'event': {
    'geometry': {
      'coordinates': [
        -89.426,
        36.285,
        6.684
      ]
    }
  },
  'viewModes': [
    {
      'id': 'list'
    },
    {
      'id': 'map'
    }
  ],
  'mapposition': [
    [4.0176, -102.52],
    [30.372, -86.813]
  ],
  'restrictListToMap': [
    {
      id: 'restrictListToMap',
      name: 'Only List Earthquakes Shown on Map'
    }
  ]
};

// This model is needed to show different outcomes for diffent properties on
// the model.
var model2 ={
  'event': {
    'geometry': {
      'coordinates': [
        -89.426,
        36.285,
        6.684
      ]
    }
  },
  'viewModes': [
    {
      'id': 'list'
    },
    {
      'id': 'settings'
    }
  ],
  'restrictListToMap': [

  ]
};

describe('map/Mapview', function () {
  describe('constructor', function () {
    it('Can be required', function () {
      /* jshint -W030 */
      expect(MapView).to.not.be.null;
      /* jshint +W030 */
    });

    it('can be destroyed', function () {
      var view;

      view = MapView();
      expect(view.destroy).to.not.throw(Error);
    });
  });

  describe('getPaddedBounds', function () {
    it('gets bounds around given point', function () {
      var bounds,
          view;

      bounds = new L.LatLngBounds([25,45],[35,55]);

      view = MapView();

      expect(view.getPaddedBounds(30, 50)).to.deep.equal(bounds);
    });
  });

  describe('deselectEventonMoveEnd', function () {
    it('sets event on the model to null', function () {
      var getBounds,
          isFilterEnabled,
          view;

      view = MapView({model: Model(model)});

      getBounds = sinon.stub(view.map, 'getBounds', function () {
        return new L.LatLngBounds(
          [35.413496049701955, -62.57812500000001],
          [-11.43695521614319, -93.9990234375]
        );
      });

      isFilterEnabled = sinon.stub(view, 'isFilterEnabled', function () {
        return true;
      });

      view.deselectEventonMoveEnd();

      expect(view.model.get('event')).to.equal(null);

      getBounds.restore();
      isFilterEnabled.restore();
      view.destroy();
    });
  });

  describe('getEventLocation', function () {
    it('gets latitude and longitude of an event', function () {
      var view;

      view = MapView({
        model: Model(model)
      });

      expect(view.getEventLocation()).to.deep.equal([36.285, -89.426]);

      view.destroy();
    });
  });

  describe('hasBounds', function () {
    it('returns bounds', function () {
      var view;

      view = MapView();

      expect(view.hasBounds()).to.equal(false);
    });
  });

  describe('isEnabled', function () {
    it('returns true if map is found', function () {
      var view;

      view = MapView({
        model: Model(model)
      });

      expect(view.isEnabled()).to.equal(true);

      view.destroy();
    });

    it('returns false if map is not found', function () {
      var view;

      view = MapView({
        model: Model(model2)
      });

      expect(view.isEnabled()).to.equal(false);

      view.destroy();
    });
  });

  describe('isFilterEnabled', function () {
    it('returns false if filter is not set', function () {
      var view;

      view = MapView({model: Model(model2)});

      expect(view.isFilterEnabled()).to.equal(false);

      view.destroy();

    });

    it('returns true if filter is set', function () {
      var view;

      view = MapView({model: Model(model)});

      expect(view.isFilterEnabled()).to.equal(true);

      view.destroy();
    });
  });

  describe('renderScheduled', function () {
    it('returns _renderScheduled', function () {
    });
  });

  describe('onChangeEvent', function () {
    var fitBounds,
        getBounds,
        getEventLocation,
        panToStub,
        view;

    afterEach(function () {
      fitBounds.restore();
      getBounds.restore();
      getEventLocation.restore();
      panToStub.restore();

      view.destroy();
    });

    beforeEach(function () {
      view = MapView({model: Model(model)});

      getEventLocation = sinon.stub(view, 'getEventLocation', function () {
        return [17.6042, -94.6667];
      });

      getBounds = sinon.stub(view.map, 'getBounds', function () {
        return new L.LatLngBounds(
          [40.413496049701955, -62.57812500000001],
          [-11.43695521614319, -93.9990234375]
        );
      });

      fitBounds = sinon.stub(view.map, 'fitBounds', function () {});
      panToStub = sinon.stub(view.map, 'panTo', function () {});
    });

    it('pans to event', function () {
      view.onChangeEvent();
      expect(panToStub.callCount).to.equal(1);
    });

    it('changes bounds to event', function () {
      getBounds.restore();
      getBounds = sinon.stub(view.map, 'getBounds', function () {
        return new L.LatLngBounds(
          [40.07807142745009, -41.1767578125],
          [-11.867350911459308, -72.59765625]
        );
      });
      view.onChangeEvent();
      expect(fitBounds.callCount).to.equal(1);
    });
  });

  describe('onClick', function () {
    it('deselects event', function () {
      var view;

      view = MapView({
        model: Model(model)
      });

      view.onClick();

      expect(view.model.get('event')).to.equal(null);

      view.destroy();
    });
  });

  describe('onMoveEnd', function () {
    var deselectEventonMoveEnd,
        getBounds,
        isEnabled,
        hasBounds,
        view;

    afterEach(function () {
      deselectEventonMoveEnd.restore();
      getBounds.restore();
      isEnabled.restore();
      hasBounds.restore();

      view.destroy();
    });

    beforeEach(function () {
      view = MapView({model: Model(model)});

      deselectEventonMoveEnd = sinon.stub(view, 'deselectEventonMoveEnd', function () {
        return;
      });

      getBounds = sinon.stub(view.map, 'getBounds', function () {
        return new L.LatLngBounds(
          [35.413496049701955, -62.57812500000001],
          [-11.43695521614319, -93.9990234375]
        );
      });

      isEnabled = sinon.stub(view, 'isEnabled', function () {
        return true;
      });

      hasBounds = sinon.stub(view, 'hasBounds', function () {
        return true;
      });

      view.onMoveEnd();
    });

    it('sets bounds', function () {
      expect(view.model.get('mapposition')).to.deep.equal(
        [[-11.43695521614319, -93.9990234375],
        [35.413496049701955, -62.57812500000001]]
      );
    });

    it('sets onMoveEndTriggered to false', function () {
      expect(view.onMoveEndTriggered).to.equal(false);
    });

    it('sets ignoreNextMoveEnd to false', function () {
      expect(view.ignoreNextMoveEnd).to.equal(false);
    });
  });

  describe('renderBasemapChange', function () {
    it('removes baselayer', function () {
      var removeLayer,
          view;

      view = MapView({model: Model(model)});
      removeLayer = sinon.stub(view.map, 'removeLayer', function () {});
      view.basemap = true;
      view.renderBasemapChange();

      expect(removeLayer.callCount).to.equal(1);

      removeLayer.restore();
      view.destroy();
    });

    it('adds new basemap', function () {
      var addLayer,
          model,
          view;

      model = {
        'basemap': {
          'id': 'grayscale'
        }
      };

      view = MapView({model: Model(model)});
      addLayer = sinon.stub(view.map, 'addLayer', function () {});
      view.renderBasemapChange();

      expect(addLayer.callCount).to.equal(1);

      addLayer.restore();
      view.destroy();
    });
  });

  describe('renderMapPositionChange', function () {
    it('if the map does not have the same bounds as the model calls fitBounds',
        function () {
      var fitBounds,
          getBounds,
          view;

      view = MapView({
        model: Model(model)
      });

      getBounds = sinon.stub(view.map, 'getBounds', function () {
        return new L.LatLngBounds(
          [40.413496049701955, -62.57812500000001],
          [-11.43695521614319, -93.9990234375]
        );
      });

      fitBounds = sinon.stub(view.map, 'fitBounds', function () {});

      view.renderMapPositionChange();


      expect(fitBounds.callCount).to.equal(1);

      getBounds.restore();
      fitBounds.restore();
      view.destroy();
    });
  });

  describe('renderViewModesChange', function () {
    var invalidateSize,
        isEnabled,
        view;

    view = MapView({model: Model(model)});

    isEnabled = sinon.stub(view, 'isEnabled', function () {
      return true;
    });

    invalidateSize = sinon.stub(view.map, 'invalidateSize', function () {
      return;
    });

    view.renderViewModesChange();

    it('calls invalidateSize', function () {
      expect(invalidateSize.callCount).to.equal(1);
    });

    isEnabled.restore();
    invalidateSize.restore();
    view.destroy();
  });
});
