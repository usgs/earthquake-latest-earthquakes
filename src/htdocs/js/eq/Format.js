/* global define */
define([
	'mvc/Util'
], function(
	Util
) {
	'use strict';


	// defaults for the dateTimeWithTimezone function
	var DATETIME_WITH_TIMEZONE_DEFAULTS = {
		tz: 0,
		tzText: ''
	};

	// defaults for iso8601 function
	var ISO8601_DEFAULTS = {
		timeSeparator: ' ',
		withMilliseconds: false
	};


	/** Static object with utility methods. */
	var Format = {

		latitude: function(n) {
			return [Math.abs(n).toFixed(3), '&deg;', (n<0?'S':'N')].join('');
		},

		longitude: function(n) {
			return [Math.abs(n).toFixed(3), '&deg;', (n<0?'W':'E')].join('');
		},

		depth: function(n) {
			return (n===null||isNaN(n)?'-':n.toFixed(1));
		},

		magnitude: function(n) {
			return (n===null||isNaN(n)?'?':n.toFixed(1));
		},

		mmi: function(n) {
			var buf = [],
				val = Math.max(Math.round(n), 1);

			if (val >= 10) {
				buf.push('X');
				val -= 10;
			}
			if (val === 9) {
				buf.push('IX');
				val -= 9;
			}
			if (val >= 5) {
				buf.push('V');
				val -= 5;
			}
			if (val === 4) {
				buf.push('IV');
				val -= 4;
			}
			while (val > 0) {
				buf.push('I');
				val -= 1;
			}
			return buf.join('');
		},

		dateTime: function(d) {
			return this.iso8601(d);
		},

		dateFromEvent: function(event, settings) {

			var time = new Date(event.properties.time);
			var zone = {tz : null};
			switch (settings.get('timeZone')) {
				case 'epicenter' :
					if (event.properties.tz === null) {
						return 'Epicenter time not available';
					}
					zone.tz = event.properties.tz;
					zone.tzText = ' UTC' + (this.isoTimezone(event.properties.tz));
					break;
				case 'utc' :
					zone.tz = 0;
					zone.tzText = ' UTC';
					break;
				default : // local
					zone.tz = -1 * new Date().getTimezoneOffset();
					zone.tzText = ' UTC' + (this.isoTimezone(zone.tz));
			}
			return this.dateTimeWithTimezone(time, zone);
		},

		dateTimeWithTimezone: function(d, options) {
			var _options = Util.extend({}, DATETIME_WITH_TIMEZONE_DEFAULTS, options);
			var val = new Date(d.getTime());

			if (_options.tz !== 0) {
				val.setTime(val.getTime()+_options.tz*60*1000);
				if (_options.tzText === '') {
					_options.tzText = this.isoTimezone(_options.tz);
				}
			}

			return this.iso8601(val, _options) + _options.tzText;
		},

		iso8601: function(d, options) {
			var _options = Util.extend({}, ISO8601_DEFAULTS, options),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth()+1,
				day = d.getUTCDate(),
				hour = d.getUTCHours(),
				minute = d.getUTCMinutes(),
				second = d.getUTCSeconds(),
				millis = d.getUTCMilliseconds(),
				buf = [];

			buf.push(
				year, '-',
				(month < 10 ? '0' : ''), month, '-',
				(day < 10 ? '0' : ''), day,
				_options.timeSeparator,
				(hour < 10 ? '0' : ''), hour, ':',
				(minute < 10 ? '0' : ''), minute, ':',
				(second < 10 ? '0' : ''), second
			);

			if (_options.withMilliseconds !== false) {
				buf.push(
					'.', (millis < 10 ? '0' : ''), (millis < 100 ? '0' : ''), millis
				);
			}

			return buf.join('');
		},

		isoTimezone: function(tz) {
			var val = Math.abs(tz),
				hours = parseInt(val / 60, 10),
				minutes = val % 60;

			return [
				(tz < 0 ? '-' : '+'),
				(hours < 10 ? '0' : ''), hours, ':',
				(minutes < 10 ? '0' : ''), minutes
			].join('');
		}

	};


	return Format;
});
