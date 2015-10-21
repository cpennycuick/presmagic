define(['text!app/ccli/CCLISearchTemplate.html', 'style!app/ccli/CCLISearchPanelStyle.css', 'app/ccli/songselectapi', 'app/ccli/LyricViewer'], 
        function (templateHTML) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);

	var _searchlist = []; //filled by the _populateList function after a search is carried out
	
	var _itemListReference; //reference to the item list panel which opened the song search dialog.
	
	var c = function ($container) {
		parent.constructor.call(this, $container, {
			Layout: 'Dialog',
			LayoutOptions: {
				title: 'Search SongSelect',
			}
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);
		songSelectLogout();
		template.get('CCLISearchPanel')
			.appendTo(this.getContainer());
		
		var self = this;
		var $button = self.$('#ccli-search-button');
		$button.click(this._songSelectSearch.bind(this))		
		
	};
	
	//loading = loading gif, false = removes load states
	c.prototype._setLoadState = function(loadState) {
	    var self = this;
	    self._clearList();
	    var $listDiv = self.$('#ccli-list-div');
	    switch(loadState) {
	    	case 'loading':	    	    
	    	    $loading = $(
	    		"<div class='Loading'><img src='/resources/712.gif'></img></div>"
	    	    );
	    	    $listDiv.append($loading);
	    	    console.log("Set loading state")
	    	    break;
	    	default:
	    	    break;
	    }
	}
	
	//TODO: Make this code prettier, implement login user/pass prompt.
	c.prototype._errorState = function(error) {
	    	console.log('Error');
		var self = this;
		var $listDiv = self.$('#ccli-list-div');
		switch(error) {
			case 'loggedout':				
			    this._songSelectLogin();
			    break;
			case 'loggedin': //We were logged out and just logged back in successfully!
				this._songSelectSearch();
				console.log("Logged in!");
			    break;
			case 'invalidlogin':
				self._clearList();
				$listDiv.addClass("ErrorDiv");
				$listDiv.append("Invalid username/password :(<br>");
				$listDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
				break;
			case 'cancellogin':
				self._clearList();
				$listDiv.addClass("ErrorDiv");
				$listDiv.append("You need to log in to search song select<br>");
				$listDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
			    break;
			case 'connection': //fall through to default
			default:
				self._clearList();
				$listDiv.addClass("ErrorDiv");
				$listDiv.append("Failed to load search results :(<br>");
				$listDiv.append("Check your connection status and try again");
				$listDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
				break;
		}

	};
	
	c.prototype._songSelectLogin = function() {
	    	var self = this;
		var opts = {
			title: 'Log in to SongSelect', 
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
		
		app.promptPanel('', $('#Content'), this, opts).then(
			function(result) {		
				songSelectLogin(result['Username'], result['Password']).then(
					function() {
					    self._errorState('loggedin');
					}, 	
        				function(error) {
					    self._errorState('invalidlogin');
        				}
				);
			},function(error) {
			    self._errorState('cancellogin');
			}
		);
	}
	

	c.prototype._songSelectSearch = function() {
		var self = this;
		var $listDiv = self.$('#ccli-list-div');
		var $searchbox = self.$("#ccli-search-box");
		var searchTerms = $searchbox.val();
		//var page
		
		if (searchTerms.length > 0) {
		    self._setLoadState('loading');
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
	
	c.prototype._populateList = function(searchresults) {
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
			event.preventDefault;
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
	};
	
	c.prototype._clearList = function() {
		this.$('#ccli-list-div')
				.empty()
				.removeClass()
				.append("<ul class=\"CCLIList\"></ul>")
				.addClass("CCLIListContainer");
	}
	
	
	c.prototype._previewSong = function(songsearchdata) {
		app.loadPanel('app/ccli/LyricViewer', $('#Content'))
		.then(function (panel) {
			panel.searchdata = songsearchdata;
			panel.run();
		}).done();
	}
	
	//Needs rewrite, just temporary
	c.prototype._importSong = function(songsearchdata) {
		var self = this;
		songsearchdata.import().then(function(cclisong){

			app.db.transaction('rw', [app.db.presentation, app.db.frame], function () {
				
				var item = {Name: cclisong.getTitle()};

				app.db.presentation.add(item).then(function (id) {

					item.ID = id;
					self._itemListReference._list.push(item);
					self._itemListReference._updateList();

					var words = cclisong.getWords();
					
					for (var key in words) {
						var text = words[key].join("\n");
						app.db.frame.add({PresentationID: id, Text: text});
					}
				});	//add error handler	

			});
		}, function(error) {
			console.log("Error importing song " + error);
		});
	}
	return c;
});
