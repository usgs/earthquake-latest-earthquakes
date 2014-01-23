

define(
	["mvc/Util", "mvc/View", "./Format"],
	function(Util, View, Format) {
// begin closure


		var DEFAULTS = {
		};


		var EventSummaryView = function(options) {
			// is a view
			View.call(this, options);

			var _options = Util.extend({}, DEFAULTS, options),
				_collection = _options.collection,
				_this = this,
				_render = null;

			var _settings = options.settings;

			_this.el.className = "eventSummaryView";

			_render = function() {
				var buf = [],
					eq = _collection.getSelected();

				if (eq === null) {
					// no current selection, empty
					_this.el.innerHTML = '';
					return;
				}

				var props = eq.properties,
					geom = eq.geometry.coordinates,
					lat = geom[1],
					lon = geom[0],
					depth = geom[2];

				var time = new Date(props.time);
				var tz = props.tz;
				var system_tz = -1 * new Date().getTimezoneOffset();

				var mag = Format.magnitude(props.mag);

				buf.push('<div>');  // begin wrapper

				buf.push(
					'<h1>',
						'<a href="', props.url, '">',
							props.title,
						'</a>',
					'</h1>'
				);

				if (props.mmi !== null || props.cdi !== null || props.alert !== null || (props.tsunami !== null && props.tsunami > 0)) {
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
						var mmi = Format.mmi(props.mmi);
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
						var cdi = Format.mmi(props.cdi);
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
								'<img src="/earthquakes/eventpage/images/logos/tsunami-wave-warning.jpg" alt="Tsunami Warning Center"/>',
							'</a>'
						);
					}

					buf.push('</div>');
				}

				buf.push(
					'<dl>',
						'<dt>Time</dt>',
						'<dd>',
							'<time datetime="', Format.dateTimeWithTimezone(time, {tzText:"Z", timeSeparator:"T", withMilliseconds: true}) ,'">',
								Format.dateFromEvent(eq, _settings),
							'</time>',
						'</dd>',
						'<dt>Location</dt>',
							'<dd>', Format.latitude(lat), ' ', Format.longitude(lon), '</dd>',
						'<dt>Depth</dt>',
							'<dd>', Format.depth(depth), 'km</dd>',
					'</dl>'
				);


				buf.push('</div>'); // end wrapper

				_this.el.innerHTML = buf.join('');

				var close = document.createElement("a");
				Util.addClass(close, "close-link");
				close.innerHTML = 'x';
				close.title = "Close";

				Util.addEvent(close, "click", function(e) {
					// unbind event
					Util.removeEvent(close, "click", arguments.callee);
					_collection.deselect();
					return false;
				});
				_this.el.appendChild(close);

			};


			// when an event is selected, show selected event
			_collection.on("select", _render);
			_collection.on("deselect", _render);
			_settings.on("change:timeZone", _render);


			this.render = _render;

		};


		// return constructor from closure
		return EventSummaryView;

// end closure
	}
)
