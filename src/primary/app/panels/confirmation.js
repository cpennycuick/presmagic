define(function () {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'ConfirmDialog',
			LayoutOptions: {
				title: 'Confirm',
			}
		});

		this._message = 'Are you sure?';
	};

	c.prototype = new parentClass();

	c.prototype.setMessage = function (message) {
		this._message = message;
	};

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		$('<div />')
			.text(this._message)
			.css({
				'text-align': 'center'
			})
			.appendTo(this.getContainer());

	};

	c.prototype._confirmAction = function () {

	};

	c.prototype._cancelAction = function () {

	};

	return c;
});
