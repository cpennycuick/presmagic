define(function () {

	app.Component = function (name) {
		this._name = name;
	};

	app.Component.prototype.buildInfo = function (version, contributers, description) {
		var versionParts = (version || '0.0.1').split('.');
		versionParts = versionParts.concat(['0', '0', '0'].slice(versionParts.length, 3));

		return {
			Name: this._name,
			Version: versionParts.join('.'),
			Contributers: contributers || [],
			Description: description || null
		};
	};

	app.Component.prototype.getInfo = function () {
		return app.Component.buildInfo('Unnamed');
	};

	app.Component.prototype.register = function () {

	};

	app.Component.prototype.load = function () {

	};

	return app.Component;

});
