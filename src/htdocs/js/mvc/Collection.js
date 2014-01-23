
/**
 * A Lightweight collection, inspired by backbone.
 *
 * Lazily builds indexes to avoid overhead until needed.
 */
define(
	["./Events"],
	function(Events) {
// begin closure


		/**
		 * Create a new Collection.
		 *
		 * @param data {Array} of data.  When omitted a new array is created.
		 */
		var Collection = function(data) {
			// add event handling to collection
			Events.apply(this);


			// the wrapped array
			var _data = data || [];

			// index of object ids in the array, built lazily by getIds
			var _ids = null;

			// currently selected feature
			var _selected = null;


			/**
			 * Get the wrapped array.
			 *
			 * @return the wrapped array.
			 */
			this.data = function() {
				return _data;
			};
			
			/**
			 * Sorts the data.
			 */
			this.sort = function(method) {
				_data.sort(method);
			};

			/**
			 * Get a map from ID to INDEX.
			 *
			 * @param force {Boolean} rebuild the map even if it exists.
			 */
			this.getIds = function(force) {
				if (force || _ids === null) {
					// build up ids first time through
					_ids = {};
					for (var i=0; i<_data.length; i++) {
						_ids[_data[i].id] = i;
					};
				}
				return _ids;
			};


			/**
			 * Get an object in the collection by ID.
			 * 
			 * Uses getIds(), so builds map of ID to INDEX on first access O(N).
			 * Subsequent access should be O(1).
			 *
			 * @param id {Any} if the collection contains more than one object with the same id,
			 *                 the last element with that id is returned.
			 */
			this.get = function(id) {
				var ids = this.getIds();
				if (ids.hasOwnProperty(id)) {
					// use cached index
					return _data[ids[id]];
				} else {
					return null;
				}
			};

			/**
			 * Add objects to the collection.
			 *
			 * Calls wrapped array.push, and clears the id cache.
			 *
			 * @param {Object…} a variable number of objects to append to the collection.
			 */
			this.push = function() {
				_data.push.apply(_data, arguments);
				_ids = null;
				this.trigger("add", Array.slice.call(arguments, 1));
			};

			/**
			 * Remove one object from the collection.
			 *
			 * This method calls array.splice and removes one item from array.
			 * Reset would be faster if modifying large chunks of the array.
			 *
			 * @param o {Object} object to remove.
			 */
			this.remove = function(o) {
				var ids = this.getIds();

				if (ids.hasOwnProperty(o.id)) {
					if (o === _selected) {
						this.deselect();
					}

					// remove from array
					_data.splice(ids[o.id], 1);
					delete ids[o.id];
					this.trigger("remove", o);
				} else {
					throw "removing object not in collection";
				}
			};

			/**
			 * Replace the wrapped array with a new one.
			 */
			this.reset = function(data) {
				// check for existing selection
				var selectedId = null;
				if (_selected !== null) {
					selectedId = _selected.id;
				}


				// free array and id cache
				this.destroy();
				// set new array
				_data = data;
				// notify listeners
				this.trigger("reset", data);


				// reselect if there was a previous selection
				if (selectedId !== null) {
					var selected = this.get(selectedId);
					if (selected !== null) {
						this.select(selected, {'reset':true});
					}
				}
			};

			/**
			 * Free the array and id cache.
			 */
			this.destroy = function() {
				_data = null;
				_ids = null;
				this.deselect();
			};


			/** 
			 * Get the currently selected object.
			 */
			this.getSelected = function() {
				return _selected;
			};

			/**
			 * Select an object in the collection.
			 *
			 * @param obj {Object} object in the collection to select.
			 * @throws exception if obj not in collection.
			 */
			this.select = function(obj, options) {
				if (_selected !== null) {
					this.deselect();
				}

				if (obj === this.get(obj.id)) {
					// make sure it's part of this collection…
					_selected = obj;
					this.trigger("select", _selected, options);
				} else {
					throw "selecting object not in collection";
				}
			};

			/**
			 * Deselect current selection.
			 */
			this.deselect = function() {
				if (_selected !== null) {
					var oldSelected = _selected;
					_selected = null;
					this.trigger("deselect", oldSelected);
				}
			};

		};


		// return from constructor
		return Collection;


// end closure
	}
);
