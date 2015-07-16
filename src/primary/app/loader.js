define(function () {

	app.Loader = function () {
		this._progress = 0;
		this._total = 0;

		this._updateFns = [];
		this._destroyed = false;
	};

	app.Loader.prototype.isComplete = function () {
		return ((this._total - this._progress) === 0);
	};

	app.Loader.prototype.add = function (inc) {
		inc = inc || 1;

		this._total += inc;
		this._update();

		return (function (incrementFn, max) {
			var counter = 0;
			return function () {
				if (counter < max) {
					counter += 1;
					incrementFn();
				};
			};
		})(this._incrementProgress.bind(this), inc);
	};

	app.Loader.prototype.startSimulateProgress = function () {
		setTimeout(
			this._simulateProgress.bind(this),
			500 + Math.floor(Math.random() * 1500)
		);
	}

	app.Loader.prototype._simulateProgress = function () {
		if (this._destroyed) {
			return;
		}

		if (Math.floor(this._progress / this._total * 100) > 95) {
			return;
		}

		this._progress += 1;
		this._total += 1;
		this._update();
	};

	app.Loader.prototype.onUpdate = function (fn) {
		if (this._destroyed) {
			return;
		}

		this._updateFns.push(fn);
	};

	app.Loader.prototype._incrementProgress = function () {
		if (this._destroyed) {
			return;
		}

		this._progress += 1;
		this._update();
	};

	app.Loader.prototype._update = function () {
		if (this._destroyed) {
			return;
		}

		this._updateFns.forEach(function (fn) {
			fn(this._progress, this._total);
		}, this);
	};

	app.Loader.prototype.destroy = function () {
		this._updateFns = null;
		this._destroyed = true;
	};

	return app.Loader;

});
