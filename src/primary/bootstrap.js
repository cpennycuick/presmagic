requirejs.config({
	baseUrl: '/src/primary',
	paths: {
		text: '/vendor/requirejs/module/text-2.0.13',
		style: '/vendor/requirejs/module/css-0.1.8',

		jquery: '/vendor/jquery/jquery-2.1.3.min',
		Q: '/vendor/q/q-1.4.1'
	}
});

requirejs(['jquery', 'Q', 'app', 'startup', 'style!primary'], function (jquery, Q, app, startup) {
	window.$ = jquery;
	window.Q = Q;
	window.app = app;

	// TODO is this the right place?
	Q.longStackSupport = true;
	Q.onerror = function () {
		console.error('Q.onerror', this, arguments);
	};

	startup();
});

// TODO is this the right place / right way?
window.requireOneDeferred = function (dep) {
	var defer = Q.defer();
	require([dep], function (loadedDep) {
		defer.resolve(loadedDep);
	});

	return defer.promise;
};

window.requireDeferred = function (deps) {
	var defer = Q.defer();
	require(deps, function () {
		var loadedDeps = {};
		for (var i = 0; i < arguments.length; i++) {
			loadedDeps[deps[i]] = arguments[i];
		}

		defer.resolve(loadedDeps);
	});

	return defer.promise;
};
