define(function () {

	var c = function () {
		this._progress = 0;
		this._total = 0;

		this._updateFns = [];
		this._destroyed = false;
	};

	c.prototype.isComplete = function () {
		return ((this._total - this._progress) === 0);
	};

	c.prototype.add = function (inc) {
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

	c.prototype.startSimulateProgress = function () {
		setTimeout(
			this._simulateProgress.bind(this),
			500 + Math.floor(Math.random() * 1500)
		);
	}

	c.prototype._simulateProgress = function () {
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

	c.prototype.onUpdate = function (fn) {
		if (this._destroyed) {
			return;
		}

		this._updateFns.push(fn);
	};

	c.prototype._incrementProgress = function () {
		if (this._destroyed) {
			return;
		}

		this._progress += 1;
		this._update();
	};

	c.prototype._update = function () {
		if (this._destroyed) {
			return;
		}

		this._updateFns.forEach(function (fn) {
			fn(this._progress, this._total);
		}, this);
	};

	c.prototype.destroy = function () {
		this._updateFns = null;
		this._destroyed = true;
	};

	return c;

});
