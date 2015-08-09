define(function () {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		var self = this;

		var menuHeight = document.getElementById('MainMenu').offsetHeight;
		var content = document.getElementById('Content');
		app.event.bind([app.EVENT_APPLICATION_START, app.EVENT_WINDOW_CHANGE], function () {
			var contentHeight = window.innerHeight - menuHeight;
			content.style.width = window.innerWidth + 'px';
			content.style.height = contentHeight + 'px';

			self.event.trigger(app.EVENT_VIEW_RESIZE, {
				Width: window.innerWidth,
				Height: contentHeight
			});
		});

		app.event.trigger(app.EVENT_ROOTPANEL_LOADED, {
			Panel: this
		});
	};

	return c;
});
