define(function () {

	var parentClass = app.Component;
	var parent = parentClass.prototype;

	var c = function () {
		parent.constructor.call(this, 'Presentation');
	};

	c.prototype = new parentClass();

	c.prototype.getInfo = function () {
		return this.buildInfo('0.1', ['Chris; @cpennycuick'],
			'This is the presentation component which provides all functionality relating to presentations.'
		);
	};

	c.prototype.register = function () {
		app.event.bind(app.EVENT_ROOTPANEL_LOADED, function (data) {
			app.loadPanel('components/presentation/presentationpanel', $('#Content'), data.Panel)
				.then(function (panel) {
					panel.run();
				});
		});
	};

	c.prototype.load = function () {

	};

	return c;

});
