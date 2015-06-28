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
		return Q()
			.then(loadClasses)
			.then(loadComponents)
			.then(function () {
				$(function () {
					app.start();
				});
			});
	};

	app.start = function () {
		bindEvents();

		app.event.trigger(app.EVENT_WINDOW_CHANGE, {
			type: 'load',
			event: null
		});

		app.event.trigger(app.EVENT_APPLICATION_START);
	};

	app.loadPanel = function (name, $container) {
		var defer = Q.defer();
		
		app.event.trigger(app.EVENT_PANEL_PRELOAD, {Name: name});
		require([name], function (panelClass) {
			defer.resolve(new panelClass($container));
		});

		return defer.promise;
	};
	
	function loadClasses() {
		app.classes = {};

		var classPathMapClassName = {
			'app/events': 'Events',
			'app/component': 'Component'
		};
		
		var defer = Q.defer();
		
		var classPaths = Object.keys(classPathMapClassName);
		require(classPaths, function () {
			var args = Array.prototype.slice.call(arguments);
			args.forEach(function (clss, index) {
				var className = classPathMapClassName[classPaths[index]];
				app.classes[className] = clss;
			});
			
			defer.resolve();
		});
		
		return defer.promise;
	}

	function loadComponents() {
		var defer = Q.defer();

		require(['text!components.json'], function (componentsJSON) {
			var components = JSON.parse(componentsJSON);

			var componentPaths = [];
			components.forEach(function (componentName) {
				componentPaths.push('components/'+componentName+'/'+componentName);
			});

			require(componentPaths, function () {
				var args = Array.prototype.slice.call(arguments);
				args.forEach(function (componentClass) {
					var c = (new componentClass());
					c.register();
				});

				defer.resolve();
			});
		});
		
		return defer.promise;
	}

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

	return app;

});
