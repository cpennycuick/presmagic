define(['text!app/ccli/CCLISearchTemplate.html', 
        'app/ccli/songselectapi', 
        'app/ccli/LyricViewer',
        'style!app/ccli/CCLISearchPanelStyle.css'],
        
        function (templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);

	var _searchlist = []; //filled by the _populateList function after a search is carried out	
	var _importObservers = []; //observers to be notified when an item is imported
	
	
	var SongSelectUI = function ($container, options) {
		parent.constructor.call(this, $container, {
			Layout: 'Dialog',
			LayoutOptions: {
				title: 'Search SongSelect',
			}
		});	
		this._importObservers = options['Observers'] || [];
	};
	
	SongSelectUI.LOADING = 'loading';
	SongSelectUI.LOGGED_OUT = 'loggedout';
	SongSelectUI.LOGGED_IN = 'loggedin';
	SongSelectUI.INVALID_LOGIN = 'invalidlogin';
	SongSelectUI.CANCEL_LOGIN = 'cancellogin';
	SongSelectUI.CONNECTION_ERROR = 'connection';

	SongSelectUI.prototype = new parentClass();

	SongSelectUI.prototype._prepare = function () {
		parent._prepare.call(this);
		//songSelectLogout(); used for testing since login is persistent
		template.get('CCLISearchPanel')
			.appendTo(this.getContainer());
		
		var self = this;
		var $button = self.$('#ccli-search-button');
		$button.click(this._songSelectSearch.bind(this));
		
		self.$('#ccli-search-box').bind('keyup', function(event) {
		    if(event.keyCode == 13) { //enter
			self._songSelectSearch();
		    }
		});
		
	};
	
	//loading = loading gif, false = removes load states
	SongSelectUI.prototype._setLoadState = function(loadState) {
	    var self = this;
	    self._clearList();
	    var $listDiv = self.$('#ccli-list-div');
	    switch(loadState) {
	    	case SongSelectUI.LOADING:	    	    
	    	    $loading = template.get('LoadingDiv');
	    	    $listDiv.append($loading);
	    	    break;
	    	default:
	    	    break;
	    }
	}
	

	SongSelectUI.prototype._errorState = function(error) {
		var self = this;
		var $listDiv = self.$('#ccli-list-div');
		
		switch(error) {
			case SongSelectUI.LOGGED_OUT:				
			    this._songSelectLogin();
			break;
			    
			case SongSelectUI.LOGGED_IN: //We were logged out and just logged back in successfully!
				this._songSelectSearch();
			break;
			    
			case SongSelectUI.INVALID_LOGIN:
				self._clearList();
				$listDiv.addClass("ErrorDiv");
				$listDiv.append("Invalid username/password :(<br>");
				$listDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
			break;
				
			case SongSelectUI.CANCEL_LOGIN:
				self._clearList();
				$listDiv.addClass("ErrorDiv");
				$listDiv.append("You need to log in to search song select<br>");
				$listDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
			break;
			    
			case SongSelectUI.CONNECTION_ERROR: //fall through to default
			default:
				self._clearList();
				$listDiv.addClass("ErrorDiv");
				$listDiv.append("Failed to load search results :(<br>");
				$listDiv.append("Check your connection status and try again");
				$listDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
				console.log(error);
			break;
		}

	};
	
	SongSelectUI.prototype._songSelectLogin = function() {
	    	var self = this;
		var opts = {
			Title: 'Log in to SongSelect', 
			Inputs:[
			        {
			            Name: 'Username', 
			            Type: 'text', 
			            Compulsory: true
			        }, 			         
			        {
			            Name: 'Password', 
			            Type: 'password', 
			            Compulsory: true
			        }
			        ],
			Buttons: {
			    	    Confirm: "Log in"
				 }
			}
		
		app.promptPanel(this, opts).then(
			function(result) {		
				songSelectLogin(result['Username'], result['Password']).then(
					function() {
					    self._errorState(SongSelectUI.LOGGED_IN);
					}, 	
        				function(error) {
					    self._errorState(SongSelectUI.INVALID_LOGIN);
        				}
				);
			},function(error) {
			    self._errorState(SongSelectUI.CANCEL_LOGIN);
			}
		);
	}
	

	SongSelectUI.prototype._songSelectSearch = function() {
		var self = this;
		var $listDiv = self.$('#ccli-list-div');
		var $searchbox = self.$("#ccli-search-box");
		var searchTerms = $searchbox.val();
		//var page
		
		if (searchTerms.length > 0) {
		    self._setLoadState(SongSelectUI.LOADING);
		    songSelectSearch(searchTerms, 1/* page */).then(function(rez) {
			self._setLoadState(false);
			self._populateList(rez);
		    }, function(error) {
			self._errorState(error);
		    });
		} else {
		    // Empty search box,
		}

	};
	
	SongSelectUI.prototype._populateList = function(searchresults) {
		var $oRow = template.get('CCLIListItem');
		var $list = this.$('.CCLIList');
		var self = this;
		
		for(var i = 0; i < searchresults.length; i++) {
			_searchlist[i] = searchresults[i];
			var $newItem = $oRow.clone();
			$newItem.find(".CCLIListResult").prepend(searchresults[i].getName());
			$newItem.find(".Authors").text(searchresults[i].getAuthors().join(", "));
			$newItem.find(".Catalogs").text(searchresults[i].getCatalogs().join(", "));
			$newItem.attr("data-index", i);
			
			tipped.create($newItem.find('[data-action="preview"]'), 'Preview lyrics');
			tipped.create($newItem.find('[data-action="import"]'), 'Import to PresMagic');
			
			$list.append($newItem);
		}

		$list.on('click', '.ActionIcon', function (event) {		
			event.preventDefault();
			var $this = $(this);
			var $selected = $this.closest('div');
			var index = $selected.attr('data-index');
			switch ($this.attr('data-action')) {
				case 'preview':
					self._previewSong(_searchlist[index]);
					break;
				case 'import':
					self._importSong(_searchlist[index]);
					break;
				default:
					break;					
				}

		});
		$list.show();
	};
	
	SongSelectUI.prototype._clearList = function() {
		this.$('#ccli-list-div')
				.empty()
				.removeClass()
				.append("<ul class=\"CCLIList\"></ul>")
				.addClass("CCLIListContainer");
		this.$(".CCLIList").hide();
		
	}
	
	
	SongSelectUI.prototype._previewSong = function(songsearchdata) {
	    var self = this;
	    songsearchdata.previewLyrics().then(function(lyrics) {
	
		self._launchLyricViewer(songsearchdata, lyrics)
		
	    }, function (error) {
		self._errorState(error);
	    });		
	}
	
	SongSelectUI.prototype._launchLyricViewer = function(songsearchdata, lyrics) {
	    var self = this;
	    var songTitle = songsearchdata.getName();
	    var opts = {
		    title: 'Preview',
		    buttons : [{
			text: 'Import',
			action: function() {
			   var opts2 =  {
				Title : 'Confirm import',
				Text : 'Import ' + songTitle + "?"
			    }
			    app.promptPanel(this, opts2).then(function(resolved) {
				self._importSong(songsearchdata);
			    });			    
			    
			}
		    }],
		    songTitle: songTitle,
		    songLyrics: lyrics
	    	}
		app.loadPanel('app/ccli/LyricViewer', $('#Content'), '', opts)
		.then(function (panel) {
			panel.run();
		}).done();
	}
	
	//TODO: Needs rewrite, just temporary
	SongSelectUI.prototype._importSong = function(songsearchdata) {
	    var self = this,
	    	frameIndex = 0;
	    songsearchdata.import().then(function(cclisong) {

		var item = {
			Name: cclisong.getTitle()
		};

		app.db.transaction('rw', [app.db.presentation, app.db.frame], function () {



		    app.db.presentation.add(item).then(function (id) {


			var words = cclisong.getWords();
			item.ID = id;
			
			for (var key in words) {
			    var text = words[key].join("\n");
			    app.db.frame.add({PresentationID: id, Text: text, FrameIndex: frameIndex++});
			}

		    });

		}).then(function() {
		    self._notifyImportObservers(item);
		}).catch(function(error) {
		    self._errorState(error);
		});
	    }, function(error) {
		self._errorState(error);
	    });

	}	
	
	/**
	 * Notifies all import observers, passed through in the 'Options' object (Options[Observers])
	 * The item {Name: SongName, ID : databaseID} is passed to each of these
	 */
	SongSelectUI.prototype._notifyImportObservers = function(item) {
	    var i = 0,
	    	length = this._importObservers.length;
	    for(i; i < length; i++) {
		if(typeof this._importObservers[i] === "function") {
		    this._importObservers[i](item);
		}		
	    }
	}
	
	return SongSelectUI;
});
