/* global PIXI, requirejs */

requirejs.config({
	baseUrl: '/src/output',
	paths: {
		'DI': '/src/displayinstructions',
		'jQuery': '/vendor/jquery/jquery-2.1.3.min',
		'Q': '/vendor/q/q-1.4.1'
	}
});

requirejs(['jQuery','Q', 'DI', 'output'], function (jQuery, Q, DI, output) {
	window.Q = Q;
	window.output = output;

	output.init();
});

//document.oncontextmenu = function (event) {
//	event.preventDefault();
//	return false;
//};
//
//window.onKeyDown = function (event) {
//	event.preventDefault();
//	return false;
//};
