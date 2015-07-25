define(['text!components/presentation/presentation.html'], function (templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);
	var $oItem = template.get('PresentationListItem').find('li');

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		this._list = [];

		template.get('PresentationListPanel')
			.appendTo(this.getContainer());

		var self = this;
		this.$('.List').on('click', 'li', function () {
			var $this = $(this);

			if ($this.is('.Active')) {
				return;
			}

			var index = $(this).attr('data-index');
			app.event.trigger(app.EVENT_PRESENTATION_CHANGED, {
				PresentationID: self._list[index].ID
			});

			$this.addClass('Active');
		});

		var self = this;
		app.db.presentation.toArray(function (list) {
			self._list = list;
			self._updateList();
		});
	};

	c.prototype._updateList = function () {
		var $list = this.$('ul');

		for (var i = 0; i < this._list.length; i++) {
			$oItem.clone()
				.attr('data-index', i)
				.text(this._list[i].Name)
				.appendTo($list);
		}
	};

	return c;
});
