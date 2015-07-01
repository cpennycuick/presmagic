define(['text!components/main/componentslist.html'], function (template) {

	var parentClass = app.classes.Panel;
	var parent = parentClass.prototype;

	var $template = $(template);

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Dialog',
			LayoutOptions: {
				title: 'Components List',
				buttons: [
					{
						text: 'Close',
						action: 'close'
					}
				]
			}
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		$template.filter('[data-template=ComponentsListPanel]')
			.clone().appendTo(this.getContainer());

		this._populateList();
	};

	c.prototype._populateList = function () {
		var $tbody = this.$('table tbody');

		var $oRow = $template
			.filter('[data-template=ComponentsListRow]')
			.find('tr').clone();

		app.components.forEach(function (component) {
			var $row = $oRow.clone();
			$row.find('[data-value=Name]').text(component.name);
			$row.find('[data-value=Version]').text(component.version);
			$tbody.append($row);
		});
	};

	return c;
});
