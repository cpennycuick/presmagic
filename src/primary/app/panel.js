define(['app/layouts'], function (appLayouts) {

	var c = function ($root, options) {
		this._$root = $root;
		this._options = options || {};
	};

	c.prototype.run = function () {
		app.event.trigger(app.EVENT_PANEL_SETUP, {Panel: this});
		this._setup();

		app.event.trigger(app.EVENT_PANEL_PREPARE, {Panel: this});
		this._prepare();

		app.event.trigger(app.EVENT_PANEL_LOADED, {Panel: this});
	};

	c.prototype.startLoading = function () {
		this._layout.startLoading();
	};

	c.prototype.endLoading = function () {
		this._layout.endLoading();
	}

	c.prototype.getContainer = function () {
		return this._layout.getContainer();
	}

	c.prototype._setup = function () {
		this._setupLayout();
	};

	c.prototype._setupLayout = function () {
		var options = this._options;
		var layoutClass = appLayouts[options.Layout];
		this._layout = new layoutClass(this._$root, options.LayoutOptions);

		this._layout.wrap();
	};

	c.prototype._prepare = function () {

	};

	c.prototype.$ = function (selector) {
		return this.getContainer().find(selector);
	};

	return c;

});
