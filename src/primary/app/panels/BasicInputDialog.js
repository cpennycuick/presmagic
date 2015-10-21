define(function () {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var c = function ($container, opts) {
		parent.constructor.call(this, $container, {
			Layout: 'InputDialog',
			LayoutOptions: opts
		});
		
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);
	};
	return c;
});
