define(function () {

	app.Component = function (name, depends) {
		this._name = name;
		this._dependencies = depends || [];

		if (!arguments.length) {
			return;
		}

		this._info = this._defineInfo();
	};

	app.Component.prototype._buildInfo = function (version, contributers, description) {
		var versionParts = (version || '0.0.1').split('.');
		versionParts = versionParts.concat(['0', '0', '0'].slice(versionParts.length, 3));

		return {
			Name: this._name,
			Version: versionParts.join('.'),
			Contributers: contributers || [],
			Description: description || null,
			Dependencies: this._dependencies
		};
	};

	app.Component.prototype.getInfo = function () {
		return this._info;
	};

	app.Component.prototype.getName = function () {
		return this._name;
	};

	app.Component.prototype.getDependencies = function () {
		return this._dependencies;
	};

	app.Component.prototype.register = function () {

	};

	app.Component.prototype.load = function () {

	};

	app.Component.prototype._defineInfo = function () {
		return this.buildInfo();
	};

	return app.Component;

});
