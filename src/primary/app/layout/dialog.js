define(['app/layout/standard'], function (layoutStandard) {

	var c = function ($root, options) {
		if (!$root || !$root.length) {
			$root = $('body');
		}

		layoutStandard.prototype.constructor.call(this, $root, options);

		this._$buttons = $();
	};
	c.prototype = new layoutStandard();

	c.prototype.wrap = function () {
		var $wrap = $(
'<div class="Cloak">'+
'	<div class="Dialog">'+
'		<div class="DialogTitle"></div>'+
'		<div class="DialogContent"></div>'+
'		<div class="DialogButtons"></div>'+
'	</div>'+
'</div>'
		);

		this._$root.append($wrap);
		this._$buttons = this._$root.find('.DialogButtons');
		this._$container = this._$root.find('.DialogContent');

		this._$root.find('.DialogTitle').text(this._options.title);
		$.each(this._options.buttons || [], $.proxy(this._addButton, this));
	};

	c.prototype._addButton = function (i, button) {
		var $button = $('<button></button>');
		$button.text(button.text);
		$button.addClass(button.className);
		$button.click(function () {
			button.action();
		});
		this._$buttons.append($button);
	};

	return c;

});
