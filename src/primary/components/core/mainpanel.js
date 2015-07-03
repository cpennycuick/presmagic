define(function () {

	var parentClass = app.classes.Panel;
	var parent = parentClass.prototype;

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		var menuHeight = 32; // TODO constant
		var $content = $('#Content');
		app.event.bind([app.EVENT_APPLICATION_START, app.EVENT_WINDOW_CHANGE], function () {
			$content.height(window.innerHeight - menuHeight);
		});
	};

	return c;
});
