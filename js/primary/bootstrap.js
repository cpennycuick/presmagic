requirejs.config({
	baseUrl: 'js/primary',
	paths: {
		events: '/js/events',

		html: '/html',
		css: '/css/primary',
		text: '/lib/requirejs/module/text-2.0.13',
		style: '/lib/requirejs/module/css-0.1.8',
		jquery: '/lib/jquery/jquery-2.1.3.min'
	}
});

requirejs(['jquery', 'app'], function (jquery, application) {
	window.$ = jquery;
	window.app = application;

	$(function () {
		app.start();
	});
});
