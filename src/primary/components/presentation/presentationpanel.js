define(['style!components/presentation/presentation'], function () {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	app.EVENT_PRESENTATION_CHANGED = 'Presentation:Changed';

	var c = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		var splitView = new app.SplitView.Vertical(this, 300, 'Fixed');
		splitView.loadPanelOne('components/presentation/presentationlistpanel');
		splitView.loadPanelTwo('components/presentation/presentationframespanel');

//		var splitViewFrames = splitView.splitHorizontalTwo(30, 'Percent', false, 'Two');
//		splitViewFrames.loadPanelOne('components/presentation/presentationframespanel');
//		splitViewFrames.loadPanelTwo('components/presentation/presentationtimelinepanel');

	};

	return c;
});
