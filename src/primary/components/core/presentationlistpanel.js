define(['text!components/core/presentationlist.html'], function (templateHTML) {

	var parentClass = app.classes.Panel;
	var parent = parentClass.prototype;

	var template = new app.classes.Template(templateHTML);

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		var $panel = template.get('SlidesListPanel')
			.appendTo(this.getContainer());

		this._updateList($panel);
	};

	c.prototype._updateList = function ($panel) {
		var $oRow = template.get('PresentationListRow');

		for (var i = 0; i < list.length; i++) {
			$oRow.clone()
				.attr('data-index', i)
				.text(list[i])
				.appendTo($panel);
		}
	};

	return c;
});
