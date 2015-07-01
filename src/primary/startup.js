define(function () {

	return function () {
		return Q()
			.then(loadClasses)
			.then(app.init)
			.then(onDOMLoaded)
			.then(initComponents)
			.then(registerComponents)
			.then(startComponents)
			.then(app.start)
			.catch(function (e) {
				console.log('startup() error', e);
			})
			.done(function () {
				console.log('startup() done!', arguments);
			});
	};

	function loadClasses() {
		var classPathMapClassName = {
			'app/eventmanager': 'EventManager',
			'app/component': 'Component',
			'app/panel': 'Panel'
		};

		var classPaths = Object.keys(classPathMapClassName);
		return requireDeferred(classPaths)
			.then(function (classPathsMapClass) {
				Object.keys(classPathsMapClass).forEach(function (classPath) {
					var className = classPathMapClassName[classPath];
					app.classes[className] = classPathsMapClass[classPath];
				});

				return app.classes;
			})
			.then(function () {
				console.log('loadClasses() done!', arguments);
			})
			.catch(function (e) {
				console.log('loadClasses() error', e);
			});
	}

	function initComponents() {
		return requireOneDeferred('text!components.json')
			.then(function (componentsJSON) {
				var componentNames = JSON.parse(componentsJSON);

				var componentPaths = [];
				componentNames.forEach(function (componentName) {
					componentPaths.push('components/'+componentName+'/'+componentName);
				});

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
				console.log('registerComponents() done!', arguments);
			})
			.catch(function (e) {
				console.log('registerComponents() error', e);
			});
	}

	function registerComponents() {
		var promises = [];
		app.components.forEach(function (component) {
			var promise = Q(component.register())
				.then(function () {
					console.log('['+component._name+'] component.register() done!', arguments);
				})
				.catch(function (e) {
					console.log('['+component._name+'] component.register() error', e);
				});

			promises.push(promise);
		});

		return Q.allSettled(promises);
	}

	function startComponents () {
		var promises = [];
		app.components.forEach(function (component) {
			var promise = Q(component.load())
				.then(function () {
					console.log('['+component._name+'] component.load() done!', arguments);
				})
				.catch(function (e) {
					console.log('['+component._name+'] component.load() error', e);
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

});
