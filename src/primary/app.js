define(function () {

	var app = {};

	app.EVENT_APPLICATION_START = 'Application:Start';
	app.EVENT_APPLICATION_SETUP_MAINMENU = 'Application:SetupMainMenu';
	app.EVENT_WINDOW_CHANGE = 'Window:Change';
	app.EVENT_PANEL_SETUP = 'Panel:Setup';
	app.EVENT_PANEL_PREPARE = 'Panel:Prepare';
	app.EVENT_PANEL_LOADED = 'Panel:Loaded';
	app.EVENT_PANEL_RESIZE = 'Panel:Resize';

	app.components = [];
	app.classes = {};
	app.event = null;
	app.loader = null;

	app.init = function () {
		app.init = null; // dereference to prevent re-init

		return loadClasses().then(doInit);
	};

	function loadClasses() {
		var classPathMapClassName = {
			'app/eventmanager': 'EventManager',
			'app/mainmenubuilder': 'MainMenuBuilder',
			'app/component': 'Component',
			'app/template': 'Template',
			'app/panel': 'Panel',
			'app/splitview': 'SplitView',
			'app/loader': 'Loader'
		};

		var classPaths = Object.keys(classPathMapClassName);
		return requireDeferred(classPaths)
			.then(function (classPathsMapClass) {
				Object.keys(classPathsMapClass).forEach(function (classPath) {
					var className = classPathMapClassName[classPath];
					app.classes[className] = classPathsMapClass[classPath];
				});

				return app.classes;
			});
	}

	function doInit() {
		app.event = new app.classes.EventManager();
		app.loader = new app.classes.Loader();

		$(window).resize(function (event) {
			app.event.trigger(app.EVENT_WINDOW_CHANGE, {
				type: 'resize',
				event: event
			});
		});

		mainmenu.setup();
	}

	app.start = function () {
		mainmenu.render();

		app.event.trigger(app.EVENT_APPLICATION_START);
		app.start = null; // dereference to prevent re-init
	};

	app.loadPanel = function (name, $container) {
		return requireOneDeferred(name)
			.then(function (panelClass) {
				return new panelClass($container);
			});
	};

	var mainmenu = {
		_mainmenu: null,
		setup: function () {
			this._mainmenu = new app.classes.MainMenuBuilder();

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
