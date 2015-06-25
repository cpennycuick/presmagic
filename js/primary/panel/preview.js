define(['app/panel', 'text!html/preview.html', 'style!css/panel/preview'], function (appPanel, htmlPreview) {

	var parentClass = appPanel;
	var parent = parentClass.prototype;

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});

		this.$template = $(htmlPreview);
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		this.getContainer()
			.append(this.$template);
	};

	return c;

});
