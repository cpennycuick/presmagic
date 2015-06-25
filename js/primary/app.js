define(['events', 'style!css/app'], function (events) {

	var app = {};

	app.EVENT_APPLICATION_START = 'Application:Start';
	app.EVENT_WINDOW_CHANGE = 'Window:Change';
	app.EVENT_PANEL_PRELOAD = 'Panel:PreLoad';
	app.EVENT_PANEL_SETUP = 'Panel:Setup';
	app.EVENT_PANEL_PREPARE = 'Panel:Prepare';
	app.EVENT_PANEL_LOADED = 'Panel:Loaded';

	app.event = events;

	app.loadPanel = function (name, $container) {
		app.event.trigger(app.EVENT_PANEL_PRELOAD, {Name: name});
		require([name], function (panelClass) {
			(new panelClass($container)).run();
		});
	};

	app.start = function () {
		bindEvents();
		loadMainMenu();

		app.event.trigger(app.EVENT_WINDOW_CHANGE, {
			type: 'load',
			event: null
		});

		app.event.trigger(app.EVENT_APPLICATION_START);

		app.loadPanel('panel/main', $('#Content'));
	};

	function bindEvents() {
		$(window).resize(function (event) {
			app.event.trigger(app.EVENT_WINDOW_CHANGE, {
				type: 'resize',
				event: event
			});
		});

		var menuHeight = 32;
		var $content = $('#Content');
		app.event.bind(app.EVENT_WINDOW_CHANGE, function (data) {
			if (data.type === 'load' || data.type === 'resize') {
				$content.height(window.innerHeight - menuHeight);
			}
		});
	}

	function loadMainMenu() {
		require(['app/mainmenu'], function (MainMenu) {
			var menu = new MainMenu();
			setupMenu(menu);

			$('#MainMenu').append(menu.render());
		});
	}

	function setupMenu(menu) {
		menu.add('File', function () {
			this.add('Application', function () {
				this.add('Preferences');
				this.add('Exit', null, function () {
					chrome.app.window.current().close();
				});
			});
			this.add('Advanced', function () {
				this.add('Stage Display');
				this.add('Remote Control');
			});
		});

		menu.add('Media', function () {
			this.add('Video', function () {
				this.add('Load File');
			});
		});

		menu.add('Windows', function () {
			this.add('Video', function () {
				this.add('Load File');
			});
		});

		menu.add('Help', function () {
			this.add('Help', function () {
				this.add('Contents');
				this.add('About');
			});
		});
	}

	return app;

});
