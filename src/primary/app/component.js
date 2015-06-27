define(function () {

	var c = function (name, version, contributers) {
		this._name = name;
		this._version = version;
		this._contributers = contributers;
	};

	c.prototype.register = function () {
		// this._load();
	};

	c.prototype._load = function () {

	};

	return c;

});
