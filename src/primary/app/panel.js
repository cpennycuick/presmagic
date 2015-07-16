define(['app/layouts'], function (appLayouts) {

	app.Panel = function ($root, options) {
		this._$root = $root;
		this._options = options || {};
		this._event = new app.EventManager();
	};

	app.Panel.prototype.run = function () {
		app.event.trigger(app.EVENT_PANEL_SETUP, {Panel: this});
		this._setup();

		app.event.trigger(app.EVENT_PANEL_PREPARE, {Panel: this});
		this._prepare();

		app.event.trigger(app.EVENT_PANEL_LOADED, {Panel: this});
	};

	app.Panel.prototype.startLoading = function () {
		this._layout.startLoading();
	};

	app.Panel.prototype.endLoading = function () {
		this._layout.endLoading();
	}

	app.Panel.prototype.getContainer = function () {
		return this._layout.getContainer();
	}

	app.Panel.prototype._setup = function () {
		this._setupLayout();
	};

	app.Panel.prototype._setupLayout = function () {
		var options = this._options;
		var layoutClass = appLayouts[options.Layout];
		this._layout = new layoutClass(this._$root, options.LayoutOptions);

		this._layout.wrap();
	};

	app.Panel.prototype._prepare = function () {

	};

	app.Panel.prototype.$ = function (selector) {
		return this.getContainer().find(selector);
	};

	app.Panel.prototype.bind = function () {
		this._event.bind.apply(this._event, arguments);
	};

	app.Panel.prototype.trigger = function () {
		this._event.trigger.apply(this._event, arguments);
	};

	return app.Panel;

});
