define(function () {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var c = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);
	};

	return c;
});
