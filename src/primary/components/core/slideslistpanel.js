define(['text!components/core/slides.html', 'style!components/core/slides'], function (templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		var $panel = template.get('SlidesListPanel')
			.appendTo(this.getContainer());

		var self = this;
		$panel.on('click', '.Slide', function (event) {
			var index = $(this).attr('data-index');
			self._showText(slides[index]);
			$panel.find('.Active').removeClass('Active');
			$(this).addClass('Active');
		});

		this._populateList($panel);
	};

	c.prototype._showText = function (text) {
		message.output.dispatch('ShowText', text);
	};

	var slides = [
		"My hope is built on nothing less",
		"Than Jesus blood and righteousness",
		"I dare not trust the sweetest frame",
		"But wholly trust in Jesus name",

		"Christ alone; cornerstone",
		"Weak made strong; in the Saviour's love",
		"Through the storm, He is Lord",
		"Lord of all"
	];

	c.prototype._populateList = function ($panel) {
		var $oSlide = template.get('SlidesListPanelSlide');

		for (var i = 0; i < slides.length; i++) {
			$oSlide.clone()
				.attr('data-index', i)
				.text(slides[i])
				.appendTo($panel);
		}
	};

	return c;
});
