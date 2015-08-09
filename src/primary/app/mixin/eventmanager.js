define(['app/eventmanager'], function (appEventManager) {

	return function () {
		var eventManager = new appEventManager();

		this.event = {
			bind: function () {
				eventManager.bind.apply(eventManager, arguments);
			},

			trigger: function () {
				eventManager.trigger.apply(eventManager, arguments);
			}
		};
	};

});
