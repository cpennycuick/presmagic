define(['app/listable/listable'], function (Listable) {

	var parentClass = app.Panel;
	var parent = parentClass.prototype;
	
	const MAIN_DIV = "<div class ='Presentation ListPanel'>";
	const SEARCH_BOX_HTML = '<div> 							\
	    				<input type="Text" 				\
	    					id="@ID"	 			\
	    					class="Presentation SearchBox" 		\
	    					placeholder="Search">			\
	    				</input>					\
	    			</div>';
	const BASIC_LIST_TEMPLATE = "<ul class = 'List'></ul>";
	const END_DIV = "</div>";
		
	var ListPanel = function ($container, options, parentPanel) {
		parent.constructor.call(this, $container, {
			Layout: 'Standard'
		}, parentPanel);
		options = options || [];
		if(options['Filterable']) {
		    this.filterable = true;
		}
		
		this.filterBoxIdentifier = "#";
		this._filterText = "";
		this._list = [];
		this._filters = [];
		
	};
	
	ListPanel.prototype = new parentClass();
	
	
	//Template list item - override me!
	ListPanel.prototype.$oItem = $("<li><span class='Text'></span></li>");
	
	ListPanel.prototype._prepare = function () {
		parent._prepare.call(this);
	}
	
	//Call this only if you want the default list behaviour, otherwise just call _prepare
	ListPanel.prototype._defaultPrepare = function () {
	    var temp = MAIN_DIV + BASIC_LIST_TEMPLATE + END_DIV;
	    $(temp).appendTo(this.getContainer());
	    if(this.filterable) {
		this._addFilterBox();
	    }
	}
	
	/**
	 * Adds a default filter box to the list, which filters by the variable "Name"
	 */
	
	ListPanel.prototype._addFilterBox = function(filterID) {
	    this.getContainer().find('ul').before(SEARCH_BOX_HTML.replace("@ID", filterID));	
	    this._setFilterBox("#" + filterID);
	}
	
	/**
	 * Sets the input box of the given jQuery selector as the box for filter operation
	 */
	ListPanel.prototype._setFilterBox = function(selector) {
	    var self = this;
	    this.filterable = true;
	    this._filterBoxIdentifier = selector;
	    this.getContainer().find(this._filterBoxIdentifier).bind('keyup', function(event) {
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
	    this._addFilter(this._defaultListFilter.bind(this));
	}
	
	ListPanel.prototype._defaultListFilter = function(listable) {
	    return (this._filterText.length == 0 
		    || listable.Name.toLowerCase().indexOf(this._filterText) != -1);
	}
	
	/**
	 * Adds the filter filterFn to this list's filters
	 * _updateFilters needs to be called to apply filters on any important change (e.g. clicking a selector button)
	 */
	ListPanel.prototype._addFilter = function(filterFn) {
	    this._filters.push(filterFn);
	}
	
	/**
	 * Removes the given function from the list of filters
	 */
	ListPanel.prototype._removeFilter = function(filterFn) {
	    var i = 0,
	    length = this._filters.length;
	    
	    for(i; i < length; i++) {
		if(this._filters[i] == filterFn) {
		    this._filters.splice(i, 1);
		    return;
		}
	    }
	}

	/**
	 * Adds the given listable item to this list
	 * If this list does not accept the item type, returns false
	 * Will call listable.onAdd
	 */
	ListPanel.prototype._addItem = function(listable) {
	    if(this._accepts(listable)) {
		this._list.push(listable);
		this._updateList();
		listable.onAdd(this);
	    }
	}
	
	/**
	 * Removes a listable by the given index from the list, if it is found. 
	 * @param index index of the listable to remove
	 */
	ListPanel.prototype._removeItemIndex = function(index) {
	    if (!(index in this._list)) {
		return false;
	    }
	    var listable = this._list[index];
	    this._list.splice(index, 1);
	    this._updateList();
	    listable.onRemove(this);
	    return true;		
	}
	
	
	/**
	 * 
	 * @param listable A listable object 
	 * @returns {Boolean} true if this list will accept the listable, false otherwise.
	 * Needs to be overridden by its subclass to provide functionality, otherwise all listable items will be added
	 * Called by the ListPanel._addItemn function to check if an item can be added, before it actually is
	 */
	ListPanel.prototype._accepts = function(listable) {
	    return true;
	    if(listable instanceof Listable)
		return true;
	    return false;
	}
	
	
	ListPanel.prototype._updateList = function () {
		var $list = this.getContainer().find('ul');
		$list[0].innerHTML = '';

		for (var i = 0; i < this._list.length; i++) {
			var $item = this.$oItem.clone()
				.attr('data-index', i)
				.appendTo($list);

			$item.find('.Text')
				.text(this._list[i].Name);
		}
	};
	
	ListPanel.prototype._updateFilter = function(filterText) {
		
	    
	    	var filterText = filterText.toLowerCase();
	    	var i = 0, j = 0;
	    	var filteredOut = false;
	    	
		this._filterText = filterText;
		
		var rez = false; //return value, true only if there is at least one item left in the list
		
		for(i = 0; i < this._list.length; i++) {
		    filteredOut = false;
		    for(j = 0; j < this._filters.length; j++) {	
			
			if(!this._filters[j](this._list[i])) {
			    filteredOut = true;
			}
		    }
			if(filteredOut) {
				this.getContainer().find("li")
				    .filter( function(){ 
				           return ($(this).attr('data-index') == i);
				     })
				    .addClass("Hidden");

				} else {
				    this.getContainer().find("li")
				    .filter( function(){
				            return ($(this).attr('data-index') == i);
				    })
				    .removeClass("Hidden");
				    rez = true; //something on the list!
				}
		}
		return rez;
	};
	
	
	return ListPanel;
});
