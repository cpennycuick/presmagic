define(function () {

	var parentClass = app.Component;
	var parent = parentClass.prototype;

	var c = function TestComponent () {
		parent.constructor.call(this, 'Test', ['Core']);
	};

	c.prototype = new parentClass();

	c.prototype._defineInfo = function () {
		return this._buildInfo('0.0.1',
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
