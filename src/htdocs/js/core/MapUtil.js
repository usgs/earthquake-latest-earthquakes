'use strict';


// static object with utility methods
var MapUtil = function () {};

/**
 * Normalize bounds by shifting the point(latlng) left or right,
 * until the point is within the offset bounds
 *
 * @param bounds {2x2 Array [southWest, northEast] or LatLngBounds object}
 * @param latlng {Array [lat,lng]}
 *
 * @return true if bounds contain [lat,lng], false otherwise.
 */
MapUtil.boundsContain = function(bounds, latlng) {
  var difference,
      latitude,
      longitude,
      maxLatitude,
      maxLongitude,
      minLatitude,
      minLongitude;

  latitude = latlng[0];
  longitude = latlng[1];

  maxLatitude = bounds[1][0];
  minLatitude = bounds[0][0];

  maxLongitude = bounds[1][1];
  minLongitude = bounds[0][1];

  difference = maxLongitude - minLongitude;

  // check latitude values
  if (latitude > maxLatitude || latitude < minLatitude) {
    return false;
  }

  // longitude spans more than 360 degrees (latitude bounds were checked)
  if (difference >= 360) {
    return true;
  }

  // normalize point to be between longitude bounds
  while (longitude > maxLongitude) {
    longitude -= 360;
  }
  while (longitude < minLongitude) {
    longitude += 360;
  }

  // test with adjusted bounds
  return (longitude <= maxLongitude && longitude >= minLongitude);
};

/**
 * Converts from leaflet bounds objet to multidimensional mapposition array
 *
 * @param L.latLngBounds {object}
 *     leaflet bounds object
 *
 * @return {Array<Array>}
 *     2x2 mapposition array
 *     [
 *       [minimum latitude, minimum longitude],
 *       [maximum latitude, maximum longitude]
 *     ]
 */
MapUtil.convertBounds = function (latLng) {
  return [[latLng._southWest.lat, latLng._southWest.lng],
          [latLng._northEast.lat, latLng._northEast.lng]];
};


module.exports = MapUtil;
