define(['app/layouts/standard'], function (layoutStandard) {

	var c = function DialogLayout ($root, options, closefn) {
		layoutStandard.prototype.constructor.call(this, $root, options);

		this._$cloak = $();
		this._$buttons = $();
		this._closefn = closefn;
	};
	c.prototype = new layoutStandard();

	c.prototype.wrap = function () {
		this._$cloak = $('<div class="Cloak"></div>');

		var $dialog = $(
'	<div class="Dialog">'+
'		<div class="DialogCloseButton icon icon-cross"></div>'+
'		<div class="DialogTitle"></div>'+
'		<div class="DialogContent"></div>'+
'		<div class="DialogButtons"></div>'+
'	</div>'
);

		this._$buttons = $dialog.find('.DialogButtons');
		this._$container = $dialog.find('.DialogContent');

		$dialog.find('.DialogCloseButton').click(this.close.bind(this));
		$dialog.find('.DialogTitle').text(this._options.title);

		$.each(this._options.buttons || [], this._addButton.bind(this));

		this._$cloak.append($dialog);
		this._$root.append(this._$cloak);
	};

	c.prototype.close = function () {
		this._$cloak.remove();
		this._closefn();
	};

	c.prototype._addButton = function (i, button) {
		var $button = $('<button></button>')
			.text(button.text)
			.addClass('dialog '+button.className);

		$button.click(this._buttonAction.bind(this, button));

		this._$buttons.append($button);
	};

	c.prototype._buttonAction = function (button) {
		console.log('Button Action', button);
	};

	return c;

});
