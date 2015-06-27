define(function () {

	var events = {};

	return {
		bind: function (name, fn) {
			if (!(name in events)) {
				events[name] = [];
			}

			events[name].push(fn);
		},
		trigger: function (name, args) {
			if (name in events) {
				for (var i in events[name]) {
					var fnArgs = (args ? $.extend({}, args) : {});
					events[name][i](fnArgs);
				}
			}
		}
	};

});
