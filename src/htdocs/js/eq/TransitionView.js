/* global define */
define([
	'mvc/Util',
	'mvc/View',
	'mvc/ModalView',
	'eq/UrlManager'
], function (
	Util,
	View,
	ModalView,
	UrlManager
) {
	'use strict';


	var CSS_CLASSNAME = 'transitionview';
	var DEFAULTS = {
		onComplete: null,
	};

	var TransitionView = function (settings, options) {

		var _this = this,
		    _onComplete = null,
		    _introDialog = null,
		    _migrateDialog = null,
		    _skipDialog = null;

		/**
		 * @constructor
		 *
		 * @param settings {Object}
		 *      User-settings, generally parsed from localStorage or a hash.
		 * @param options {Object}
		 *      Configuration options. See DEFAULTS for available parameters.
		 */
		var _initialize = function (settings, options) {
			settings = settings || {};
			options = Util.extend({}, DEFAULTS, options);

			_introDialog = _createIntroDialog();
			_migrateDialog = _createMigrateDialog(settings);
			_skipDialog = _createSkipDialog();

			_onComplete = options.onComplete || null;
		};

		var _createIntroDialog = function () {
			return new ModalView('<p><strong>Bookmarks</strong> are now used ' +
					'to save settings and searches.</p>', {
					title: 'Application Update',
					closable: false,
					classes: [CSS_CLASSNAME],
					buttons: [
						{
							text: 'Keep My Current Settings',
							classes: [CSS_CLASSNAME + '-keep'],
							callback: _onKeepClick
						},
						{
							text: 'Remove My Current Settings',
							classes: [CSS_CLASSNAME + '-skip', 'button-as-link'],
							callback: _onSkipClick
						}
					]
				});
		};

		var _createMigrateDialog = function (settings) {
			var message = document.createElement('div'),
			    searches = settings.searches || [],
			    i = 0,
			    len = searches.length,
			    ul = null,
			    modal = new ModalView(message, {
						title: 'Bookmark My Settings',
						closable: false,
						classes: [CSS_CLASSNAME],
						buttons: [
							{
								text: 'Finished',
								title: 'Finished',
								callback: _onMigrateFinished
							}
						]
					});

			message.innerHTML = [
				'<p>',
					'Settings and searches are no longer automatically saved. To ',
					'manually save your current settings and searches, bookmark the ',
					'links below.',
				'</p>',
				'<ul class="', CSS_CLASSNAME, '-bookmarks"></ul>',
				'<p class="', CSS_CLASSNAME, '-disclaimer">',
					'Each link above opens in a new tab or window. Use your browser to ',
					'bookmark each link; then return to this page to continue.',
				'</p>'
			].join('');

			ul = message.querySelector('.' + CSS_CLASSNAME + '-bookmarks');
			// Current settings
			ul.appendChild(_createBookmarkableItem(settings));

			// Any saved searches
			for (i = 0; i < len; i++) {
				ul.appendChild(_createBookmarkableItem(settings, searches[i]));
			}

			return modal;
		};

		var _createSkipDialog = function () {
			var message = document.createElement('div'),
			    modal = new ModalView(message, {
						title: 'Are You Sure?',
						closable: false,
						classes: ['modal-warning'],
						buttons: [
							{
								text: '&laquo; Go Back',
								title: 'Go Back',
								callback: _onBackClick
							},
							{
								text: 'Remove',
								title: 'Remove',
								classes: ['button-as-link', CSS_CLASSNAME + '-remove'],
								callback: _onRemoveClick
							}
						]
					});

			message.innerHTML = [
				'<p>',
					'This is your <strong>only chance</strong> to keep your current ',
					'settings and searches.',
				'</p>',
			].join('');

			return modal;
		};

		var _createBookmarkableItem = function (settings, search) {
			var item = document.createElement('li'),
			    link = item.appendChild(document.createElement('a')),
			    name = (search)?search.name:'Default Settings',
					url = _createUrl(settings, search);

			item.className = CSS_CLASSNAME + '-bookmark';

			Util.addClass(link, CSS_CLASSNAME + '-link');
			link.setAttribute('href', url);
			link.setAttribute('target', '_blank');
			link.innerHTML = name;

			return item;
		};

		/**
		 * Creates the URL for the given settings and search. Delegates to the
		 * URLManager.
		 *
		 * @param settings {Object}
		 * @param search {Object}
		 */
		var _createUrl = function (settings, search) {
			return window.location.pathname +
					UrlManager.parseSettings(settings, search);
		};

		var _onKeepClick = function () {
			_introDialog.hide();
			_migrateDialog.show();
		};

		var _onSkipClick = function () {
			_introDialog.hide();
			_skipDialog.show();
		};

		var _onMigrateFinished = function () {
			_this.hide();
		};

		var _onBackClick = function () {
			_skipDialog.hide();
			_introDialog.show();
		};

		var _onRemoveClick = function () {
			_this.hide();
		};

		this.show = function () {
			_introDialog.show();
		};

		this.hide = function () {
			_introDialog.hide();
			_migrateDialog.hide();
			_skipDialog.hide();

			if (_onComplete && typeof _onComplete === 'function') {
				try {
					_onComplete();
				} catch (e) { /* Ignore */ }
			}
		};

		_initialize(settings, options);
	};

	return TransitionView;
});
