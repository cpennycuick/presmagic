requirejs.config({
	baseUrl: 'js/output',
	paths: {
		style: '/vendor/requirejs/module/css-0.1.8',
		jquery: '/vendor/jquery/jquery-2.1.3.min'
	}
});

requirejs(['jquery'], function (jquery) {
	window.$ = jquery;
});

document.oncontextmenu = function (event) {
	event.preventDefault();
	return false;
};

window.onKeyDown = function (event) {
	event.preventDefault();
	return false;
};
