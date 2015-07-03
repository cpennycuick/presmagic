define(function () {

	var c = function () {

	};
	
	c.buildInfo = function (name, version, contributers, description) {
		retun {
			Name: name,
			Version: version || '0.0.1',
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
