define(['app/tool/actionset', 'text!components/presentation/presentation.html'], function (ActionSet, templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);
	var $oSlide = template.get('PresentationFrame');

	var c = function ($container, options, parentPanel) {
		this._name = 'FramesPanel';
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		var self = this;
		parent._prepare.call(this);

		template.get('PresentationFramesPanel')
			.appendTo(this.getContainer());


		ActionSet.create()
			.addAction('plus', function () {
				self._addNewFrame();
			})
			.render(this.$('.FramesPanel'));

		this._frames = [];
		this._presentationID = null;

		this.getContainer().on('click', '.Frame', function (event) {
			event.preventDefault;

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

			return;
		});

		this.getContainer().on('contextmenu', '.Frame', function (event) {
			if (event.which === 3) {
				event.preventDefault();
				// this method is temporary
				// TODO find another method - context menu?

				var index = $(this).attr('data-index');
				self._removeFrame(index);
			}
		});

		app.event.bind(app.EVENT_PRESENTATION_CHANGED, function (data) {
			if (data.PresentationID) {
				app.db.frame
					.where('PresentationID')
					.equals(data.PresentationID)
					.toArray(function (frames) {
						self._frames = frames;
						self._updateFrames();
					});
			} else {
				self._frames = [];
				self._updateFrames();
			}

			self._presentationID = data.PresentationID;
		});
	};

	c.prototype._showText = function (text) {
		var text = DI.A.Text.Add({Text: text, Opacity: 0});
		text.queue(DI.A.Text.Animate(text.getID(), {Opacity: 1}));
		text.send();
	};

	c.prototype._updateFrames = function () {
		var $frames = this.$('.Frames');
		$frames[0].innerHTML = '';

		for (var i = 0; i < this._frames.length; i++) {
			$oSlide.clone()
				.attr('data-index', i)
				.text(this._frames[i].Text)
				.appendTo($frames);
		}
	};

	c.prototype._addNewFrame = function () {
		if (!this._presentationID) {
			return;
		}

		var self = this;
		app.db.transaction('rw', app.db.frame, function () {
			var item = {PresentationID: self._presentationID, Text: 'New'};
			app.db.frame.add(item).then(function (ID) {
				item.ID = ID;

				self._frames.push(item);
				self._updateFrames();
			});
		});
	};

	c.prototype._removeFrame = function (index) {
		if (!(index in this._frames)) {
			return;
		}

		// TODO confirm

		var self = this;
		var item = this._frames[index];

		app.db.transaction('rw', app.db.frame, function () {
			app.db.frame.delete(item.ID);

			self._frames.splice(index, 1);
			self._updateFrames();
		});
	};

	return c;
});
