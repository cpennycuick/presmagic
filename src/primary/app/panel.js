define(['app/layouts', 'app/mixin/eventmanager'], function (appLayouts, appMixinEventManager) {

	app.Panel = function ($root, options, parentPanel) {
		this._$root = $root;
		this._options = options || {};
		this._parent = parentPanel;

		this._loaded = false;

		appMixinEventManager.call(this);

		if (this._parent) {
			var self = this;
			this._parent.event.bind(app.EVENT_VIEW_RESIZE, function (data) {
				if (!self._loaded) {
					return;
				}

				var container = self.getContainer()[0];
				self.event.trigger(app.EVENT_VIEW_RESIZE, {
					Width: container.offsetWidth,
					Height: container.offsetHeight
				});
			});
		}
	};

	app.Panel.prototype.run = function () {
		app.event.trigger(app.EVENT_PANEL_SETUP, {Panel: this});
		this._setup();

		app.event.trigger(app.EVENT_PANEL_PREPARE, {Panel: this});
		this._prepare();

		this._loaded = true;
		app.event.trigger(app.EVENT_PANEL_LOADED, {Panel: this});
	};

	app.Panel.prototype.startLoading = function () {
		this._layout.startLoading();
	};

	app.Panel.prototype.endLoading = function () {
		this._layout.endLoading();
	};

	app.Panel.prototype.getContainer = function () {
		return this._layout.getContainer();
	};

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

	return app.Panel;

});
