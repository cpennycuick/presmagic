define(function () {

	return function () {
		var self = this;

		this.Q = function (funcName) {
			return function () {
				return self[funcName].apply(self, arguments);
			};
		};
	};

});
