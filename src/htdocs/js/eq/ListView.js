/* global define */
define([
	'mvc/View',
	'mvc/Util',
	'./Format',
	'./DefaultListFormatter',
	// Change these to custom implementations as they are completed
	'./DYFIListFormatter',
	'./DefaultListFormatter',
	'./ShakeMapListFormatter'
], function (
	View,
	Util,
	Format,
	DefaultListFormatter,
	DYFIListFormatter,
	PAGERListFormatter,
	ShakeMapListFormatter
) {
	'use strict';


	var DEFAULTS = {
	};

	var SEQUENCE = 0;

	var ListView = function (options) {
		View.apply(this, arguments);

		this._options = Util.extend({}, DEFAULTS, options);
		this._idprefix = 'listview-' + (++SEQUENCE) + '-';
		this._lastDataRender = null;

		Util.addClass(this._el, 'listView');
		this.initialize();
		this._bindEvents();
	};

	// Extend the base View with custom methods and state
	ListView.prototype = {

		// ------------------------------------------------------------
		// Public methods
		// ------------------------------------------------------------

		/**
		* Creates the view
		*/
		initialize: function() {
			var el = this._el;

			el.innerHTML = [
				'<header class="listHeader">',
					'<h1 class="title"></h1>',
					'<span>',
						'<strong class="count"></strong> earthquakes - ',
						'<a class="download" href="javascript:void(null);">Download</a>',
					'</span>',
					'<ul class="downloads"></ul>',
					'<span class="updated"></span>',
					'<span class="timezone"></span>',
					'<span class="showing"></span>',
				'</header>',
				'<ol class="listContent"></ol>',
				'<footer class="listFooter"></footer>'
			].join('');

			this._header = el.querySelector('.listHeader');
			this._title = el.querySelector('.title');
			this._count = el.querySelector('.count');
			this._downloadsLink = el.querySelector('.download');
			this._downloads = el.querySelector('.downloads');
			this._timestamp = el.querySelector('.updated');
			this._timezone = el.querySelector('.timezone');
			this._filtered = el.querySelector('.showing');
			this._content = el.querySelector('.listContent');
			this._footer = el.querySelector('.listFooter');

			// Defines this._itemFormatter
			this._setListFormatter({silent: true});

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
					selected = collection.getSelected();
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
				sort: settings.get('sort'),
				timeZone: settings.get('timeZone'),
				bounds: bounds,
				format: settings.get('listFormat')
			};
		},

		// ------------------------------------------------------------
		// Private methods
		// ------------------------------------------------------------

		_setListFormatter: function (params) {
			var options,
			    className,
			    settings = this._options.settings,
			    format = settings.get('listFormat');

			options = {
				settings: settings,
				idprefix: this._idprefix
			};

			if (this._itemFormatter && this._itemFormatter.destroy) {
				className = this._itemFormatter.getListClassName();

				if (className && this._content.classList.contains(className)) {
					this._content.classList.remove(className);
				}

				this._itemFormatter.destroy();
				this._itemFormatter = null;
			}

			if (format === 'dyfi') {
				this._itemFormatter = new DYFIListFormatter(options);
			} else if (format === 'pager') {
				this._itemFormatter = new PAGERListFormatter(options);
			} else if (format === 'shakemap') {
				this._itemFormatter = new ShakeMapListFormatter(options);
			} else {
				this._itemFormatter = new DefaultListFormatter(options);
			}

			className = this._itemFormatter.getListClassName();
			if (className) {
				this._content.classList.add(className);
			}

			if (!params || !params.silent) {
				this.render();
			}
		},

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
					lastDataRender.sort === _settings.get('sort') &&
					lastDataRender.format === _settings.get('listFormat') &&
					// have bounds changed, and do we care
					(_bounds && this._boundsEqual(_bounds, lastDataRender.bounds)) &&
					lastDataRender.timeZone === _settings.get('timeZone'));
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
						new Date(catalog.generated||(new Date().getTime())), {
							tz: 0,
							tzText: ' UTC'
						});
			} else if (tz === 'epicenter') {
				tzString = 'Event Epicenter Time';
				theDate = Format.dateTimeWithTimezone(
						new Date(catalog.generated||(new Date().getTime())), {
							tz: 0,
							tzText: ' UTC' + (Format.isoTimezone(0))
						});
			} else {
				// default is "local"
				var tzOffset = -1 * (new Date()).getTimezoneOffset(),
				    tzOffsetStr = Format.isoTimezone(tzOffset);
				tzString = 'Local System Time (UTC' + tzOffsetStr + ')';
				theDate = Format.dateTimeWithTimezone(
						new Date(catalog.generated||(new Date().getTime())), {
							'tz': tzOffset,
							tzText: ' UTC' + tzOffsetStr
						});
			}

			this._title.innerHTML = title;
			this._timestamp.innerHTML = 'Updated: ' + theDate;
			this._timezone.innerHTML = 'Showing event times using '+ tzString;
			this._count.innerHTML = totalCount;
			this._downloads.innerHTML = this._generateDownloadList();

			if (_restricted) {
				if (!Util.hasClass(this._el, 'filtered')) {
					Util.addClass(this._el, 'filtered');
				}

				this._filtered.innerHTML = [
					'<strong>', displayCount, '</strong>',
					' earthquakes in map area'
				].join('');
			} else {
				if (Util.hasClass(this._el, 'filtered')) {
					Util.removeClass(this._el, 'filtered');
				}
			}
		},

		_generateListMarkup: function (items) {
			var markup = [],
			    i, len;

			if (items.length === 0) {
				markup.push('<p class="nodata">No earthquakes to display</p>');
			} else {
				for (i = 0, len = items.length; i < len; i++) {
					markup.push(this._itemFormatter.generateListItemMarkup(items[i]));
				}
			}
			this._content.innerHTML = markup.join('');
		},

		_generateListFooterMarkup: function () {
			this._footer.innerHTML = [
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
			    m = this._options.app.getView('map');

			// Add handler for list click event
			Util.addEvent(this._content, 'click', this._listClick());
			Util.addEvent(this._downloadsLink, 'click', this._downloadsClick());

			// was the map somehow shown before the list initialized?
			if (m.wasShown()) {
				this._mapShown();
			} else {
				m.on('mapshown', this._mapShown, this);
			}

			// Add handler for various MVC events
			s.on('change:sort', this.render, this);
			s.on('change:timeZone', this.render, this);
			s.on('change:restrictListToMap', this._bindMapListeners, this);
			s.on('change:restrictListToMap', this.render, this);
			s.on('change:listFormat', this._setListFormatter, this);
			c.on('select', this._collectionSelect, this);
			c.on('deselect', this._collectionDeselect, this);
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
			    m = this._options.app.getView('map');

			if (m.wasShown() && s.get('restrictListToMap')) {
				this._bindMapListeners(false);
			}

			m.off('mapshown', this._mapShown, this);
			c.off('deselect', this._collectionDeselect, this);
			c.off('select', this._collectionSelect, this);
			s.off('change:listFormat', this._setListFormatter, this);
			s.off('change:restrictListToMap', this.render, this);
			s.off('change:restrictListToMap', this._bindMapListeners, this);
			s.off('change:timeZone', this.render, this);
			s.off('change:sort', this.render, this);

			Util.removeEvent(this._el, 'click', this._listClick());
			Util.removeEvent(this._downloadsLink, 'click', this._downloadsClick());
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

			Util.addClass(row, 'selected');
		},

		_collectionDeselect: function (selected) {
			var id = selected.id,
			    row = document.getElementById(this._idprefix + id);

			Util.removeClass(row, 'selected');
		},

		// use event delegation to bind once
		// Need to create a clousure in order to preserve _this === ListView
		// so we have a means to bind _and_ unbind the DOM event.
		__listClick: null,
		_listClick: function () {
			var _this = this;
			if (_this.__listClick === null) {
				_this.__listClick = function (e) {
					var ev = Util.getEvent(e),
					    el,
					    id,
					    obj;
					if (ev.target.tagName === 'LI') {
						el = ev.target;
					} else {
						el = ev.target.parentNode;
					}
					id = el.getAttribute('id').replace(_this._idprefix, '');
					obj = _this._options.collection.get(id);
					_this._options.collection.select(obj);
				};
			}
			return this.__listClick;
		},

		// reference to downloads click event handler, so it can later be removed.
		__downloadsClick: null,
		_downloadsClick: function () {
			var _el = this._el;
			if (this.__downloadsClick === null) {
				this.__downloadsClick = function () {
					if (Util.hasClass(_el, 'showDownloads')) {
						Util.removeClass(_el, 'showDownloads');
					} else {
						Util.addClass(_el, 'showDownloads');
					}
				};
			}
			return this.__downloadsClick;
		}
	};

	// return constructor from closure
	return ListView;
});
