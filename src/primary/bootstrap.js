requirejs.config({
	baseUrl: '/src/primary',
	paths: {
		text: '/vendor/requirejs/module/text-2.0.13',
		style: '/vendor/requirejs/module/css-0.1.8',

		'DI': '/src/displayinstructions',		
		'Dexie': '/vendor/dexie/dexie-1.0.4.min',
		'jQuery': '/vendor/jquery/jquery-2.1.3.min',
		'Q': '/vendor/q/q-1.4.1',
		'tipped' : '/vendor/tipped/js/tipped/tipped',
		
	},
	shim: {
		'Dexie': {
			exports: 'Dexie'
		}
	}
});

requirejs(['jQuery', 'Q', 'Dexie', 'tipped', 'app', 'startup', 'style!primary', 'style!icons'], function (jquery, Q, Dexie, tipped, app, startup) {
//	window.Dexie = Dexie;
	window.Q = Q;
	window.app = app;
	window.tipped = tipped;

	// TODO is this the right place?
	Q.longStackSupport = false;
	Q.longStackJumpLimit = 0;	
	Q.onerror = function (e) {
		console.error('Q.onerror', e, e.stack);
	};
	loadCSS('/vendor/tipped/css/tipped/tipped.css');
	startup();
});

requirejs(['DI'], function () {
	console.log(window.DI);
});

window.loadCSS = function(url) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	link.href = url;
	document.getElementsByTagName("head")[0].appendChild(link);
}

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
