/* global define, escape */

// define in global scope
var eqfeed_callback;
var checkSearchLimit;

define([
	'mvc/Collection',
	'mvc/Util',
	'mvc/ModalView',
	'mvc/ToggleView'
], function(
	Collection,
	Util,
	ModalView,
	ToggleView
) {
	'use strict';

	var Catalog = function(options) {

		// --------------------------------------------------
		// Private variables
		// --------------------------------------------------
		var _this,
		    _options,
		    _feed,
		    _isError,
		    _maxResults,
		    _overridden,
		    _settings,
		    _app;

		// --------------------------------------------------
		// Private methods
		// --------------------------------------------------

		/**
		 * @constructor
		 *
		 */
		var _initialize = function (options) {
			_options = options || {feed:null};
			_this = this;
			_isError = false;
			_overridden = false;
			_settings = _options.settings;
			_feed = _options.feed;
			_app = _options.app;

			// this is a collection of data
			Collection.call(this);

			if (typeof(_options.host) === 'undefined') {
				_options.host = '';
			}

			// set max number of results before displaying a warning
			if (Util.isMobile()) {
				_maxResults = 500;
			} else {
				_maxResults = 2000;
			}

		};

		/**
		 * @param params {Object}
		 *      Object containing search parameters
		 * @param count {Boolean} Optional.
		 *      Flag indicating whether to generate a url for search count (true), or
		 *      for actual search results (false). Default false.
		 *
		 * @return {String}
		 *      A fully-qualified URL to perform the search against.
		 */
		var _createSearchURL = function (params, count) {
			var method = (count) ? 'count' : 'query',
			    callback = (count) ? 'checkSearchLimit' : 'eqfeed_callback',
			    query = '',
			    host;

			host = _options.host + '/fdsnws/event/1/' + method + '?' +
					'format=geojson&jsonerror=true&callback=' + callback;

			for (var key in params) {
				if (key === 'id' || key === 'url' || key === 'autoUpdate' ||
						key === 'name' || key === 'isSearch') {
					continue;
				}
				query += '&' + _migrateKey(escape(key)) + '=' + escape(params[key]);
			}

			return host + query;
		};

		/**
		 * Does simply munging on the search keys to aide in migration.
		 *
		 * @param key {String}
		 *      The key to be migrated.
		 */
		var _migrateKey = function (key) {
			// These are "safe" to perform for keys.

			key = key.replace('-', ''); // Search fields do not contain a hyphen
			key = key.toLowerCase();    // Search fields are all lower case

			return key;
		};

		/**
		 * Creates a script element with the given src.
		 *
		 * @param src {String}
		 *      The source to use for the script.
		 * return {DOMElement}
		 *      A script element
		 */
		var _createScript = function (src) {
			var script = document.createElement('script');
			script.src = src;
			script.async = 1;
			return script;
		};

		/**
		 * Actually perform the JSONP request.
		 *
		 * @param script {DOMElement}
		 *      The script element used to perform the JSONP request.
		 */
		var _doFetch = function (script) {

			// notify a fetch is happening
			_this.trigger('fetching');

			// callback to cleanup script element when done
			var cleanup = function () {
				// unbind
				Util.removeEvent(script, 'load', cleanup);
				Util.removeEvent(script, 'error', cleanupError);

				// remove element from dom
				script.parentNode.removeChild(script);

				// not sure if these are needed
				script = null;
				cleanupError = null;
				cleanup = null;
			};

			var cleanupError = function () {
				_isError = true;
				_showServerError();
				cleanup();
			};

			Util.addEvent(script, 'load', cleanup);
			Util.addEvent(script, 'error', cleanupError);

			// add script
			var body = document.getElementsByTagName('body')[0];
			body.appendChild(script);
		};

		/**
		 * @param dialog {ModalView}
		 *      The dialog to close when this action is taken by the user.
		 * @return {DOMElement}
		 *      A DOM element with actions to "Show Realtime Data Instead".
		 */
		var _getDialogRevertAction = function (dialog) {
			var p = document.createElement('p');

			p.innerHTML = [
				'<p class="catalog-revert-wrapper">',
					'<button class="button-as-link revert">',
						'Show Realtime Data Instead',
					'</button>',
					'<small class="catalog-action-description">',
						'1 Day, Magnitude 2.5+ Worldwide',
					'</small>',
				'</p>'
			].join('');

			Util.addEvent(p.querySelector('.revert'), 'click', function () {
				dialog.hide();
				_app.revertToDefaultFeed();
			});

			return p;
		};

		/**
		 * @param helpText {String}
		 *      Text used under the modify search action item to help explain to the
		 *      user why they may want to choose this option.
		 * @return {DOMElement}
		 *      A DOM element with actions to "Modify Search".
		 */
		var _getDialogModifySearchAction = function (helpText) {
			var p = document.createElement('p');

			p.innerHTML = [
				'<a href="/earthquakes/search/', // TODO :: Configurable?
				window.location.hash, '">Modify Search</a>',
				'<small class="catalog-action-description">', helpText, '</small>'
			].join('');

			return p;
		};

		var _getDialogContinueAction = function (dialog) {
			var p = document.createElement('p');

			p.innerHTML = [
				'<button class="button-as-link continue">Continue Anyway</button>',
				'<small class="catalog-action-description">',
					'If you continue, you may have difficulty using this application.',
				'</small>'
			].join('');

			Util.addEvent(p.querySelector('.continue'), 'click', function () {
				dialog.hide();
				_overridden = true;
				_doFetch(_createScript(
					(_feed.isSearch) ?
					_createSearchURL(_feed.params||{}) :
					_feed.url
				));
			});

			return p;
		};

		/**
		 * Method called if service request results in an error. This is generally a
		 * 503 or 400 error indicating a bad request of some sort. This method will
		 * display a modal dialog notifying the user of the error.
		 *
		 * This type of error is generally non-transient meaning subsequent requests
		 * for this data will consistently fail. For this reason, the user has only
		 * two courses of action in this dialog:
		 *
		 *   (1) Modify search (only if currently selected feed is a search)
		 *   (2) Show realtime data instead
		 *
		 * @param response {JSONObject}
		 *      Response sent from server. Should have a metadata child element that
		 *      contains useful information for rendering the dialog.
		 *
		 * @see Catalog.js#_showServerError
		 */
		var _showServiceError = function (data) {
			var message = document.createElement('div'),
			    dialog = new ModalView(message, {
						title: '[' + (data.metadata.status||'UKNKNOWN') + '] Error',
						classes: ['modal-error', 'catalog'],
						closable: false
					});

			message.innerHTML = [
				'<p>There was an error with your search:</p>',
				'<small>' + data.metadata.error + '</small>'
			].join('');
			message.appendChild(_getDialogModifySearchAction(
					'See the error message above for details about why the current ' +
					'request failed and modify appropriately.'));
			message.appendChild(_getDialogRevertAction(dialog));

			dialog.show();
		};

		/**
		 * Method called if the server does not respond to a request for data. This
		 * is generally a default Apache 500 error. This method will display a modal
		 * dialog notifying the user of the error.
		 *
		 * This type of error is generally transient meaning subsequent requests for
		 * this data may actually succeed, but the server is currently busy or
		 * otherwise unavailable. For this reason, the user is presented with three
		 * courses of action in this dialog:
		 *
		 *   (1) Bookmark this page to try again later
		 *   (2) Modify search (only if currently selected feed is a search)
		 *   (3) Show realtime data instead
		 *
		 * @see Catalog.js#_showServiceError
		 */
		var _showServerError = function () {
			var message = document.createElement('div'),
			    supportsBookmark = window.sidebar ||
							(window.external&&window.external.AddFavorite),
			    dialog = new ModalView(message, {
						title: 'Error: Service Unavailable',
						classes: ['modal-error', 'catalog'],
						closable: false
					});

			// TODO :: Use generic bookmark widget?

			message.innerHTML = [
				'<p>',
					'Your search could not be completed at this time, please try again ',
					'later.',
				'</p>',
				'<p>',
					(supportsBookmark) ? '<button class="button-as-link bookmark">' : '',
						'Bookmark This Page',
					(supportsBookmark) ? '</button>' : '',
					'<small class="catalog-action-description">',
						'Your search may be okay, but the system may be down for ',
						'maintenance. Bookmark this page to try again later.',
					'</small>',
				'</p>'
			].join('');

			message.appendChild(_getDialogModifySearchAction(
					'Your search may be too large, modify your search if you think ',
					'this is the case.'));
			message.appendChild(_getDialogRevertAction(dialog));

			if (supportsBookmark) {
				Util.addEvent(message.querySelector('.bookmark'), 'click', function () {
					if (window.sidebar) { // FF
						window.sidebar.addPanel(window.location, document.title, '');
					} else if (window.external) { // IE
						window.external.AddFavorite(window.location, document.title);
					}
					// Don't hide dialog yet. User might not be done.
				});
			}

			dialog.show();
		};

		/**
		 * Method called when a request for data returns no earthquake data. This is
		 * not an error, but simply means no earthquakes matched the currently
		 * selected feed (or search) options.
		 *
		 * We notify the user so they understand the application successfully made
		 * the request and the reason the interface is empty is because no data was
		 * returned. Hopefully this prevents users from staring at an empty
		 * interface waiting for the data to load.
		 *
		 */
		var _showNoDataDialog = function () {
			var message = document.createElement('div'),
			    dialog = new ModalView(message, {
						title: 'No Earthquakes to Display',
						buttons: [
							{
								text: 'Okay',
								title: 'Okay - Close this Dialog',
								callback: function (evt, dialog) {
									dialog.hide();
								}
							}
						]
					});

			message.innerHTML = [
				'<p>',
					'The current selection does not currently include any earthquakes.',
				'</p>',
				'<p>',
					'Earthquakes happen around the world all the time. Change your ',
					'options to view more earthquakes.',
				'</p>'
			].join('');

			dialog.show();
		};

		var _showClientMaxError = function (data) {
			var message = document.createElement('div'),
			    downloadHelp = document.createElement('small'),
			    links = _this.getDownloadLinks(),
			    link = null,
			    linkMarkup = [],
			    i = 0,
			    len = links.length,
			    dialog = new ModalView(message, {
						title: 'Caution',
						closable: false,
						classes: ['modal-warning', 'catalog']
					});

			message.innerHTML = [
				'<p>',
					'The current selection includes more earthquakes than your device ',
					'may be able to display.',
				'</p>',
				'<div class="downloads"></div>'
			].join('');

			message.appendChild(_getDialogModifySearchAction(
					'We recommend at most ' + _maxResults + ' earthquakes for your ' +
					'device.'));
			message.appendChild(_getDialogContinueAction(dialog));
			message.appendChild(_getDialogRevertAction(dialog));

			Util.addClass(downloadHelp, 'catalog-action-description');
			downloadHelp.innerHTML = 'Current selection includes ' +
					((data.metadata) ? data.metadata.count : data.count) +
					' earthquakes.';

			for (i = 0; i < len; i++) {
				link = links[i];
				linkMarkup.push('<li><a href="', link.href, '">', link.link,
						'</a></li>');
			}

			new ToggleView({
				el: message.querySelector('.downloads'),
				header: downloadHelp,
				control: 'Download Data',
				controlClasses: ['button-as-link'],
				content: '<ul>' + linkMarkup.join('') + '</ul>'
			});

			dialog.show();
		};

		/**
		 *
		 * @param data {JSONObject}
		 *      The server response indicating an error occurred.
		 *
		 */
		var _showServerMaxError = function (data) {
			// Server will result in error, no chance to override
			var message = document.createElement('div'),
			    dialog = new ModalView(message, {
						title: 'Error',
						closable: false,
						classes: ['modal-error', 'catalog']
			    });

			message.innerHTML = [
				'<p>',
					'The current selection includes ', data.count, ' earthquakes, ',
					'which is more than is allowed.',
				'</p>'
			].join('');

			message.appendChild(_getDialogModifySearchAction(
					'Maximum allowed result size is ' + data.maxAllowed +
					' earthquakes.'));
			message.appendChild(_getDialogRevertAction(dialog));

			dialog.show();
		};

		// --------------------------------------------------
		// API Methods
		// --------------------------------------------------

		/**
		 * Delegator that fires off requests for data. This method is generally
		 * called in response to a feed change in the settings.
		 *
		 * If the currently selected feed is a search, this method fires a
		 * checkSearchLimit request before requesting the actual data.
		 *
		 * If the currently selected feed is a realtime feed, this method
		 * immediately requests the actual data.
		 *
		 */
		this.fetch = function() {
			if (_feed.isSearch) {
				_doFetch(_createScript(_createSearchURL(_feed.params, true)));
			} else {
				_doFetch(_createScript(_feed.url));
			}
		};

		/**
		 * @return {Array}
		 *      An array of objects containing link and href information
		 *      for available downloads.
		 */
		this.getDownloadLinks = function () {
			var urls = {}, url, r, downloads;

			if (_feed.isSearch) {
				url = _createSearchURL(_feed.params);
				r = 'geojson';

				url = url.replace(/&callback=[\w]+/, '').replace('&jsonerror=true', '');

				urls = {
					'csv': url.replace(r, 'csv'),
					'geojson': url,
					'kmlAge': url.replace(r,'kml&kmlcolorby=age'),
					'kmlAgeAnimated':
							url.replace(r,'kml&kmlcolorby=age&kmlanimated=true'),
					'kmlDepth': url.replace(r,'kml&kmlcolorby=depth'),
					'kmlDepthAnimated':
							url.replace(r,'kml&kmlcolorby=depth&kmlanimated=true'),
					'quakeml': url.replace(r, 'quakeml')
				};

			} else {
				url = _feed.url;
				r = '.geojsonp';

				urls = {
					'atom': url.replace(r, '.atom'),
					'csv': url.replace(r, '.csv'),
					'geojson': url.replace(r,'.geojson'),
					'kmlAge': url.replace(r,'_age.kml'),
					'kmlAgeAnimated': url.replace(r,'_age_animated.kml'),
					'kmlDepth': url.replace(r,'_depth.kml'),
					'kmlDepthAnimated': url.replace(r,'_depth_animated.kml'),
					'quakeml': url.replace(r, '.quakeml')
				};
			}

			downloads = [
				{'link': 'CSV', 'href': urls.csv},
				{'link': 'GeoJSON', 'href': urls.geojson },
				{'link': 'KML - Color by Age', 'href': urls.kmlAge},
				{'link': 'KML - Color by Age (animated)',
						'href': urls.kmlAgeAnimated},
				{'link': 'KML - Color by Depth', 'href': urls.kmlDepth},
				{'link': 'KML - Color by Depth (animated)',
						'href': urls.kmlDepthAnimated},
				{'link': 'QuakeML', 'href': urls.quakeml}
			];

			if (!_feed.isSearch) {
				downloads.unshift({'link': 'ATOM', 'href': urls.atom});
			}

			return downloads;
		};

		// -- Simple getters and setters -- //

		this.getFeed = function () { return _feed; };
		this.isError = function () { return _isError; };

		this.setFeed = function (feed) {
			_feed = feed;
			_overridden = false;
		};


		// --------------------------------------------------
		// Global method overrides. Not ideal but...
		// --------------------------------------------------

		// callback for realtime and fdsn earthquake queries
		eqfeed_callback = function (data) {

			var dataFeed = data.metadata.url;
			var userFeed = (_feed.isSearch) ?
					_createSearchURL(_feed.params) : _feed.url;

			// check if dataFeed is still the user-desired feed (userFeed)
			if (dataFeed.substr(dataFeed.length - userFeed.length) !== userFeed) {
				// Not an error per-se. Just not the feed we're expecting. Skip it.
				_isError = false;
				return;
			}

			// check if dataFeed resulted in an error
			if (data.metadata.hasOwnProperty('status') &&
					data.metadata.status !== 200) {
				_isError = true;
				_showServiceError(data);
				return;
			}

			// update the feed metadata (info is used by ListView)
			_this.title = data.metadata.title;
			_this.generated = data.metadata.generated;

			if (data.features.length === 0) {
				_showNoDataDialog();
			}

			// No errors
			_isError = false;

			// Check for large result set, prompt user if they want to load anyway
			// This is still important in case a realtime feed gets too large
			if (!_overridden && data.features.length > _maxResults && _maxResults > 0) {
				// TODO :: Set _isError ?
				_showClientMaxError(data);
			} else {
				_this.reset(data.features);
			}
		};

		// callback for fdsn count method requests
		checkSearchLimit = function (data) {
			var count = data.count,
			    max = data.maxAllowed;

			// check limits, provide warning or search as applicable
			if (count > max) {
				_showServerMaxError(data);
			} else if (count > _maxResults) {
				_showClientMaxError(data);
			} else {
				// It's all good
				_doFetch(_createScript(_createSearchURL(_feed.params)));
			}
		};


		// Call constructor
		_initialize.call(this, options);
	};

	return Catalog;
});
