/* global PIXI, requirejs */

requirejs.config({
	baseUrl: '/src/output',
	paths: {
		jquery: '/vendor/jquery/jquery-2.1.3.min',
	}
});

requirejs(['jquery', 'output'], function (jquery, output) {
	window.$ = jquery;
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
