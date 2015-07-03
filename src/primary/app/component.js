define(function () {

	var c = function () {

	};

	c.buildInfo = function (name, version, contributers, description) {
		var versionParts = (version || '0.0.1').split('.');
		versionParts = versionParts.concat(['0', '0', '0'].slice(versionParts.length, 3));

		return {
			Name: name,
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
