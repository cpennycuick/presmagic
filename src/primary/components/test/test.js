define(function () {

	var parentClass = app.Component;
	var parent = parentClass.prototype;

	var c = function () {
		parent.constructor.call(this, 'Test');
	};

	c.prototype = new parentClass();

	c.prototype.getInfo = function () {
		return this.buildInfo('0.0.1', ['Chris; @cpennycuick'],
			'This is a test component running along side the core component.'
		);
	};

	c.prototype.register = function () {
//		return Q.delay(500);
	};

	c.prototype.load = function () {
//		return Q.delay(100);
	};

	return c;

});
