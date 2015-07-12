define(function () {

	var parentClass = app.classes.Panel;
	var parent = parentClass.prototype;

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		var splitView = new app.classes.SplitView.Vertical(this, 250, 'Fixed');
		app.loadPanel('components/core/slidespanel', splitView.getContainerTwo())
			.then(function (panel) {
				panel.run();
			}).done();

		var self = this;

		var menuHeight = $('#MainMenu').outerHeight();
		var $content = $('#Content');
		app.event.bind([app.EVENT_APPLICATION_START, app.EVENT_WINDOW_CHANGE], function () {
			var contentHeight = window.innerHeight - menuHeight;
			$content.height(contentHeight);
			self.trigger(app.EVENT_PANEL_RESIZE, {
				Width: window.innerWidth,
				Height: contentHeight
			});
		});
	};

	return c;
});
