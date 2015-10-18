define(function () {

	app.ItemSelection = function () {
		this._selection = [];
		this._updateFns = [];
	};

	app.ItemSelection.create = function () {
		return new app.ItemSelection();
	};

	app.ItemSelection.prototype.isSelectionEmpty = function () {
		return (this._selection.length === 0);
	};

	app.ItemSelection.prototype.getSelection = function () {
		return Array.prototype.slice.call(this._selection);
	};

	app.ItemSelection.prototype.getSingleSelection = function () {
		if (this.isSingleSelection()) {
			return this._selection[0];
		}
		return false;
	};

	app.ItemSelection.prototype.isSingleSelection = function () {
		return (this._selection.length === 1);
	};

	app.ItemSelection.prototype.setSelection = function (first) {
		var selection = Array.prototype.slice.call(arguments);

		if (!this.matches(selection)) {
			this._selection = selection;
			this._triggerChange();
		}
	};

	app.ItemSelection.prototype.addToSelection = function (single) {
		if (!this.isSelected(single)) {
			this._selection.push(single);
			this._triggerChange();
		}
	};

	app.ItemSelection.prototype.removeFromSelection = function (single) {
		if (this.isSelected(single)) {
			var index = this._selection.indexOf(single);
			this._selection.splice(index, 1);
			this._triggerChange();
		}
	};
	
	app.ItemSelection.prototype.toggleSelected = function (index) {
		if(this.isSelected(index)) {
			this.removeFromSelection(index);
		} else {
			this.addToSelection(index);
		}
	}

	app.ItemSelection.prototype.isSelected = function (single) {
		return (this._selection.indexOf(single) >= 0);
	};

	app.ItemSelection.prototype.clearSelection = function () {
		this.setSelection();
	};

	app.ItemSelection.prototype.matches = function (selection) {
		if (this._selection.length !== selection.length) {
			return false;
		}

		for (var i in this._selection) {
			if (this._selection[i] != selection[i]) {
				return false;
			}
		}

		return true;
	};

	app.ItemSelection.prototype.onChange = function (fn) {
		this._updateFns.push(fn);
		return this;
	};

	app.ItemSelection.prototype._triggerChange = function () {
		for (var i in this._updateFns) {
			var selection = Array.prototype.slice.call(this._selection);
			this._updateFns[i](selection);
		}
	};

	return app.ItemSelection;

});
