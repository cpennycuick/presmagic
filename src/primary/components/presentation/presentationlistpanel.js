define(['app/tool/actionset', 'text!components/presentation/presentation.html'], function (ActionSet, templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);
	var $oItem = template.get('PresentationListItem').find('li');

	var c = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		this._list = [];
		this._activePresentationID = null;

		template.get('PresentationListPanel')
			.appendTo(this.getContainer());

		var self = this;
		ActionSet.create()
			.addAction('plus', function () {
				self._addNewItem();
			})
//			.addAction('search', function () {
//				console.log('Item1');
//			})
			.render(this.getContainer());

		var self = this;

		this.$('.List').on('click', 'li', function () {
			var $this = $(this);

			if ($this.is('.Active')) {
				return;
			}

			var index = $(this).attr('data-index');
			self._activePresentationID = self._list[index].ID;

			app.event.trigger(app.EVENT_PRESENTATION_CHANGED, {
				PresentationID: self._activePresentationID
			});

			self.$('.Active').removeClass('Active');
			$this.addClass('Active');
		});

		this.$('.List').on('click', 'li .Action', function (event) {
			event.preventDefault;
			var $this = $(this);

			var index = $this.closest('li').attr('data-index');
			switch ($this.attr('data-action')) {
				case 'Delete':
					self._removeItem(index);
					break;
			}

			return false;
		});


		var self = this;
		app.db.presentation.toArray(function (list) {
			self._list = list;
			self._updateList();
		});
	};

	c.prototype._updateList = function () {
		var $list = this.$('ul');
		$list[0].innerHTML = '';

		for (var i = 0; i < this._list.length; i++) {
			var $item = $oItem.clone()
				.attr('data-index', i)
				.appendTo($list);

			$item.find('.Text')
				.text(this._list[i].Name);
		}
	};

	c.prototype._addNewItem = function () {
		var self = this;
		app.db.transaction('rw', app.db.presentation, function () {
			var item = {Name: "New"};
			app.db.presentation.add(item).then(function (ID) {
				item.ID = ID;

				self._list.push(item);
				self._updateList();
			});
		});
	};

	c.prototype._removeItem = function (index) {
		if (!(index in this._list)) {
			return;
		}

		// TODO confirm

		var self = this;
		var item = this._list[index];

		app.db.transaction('rw', [app.db.presentation, app.db.frame], function () {
			app.db.frame.where('PresentationID').equals(item.ID).delete();
			app.db.presentation.delete(item.ID);

			self._list.splice(index, 1);
			self._updateList();
		});

		if (this._activePresentationID) {
			app.event.trigger(app.EVENT_PRESENTATION_CHANGED, {
				PresentationID: null
			});

			this._activePresentationID = null;
		}
	};

	return c;
});
