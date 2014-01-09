define([
    'eq/Format',
    'mvc/View',
    'mvc/Util'
], function (Format, View, Util) {

    // -------------------------------------------------------------------------
    // Private static variables
    // -------------------------------------------------------------------------
    var DOM_CONTAINER_CLASS = 'searchView modalmask',
        DOM_ADVANCED_CLASS = 'advancedOptions',
        NULL_SELECT_VALUE = 'pleaseSelect',
        NULL_SELECT_DISPLAY = 'Please Select',
        DEFAULTS = {
            // Leaflet map. Used to get current map extents.
            'map': null,

            // Product types to list. option_value => option_text
            'producttypes': {},

            // Event sources to list. options_value => option_text
            'catalogs': {},

            // Product sources to list. options_value => option_text
            'contributors': {}
       };

    // -------------------------------------------------------------------------
    // Private static helper functions
    // -------------------------------------------------------------------------

    /**
     * @param options {Object}
     *      An object mapping option_value => options_display_text
     *
     * @return {String}
     *      Markup for the given list of options as select box options.
     */
    var _getOptionsMarkup = function (options) {
        var markup = [];

        for (key in options) {
            markup.push('<option value="',key,'">',options[key],'</option>');
        }

        return markup.join('');
    };

    /**
     * A date format method useful for setting the value on a "date" type
     * input field in HTML5.
     *
     * @param theDate {Date}
     *      A date to format.
     * @return {String}
     *      The formatted date. yyyy-mm-dd
     */
    var _getYMD = function (theDate) {
        var y, m, d, isNeg;

        y = theDate.getUTCFullYear();
        m = theDate.getUTCMonth(); m += 1;
        d = theDate.getUTCDate();

        if (m < 10) { m = '0' + m; }
        if (d < 10) { d = '0' + d; }

        return '' + y + '-' + m + '-' + d;
    };

    /**
     * Maybe this should be part of the js/eq/Format.js class as a generalized
     * parser?
     *
     * @param ymd {String}
     *      A date string. Formatted as yyyy-mm-dd (or similar).
     * @param endOfDay {Boolean}
     *      If true, round the parsed date/time stamp to the end of the day. If
     *      false or not present, round the parsed date/time stamp to the
     *      beginning of the day.
     *
     * @return {Date}
     *      A date corresponding to the given input date string. Note, if
     *      hours/minutes/seconds etc... are specified, they are ignore.
     *      Result date always indicates the beginning of the specified date.
     */
    var _getDate = function (ymd, endOfDay) {
        var parts = ymd.match(/(\d+)/g),
            t = null,
            y = parseInt(parts[0], 10),
            m = parseInt(parts[1], 10) - 1,
            d = parseInt(parts[2], 10);

        // Simple parsing sanity checks
        if (parts.length !== 3) {
            throw 'Invalid date format';
        } else if (m < 0 || m > 11) {
            throw 'Invalid month.';
        } else if (d < 1 || d > 31) {
            // Not perfect check, but a sanity check.
            throw 'Invalid day.';
        }

        if (endOfDay) {
            // Push to end of day
            t = new Date(Date.UTC(y, m, d+1, 0, 0, 0, -1));
        } else {
            // Truncate to start of day
            t = new Date(Date.UTC(y, m, d));
        }

        // Make sure we still have a valid date object
        if (Object.prototype.toString.call(t) === "[object Date]") {
            if (isNaN(t.getTime())) {
                throw 'Invalid date.';
            }
        } else {
            throw 'Not a date';
        }

        return t;
    };

    /**
     * Serializes the given bounds object into a string.
     *
     * @param bounds {Object}
     *      A bounds object containing any of the following:
     *           - minlatitude
     *           - maxlatitude
     *           - minlongitude
     *           - maxlongitude
     *      If any of the above keys are missing from the object, an empty
     *      placeholder is used for that field instead.
     */
    var _serializeBounds = function (bounds, humanReadable) {
        var north = bounds.maxlatitude,
            south = bounds.minlatitude,
             east  = bounds.maxlongitude,
             west  = bounds.minlongitude,
             text = '';

        if (isNaN(north)) { north = ''; } else { north = north.toFixed(3); }
        if (isNaN(south)) { south = ''; } else { south = south.toFixed(3); }

        // Limit to 1 instance of globe
        if (!isNaN(west) && !isNaN(east) && Math.abs(east - west) > 360.0) {
            east = 180.0;
            west = -180.0;
        }

        // Fit to +/- 360.0 east/west
        if (isNaN(east)) { east = ''; } else {
            while (east < -360) { east += 360; }
            east %= 360;
            east = east.toFixed(3);
        }

        if (isNaN(west)) { west = ''; } else {
            while (west < -360) { west += 360; }
            west %= 360;
            west = west.toFixed(3);
        }

        return '' + north + ',' + south + ',' + east + ',' + west;
    };

    /**
     * Parses a formatted bounds string into a bounds object.
     *
     * @param bounds {String}
     *      A formatted bounds string containing min/max lat/lng values as
     *      follows: "maxLat,minLat,maxLong,minLon"
     *
     * @return {Object}
     *      A bounds object with the following keys:
     *           - minlatitude {Float}
     *           - maxlatitude {Float}
     *           - minlongitude {Float}
     *           - maxlongitude {Float}
     */
    var _parseBounds = function (bounds) {
        var parts = bounds.split(','),
            bounds = {},
             value = null;

        try { /* Try catch in case of incomplete bounds */
            if (parts[0] !== '') {
                value = parseFloat(parts[0]);
                if (!isNaN(value)) {
                    bounds.maxlatitude = value;
                }
            }
            if (parts[1] !== '') {
                value = parseFloat(parts[1]);
                if (!isNaN(value)) {
                    bounds.minlatitude = value;
                }
            }
            if (parts[2] !== '') {
                value = parseFloat(parts[2]);
                while (value < -360.0) { value += 360.0; }
                while (value > 360.0) { value -= 360.0; }
                if (!isNaN(value)) {
                    bounds.maxlongitude = value;
                }
            }
            if (parts[3] !==  '') {
                value = parseFloat(parts[3]);
                while (value < -360.0) { value += 360.0; }
                while (value > 360.0) { value -= 360.0; }
                if (!isNaN(value)) {
                    bounds.minlongitude = value;
                }
            }
        } catch (e) { }

        return bounds;
    };

    /**
     * Creates the markup for a blank search form.
     */
    var _createSearchForm = function (options) {

        return [
            // Basic search options
            '<div class="modal">',
            '<header class="searchHeader">',
                '<h3>Create new search</h3>',
                '<span id="closeButton" class="close-link" title="Cancel">x</span>',
                '<input type="hidden" name="searchId" id="searchId" ',
                        'value="', (+new Date), '"/>',
            '</header>',
            '<section>',
            '<ul class="errors"></ul>',
            '<ul class="basic">',
                '<li>',
                    '<label for="searchName">',
                        'Name this search',
                        '<span class="help">For display purposes</span>',
                    '</label>',
                    '<input type="text" name="searchName" id="searchName" ',
                            'placeholder="A-z, 0-9, ., [space]"/>',
                '</li>',

                '<li class="restrictBounds">',
                    '<fieldset>',
                        '<legend>Geographic Region</legend>',
                        '<ul>',
                            '<li class="noBounds">',
                                '<label>',
                                    '<input type="radio" name="restrictBounds" ',
                                            'id="noBounds" />',
                                    'Entire World',
                                '</label>',
                            '</li>',
                            '<li class="customBounds">',
                                '<label>',
                                    '<input type="radio" name="restrictBounds" ',
                                            'id="customBounds"/>',
                                    'Custom Region',
                                '</label>',
                                '<section class="customBoundsInputs">',
                                    '<span class="help">',
                                        'Decimal degree coordinates. North must be ',
                                        'greater than South. East must be greater ',
                                        'than west.',
                                    '</span>',
                                    '<label for="maxlatitude" ',
                                            'id="maxlatitude-lbl">',
                                        '<abbr title="North">N</abbr>',
                                        '<input type="text" name="maxlatitude" ',
                                                'id="maxlatitude" ',
                                                'placeholder="90.000"/>',
                                    '</label>',
                                    '<label for="minlongitude" ',
                                            'id="minlongitude-lbl">',
                                        '<abbr title="West">W</abbr>',
                                        '<input type="text" name="minlongitude" ',
                                                'id="minlongitude" ',
                                                'placeholder="-180.000"/>',
                                    '</label>',
                                    '<label for="maxlongitude" ',
                                            'id="maxlongitude-lbl">',
                                        '<input type="text" name="maxlongitude" ',
                                                'id="maxlongitude" ',
                                                'placeholder="180.000"/>',
                                        '<abbr title="East">E</abbr>',
                                    '</label>',
                                    '<label for="minlatitude" ',
                                            'id="minlatitude-lbl">',
                                        '<input type="text" name="minlatitude" ',
                                                'id="minlatitude" ',
                                                'placeholder="-90.000"/>',
                                        '<abbr title="South">S</abbr>',
                                    '</label>',
                                    '<button name="useMapExtent" id="useMapExtent" ',
                                            'value="">Set Custom Region to Map ',
                                            'Extent</button>',
                                '</section>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</li>',

                '<li>',
                    '<fieldset>',
                        '<legend>',
                            'Date Range',
                            '<span class="help">',
                                'Universal Coordinated Time',
                                    (!Util.supportsDateInput())?' (yyyy-mm-dd)':'',
                            '</span>',
                        '</legend>',
                        '<ul>',
                            '<li>',
                            '<label for="startDate">Start</label>',
                            '<input type="date" name="startDate" id="startDate" ',
                                    'placeholder="yyyy-mm-dd" />',
                            '<input type="hidden" name="starttime"',
                                    'id="starttime"/>',
                            '</li><li>',
                            '<label for="endDate">End</label>',
                            '<input type="date" name="endDate" id="endDate" ',
                                    'placeholder="yyyy-mm-dd" />',
                            '<input type="hidden" name="endtime"',
                                    'id="endtime"/>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</li>',

                '<li>',
                    '<fieldset>',
                        '<legend>Magnitude</legend>',
                        '<ul>',
                            '<li>',
                            '<label for="minmagnitude">Minimum</label>',
                            '<input type="number" name="minmagnitude" ',
                                    'id="minmagnitude" step="0.1" min="-1.0" ',
                                    'max="10.0" placeholder="-1.0 to 10.0"/>',
                            '</li><li>',
                            '<label for="maxmagnitude">Maximum</label>',
                            '<input type="number" name="maxmagnitude" ',
                                    'id="maxmagnitude" step="0.1" min="-1.0" ',
                                    'max="10.0" placeholder="-1.0 to 10.0"/>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</li>',
            '</ul>',

            // Advanced search options
            '<section class="advanced">',
            '<h3>Advanced Search Options</h3>',
            '<ul>',
                '<li>',
                    '<fieldset>',
                        '<legend>',
                            'Depth',
                            '<span class="help">Kilometers</span>',
                        '</legend>',
                        '<ul>',
                            '<li>',
                            '<label for="mindepth">Minimum</label>',
                            '<input type="number" name="mindepth" ',
                                    'id="mindepth" step="1.0"/>',
                            '</li><li>',
                            '<label for="maxdepth">Maximum</label>',
                            '<input type="number" name="maxdepth" ',
                                    'id="maxdepth" step="1.0"/>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</li>',

                '<li>',
                    '<fieldset>',
                        '<legend>',
                            'Intensity',
                            '<span class="help">Maximum Modified Mercalli</span>',
                        '</legend>',
                        '<ul>',
                            '<li>',
                                '<label for="minmmi">Minimum</label>',
                                '<input type="number" name="minmmi" ',
                                        'id="minmmi" step="0.1" min="0.0" ',
                                        'max="12.0" placeholder="0.0 to 12.0"/>',
                            '</li>',
                            '<li>',
                                '<label for="maxmmi">Maximum</label>',
                                '<input type="number" name="maxmmi" ',
                                        'id="maxmmi" step="0.1" min="0.0" ',
                                        'max="12.0" placeholder="0.0 to 12.0"/>',
                            '</li>',
                        '</ul>',
                    '</fieldset>',
                '</li>',

                '<li>',
                    '<label for="producttype">Product Type</label>',
                    '<select name="producttype" id="producttype">',
                        '<option value="', NULL_SELECT_VALUE, '">',
                            NULL_SELECT_DISPLAY,
                        '</option>',
                        _getOptionsMarkup(options.producttypes),
                    '</select>',
                '</li>',

                '<li>',
                    '<label for="catalog">',
                        'Event Catalog',
                    '</label>',
                    '<select name="catalog" id="catalog">',
                        '<option value="', NULL_SELECT_VALUE, '">',
                            NULL_SELECT_DISPLAY,
                        '</option>',
                        _getOptionsMarkup(options.catalogs),
                    '</select>',
                '</li>',

                '<li>',
                    '<label for="contributor">',
                        'Product Source',
                    '</label>',
                    '<select name="contributor" id="contributor">',
                        '<option value="', NULL_SELECT_VALUE, '">',
                            NULL_SELECT_DISPLAY,
                        '</option>',
                        _getOptionsMarkup(options.contributors),
                    '</select>',
                '</li>',
            '</ul>',
            '</section>', // END: Advanced
            '</section>', // END: Scrolling

            '<footer>',
                '<button id="saveButton">Search</button>',
                '<button id="cancelButton">Cancel</button>',
                '<button id="deleteButton">Delete</button>',
            '</footer>',
            '</div>'
        ].join('');
    };

    /**
     * Class definition.
     *
     * @param options {Object}
     *
     */
    var SearchView = function (options) {
        // Extend MVC View
        View.call(this);

        // ----------------------------------------------------------------------
        // Private member variables
        // ----------------------------------------------------------------------
        var _this = this,
             _options = null,
            _oldSearchObject = null,

             _onSaveCallback = null,
             _onCancelCallback = null,
             _onDeleteCallback = null,

             // Scrolling content section
             _scrollSection = null,

             // Unique ID for this search
             _searchId = null,

             // Container for error output
             _errors = null,

             // Modal dialog title
             _modalTitle = null,

             // Input fields for basic search parameters
             _searchName = null,

             _noBounds = null,
             _customBounds = null,
             _minlatitude = null,
             _maxlatitude = null,
             _minlongitude = null,
             _maxlongitude = null,
             _useMapExtent = null,

             _startDate = null,
             _endDate = null,
             _minmagnitude = null,
             _maxmagnitude = null,

             // Input fields for advanced search parameters
             _mindepth = null,
             _maxdepth = null,
             _minmmi = null,
             _maxmmi = null,
             _producttype = null,
             _catalog = null,
             _contributor = null,

             // Action buttons
             _closeButton = null,
             _cancelButton = null,
             _saveButton = null,
             _deleteButton = null;

        // ----------------------------------------------------------------------
        // Constructor/Initializer
        // ----------------------------------------------------------------------

        /**
         * @constructor
         */
        var _initialize = function (options) {
            // Extend defaults with custom options
            _options = Util.extend({}, DEFAULTS, options);

            // Create search form template
            _this.el.innerHTML = _createSearchForm(_options);
            _this.el.className = DOM_CONTAINER_CLASS;

            // Pull out DOM elements from our search form and store for quicker
            // access later (so we aren't constantly fetching from the DOM).
            _cacheDOMObjects();

            // Bind events to input fields for validation etc...
            _bindEvents();
        };

        // ----------------------------------------------------------------------
        // Public Methods
        // ----------------------------------------------------------------------

        /**
         * API Method
         *
         * Shows the current view in a modal dialog.
         *
         * @param onCancel {Function}
         *      Callback method. Called if the user cancels creation of search
         *      view. onCancel = function ();
         * @param onSave {Function}
         *      Callback method. Called when the user creates a new search.
         *      onSave = function ({searchParams});
         * @param searchParams {Object} Optional.
         *      Search parameters from a previous search. When present, the values
         *      in this object should be the default values displayed in the
         *      search form.
         */
        this.show = function (opts) { //onCancel, onSave, searchParams, map) {
            // If form already visible, cancel.
            if (_this.el.parentNode === document.body) {
                return false;
            }

            // Set onCancel, onSave, and onDelete callbacks
            if (typeof opts.onCancel === 'function') {
                _onCancelCallback = opts.onCancel;
            }

            if (typeof opts.onSave === 'function') {
                _onSaveCallback = opts.onSave;
            }

            if (typeof opts.onDelete === 'function') {
                _onDeleteCallback = opts.onDelete;
            }

            // Show the form.
            // Note: Must attach _this.el to body before trying to set "checked"
            document.body.appendChild(_this.el);

            // Always clear form before potentially setting input parameter values
            // since a previous search value might still be present but may not be
            // specified by the input search parameters.
            _clearForm();

            // Set current bounds if possible. Note: If 'search' is passed, those
            // may potentially supercede these map bounds.
            if (opts.bounds) {
                _useMapExtent.value = _serializeBounds(opts.bounds);
                _useMapExtent.removeAttribute('disabled');
            } else {
                _useMapExtent.setAttribute('disabled', 'disabled');
            }

            // Populate form with search params if given
            if (typeof opts.search === 'object') {
                _populateForm(opts.search);
            }

            _searchName.focus();
            _searchName.select();

            return true;
        };

        /**
         * API Method
         *
         * Hides the current view.
         */
        this.hide = function () {
            _handleCancel(null);
        };

        // ----------------------------------------------------------------------
        // Private methods
        // ----------------------------------------------------------------------

        var _clearForm = function () {
            _oldSearchObject = null;

            _searchId.value = '' + (+new Date);
            _errors.innerHTML = '';
            _modalTitle.innerHTML = 'Create new search';
            _searchName.value = 'Custom Search';
            _minlatitude.value = '';
            _maxlatitude.value = '';
            _minlongitude.value = '';
            _maxlongitude.value = '';
            _startDate.value = '';
            _endDate.value = '';
            _minmagnitude.value = '';
            _maxmagnitude.value = '';
            _customBounds.checked = false;
            _noBounds.checked = true;
            _mindepth.value = '';
            _maxdepth.value = '';
            _minmmi.value = '';
            _maxmmi.value = '';
            _producttype.selectedIndex = 0;
            _catalog.selectedIndex = 0;
            _contributor.selectedIndex = 0;

            Util.removeClass(_this.el, 'error');
            Util.removeClass(_restrictBounds, 'supportsMapBounds');
            Util.removeClass(_this.el, 'showAdvanced');

            _deleteButton.style.display = 'none';

            _toggleCustomBounds();
        };

        var _populateForm = function (searchParams) {
            var showAdvanced = false; // Flag to expand advanced options

            _oldSearchObject = searchParams;

            for (key in searchParams) {
                var value = searchParams[key];

                switch (key) {
                    case 'id':
                        _searchId.value = value;
                        break;
                    case 'name':
                        if (value.match(/^[A-Za-z0-9\. ]+$/)!==null) {
                            _searchName.value = value;
                        } else {
                            _searchName = 'Custom Search'; // Bad name.
                        }
                        break;
                    case 'minlatitude':
                        _minlatitude.value = value;
                        break;
                    case 'maxlatitude':
                        _maxlatitude.value = value;
                        break;
                    case 'minlongitude':
                        _minlongitude.value = value;
                        break;
                    case 'maxlongitude':
                        _maxlongitude.value = value;
                        break;
                    case 'starttime':
                        _startDate.value = _getYMD(new Date(value));
                        break;
                    case 'endtime':
                        _endDate.value = _getYMD(new Date(value));
                        break;
                    case 'minmagnitude':
                        _minmagnitude.value = value;
                        break;
                    case 'maxmagnitude':
                        _maxmagnitude.value = value;
                        break;
                    case 'mindepth':
                        _mindepth.value = value;
                        showAdvanced = true;
                        break;
                    case 'maxdepth':
                        _maxdepth.value = value;
                        showAdvanced = true;
                        break;
                    case 'minmmi':
                        _minmmi.value = value;
                        showAdvanced = true;
                        break;
                    case 'maxmmi':
                        _maxmmi.value = value;
                        showAdvanced = true;
                        break;
                    case 'producttype':
                        if (value in _options.producttypes) {
                            showAdvanced = true;
                            _producttype.value = value;
                        }
                        break;
                    case 'catalog':
                        if (value in _options.catalogs) {
                            showAdvanced = true;
                            _catalog.value = value;
                        }
                        break;
                    case 'contributor':
                        if (value in _options.contributors) {
                            showAdvanced = true;
                            _contributor.value = value;
                        }
                        break;
                    case 'errors':
                        if (value.length > 0) {
                            _renderErrors(value);
                        }
                        break;
                }
            }

            // Inform user they are editing a search (i.e. not a new search)
            _modalTitle.innerHTML = 'Edit existing search';

            if (_onDeleteCallback !== null) {
                // Only show delete button if a callback is defined
                _deleteButton.style.display = '';
            }

            // Expand advanced options my default if rendering a previous search
            // that included any advanced feature
            if (showAdvanced &&
                    !Util.hasClass(_this.el,'showAdvanced')) {
                Util.addClass(_this.el, 'showAdvanced');
            }

            // Set bounds. If bounds specified, show geographic region radio button
            // and check that option by default.
            if (searchParams.hasOwnProperty('minlatitude') ||
                    searchParams.hasOwnProperty('maxlatitude') ||
                    searchParams.hasOwnProperty('maxlongitude') ||
                    searchParams.hasOwnProperty('maxlongitude')) {
                _customBounds.checked = true;
                _toggleCustomBounds();
            }
        };

        var _cacheDOMObjects = function () {
            var el = _this.el;

            _searchId = el.querySelector('#searchId');

            _scrollSection = el.querySelector('section');
            _errors = el.querySelector('.errors');
            _modalTitle = el.querySelector('h3');

            _searchName = el.querySelector('#searchName');

            _restrictBounds = el.querySelector('.restrictBounds');
            _noBounds = el.querySelector('#noBounds');
            _customBounds = el.querySelector('#customBounds');

            _minlatitude = el.querySelector('#minlatitude');
            _maxlatitude = el.querySelector('#maxlatitude');
            _minlongitude = el.querySelector('#minlongitude');
            _maxlongitude = el.querySelector('#maxlongitude');
            _useMapExtent = el.querySelector('#useMapExtent');

            _startDate = el.querySelector('#startDate');
            _endDate = el.querySelector('#endDate');

            _minmagnitude = el.querySelector('#minmagnitude');
            _maxmagnitude = el.querySelector('#maxmagnitude');

            _advancedController = el.querySelector('.advanced h3');

            _mindepth = el.querySelector('#mindepth');
            _maxdepth = el.querySelector('#maxdepth');

            _minmmi = el.querySelector('#minmmi');
            _maxmmi = el.querySelector('#maxmmi');

            _producttype = el.querySelector('#producttype');
            _catalog = el.querySelector('#catalog');
            _contributor = el.querySelector('#contributor');

            _closeButton = el.querySelector('#closeButton');
            _cancelButton = el.querySelector('#cancelButton');
            _saveButton = el.querySelector('#saveButton');
            _deleteButton = el.querySelector('#deleteButton');
        };

        /**
         * Bind event handlers to DOM elements.
         */
        var _bindEvents = function () {
            // Use map extent
            Util.addEvent(_useMapExtent, 'click', _setBoundsToMap);
            Util.addEvent(_customBounds, 'change', _toggleCustomBounds);
            Util.addEvent(_noBounds, 'change', _toggleCustomBounds);

            // Show/hide advanced options
            Util.addEvent(_advancedController, 'click', _toggleAdvancedOptions);

            // Cancel/save handlers
            Util.addEvent(_cancelButton, 'click', _handleCancel);
            Util.addEvent(_closeButton, 'click', _handleCancel);
            Util.addEvent(_saveButton, 'click', _handleSave);
            Util.addEvent(_deleteButton, 'click', _handleDelete);
        };

        var _validateSearchForm = function () {
            var errors = _getErrors();
            _renderErrors(errors);

            return (errors.length === 0);
        };

        var _getErrors = function () {
            var errors = [];

            // Search name
            if (_searchName.value === '') {
                errors.push('Search name is a required field.');
            } else if (_searchName.value.match(/^[a-zA-Z0-9\. ]+$/) === null) {
                errors.push('Search name may only contain letters numbers or ' +
                        'spaces.');
            }

            // Location
            if (_customBounds.checked) {
                var north = parseFloat(_maxlatitude.value),
                    west = parseFloat(_minlongitude.value),
                    east = parseFloat(_maxlongitude.value),
                    south = parseFloat(_minlatitude.value);

                if (!isNaN(north) && (north > 90.0 || north < -90.0)) {
                    errors.push('North location must be between +/- 90.0.');
                }
                if (!isNaN(south) && (south > 90.0 || south < -90.0)) {
                    errors.push('South location must be between +/- 90.0.');
                }
                if (!isNaN(west) && (west > 360.0 || south < -360.0)) {
                    errors.push('West location must be between +/- 360.0.');
                }
                if (!isNaN(east) && (east > 360.0 || east < -360.0)) {
                    errors.push('East location must be between +/- 360.0.');
                }
                if (!isNaN(north) && !isNaN(south) && north <= south) {
                    errors.push('North must be larger than south.');
                }
                if (!isNaN(east) && !isNaN(west) && east <= west) {
                    errors.push('East must be larger than west.');
                }
                if (Math.abs(east - west) > 360.0) {
                    errors.push('East/west may only span at most 360.0 degrees.');
                }
            }

            // Date range
            var startDate = null, endDate = null;
            if (_startDate.value !== '') {
                try {
                    startDate = _getDate(_startDate.value, false);
                } catch (e) {
                    errors.push('Invalid value for start date. Format: yyyy-mm-dd');
                }
            }


            if (_endDate.value !== '') {
                try {
                    endDate = _getDate(_endDate.value, true);
                } catch (e) {
                    errors.push('Invalid value for end date. Format: yyyy-mm-dd');
                }
            }

            var currentDate = new Date();
            currentDate.setUTCHours(23);
            currentDate.setUTCMinutes(59);
            currentDate.setUTCSeconds(59);
            currentDate.setUTCMilliseconds(999);

            if (startDate !== null && startDate.getTime() > currentDate.getTime()) {
                errors.push("Start date may not be in the future.");
            }
            if (endDate !== null && endDate.getTime() > currentDate.getTime()) {
                errors.push("End date may not be in the future.");
            }

            if (startDate !== null && endDate !== null && startDate.getTime() >=
                    endDate.getTime()) {
                errors.push('End date must be after start date.');
            }

            // Magnitude
            var minMag = null, maxMag = null;
            if (_minmagnitude.value !== '') {
                minMag = parseFloat(_minmagnitude.value);
                if (isNaN(minMag)) {
                    errors.push('Minimum magnitude must be numeric.');
                } else if (minMag < -1.0 || minMag > 10.0) {
                    errors.push('Minimum magnitude range: -1.0 to 10.0.');
                }
            }
            if (_maxmagnitude.value !== '') {
                maxMag = parseFloat(_maxmagnitude.value);
                if (isNaN(maxMag)) {
                    errors.push('Maximum magnitude must be numeric.');
                } else if (maxMag < -1.0 || maxMag > 10.0) {
                    errors.push('Maximum magnitude range: -1.0 to 10.0.');
                }
            }
            if (minMag !== null && maxMag !== null && maxMag < minMag) {
                errors.push('Minimum magnitude must be less than maximum ' +
                        'magnitude.');
            }

            // Depth
            var minDepth = null, maxDepth = null;
            if (_mindepth.value !== '') {
                minDepth = parseFloat(_mindepth.value);
                if (isNaN(minDepth)) {
                    errors.push('Minimum depth must be numeric.');
                }
            }
            if (_maxdepth.value !== '') {
                maxDepth = parseFloat(_maxdepth.value);
                if (isNaN(maxDepth)) {
                    errors.push('Maximum depth must be numeric.');
                }
            }
            if (minDepth !== null && maxDepth !== null && maxDepth < minDepth) {
                errors.push('Minimum depth must be less than maximum depth.');
            }

            // Intensity
            var minMMI = null, maxMMI = null;
            if (_minmmi.value !== '' && isNaN(_minmmi.value)) {
                minMMI = parseFloat(_minmmi.value);
                if (isNaN(minMMI)) {
                    errors.push('Minimum intensity must be numeric.');
                } else if (minMMI < 0.0 || minMMI > 12.0) {
                    errors.push('Minimum intensity must be between 0.0 and 12.0.');
                }
            }
            if (_maxmmi.value !== '') {
                maxMMI = parseFloat(_maxmmi.value);
                if (isNaN(maxMMI)) {
                    errors.push('Maximum intensity must be numeric.');
                } else if (maxMMI < 0.0 || maxMMI > 12.0) {
                    errors.push('Maximum intensity must be between 0.0 and 12.0.');
                }
            }
            if (minMMI !== null && maxMMI !== null && maxMMI < minMMI) {
                errors.push('Minimum intensity must be less than maximum ' +
                        'intensity.');
            }

            // Product type
            if (_producttype.value !== 'pleaseSelect' &&
                    !(_producttype.value in _options.producttypes)) {
                errors.push('Please select a valid product type.');
            }

            // Event source
            if (_catalog.value !== 'pleaseSelect' &&
                    !(_catalog.value in _options.catalogs)) {
                errors.push('Please select a valid event catalog.');
            }

            // Product source
            if (_catalog.value !== 'pleaseSelect' &&
                    !(_catalog.value in _options.catalogs)) {
                errors.push('Please select a valid event catalog.');
            }

            return errors;
        };

        var _renderErrors = function (errors) {
            // Display errors and return
            var numErrors = errors.length;

            if (numErrors > 0) {
                if (!Util.hasClass(_this.el, 'error')) {
                    Util.addClass(_this.el, 'error');
                }
            } else {
                if (Util.hasClass(_this.el, 'error')) {
                    Util.removeClass(_this.el, 'error');
                }
            }
            _errors.innerHTML = '<li>' + errors.join('</li><li>') + '</li>';
        };

        var _setBoundsToMap = function (evt) {
            var e = Util.getEvent(evt),
                bounds = _parseBounds(e.target.value);

            _minlatitude.value = bounds.minlatitude || '';
            _maxlatitude.value = bounds.maxlatitude || '';
            _minlongitude.value = bounds.minlongitude || '';
            _maxlongitude.value = bounds.maxlongitude || '';

            if (!_customBounds.checked) {
                _customBounds.checked = true;
                _toggleCustomBounds();
            }
        };

        var _toggleCustomBounds = function (evt) {
            if (_customBounds.checked) {
                _minlatitude.removeAttribute('disabled');
                _maxlatitude.removeAttribute('disabled');
                _minlongitude.removeAttribute('disabled');
                _maxlongitude.removeAttribute('disabled');
                Util.removeClass(_restrictBounds, 'disabled');
            } else {
                _minlatitude.setAttribute('disabled', 'disabled');
                _maxlatitude.setAttribute('disabled', 'disabled');
                _minlongitude.setAttribute('disabled', 'disabled');
                _maxlongitude.setAttribute('disabled', 'disabled');
                Util.addClass(_restrictBounds, 'disabled');
            }
        };

        var _toggleAdvancedOptions = function (evt) {
            if (Util.hasClass(_this.el, 'showAdvanced')) {
                Util.removeClass(_this.el, 'showAdvanced');
            } else {
                Util.addClass(_this.el, 'showAdvanced');
            }
        };

        var _handleCancel = function (evt) {
            // Close form
            document.body.removeChild(_this.el);

            // Execute callback
            if (typeof _onCancelCallback === 'function') {
                _onCancelCallback(_oldSearchObject);
                _onCancelCallback = null;
            }

            _onSaveCallback = null;
            _onDeleteCallback = null;
        };

        var _handleSave = function (evt) {
            // Validate and short-circuit if appropriate.
            if (!_validateSearchForm()) {
                // Scroll up so errors are visible
                _scrollSection.scrollTop = 0;
                return;
            }

            // Close the form
            document.body.removeChild(_this.el);

            // Execute callback
            if (typeof _onSaveCallback === 'function') {
                _onSaveCallback(_getSearchObject());
                _onSaveCallback = null;
            }

            _onCancelCallback = null;
            _onDeleteCallback = null;
        };

        var _handleDelete = function (evt) {
            // Built-in dialog not ideal, but quick and dirty.
            if (confirm('Are you sure you want to delete this search?')) {

                // Close the form
                document.body.removeChild(_this.el);

                // Execute the callback
                if (typeof _onDeleteCallback === 'function') {
                    _onDeleteCallback(_getSearchObject());
                    _onDeleteCallback = null;
                }

                _onCancelCallback = null;
                _onSaveCallback = null;
            }
        };

        var _getSearchObject = function () {
            var search = {};

            // Create a "search" object
            search.id = _searchId.value;
            search.name = _searchName.value;

            if (_customBounds.checked) {
                if (_minlatitude.value !== '') {
                    search.minlatitude = parseFloat(_minlatitude.value);
                }
                if (_maxlatitude.value !== '') {
                    search.maxlatitude = parseFloat(_maxlatitude.value);
                }
                if (_minlongitude.value !== '') {
                    search.minlongitude = parseFloat(_minlongitude.value);
                }
                if (_maxlongitude.value !== '') {
                    search.maxlongitude = parseFloat(_maxlongitude.value);
                }
            }

            if (_startDate.value !== '') {
                search.starttime = Format.iso8601(
                        _getDate(_startDate.value, false),
                        {timeSeparator:'T',withMilliseconds:true});
            }
            if (_endDate.value !== '') {
                search.endtime = Format.iso8601(
                        _getDate(_endDate.value, true),
                        {timeSeparator:'T',withMilliseconds:true});
            }
            if (_minmagnitude.value !== '') {
                search.minmagnitude = parseFloat(_minmagnitude.value);
            }
            if (_maxmagnitude.value !== '') {
                search.maxmagnitude = parseFloat(_maxmagnitude.value);
            }

            if (_mindepth.value !== '') {
                search.mindepth = parseFloat(_mindepth.value);
            }
            if (_maxdepth.value !== '') {
                search.maxdepth = parseFloat(_maxdepth.value);
            }
            if (_minmmi.value !== '') {
                search.minmmi = parseFloat(_minmmi.value);
            }
            if (_maxmmi.value !== '') {
                search.maxmmi = parseFloat(_maxmmi.value);
            }
            if (_producttype.selectedIndex !== 0) {
                search.producttype =
                        _producttype.options[_producttype.selectedIndex].value;
            }
            if (_catalog.selectedIndex !== 0) {
                search.catalog =
                        _catalog.options[_catalog.selectedIndex].value;
            }
            if (_contributor.selectedIndex !== 0) {
                search.contributor =
                        _contributor.options[_contributor.selectedIndex].value;
            }

            return search;
        };

        // Go.
        _initialize(options);
    };

    return SearchView;
});
