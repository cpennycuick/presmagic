define(['text!components/presentation/presentation.html'], function (templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);
	var $oSlide = template.get('PresentationFrame');

	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		template.get('PresentationFramesPanel')
			.appendTo(this.getContainer());

		this._frames = [];

		var self = this;
		this.getContainer().on('click', '.Frame', function () {
			var $this = $(this);
			var index = $this.attr('data-index');

			if ($this.is('.Active')) {
				self._showText('');
				self.$('.Active').removeClass('Active');
			} else {
				self._showText(self._frames[index].Text);
				self.$('.Active').removeClass('Active');
				$this.addClass('Active');
			}
		});

		app.event.bind(app.EVENT_PRESENTATION_CHANGED, function (data) {
			app.db.frame
				.where('PresentationID')
				.equals(data.PresentationID)
				.toArray(function (frames) {
					self._frames = frames;
					self._updateFrames();
				});
		});
	};

	c.prototype._showText = function (text) {
		message.output.dispatch('ShowText', text);
	};

	c.prototype._updateFrames = function () {
		var $panel = this.$('.FramesPanel').empty();

		for (var i = 0; i < this._frames.length; i++) {
			$oSlide.clone()
				.attr('data-index', i)
				.text(this._frames[i].Text)
				.appendTo($panel);
		}
	};

	return c;
});
