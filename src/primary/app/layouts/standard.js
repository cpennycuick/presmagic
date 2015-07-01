define(function () {

	var c = function ($root, options) {
		this._$root = $root || $();
		this._options = options || {};

		this._$container = $();
	};

	c.prototype.wrap = function () {
		this._$container = this._$root;
	};

	c.prototype.getContainer = function () {
		return this._$container;
	}

	c.prototype.startLoading = function () {

	};

	c.prototype.endLoading = function () {

	};

	c.prototype.close = function () {

	};

	return c;

});
