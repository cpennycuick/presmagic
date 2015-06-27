define(['app/events'], function (events) {

	var app = {};

	app.EVENT_APPLICATION_START = 'Application:Start';
	app.EVENT_WINDOW_CHANGE = 'Window:Change';
	app.EVENT_PANEL_PRELOAD = 'Panel:PreLoad';
	app.EVENT_PANEL_SETUP = 'Panel:Setup';
	app.EVENT_PANEL_PREPARE = 'Panel:Prepare';
	app.EVENT_PANEL_LOADED = 'Panel:Loaded';

	app.event = events;

	app.init = function () {
		$(function () {
			app.start();
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

		loadComponents();
//		app.loadPanel('panel/main', $('#Content'));
	};

	app.loadPanel = function (name, $container) {
		var defer = Q.defer();

		app.event.trigger(app.EVENT_PANEL_PRELOAD, {Name: name});
		require([name], function (panelClass) {
			defer.resolve(new panelClass($container));
		});

		return defer.promise;
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

		menu.add('Help', function () {
			this.add('Help', function () {
				this.add('Contents');
				this.add('About');
			});
		});
	}

	function loadComponents() {
		require(['text!components.json'], function (componentsJSON) {
			var components = JSON.parse(componentsJSON);

			var componentPaths = [];
			components.forEach(function (componentName) {
				componentPaths.push('components/'+componentName+'/'+componentName);
			});

			require(componentPaths, function () {
				Array.prototype.slice.call(arguments).forEach(function (componentClass) {
					var c = (new componentClass());
					c.register();
				});
			});
		});
	}

	return app;

});
