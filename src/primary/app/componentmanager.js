define(['text!components.json', 'app/mixin/qmethods'], function (componentsJSON, appMixinQMethods) {

	app.ComponentManager = function () {
		this._componentClassNames = JSON.parse(componentsJSON);
		this._componentGraphRoots = [];
		this._componentDependencyOrder = [];

		this.STATE_READY = 'Ready';
		this.STATE_INITIALSED = 'Initialsed';
		this.STATE_REGISTERED = 'Registered';
		this.STATE_STARTED = 'Started';

		this._state = this.STATE_READY;

		this._registerCompleteFn = null;
		this._loadCompleteFn = null;

		appMixinQMethods.call(this);
	};

	app.ComponentManager.prototype.init = function () {
		this._checkState(this.STATE_READY);

		return Q()
			.then(this._getClasses.bind(this))
			.then(this._buildDependencyGraph.bind(this))
			.then(this._updateState.bind(this, this.STATE_INITIALSED));
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
		this._checkState(this.STATE_INITIALSED);

		var promises = this._callComponentsMethod('register', this._registerCompleteFn);

		return Q.allSettled(promises)
			.then(this._updateState.bind(this, this.STATE_REGISTERED));
	};

	app.ComponentManager.prototype.start = function () {
		this._checkState(this.STATE_REGISTERED);

		var promises = this._callComponentsMethod('load', this._loadCompleteFn);

		return Q.allSettled(promises)
			.then(this._updateState.bind(this, this.STATE_STARTED));
	};

	app.ComponentManager.prototype._callComponentsMethod = function (methodName, completeFn) {
		var promises = [];

		this._componentDependencyOrder.forEach(function (component) {
			var promise = Q(component[methodName]())
				.then(completeFn);

			promise.done();

			promises.push(promise);
		}, this);

		return promises;
	};

	app.ComponentManager.prototype._checkState = function (state) {
		if (this._state !== state) {
			throw new Error('Invalid state: '+this._state+'; Expected: '+state);
		}
	};

	app.ComponentManager.prototype._updateState = function (state) {
		this._state = state;
	};

	app.ComponentManager.prototype.getAll = function () {
		return this._componentDependencyOrder;
	};

	return app.ComponentManager;

});
