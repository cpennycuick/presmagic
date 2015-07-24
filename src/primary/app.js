define(['db'], function (db) {

	var app = {};

	app.db = db;

	app.EVENT_APPLICATION_START = 'Application:Start';
	app.EVENT_APPLICATION_SETUP_MAINMENU = 'Application:SetupMainMenu';
	app.EVENT_WINDOW_CHANGE = 'Window:Change';
	app.EVENT_PANEL_SETUP = 'Panel:Setup';
	app.EVENT_PANEL_PREPARE = 'Panel:Prepare';
	app.EVENT_PANEL_LOADED = 'Panel:Loaded';
	app.EVENT_PANEL_RESIZE = 'Panel:Resize';

	app.components = [];
	app.event = null;
	app.loader = null;

	app.init = function () {
		delete app.init; // dereference to prevent re-init
		return setup.init();
	};

	app.start = function () {
		delete app.start; // dereference to prevent re-init
		setup.start();
	};

	app.loadPanel = function (name, $container) {
		return requireOneDeferred(name)
			.then(function (panelClass) {
				return new panelClass($container);
			});
	};

	var setup = {
		init: function () {
			return this._loadClasses()
				.then(this._doInit);
		},
		start: function () {
			mainmenu.render();

			app.event.trigger(app.EVENT_APPLICATION_START);
		},
		_loadClasses: function () {
			var classPaths = [
				'app/eventmanager',
				'app/mainmenubuilder',
				'app/component',
				'app/template',
				'app/panel',
				'app/splitview',
				'app/loader'
			];

			return requireDeferred(classPaths);
		},
		_doInit: function () {
			app.event = new app.EventManager();
			app.loader = new app.Loader();

			$(window).resize(function (event) {
				app.event.trigger(app.EVENT_WINDOW_CHANGE, {
					type: 'resize',
					event: event
				});
			});

			mainmenu.setup();
		}
	};

	var mainmenu = {
		_mainmenu: null,
		setup: function () {
			this._mainmenu = new app.MainMenuBuilder();

			this._mainmenu.add('File', 0, function () {
				this.add('Application', function () {
					this.add('Exit', null, function () {
						chrome.app.window.current().close();
					});
				});
			});
		},
		render: function () {
			app.event.trigger(app.EVENT_APPLICATION_SETUP_MAINMENU, {'MainMenu': this._mainmenu});

			$('#MainMenu').append(this._mainmenu.render());
		}
	};

	return app;

});
