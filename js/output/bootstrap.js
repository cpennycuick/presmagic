requirejs.config({
	baseUrl: 'js/output',
	paths: {
		css: '/css/output',
		style: '/lib/requirejs/module/css-0.1.8',
		jquery: '/lib/jquery/jquery-2.1.3.min'
	}
});

requirejs(['jquery', 'style!css/style'], function (jquery) {
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
