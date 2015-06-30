define(function () {

	function makeArray(value) {
		if (value === null || value === undefined) {
			return [];
		} else if (value instanceof Array) {
			return value;
		}

		return [value];
	}

	return function () {
		var events = {};

		this.bind = function (names, fn) {
			makeArray(names).forEach(function (name) {
				if (!(name in events)) {
					events[name] = [];
				}

				events[name].push(fn);
				console.log('event.bind', name);
			});
		};

		this.trigger = function (names, args) {
			makeArray(names).forEach(function (name) {
				if (name in events) {
					for (var i in events[name]) {
						var fnArgs = (args ? $.extend({}, args) : {});
						events[name][i](fnArgs);
						console.log('event.trigger', name);
					}
				}
			});
		};
	};

});
