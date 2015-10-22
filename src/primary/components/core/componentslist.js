define(['text!components/core/componentslist.html'], function (templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);

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

		app.components.getAll().forEach(function (component) {
			var $row = $oRow.clone();

			var info = component.getInfo();
			$row.attr('title', info.Description);
			$row.find('[data-value=Name]').text(info.Name);
			$row.find('[data-value=Version]').text(info.Version);

			$tbody.append($row);
		});
	};

	return c;
});
