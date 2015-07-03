define(function () {

	var parentClass = app.classes.Component;
	var parent = parentClass.prototype;

	var c = function () {
		parent.constructor.call(this);
	};

	c.prototype = new parentClass();

	c.prototype.getInfo = function () {
		return parentClass.buildInfo('Test', '0.0.1', ['Chris; @cpennycuick'],
			'This is a test component running along side the core component.'
		);
	};

	c.prototype.register = function () {
		return Q.delay(500);
	};

	c.prototype.load = function () {
		return Q.delay(100);
	};

	return c;

});
