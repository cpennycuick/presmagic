define(['text!components/main/componentslist.html'], function (templateHTML) {

	var parentClass = app.classes.Panel;
	var parent = parentClass.prototype;

	var template = new app.classes.Template(templateHTML);

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Dialog',
			LayoutOptions: {
				title: 'Components List',
			}
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		template.get('ComponentsListPanel')
			.appendTo(this.getContainer());

		this._populateList();
	};

	c.prototype._populateList = function () {
		var $tbody = this.$('table tbody');

		var $oRow = template.get('ComponentsListRow', 'tr');

		app.components.forEach(function (component) {
			var $row = $oRow.clone();
			$row.find('[data-value=Name]').text(component.name);
			$row.find('[data-value=Version]').text(component.version);
			$tbody.append($row);
		});
	};

	return c;
});
