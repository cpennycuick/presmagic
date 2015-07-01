define(function () {

	var app = {};

	app.EVENT_APPLICATION_START = 'Application:Start';
	app.EVENT_WINDOW_CHANGE = 'Window:Change';
	app.EVENT_PANEL_SETUP = 'Panel:Setup';
	app.EVENT_PANEL_PREPARE = 'Panel:Prepare';
	app.EVENT_PANEL_LOADED = 'Panel:Loaded';

	app.components = [];
	app.classes = {};
	app.event = null;

	app.init = function () {
		app.event = new app.classes.EventManager();

		$(window).resize(function (event) {
			app.event.trigger(app.EVENT_WINDOW_CHANGE, {
				type: 'resize',
				event: event
			});
		});

		app.init = null; // dereference to prevent re-init
	};

	app.start = function () {
		app.event.trigger(app.EVENT_APPLICATION_START);

		app.start = null; // dereference to prevent re-init
	};

	app.loadPanel = function (name, $container) {
		return requireOneDeferred(name)
			.then(function (panelClass) {
				return new panelClass($container);
			});
	};

	return app;

});
