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
			.catch(function (e) {
				console.log('startup() error', e);
			})
			.done(function () {
				console.log('startup() done!');
			});
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
			})
			.then(function () {
				console.log('registerComponents() done!');
			})
			.catch(function (e) {
				console.log('registerComponents() error', e);
			});
	}

	function registerComponents() {
		var promises = [];
		app.components.forEach(function (component) {
			var promise = Q(component.register())
				.then(componentRegisterCompleteFn)
				.then(function () {
					console.log('component.register() done!');
				})
				.catch(function (e) {
					console.log('component.register() error', e);
				});

			promises.push(promise);
		});

		return Q.allSettled(promises);
	}

	function startComponents () {
		var promises = [];
		app.components.forEach(function (component) {
			var promise = Q(component.load())
				.then(componentLoadCompleteFn)
				.then(function () {
					console.log('component.load() done!');
				})
				.catch(function (e) {
					console.log('component.load() error', e);
				});

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
		});

		var $progressProgress = $('#SplashScreen .LoadingProgress');
		app.loader.onUpdate(function (progress, total) {
			$progressProgress.width((total ? Math.floor(progress / total * 100) : 100)+'%');
		});

		app.loader.startSimulateProgress();
	}

	function onLoadComplete() {
		var defer = Q.defer();

		var interval = setInterval(function () {
			if (app.loader.isComplete()) {
				clearInterval(interval);
				defer.resolve();
			}
		}, 500);

//		Q.timeout(defer.promise, 10);

		return defer.promise;
	}

	function removeSplashLoader() {
		$('#SplashScreen').fadeOut(1000, function () {
			$(this).remove();
		});
	}

});
