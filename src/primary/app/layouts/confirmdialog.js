define(['app/layouts/dialog'], function (layoutDialog) {

	var $body = $(document.body);

	var c = function ConfirmDialogLayout ($root, options, closefn) {
		layoutDialog.prototype.constructor.call(this, $body, options, closefn);
	};
	c.prototype = new layoutDialog();

	c.prototype.wrap = function () {

		this._setupConfirmButtons();

		layoutDialog.prototype.wrap.call(this);
	};

	c.prototype._setupConfirmButtons = function () {
		if (!this._options.buttons) {
			this._options.buttons = [];
		}

		this._options.buttons.unshift({
			text: 'Cancel',
			className: 'Cancel',
		});
		this._options.buttons.push({
			text: 'Confirm',
			className: 'Confirm',
		});
	};

	return c;

});
