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

		var splitView = new app.SplitView.Horizontal(this, 30, 'Percent', false, 'Two');
		splitView.loadPanelTwo('components/core/slidespanel');

	};

	return c;
});
