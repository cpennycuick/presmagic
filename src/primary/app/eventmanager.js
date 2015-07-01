define(function () {

	var c = function () {
		this._events = {};
	};

	c.prototype.bind = function (names, fn) {
		this._makeArray(names).forEach(function (name) {
			if (!(name in this._events)) {
				this._events[name] = [];
			}

			this._events[name].push(fn);
			console.log('event.bind', name);
		}, this);
	};

	c.prototype.trigger = function (names, args) {
		this._makeArray(names).forEach(function (name) {
			if (name in this._events) {
				for (var i in this._events[name]) {
					var fnArgs = (args ? $.extend({}, args) : {});
					this._events[name][i](fnArgs);
					console.log('event.trigger', name);
				}
			}
		}, this);
	};

	c.prototype._makeArray = function (value) {
		if (value === null || value === undefined) {
			return [];
		} else if (value instanceof Array) {
			return value;
		}

		return [value];
	};

	return c;

});
