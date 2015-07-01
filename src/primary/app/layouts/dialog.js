define(['app/layouts/standard'], function (layoutStandard) {

	var c = function ($root, options) {
		if (!$root || !$root.length) {
			$root = $('body');
		}

		layoutStandard.prototype.constructor.call(this, $root, options);

		this._$cloak = $();
		this._$buttons = $();
	};
	c.prototype = new layoutStandard();

	c.prototype.wrap = function () {
		this._$cloak = $('<div class="Cloak"></div>');

		var $dialog = $(
'	<div class="Dialog">'+
'		<div class="DialogTitle"></div>'+
'		<div class="DialogContent"></div>'+
'		<div class="DialogButtons"></div>'+
'	</div>'
);

		this._$buttons = $dialog.find('.DialogButtons');
		this._$container = $dialog.find('.DialogContent');

		$dialog.find('.DialogTitle').text(this._options.title);
		$.each(this._options.buttons || [], $.proxy(this._addButton, this));

		this._$cloak.append($dialog);
		this._$root.append(this._$cloak);
	};

	c.prototype.close = function () {
		this._$cloak.remove();
	};

	c.prototype._addButton = function (i, button) {
		var $button = $('<button></button>')
			.text(button.text)
			.addClass('dialog '+button.className);

		if (button.action === 'close') {
			$button.click(this.close.bind(this));
		} else if (button.action) {
			$button.click(button.action);
		}

		this._$buttons.append($button);
	};

	return c;

});
