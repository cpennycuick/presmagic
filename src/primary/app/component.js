define(function () {

	var c = function (name) {
		this._name = name;
	};

	c.prototype.buildInfo = function (version, contributers, description) {
		var versionParts = (version || '0.0.1').split('.');
		versionParts = versionParts.concat(['0', '0', '0'].slice(versionParts.length, 3));

		return {
			Name: this._name,
			Version: versionParts.join('.'),
			Contributers: contributers || [],
			Description: description || null
		};
	};

	c.prototype.getInfo = function () {
		return c.buildInfo('Unnamed');
	};

	c.prototype.register = function () {

	};

	c.prototype.load = function () {

	};

	return c;

});
