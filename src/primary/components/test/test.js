define(function () {

	var parentClass = app.classes.Component;
	var parent = parentClass.prototype;

	var c = function () {
		parent.constructor.call(this, 'Test', '0.1', [
			'Chris; @cpennycuick'
		]);
	};

	c.prototype = new parentClass();

	c.prototype.register = function () {

	};

	c.prototype.load = function () {

	};

	return c;

});
