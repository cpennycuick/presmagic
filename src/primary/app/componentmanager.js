define(['text!components.json', 'app/mixin/qmethods'], function (componentsJSON, appMixinQMethods) {

	app.ComponentManager = function () {
		this._componentClassNames = JSON.parse(componentsJSON);
		this._componentGraphRoots = [];
		this._componentDependencyOrder = [];

		this._registerCompleteFn = null;
		this._loadCompleteFn = null;

		appMixinQMethods.call(this);
	};

	app.ComponentManager.prototype.init = function () {
		return Q()
			.then(this._getClasses.bind(this))
			.then(this._buildDependencyGraph.bind(this))
	};

	app.ComponentManager.prototype._getClasses = function () {
		var componentPaths = [];
		this._componentClassNames.forEach(function (componentName) {
			componentPaths.push('components/'+componentName+'/'+componentName);
		});

		this._registerCompleteFn = app.loader.add(componentPaths.length);
		this._loadCompleteFn = app.loader.add(componentPaths.length);

		return requireDeferred(componentPaths);
	};

	app.ComponentManager.prototype._buildDependencyGraph = function (componentClasses) {
		var componentClassPaths = Object.keys(componentClasses);

		var componentPath;
		var componentClass;
		var componentName;
		var componentNodeMapName = {};
		while(componentClassPaths.length) {
			componentPath = componentClassPaths.shift();
			componentClass = componentClasses[componentPath];
			var component = new componentClass();
			var componentName = component.getName();

			var componentNode;
			if (componentName in componentNodeMapName) {
				componentNode = componentNodeMapName[componentName];
			} else {
				componentNode = componentNodeMapName[componentName] = {
					Component: component,
					Dependencies: [],
					Children: []
				};

				this._componentDependencyOrder.push(component);
			}

			if (!component.getDependencies().length) {
				this._componentGraphRoots.push(componentNode);
			} else if (this._allDependenciesMapped(component, componentNodeMapName)) {
				component.getDependencies().forEach(function (dependComponentName) {
					var dependComponentNode = componentNodeMapName[dependComponentName];
					dependComponentNode.Children.push(componentNode);
					componentNode.Dependencies.push(dependComponentNode);
				}, this);
			} else {
				componentClassPaths.push(componentPath);
			}
		}
	};

	app.ComponentManager.prototype._allDependenciesMapped = function (componentInstance, classNodeMap) {
		return componentInstance.getDependencies().every(function (depCompName) {
			return (depCompName in classNodeMap);
		});
	};

	app.ComponentManager.prototype.register = function () {
		var promises = [];

		this._componentDependencyOrder.forEach(function (component) {
			var promise = Q(component.register())
				.then(this._registerCompleteFn)
				.then(function() {
					console.log('Component', component._name, 'register()');
				});

			promise.done();

			promises.push(promise);
		}, this);

		return Q.allSettled(promises);
	};

	app.ComponentManager.prototype.start = function () {
		var promises = [];

		this._componentDependencyOrder.forEach(function (component) {
			var promise = Q(component.load())
				.then(this._loadCompleteFn)
				.then(function() {
					console.log('Component', component._name, 'load()');
				});

			promise.done();

			promises.push(promise);
		}, this);

		return Q.allSettled(promises);
	};

	return app.ComponentManager;

});
