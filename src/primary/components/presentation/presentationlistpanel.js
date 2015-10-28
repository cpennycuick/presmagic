define(['app/tool/actionset', 
        'text!components/presentation/presentation.html',
        'app/panels/ListPanel', 'app/listable/songlistitem'],
        
        function (ActionSet, templateHTML, ListPanel, SongListItem) {
    
    	"use strict";

	var ParentClass = ListPanel;
	var parent = ParentClass.prototype;	
	
	var c = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
	};

	c.prototype = new ParentClass();
	
	var template = new app.Template(templateHTML);
	
	/**
	 * Overridden from ListPanel superclass
	 * Represents the default structure of a list item on this list
	 */
	c.prototype.$oItem = template.get('PresentationListItem').find('li');
	
	c.prototype._prepare = function () {
	    parent._prepare.call(this);
	    
	    
	    var self = this;
	    this._activePresentationID = null;
	    	
	    

	    template.get('PresentationListPanel')
			.appendTo(this.getContainer());
		
	    this._setFilterBox("#list-search-box");		
	    this._createActionSet();
	    this.$('.List').on('click', 'li', this._listItemClicked.bind(this));
	    this.$('.List').on('click', 'li .Action', this._listActionIconClicked.bind(this));
		
	    this._loadListFromDatabase();
	};
	
	c.prototype._createActionSet = function() {
	    var self = this;
	    ActionSet.create()
	    .addAction('plus', function () {
		self._addNewItem();
	    }, "New")
	    .addAction('folder-download', function () {
		self._launchSongSelectSearch();
	    }, "SongSelect")
	    .render(this.getContainer());
	};

	c.prototype._listItemClicked = function(event) {
	    var index = -1,
	        $this = $(event.target),
	        loopCount = 0;
	    
	    if($this.is(".Action")) {
		return;
	    }
	    
	    while(!$this.is("li")) {
		$this = $this.parent(); //event bubbling, make sure the li is the target.
		loopCount++;
		if(loopCount > 5) {
		    throw new Error("Couldn't find parent list item");
		}
	    }
	    
	    if ($this.is('.Active')) {
		return;
	    }
	    
	    index = $this.attr('data-index');	    
	    this._activePresentationID = this._list[index].ID;

	    app.event.trigger(app.EVENT_PRESENTATION_CHANGED, {
		PresentationID: this._activePresentationID
	    });

	    this.$('.Active').removeClass('Active');
	    $this.addClass('Active');
	};
	
	c.prototype._listActionIconClicked = function(event) {
		event.preventDefault();
		
		var $this = $(event.target),
		    $selectedLI = $this.closest('li'),
		    index = $selectedLI.attr('data-index');
		
		switch ($this.attr('data-action')) {
			case 'Delete':
				this._removeItemIndex(index);
				break;
			case 'Edit':
				this._editItem($selectedLI, index);
				break;
			default:
				break;					
		}
	};
	
	c.prototype._loadListFromDatabase = function() {
	    var self = this;
	    app.db.presentation.toArray(function (list) {
		var i = 0,
		    length = list.length;
		for(i; i < length; i++) {
		    self._list[i] = new SongListItem(list[i].Name, list[i].ID);
		}
		self._updateList();
	    });
	};
	
	c.prototype._addNewItem = function () {
		var self = this;
		app.db.transaction('rw', app.db.presentation, function () {
			var item = {Name:"New"};
			app.db.presentation.add(item).then(function (ID) {
				item.ID = ID;
				self._addItem(new SongListItem(item.Name, item.ID));
			});
		});
	};

	c.prototype._removeItemIndex = function (index) {

	    /*
	     * 			   var opts2 =  {
				Title : 'Confirm delete',
				Text : 'Delete ' + songTitle + "?"
			    }
			    app.promptPanel(this, opts2).then(function(resolved) {
				self._importSong(songsearchdata);
			    });	
	     */
		// TODO confirm
		var self = this;
		var item = this._list[index];
		
	    	if(!parent._removeItemIndex.call(this, index)) {
	    	    return;
	    	}

		app.db.transaction('rw', [app.db.presentation, app.db.frame], function () {
			app.db.frame.where('PresentationID').equals(item.ID).delete();
			app.db.presentation.delete(item.ID);

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
		    var itemID = self._list[index].ID;
		    var newtext = $this.val();
		    //Swap css style elements back to hide the text box and show the name
		    $this.removeClass("EditActive").addClass("Hidden");
		    $this.siblings(".Text").removeClass("Hidden");
		    $this.parent("li").removeClass("Edit");
		    $this.off(); //remove this event handler
		    if(newtext.length === 0) return; //We don't want to have no name 
		    //Database transaction
		    //Would love some functions for the database so I can just do app.db.updateTitle(SONGID, TITLE)
		    app.db.transaction('rw', [app.db.presentation], function () {
			app.db.presentation.where('ID').equals(itemID).modify({"Name" : newtext});
		    }).then(function() {
			$this.siblings(".Text").text(newtext); //change the text only if the database is also changed
			self._list[index].Name = newtext;
		    }).catch(function(error) {

			console.log(error);
		    });							
		}						
	    });
	};
	
	c.prototype._launchSongSelectSearch = function() {
		var self = this;
		var options = {
			Observers : [self.onImport.bind(this)]
		}
		app.loadPanel('app/ccli/songselectui', $('#Content'), '', options)
		.then(function (panel) {
			panel.run();
		}).done();
	};
	
	/**
	 * Observer function, passed to any function which may result in a song import
	 * Should be called when a song is imported
	 * Updates the presentation list and local data structure
	 */
	c.prototype.onImport = function(item) {
	    	    
	    this._addItem(new SongListItem(item.Name, item.ID));
	};

	return c;
});
