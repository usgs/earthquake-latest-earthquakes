define([
	'mvc/View',
	'mvc/Util',
	'./Format'
], function (View, Util, Format) {

	var DEFAULTS = {
	};

	var SEQUENCE = 0;

	var ListView = function (options) {
		View.apply(this, arguments);

		this._options = Util.extend({}, DEFAULTS, options);
		this._idprefix = "listview-" + (++SEQUENCE) + "-";
		this._lastDataRender = null;

		Util.addClass(this.el, "listView");
		this.initialize();
		this._bindEvents();
	};

	// Extend the base View with custom methods and state
	ListView.prototype = {

		// dom elements
		elements: {
			"header" : null,
			"title" : null,
			"timestamp" : null,
			"count" : null,
			"downloads" : null,
			"downloadsLink" : null,
			"filtered" : null,
			"content" : null,
			"footer" : null
		},

		// ------------------------------------------------------------
		// Public methods
		// ------------------------------------------------------------

		/**
		* Creates the view
		*/
		initialize: function() {

			// header
			this.elements['header'] = document.createElement('div');
			Util.addClass(this.elements['header'], 'listHeader');

			// feed/search title
			this.elements['title'] = document.createElement('h1');
			Util.addClass(this.elements['title'], 'title');
			this.elements['header'].appendChild(this.elements['title']);

			// count/download
			var cnt_dnld = this.elements['header'].appendChild(
					document.createElement('span'));
			this.elements['count'] = cnt_dnld.appendChild(
					document.createElement('strong'));
			cnt_dnld.appendChild(document.createTextNode(' earthquakes - '));
			this.elements['downloadsLink'] = cnt_dnld.appendChild(
					document.createElement('a'));
			this.elements['downloadsLink'].href = 'javascript:void(null);';
			this.elements['downloadsLink'].innerHTML = 'Download';

			// downloads
			this.elements['downloads'] = this.elements['header'].appendChild(
					document.createElement('ul'));
			Util.addClass(this.elements['downloads'], 'downloads');

			// timestamp
			this.elements['timestamp'] = this.elements['header'].appendChild(
					document.createElement('span'));
			Util.addClass(this.elements['timestamp'], 'updated');
			this.elements['timezone'] = this.elements['header'].appendChild(
					document.createElement('span'));
			Util.addClass(this.elements['timezone'], 'timezone');

			// append header to container
			this.el.appendChild(this.elements['header']);

			Util.addEvent(this.elements['downloadsLink'], 'click', (function (view) {
				return function (clickEvent) {
					if (Util.hasClass(view.el, 'showDownloads')) {
						Util.removeClass(view.el, 'showDownloads');
					} else {
						Util.addClass(view.el, 'showDownloads');
					}
				};
			})(this));

			// filtered event count
			this.elements['filtered'] = document.createElement('span');
			Util.addClass(this.elements['filtered'], 'showing');
			this.elements['header'].appendChild(this.elements['filtered']);

			// the list of events
			this.elements['content'] = document.createElement('ol');
			Util.addClass(this.elements['content'], 'listContent');
			this.el.appendChild(this.elements['content']);

			// the footer
			this.elements['footer'] = document.createElement('div');
			Util.addClass(this.elements['footer'], 'listFooter');
			this.el.appendChild(this.elements['footer']);
			this._generateListFooterMarkup();
		},

		/**
		* Renders the list in the container if the list is currently
		* visible.
		*/
		render: function (_force) {
			var items,
			    inBounds = null,
			    collection = this._options.collection,
			    settings = this._options.settings,
			    viewModes = settings.get('viewModes'),
			    mapView = this._options.app.getView('map'),
			    wasShown = mapView.wasShown(),
			    bounds = null,
			    selected = collection.getSelected();

			if (!wasShown && (viewModes &&
					viewModes.hasOwnProperty('map') && viewModes.map === true)) {
				// Map will show, but has not yet shown. Wait for map to load,
				// list render will be called again when mapShown event fires.
				return;
			}

			if (wasShown && settings.get('restrictListToMap')) {
				bounds = settings.get('mapposition');
				if (bounds) {
					inBounds = function (_item) {
						var c = _item.geometry.coordinates;
						return mapView.boundsContain(bounds, [c[1], c[0]]);
					};

					// deselect if out of bounds and list is restricted to map
					var selected = collection.getSelected();
					if (selected !== null && !inBounds(selected)) {
						collection.deselect();
					}
				}
			}

			if (!_force && this._renderUpToDate(collection, settings, bounds)) {
				return;
			}

			// grab a _copy_ of the collection
			items = this._getListItems(collection.data().slice(0),
					settings.getSort().sort, inBounds);

			// generate list header
			this._generateListHeaderMarkup(items, bounds !== null);

			// generate list content
			this._generateListMarkup(items);

			if (selected !== null) {
				this._collectionSelect(selected);
			}

			// have updated since last collection reset
			this._lastDataRender = {
				generated: collection.generated,
				url: collection.url,
				sort: settings.get("sort"),
				timeZone: settings.get("timeZone"),
				bounds: bounds
			};
		},

		// ------------------------------------------------------------
		// Private methods
		// ------------------------------------------------------------

		/**
		 * Check if anything has changed since the last render
		 *
		 * @return {Boolean}
		 *			True if rendering is up-to-date and is not required. False
		 *			otherwise.
		 */
		_renderUpToDate: function (_collection, _settings, _bounds) {
			var lastDataRender = this._lastDataRender;

			return (lastDataRender !== null &&
					lastDataRender.generated === _collection.generated &&
					lastDataRender.url === _collection.url &&
					lastDataRender.sort === _settings.get("sort") &&
					// have bounds changed, and do we care
					(_bounds && this._boundsEqual(_bounds, lastDataRender.bounds)) &&
					lastDataRender.timeZone === _settings.get("timeZone"));
		},

		_boundsEqual: function (a, b) {
			try {
				if (
						!isNaN(a[0][0]) && !isNaN(a[1][0]) && !isNaN(a[0][1]) &&
						!isNaN(a[1][1]) && !isNaN(b[0][0]) && !isNaN(b[1][0]) &&
						!isNaN(b[0][1]) && !isNaN(b[1][1]) && (a[0][0] === b[0][0]) &&
						(a[1][0] === b[1][0]) && (a[0][1] === b[0][1]) && (a[1][1] === b[1][1])) {
					return true;
				}
			} catch (e) {
				return false;
			}
			return false;
		},

		_getListItems: function (_items, _sortFunction, _filterFunction) {
			var i, len, items = [];

			// filter list to what is in map bounds if applicable
			if (!_filterFunction) {
				items = _items;
			} else {
				for (i = 0, len = _items.length; i < len; i++) {
					if (_filterFunction(_items[i])) {
						items.push(_items[i]);
					}
				}
			}

			// sort list by specified sort order
			items.sort(_sortFunction);
			return items;
		},

		_generateListHeaderMarkup: function (_items, _restricted) {
			var settings = this._options.settings,
			    catalog = this._options.collection,
			    tz = settings.get('timeZone'),
			    tzString = '',
			    title = null,
			    theDate,
			    displayCount = _items.length,
			    totalCount = catalog.data().length;

			if (settings.getFeed().name) {
				title = settings.getFeed().name;
			} else {
				title = catalog.title.replace(/^USGS /,'');
			}

			if (tz === 'utc') {
				tzString = 'UTC';
				theDate = Format.dateTimeWithTimezone(
						new Date(catalog.generated||(+new Date)), {
							tz: 0,
							tzText: ' UTC'
						});
			} else if (tz === 'epicenter') {
				tzString = 'Event Epicenter Time';
				theDate = Format.dateTimeWithTimezone(
						new Date(catalog.generated||(+new Date)), {
							tz: 0,
							tzText: ' UTC' + (Format.isoTimezone(0))
						});
			} else {
				// default is "local"
				var tzOffset = -1 * (new Date()).getTimezoneOffset(),
				    tzOffsetStr = Format.isoTimezone(tzOffset);
				tzString = 'Local System Time (UTC' + tzOffsetStr + ')';
				theDate = Format.dateTimeWithTimezone(
						new Date(catalog.generated||(+new Date)), {
							'tz': tzOffset,
							tzText: ' UTC' + tzOffsetStr
						});
			}

			this.elements['title'].innerHTML = title;
			this.elements['timestamp'].innerHTML = 'Updated: ' + theDate;
			this.elements['timezone'].innerHTML = 'Showing event times using '+ tzString;
			this.elements['count'].innerHTML = totalCount;
			this.elements['downloads'].innerHTML = this._generateDownloadList();

			if (_restricted) {
				if (!Util.hasClass(this.el, 'filtered')) {
					Util.addClass(this.el, 'filtered');
				}

				this.elements['filtered'].innerHTML = [
					'<strong>', displayCount, '</strong>',
					' earthquakes in map area'
				].join('');
			} else {
				if (Util.hasClass(this.el, 'filtered')) {
					Util.removeClass(this.el, 'filtered');
				}
			}
		},

		_generateListMarkup: function (items) {
			var markup = [],
			    prefix = this._idprefix,
			    settings = this._options.settings,
			    i, len, item, p, c, className;

			if (items.length === 0) {
				markup.push('<p class="nodata">No earthquakes to display</p>');
			} else {
				for (i = 0, len = items.length; i < len; i++) {
					item = items[i];
					p = item.properties;
					c = item.geometry.coordinates;
					className = '';

					if (p.sig >= 600) {
						className = ' class="bigger"';
					} else if (p.mag >= 4.5) {
						className = ' class="big"';
					}

					markup.push(
					'<li id="', prefix, item.id, '"', className, '>',
						'<span class="mag">',
							Format.magnitude(p.mag),
						'</span> ',
						'<span class="place">',
							this._generateListItemTitle(p.type, p.place),
						'</span> ',
						'<span class="time"> ',
							Format.dateFromEvent(item, settings),
						'</span> ',
						'<span class="depth">',
							Format.depth(c[2]),
						' km</span>',
					'</li>');
				}
			}
			this.elements['content'].innerHTML = markup.join('');
		},

		_generateListItemTitle: function (type, place) {
			if (type === null || type.toLowerCase() === 'earthquake') {
				return place;
			} else {
				type = type.toLowerCase();
				if (type === 'quarry') {
					type = 'Quarry Blast';
				} else if (type === 'nuke') {
					type = 'Nuclear Explosion';
				} else if (type === 'rockfall') {
					type = 'Rockslide';
				} else if (type === 'rockburst') {
					type = 'Rockslide';
				} else if (type === 'sonicboom') {
					type = 'Sonic Boom';
				} else {
					type = type.replace(/\w\S*/g,
							function (txt) {
								return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
							}
					);
				}
			}
			return type + ' ' + place;
		},

		_generateListFooterMarkup: function () {
			this.elements['footer'].innerHTML = [
				'<h5>Didn\'t find what you were looking for?</h5>',
				'<ol class="help">',
					'<li>',
						'Change your &ldquo;Settings&rdquo; to view more ',
						'earthquakes.',
					'</li>',
					'<li>',
						'<a href="doc_whicheqs.php">',
							'Which earthquakes are included on the map and ',
							'list?',
						'</a>',
					'</li>',
					'<li>',
						'<a href="/earthquakes/eventpage/dyfi/?enabled=false">',
							'Felt something not shown – report it here.',
						'</a>',
					'</li>',
				'</ol>',
			'</div>'
			].join('');
		},

		_generateDownloadList: function () {
			var markup = [],
			    links = this._options.collection.getDownloadLinks();
			for (var i=0; i<links.length; i++) {
				markup.push(
					'<li><a href="', links[i].href, '">',
						links[i].link,
					'</a></li>'
				);
			}
			return markup.join('');
		},

		_bindEvents: function () {
			var c = this._options.collection,
			    s = this._options.settings,
			    m = this._options.app.getView("map");

			// Add handler for list click event
			Util.addEvent(this.elements['content'], "click", this._listClick());

			// was the map somehow shown before the list initialized?
			if (m.wasShown()) {
				this._mapShown();
			} else {
				m.on("mapshown", this._mapShown, this);
			}

			// Add handler for various MVC events
			s.on("change:sort", this.render, this);
			s.on("change:timeZone", this.render, this);
			s.on("change:restrictListToMap", this._bindMapListeners, this);
			s.on("change:restrictListToMap", this.render, this);
			c.on("select", this._collectionSelect, this);
			c.on("deselect", this._collectionDeselect, this);
		},

		_mapShown: function() {
			if (this._options.settings.get('restrictListToMap')) {
				this._bindMapListeners(true);
			}
			this.render();
		},

		_unbindEvents: function () {
			var c = this._options.collection,
			    s = this._options.settings,
			    m = this._options.app.getView("map");

			if (m.wasShown() && settings.get('restrictListToMap')) {
				this._bindMapListeners(false);
			}

			m.off("mapshown", this._mapShown, this);
			c.off("deselect", this._collectionDeselect, this);
			c.off("select", this._collectionSelect, this);
			s.off("change:restrictListToMap", this.render, this);
			s.off("change:restrictListToMap", this._bindMapListeners, this);
			s.off("change:timeZone", this.render, this);
			s.off("change:sort", this.render, this);

			Util.removeEvent(this.el, "click", this._listClick());
		},

		_bindMapListeners: function (bind) {
			var s = this._options.settings;

			if (bind) {
				// Bind
				s.on('change:mapposition', this.render, this);
			} else {
				// Unbind
				s.off('change:mapposition', this.render, this);
			}
		},

		_collectionSelect: function (selected) {
			var id = selected.id,
			    row = document.getElementById(this._idprefix + id);

			Util.addClass(row, "selected");
		},

		_collectionDeselect: function (selected) {
			var id = selected.id,
			    row = document.getElementById(this._idprefix + id);

			Util.removeClass(row, "selected");
		},

		// use event delegation to bind once
		// Need to create a clousure in order to preserve _this === ListView
		// so we have a means to bind _and_ unbind the DOM event.
		__listClick: null,
		_listClick: function (e) {
			var _this = this;
			if (_this.__listClick === null) {
				_this.__listClick = function (e) {
					var ev = Util.getEvent(e);
					if (ev.target.tagName == 'LI') {
						var el = ev.target;
					} else {
						var el = ev.target.parentNode;
					}
					id = el.getAttribute("id").replace(_this._idprefix, "");
					obj = _this._options.collection.get(id);
					_this._options.collection.select(obj);
				};
			}
			return this.__listClick;
		}
	};

	// return constructor from closure
	return ListView;
});
