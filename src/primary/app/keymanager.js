define(function () {

	app.KeyManager = function () {
		this._keys = {};
		this._on = {};
	};

	app.KeyManager.KEY = {
		ENTER: 13,
		SHIFT: 16,
		CRTL: 17,
		ALT: 18,
		ESC: 27,
		SPACE: 32,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,

		A: 65
	};

	var k = app.KeyManager.KEY;
	app.KeyManager.prototype.on = function (keys, modifier, fn) {


		return this;
	};

	app.KeyManager.prototype.bind = function () {
		document.body.addEventListener('keydown', this.onKeyDown.bind(this), false);
		document.body.addEventListener('keyup', this.onKeyUp.bind(this), false);
	};

	app.KeyManager.prototype.onKeyDown = function (e) {
		if (!(e.which in this._keys)) {
			this._keys[e.which] = true;
			var key = Object.keys(this._keys);
			if (key.join('-'))
		} else {
			return false;
		}
	};

	app.KeyManager.prototype.onKeyUp = function (e) {
		if (e.which in this._keys) {
			delete this._keys[e.which];
		}
	};

	return app.KeyManager;

});
