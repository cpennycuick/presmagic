requirejs.config({
	baseUrl: '/src/primary',
	paths: {
		text: '/vendor/requirejs/module/text-2.0.13',
		style: '/vendor/requirejs/module/css-0.1.8',

		jquery: '/vendor/jquery/jquery-2.1.3.min',
		Q: '/vendor/q/q-1.4.1'
	}
});

requirejs(['jquery', 'Q', 'app', 'style!primary'], function (jquery, Q, app) {
	window.$ = jQuery;
	window.Q = Q;
	window.app = app;

	app.init();
});
