define(function () {

	var uniqueID = 1;

	var template = '<div class="AddItem">'+
		'<div class="AddItemOptions"></div>'+
		'<div class="AddItemButton"></div>'+
	'</div>';

	app.ActionSet = function () {
		this._ID = uniqueID++;
		this._actions = [];
		this._$actionSet = $(template);

		this._$actionSet
			.find('.AddItemButton')
			.addClass('icon icon-circle-up');

		var self = this;
		this._$actionSet.find('.AddItemButton').click(function () {
			self._$actionSet.toggleClass('Open');

			if (self._$actionSet.is('.Open')) {
				$('body').on('click.ActionSet'+self._ID, function (event) {
					if (!$.contains(self._$actionSet[0], event.target)) {
						self.close();
					}
				});
			}
		});

		this._$actionSet
			.on('click', '.Option', function (event) {
				var index = $(event.currentTarget).attr('data-index');
				self.runAction(index);
			});

	};

	app.ActionSet.create = function () {
		return new app.ActionSet();
	};

	app.ActionSet.prototype.runAction = function (index) {
		if (index in this._actions) {
			this._actions[index][1]();
		}

		this.close();
	};

	app.ActionSet.prototype.close = function () {
		this._$actionSet.removeClass('Open');
		$('body').unbind('click.ActionSet'+this._ID);
	};

	app.ActionSet.prototype.addAction = function (icon, fn) {
		this._actions.push([icon, fn]);
		return this;
	};

	app.ActionSet.prototype.render = function ($container) {
		if (!this._actions.length) {
			return;
		}

		var $actionOptions = this._$actionSet.find('.AddItemOptions');

		for (var i = 0; i < this._actions.length; i++) {
			var $action = $('<div class="Option"></div>')
				.addClass('icon icon-'+this._actions[i][0])
				.attr('data-index', i);

			$actionOptions.append($action);
		}

		$container.append(this._$actionSet);
	};

	return app.ActionSet;
});
