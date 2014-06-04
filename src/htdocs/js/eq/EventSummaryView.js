/* global define */
define([
	'mvc/Util',
	'mvc/View',
	'./Format'
], function(
	Util,
	View,
	Format
) {
	'use strict';


	var DEFAULTS = {
	};


	var EventSummaryView = function(options) {
		// is a view
		View.call(this, options);

		var _options = Util.extend({}, DEFAULTS, options),
		    _collection = _options.collection,
		    _this = this,
		    _render = null,
		    _settings = options.settings,
		    _summaryEl = document.createElement('div'),
		    _closeEl = document.createElement('a');

		_this._el.className = 'eventSummaryView';

		_closeEl.className = 'close-link';
		_closeEl.innerHTML = 'x';
		_closeEl.title = 'Close';
		_closeEl.addEventListener('click', function (e) {
			e.preventDefault();
			_collection.deselect();
			return false;
		});


		_render = function() {
			var buf = [],
			    eq = _collection.getSelected(),
			    props,
			    geom,
			    lat,
			    lon,
			    depth,
			    time,
			    tz,
			    system_tz,
			    mmi,
			    cdi;

			if (eq === null) {
				// no current selection, empty
				Util.empty(_this._el);
				return;
			}

			props = eq.properties;

			// title
			buf.push(
				'<h1>',
					'<a href="', props.url, '">',
						props.title,
					'</a>',
				'</h1>'
			);

			// quicksummary buttons
			if (props.mmi !== null ||
					props.cdi !== null ||
					props.alert !== null ||
					(props.tsunami !== null && props.tsunami > 0)) {
				buf.push('<div class="quicksummary">');
				if (props.alert !== null) {
					buf.push(
						'<a href="', props.url, '#pager"',
							' title="PAGER estimated impact alert level"',
							' class="alertlevel pager-alertlevel-', props.alert, '"',
						'>',
							'PAGER - <strong>', props.alert.toUpperCase(), '</strong>',
						'</a>'
					);
				}
				if (props.mmi !== null) {
					mmi = Format.mmi(props.mmi);
					buf.push(
						'<a href="', props.url, '#shakemap"',
							' title="ShakeMap maximum estimated intensity"',
							' class="maxmmi mmi', mmi, '"',
						'>',
							'ShakeMap - <strong class="roman">', mmi, '</strong>',
						'</a>'
					);
				}
				if (props.cdi !== null) {
					cdi = Format.mmi(props.cdi);
					buf.push(
						'<a href="', props.url, '#dyfi"',
							' title="Did You Feel It? maximum reported intensity (', props.felt, ' reports)"',
							' class="feltreports mmi', cdi, '"',
						'>',
							'DYFI? - <strong class="roman">', cdi, '</strong>',
						'</a>'
					);
				}
				if (props.tsunami !== null && props.tsunami > 0) {
					buf.push(
						'<a class="tsunamilogo" href="http://www.tsunami.gov/" title="Tsunami Warning Center">',
							'<img src="/earthquakes/eventpage/images/logos/tsunami.jpg" alt="Tsunami Warning Center"/>',
						'</a>'
					);
				}
				buf.push('</div>');
			}

			// details
			geom = eq.geometry.coordinates;
			lat = geom[1];
			lon = geom[0];
			depth = geom[2];
			time = new Date(props.time);
			tz = props.tz;
			system_tz = -1 * new Date().getTimezoneOffset();

			buf.push(
				'<dl>',
					'<dt>Time</dt>',
					'<dd>',
						'<time datetime="',
								Format.dateTimeWithTimezone(time,
										{tzText:'Z', timeSeparator:'T', withMilliseconds: true}),
						'">',
							Format.dateFromEvent(eq, _settings),
						'</time>',
					'</dd>',
					'<dt>Location</dt>',
						'<dd>', Format.latitude(lat), ' ', Format.longitude(lon), '</dd>',
					'<dt>Depth</dt>',
						'<dd>', Format.depth(depth), 'km</dd>',
				'</dl>'
			);

			// add summary element and close button
			_summaryEl.innerHTML = buf.join('');
			_this._el.appendChild(_summaryEl);
			_this._el.appendChild(_closeEl);
		};

		// when an event is selected, show selected event
		_collection.on('select', _render);
		_collection.on('deselect', _render);
		_settings.on('change:timeZone', _render);

		this.render = _render;
	};


	// return constructor from closure
	return EventSummaryView;
});
