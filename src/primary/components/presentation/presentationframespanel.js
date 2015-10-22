define([
		'app/tool/actionset',
		'app/tool/itemselection',
		'text!components/presentation/presentation.html'
	], function (ActionSet, ItemSelection, templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);
	var $oSlide = template.get('PresentationFrame');

	var c = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);

		this._activeFrame = null;
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

		this._selection = ItemSelection.create()
			.onChange(function (selection) {
				self.$('.Selected').removeClass('Selected');
				for (var i in selection) {
					self.$('[data-index='+selection[i]+']').addClass('Selected');
				}
			});

		this._frames = [];
		this._presentationID = null;

		var keys = [];

		var $frames = this.$('.Frames');
		
		var $actions = this.$('.Actions');
		$('body').on('click.FramesPanel', function (event) {
			if (!$.contains($frames[0], event.target)
					&& !$.contains($actions[0], event.target)
					&& $actions[0] !== event.target
					&& !self._selection.isSelectionEmpty()) {
				self._selection.clearSelection();
			}
		}).on('keydown.FramesPanel', function (event) {
			if (!(event.which in keys)) {
				keys[event.which] = true;
				if (event.ctrlKey && event.which === 65) { // CTRL + A
					self._selection.setSelection.apply(self._selection, Object.keys(self._frames));
/*					songSelectLogout().then(function() {
						songSelectLogin("info@rcbc.org.au", "rcbcmedia").then(function(loginResult) {
							console.log("Successfully logged in as: " + loginResult);
						}, function(error){
							console.log("Failed login! " + error);
						});
					}); //testing

*/

				} else if (event.which === 27) { // ESC
					self._selection.clearSelection();
				} else if (event.which === 39) { // RIGHT
					var selection = this._selection.getSingleSelection()
					if ((selection !== false) && parseInt(selection) < self._frames.length - 1) {
						selection = parseInt(selection) + 1;
						self._selection.setSelection(selection);
					}
				} else if (event.which === 37) { // LEFT
					var selection = self._selection.getSingleSelection();
					if ((selection !== false) && parseInt(selection) > 0) {
						selection = parseInt(selection) + - 1;
						self._selection.setSelection(selection);
					}
				} else if (event.which === 32 || event.which === 13) { // SPACE | ENTER
					var selection = self._selection.getSingleSelection();
					if (selection !== false) {
						self._toggleActive(selection);
					}
				} else {
//					console.log(event);
				}
			} else {
				return false;
			}
		}).on('keyup.FramsPanel', function (event) {
			if (event.which in keys) {
				delete keys[event.which];
			}
		});

		this.getContainer().on('click', '.Frame', function (event) {
			event.preventDefault;

			var $this = $(this);
			var index = $this.attr('data-index');

			if (event.shiftKey) {
			    self._selection.toggleSelected(index);
				return; //no actions except toggle selected with the shift key
			}
			//single frame selected, we can make it active
			if (self._selection.isSelected(index) && self._selection.isSingleSelection()) {
				self._toggleActive(index);
			}
			self._selection.setSelection(index);
			return;
		});

		$("#editframe").click(function() {
			var frame = self._selection.getSingleSelection();

			if (!frame) {
				return; // Return if no frame is selected, or multiple frames are selected
			}

			self._setFrameText(frame, "This has been edited");
		});

		$("#deleteframe").click(function() {
			idxs = self._selection.getSelection();
			self._removeFrames(idxs);
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

			self._selection.clearSelection();
			self._presentationID = data.PresentationID;
		});
	};

	c.prototype._showText = function (text) {
		var text = DI.A.Text.Add({Text: text, Opacity: 0});
		text.queue(DI.A.Text.Animate(text.getID(), {Opacity: 1}));
		text.send();
	};

	c.prototype._toggleActive = function (index) {
		var $this = this.$('[data-index='+index+']');

		var selectedActiveFrame = this._getActiveFrameKey(this._presentationID, index);

		if (this._activeFrame === selectedActiveFrame) {
			this._showText('');
			this.$('.Active').removeClass('Active');
			this._activeFrame = null;
		} else {
			this._showText(this._frames[index].Text);
			this.$('.Active').removeClass('Active');
			$this.addClass('Active');
			this._activeFrame = selectedActiveFrame;
		}
	};

	c.prototype._getActiveFrameKey = function (presentationID, index) {
		return presentationID+':'+index;
	};

	c.prototype._updateFrames = function () {
		var $frames = this.$('.Frames');
		$frames[0].innerHTML = '';

		for (var index = 0; index < this._frames.length; index++) {
			var isActive = (this._activeFrame === this._getActiveFrameKey(this._presentationID, index));

			$oSlide.clone()
				.attr('data-index', index)
				.text(this._frames[index].Text)
				.toggleClass('Active', isActive)
				.appendTo($frames);
		}

		this._selection.triggerChange();
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

	c.prototype._removeFrames = function(indexes) {
		if(!($.isArray(indexes))) {
			throw new Error("Expected array, got " + indexes);
		}

		var self = this;
		indexes.sort();

		// Count backwards so we don't shift array positions.
		for(var i = indexes.length; i >= 0; i--) {
			if (!(indexes[i] in this._frames)) {
				continue;
			}

			var item = this._frames[indexes[i]];

			// TODO handle DB calls in a better place
			app.db.transaction('rw', app.db.frame, function() {
				app.db.frame.delete(item.ID);
				self._frames.splice(indexes[i], 1);
			});
		}

		this._updateFrames();
	}

	c.prototype._removeFrame = function (index) {
		this._removeFrames([index]);
	};

	c.prototype._setFrameText = function (index, text) {
		if (!(index in this._frames)) {
			return;
		}
		var self = this;
		var item = this._frames[index];
		app.db.transaction('rw', app.db.frame, function() {
			app.db.frame.where("ID").equals(item.ID).modify({"Text" : text});
		}).then(function() {
			self._frames[index].Text = text;
			self._updateFrames();
		});
	};

	return c;
});
