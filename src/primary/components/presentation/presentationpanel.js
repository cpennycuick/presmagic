define(['style!components/presentation/presentation'], function () {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	app.EVENT_PRESENTATION_CHANGED = 'Presentation:Changed';

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		var splitView = new app.SplitView.Vertical(this, 300, 'Fixed');
		splitView.loadPanelOne('components/presentation/presentationlistpanel');
		splitView.loadPanelTwo('components/presentation/presentationframesmainpanel');

	};

	return c;
});
