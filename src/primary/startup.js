define(function () {

	return function () {
		return Q()
			.then(app.init)
			.then(initComponents)
			.then(onDOMLoaded)
			.then(initSplashLoader)
			.then(registerComponents)
			.then(startComponents)
			.then(app.start)
			.then(onLoadComplete)
			.then(removeSplashLoader)
			.then(function () {
				console.log('Startup done()');
			})
			.done();
	};

	var componentRegisterCompleteFn = null;
	var componentLoadCompleteFn = null;

	function initComponents() {
		return requireOneDeferred('text!components.json')
			.then(function (componentsJSON) {
				var componentNames = JSON.parse(componentsJSON);

				var componentPaths = [];
				componentNames.forEach(function (componentName) {
					componentPaths.push('components/'+componentName+'/'+componentName);
				});

				componentRegisterCompleteFn = app.loader.add(componentPaths.length);
				componentLoadCompleteFn = app.loader.add(componentPaths.length);

				return componentPaths;
			})
			.then(requireDeferred)
			.then(function (componentClasses) {
				Object.keys(componentClasses).forEach(function (componentPath) {
					var componentClass = componentClasses[componentPath];
					app.components.push(new componentClass());
				});
			});
	}

	function registerComponents() {
		var promises = [];
		app.components.forEach(function (component) {
			var promise = Q(component.register())
				.then(componentRegisterCompleteFn)
				.then(function() {
					console.log('Component', component._name, 'register()');
				});

			promise.done();

			promises.push(promise);
		});

		return Q.allSettled(promises);
	}

	function startComponents () {
		var promises = [];
		app.components.forEach(function (component) {
			var promise = Q(component.load())
				.then(componentLoadCompleteFn)
				.then(function() {
					console.log('Component', component._name, 'load()');
				});

			promise.done();

			promises.push(promise);
		});

		return Q.allSettled(promises);
	}

	function onDOMLoaded () {
		var defer = Q.defer();

		$(function () {
			defer.resolve();
		});

		return defer.promise;
	}

	function initSplashLoader() {
		var appLoadComplete = app.loader.add();
		app.event.bind(app.EVENT_APPLICATION_START, function () {
			appLoadComplete();
			appLoadComplete = null;
		});

		var $progressProgress = $('#SplashScreen .LoadingProgress');
		app.loader.onUpdate(function (progress, total) {
			$progressProgress.width((total ? Math.floor(progress / total * 100) : 100)+'%');
		});

		app.loader.startSimulateProgress();
	}

	function onLoadComplete() {
		var defer = Q.defer();

		defer.promise
			.timeout(1000 * 30)
			.fail(function (err) {
				console.log('Failed to finish loading.');
				clearInterval(interval);
				defer.resolve();
			})
			.done();

		var interval = setInterval(function () {
			if (app.loader.isComplete()) {
				clearInterval(interval);
				defer.resolve();
			}
		}, 500);

		return defer.promise;
	}

	function removeSplashLoader() {
		componentRegisterCompleteFn = null;
		componentLoadCompleteFn = null;

		app.loader.destroy();
		app.loader = null;

		$('#SplashScreen').fadeOut(1000, function () {
			$(this).remove();
		});
	}

});
