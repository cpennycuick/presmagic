define(['app/tool/actionset', 'text!components/presentation/presentation.html'], function (ActionSet, templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);
	var $oItem = template.get('PresentationListItem').find('li');
	
	var c = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);

		this._list = [];
		this._listFilter = "";
		this._activePresentationID = null;

		template.get('PresentationListPanel')
			.appendTo(this.getContainer());

		var self = this;
		ActionSet.create()
			.addAction('plus', function () {
				self._addNewItem();
			}, "New")
			.addAction('folder-download', function () {
				self._launchSongSelectSearch();
			}, "SongSelect")
			.render(this.getContainer());

		this.$('.List').on('click', 'li', function () {
			var $this = $(this);

			if ($this.is('.Active')) {
				return;
			}

			var index = $(this).attr('data-index');
			self._activePresentationID = self._list[index].ID;

			app.event.trigger(app.EVENT_PRESENTATION_CHANGED, {
				PresentationID: self._activePresentationID
			});

			self.$('.Active').removeClass('Active');
			$this.addClass('Active');
		});

		this.$('.List').on('click', 'li .Action', function (event) {
			event.preventDefault;
			var $this = $(this);

			var $selectedLI = $this.closest('li');
			var index = $selectedLI.attr('data-index');
			console.log($this.attr('data-action'));
			switch ($this.attr('data-action')) {
				case 'Delete':
					self._removeItem(index);
					break;
				case 'Edit':
					self._editItem($selectedLI, index);
					break;
				default:
					break;					
			}

			return false;
		});
		
		$('#list-search-box').bind('keyup', function(event) {
			if(self._updateFilter($(this).val())) {
				$(this).css("background-color", "#CCFF99");
			} else {
				$(this).css("background-color", "#FF7376");
			}
		}).blur(function() {
			if($(this).val().length == 0) {
				$(this).css("background-color", "#FFFFFF");
			}
		});
		

		var self = this;
		app.db.presentation.toArray(function (list) {
			self._list = list;
			self._updateList();
		});

	};

	c.prototype._updateList = function () {
		var $list = this.$('ul');
		$list[0].innerHTML = '';

		for (var i = 0; i < this._list.length; i++) {
			var $item = $oItem.clone()
				.attr('data-index', i)
				.appendTo($list);

			$item.find('.Text')
				.text(this._list[i].Name);
		}
	};
	
	c.prototype._updateFilter = function(filterText) {
		filterText = filterText.toLowerCase();
		this._listFilter = filterText;
		
		var rez = false; //return value, true only if there is at least one item left in the list
		
		for(var i = 0; i < this._list.length; i++) {
			if((filterText.length == 0) || (this._list[i].Name.toLowerCase().indexOf(filterText) != -1)) {
				$("li")
			    .filter( function(){
			            return ($(this).attr('data-index') == i);
			        })
			    .removeClass("Hidden");
				rez = true;
			} else {
				$("li")
			    .filter( function(){ 
			            return ($(this).attr('data-index') == i);
			        })
			    .addClass("Hidden");
			}
		}
		return rez;
	};

	c.prototype._addNewItem = function () {
		var self = this;
		app.db.transaction('rw', app.db.presentation, function () {
			var item = {Name: "New"};
			app.db.presentation.add(item).then(function (ID) {
				item.ID = ID;

				self._list.push(item);
				self._updateList();
			});
		});
	};

	c.prototype._removeItem = function (index) {
		if (!(index in this._list)) {
			return;
		}

		// TODO confirm

		var self = this;
		var item = this._list[index];

		app.db.transaction('rw', [app.db.presentation, app.db.frame], function () {
			app.db.frame.where('PresentationID').equals(item.ID).delete();
			app.db.presentation.delete(item.ID);

			self._list.splice(index, 1);
			self._updateList();
		});

		if (this._activePresentationID) {
			app.event.trigger(app.EVENT_PRESENTATION_CHANGED, {
				PresentationID: null
			});

			this._activePresentationID = null;
		}
	};
	
	c.prototype._editItem = function ($listelement, index) {
		
		var self = this;
		var oldtext = $listelement.find(".Text").addClass("Hidden").text();
		
		$listelement.addClass("Edit");
		$listelement.find("input")
					.addClass("EditActive")
					.removeClass("Hidden")
					.val(oldtext)
					.focus()
					.bind('blur keyup', function(event) {
						if(event.type == 'blur' || event.keyCode == '13') { //Focus lost or enter pressed
							var $this = $(this);
							var itemID = self._list[index].ID;;
							var newtext = $this.val();
							//Swap css style elements back to hide the textbox and show the name
							$this.removeClass("EditActive").addClass("Hidden");
							$this.siblings(".Text").removeClass("Hidden")
							$this.parent("li").removeClass("Edit");
							$this.off(); //remove this event handler
							if(newtext.length == 0) return; //We don't want to have no name 
							//Database transaction
							//Would love some functions for the database so I can just do app.db.updateTitle(SONGID, TITLE)
							app.db.transaction('rw', [app.db.presentation], function () {
								app.db.presentation.where('ID').equals(itemID).modify({"Name" : newtext});
							}).then(function() {
								$this.siblings(".Text").text(newtext); //change the text only if the database is also changed
								self._list[index].Name = newtext;
							}).catch(function(error) {
								console.log("Failed to edit song name");
								console.log(error);
							});							
						}						
					})
	};
	
	c.prototype._launchSongSelectSearch = function() {
		var self = this;
		var options = {
			Observers : [self.onImport.bind(this)]
		}
		app.loadPanel('app/ccli/songselectui', $('#Content'), '', options)
		.then(function (panel) {
			panel._itemListReference = self;
			panel.run();
		}).done();
	}
	
	/**
	 * Observer function, passed to any function which may result in a song import
	 * Should be called when a song is imported
	 * Updates the presentation list and local data structure
	 */
	c.prototype.onImport = function(item) {
	    console.log("on import");
	    this._list.push(item);
	    this._updateList();
	}

	return c;
});
