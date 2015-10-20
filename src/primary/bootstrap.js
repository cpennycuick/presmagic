requirejs.config({
	baseUrl: '/src/primary',
	paths: {
		text: '/vendor/requirejs/module/text-2.0.13',
		style: '/vendor/requirejs/module/css-0.1.8',

		'DI': '/src/displayinstructions',

		'Handlebars': '/vendor/handlebars/handlebars-4.0.2',
		'Dexie': '/vendor/dexie/dexie-1.0.4.min',
		'jQuery': '/vendor/jquery/jquery-2.1.3.min',
		'Q': '/vendor/q/q-1.4.1'
	},
	shim: {
		'Dexie': {
			exports: 'Dexie'
		},
		'Handlebars': {
			exports: 'Handlebars'
		}
	}
});

requirejs(['jQuery', 'Q', 'Dexie', 'Handlebars', 'app', 'startup', 'style!primary', 'style!icons'], function (jquery, Q, Dexie, Handlebars, app, startup) {
//	window.Dexie = Dexie;
	window.Q = Q;
	window.app = app;

	// TODO is this the right place?
	Q.longStackSupport = true;
	Q.onerror = function (e) {
		console.error('Q.onerror', e, e.stack);
	};

	startup();
});

requirejs(['DI'], function () {
	console.log(window.DI);
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

	defer.promise.catch(function () {
		console.error('Error!');
	});

	return defer.promise;
};
