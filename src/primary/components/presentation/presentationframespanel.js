        define([
                'app/tool/actionset',
                'app/tool/itemselection',
                'text!components/presentation/presentation.html'
                ], function (ActionSet, ItemSelection, templateHTML) {
        
            "use strict";
            
            var ParentClass = app.Panel;
            var parent = ParentClass.prototype;
        
            var template = new app.Template(templateHTML);
            var $oSlide = template.get('PresentationFrame');
        
            var c = function ($container, options, parentPanel) {
        	parent.constructor.call(this, $container, {
        	    Layout: 'Standard'
        	}, parentPanel);
        
        	this._activeFrame = null;
            };
        
            c.prototype = new ParentClass();
        
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
        	this._presentationEdited = false;
        	this._presentationID = null;
        	
        
        	var keys = [];
        
        	var $frames = this.$('.Frames');
        
        	var $actions = this.getContainer().find('.Actions');
        
        	$('body').on('click.FramesPanel', function (event) {
        	    if (!$.contains($frames[0], event.target) && 
        		    !$.contains($actions[0], event.target) &&
        		    $actions[0] !== event.target && 
        		    !self._selection.isSelectionEmpty()
        	    ) {
        		self._selection.clearSelection();
        	    }
        	}).on('keydown.FramesPanel', function (event) {
        	    if (!(event.which in keys)) {
        		keys[event.which] = true;
        		if (event.ctrlKey && event.which === 65) { // CTRL + A
        		    self._selection.setSelection.apply(self._selection, Object.keys(self._frames));
        
        
        		} else if (event.which === 27) { // ESC
        		    self._selection.clearSelection();
        		} else if (event.which === 39) { // RIGHT
        		    var selection = this._selection.getSingleSelection();
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
        		    //		    
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
        	    event.preventDefault();
        
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
        
        	$("#editframe").click(function(event) {
        	    event.preventDefault();
        
        	    var frameIdx = self._selection.getSingleSelection();
        
        	    if (!frameIdx) {
        		return; // Return if no frame is selected, or multiple frames are selected
        	    }
        
        	    self._openEditorDialog(frameIdx);
        	    //self._setFrameText(frame, "This has been edited");
        	});
        

        	$("#deleteframe").click(function(event) {
        	    event.preventDefault();
        	    var idxs = self._selection.getSelection();
        	    self._removeFrames(idxs);
        	});
        
        	$("#frameleft").click(function(event) {
        	    event.preventDefault();
        	    var frameIdx = self._selection.getSingleSelection();
        	    if (!frameIdx) {
        		return; // Return if no frame is selected, or multiple frames are selected
        	    }
        	    if(!self._shiftFrame(frameIdx, 'left')) {
        		self._selection.setSelection(frameIdx);
        	    }
        	});
        
        	$("#frameright").click(function(event) {
        	    event.preventDefault();
        	    var frameIdx = self._selection.getSingleSelection();
        	    if (!frameIdx) {
        		return; // Return if no frame is selected, or multiple frames are selected
        	    }
        	    self._shiftFrame(frameIdx, 'right');
        	});
        	
        	$("#framesave").click(function(event) {
        	    if(self._presentationEdited) {
        		self._saveFrames(); 
        		$(this).css({color:'grey'});
        		self._presentationEdited = false;
        	    }
        		
        	});
        	
        	
        //TODO: Big and ugly. Simplify
        	app.event.bind(app.EVENT_PRESENTATION_CHANGED, function (data) {
        	    
        	    
        	    if (data.PresentationID) {
        		if(self._presentationEdited) {
        		    console.log("Edited....");
        		    self._promptSave().then (function() {
        			console.log("Done saving");
        			app.db.frame
        			.where('PresentationID')
        			.equals(data.PresentationID)
        			.toArray(function (frames) {
        			    frames.sort(function(a, b) {
        				return a.FrameIndex - b.FrameIndex;
        			    });

        			    $("#framesave").css({color:'grey'});
        			    self._frames = frames;     
        			    self._presentationEdited = false;
        			    self._updateFrames();
        	        	    self._selection.clearSelection();
        	        	    self._presentationID = data.PresentationID;
        			});
        		    });        		    
        		} else {
        		    app.db.frame
        		    .where('PresentationID')
        		    .equals(data.PresentationID)
        		    .toArray(function (frames) {
        			frames.sort(function(a, b) {
        			    return a.FrameIndex - b.FrameIndex;
        			});

        			$("#framesave").css({color:'grey'});
        			self._frames = frames;   
        			self._presentationEdited = false;
        			self._updateFrames();
        	        	self._selection.clearSelection();
        	        	self._presentationID = data.PresentationID;
        		    });
        		}
        		
        	    } else {
        		self._frames = [];
        		self._updateFrames();
            	    	self._selection.clearSelection();
            	    	self._presentationID = data.PresentationID;
        	    }
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
            /**
             * Updates the FrameIndex value of each frame to represent its current array position.
             */
            c.prototype._updateFrameIndices = function() {
        	var i = 0,
        	length = this._frames.length;
        	for(i; i < length; i++) {
        	    this._frames[i].FrameIndex = i;
        	}
            };
        
            c.prototype._updateFrames = function () {
        	this._updateFrameIndices();        	
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
        	
        	//Note: item here not added to DB so it has no ID yet
        	var item = {
        		PresentationID: this._presentationID, 
        		Text: 'New', 
        		FrameIndex: this._frames.length
        	    };
        	    
    		this._frames.push(item);
    		this._updateFrames();
    		this._setPresentationEdited();

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
        	    self._frames.splice(indexes[i], 1);
        
        	}
        	this._setPresentationEdited();
        	this._updateFrames();
            };
        
            c.prototype._removeFrame = function (index) {
        	this._removeFrames([index]);
            };
        
            /**
             * Saves all current frames to the database
             */
            c.prototype._saveFrames = function() {
        	
        	var self = this,
        	length = this._frames.length,
        	frames = this._frames,
        	deferred = Q.defer();
        
        	this._updateFrameIndices();
        	
        	app.db.transaction('rw', app.db.frame, function() {
        	    for(let i = 0; i < length; i++) {
        		if(frames[i].ID === undefined) {
        		    app.db.frame.add(frames[i]).then(function(id) {
        			self._frames[i].ID = id;
        		    });
        		} else {
        		    app.db.frame.where("ID").equals(frames[i].ID).modify(frames[i]);
        		}  
               	    }
        	    //Now delete frames that arent in the list anymore
        	    app.db.frame
        	    .where('PresentationID').equals(self._presentationID)
        	    .toArray(function (dbframes) {
        		var j = 0, 
        		dblength = dbframes.length;
        		for (j; j < dblength; j++) {
        		    var foundMatch = false;
        		    for(let i = 0; i < length; i++) {
        			if(frames[i].ID == dbframes[j].ID) {
        			    foundMatch = true;
        			    break;
        			}
        		    }
        		    if(!foundMatch) {
        			app.db.frame.delete(dbframes[j].ID); //no match in this presentation, must have been deleted
        		    }
        		}
        	    });
        	    
        	}).then(function() {
        	    self._onSaveSuccess();
        	    deferred.resolve();
        	}, function(error) {
        	    self._onSaveFail(error);
        	    deferred.reject(error);
        	});
        	return deferred.promise;
            };
            
            c.prototype._onSaveSuccess = function() {
        	console.log("Saved like a boss");
            };
            
            c.prototype._onSaveFail = function(error) {
        	console.log("Save failed: " + error);
            };
        
            c.prototype._setPresentationEdited = function() {
        	if(!this._presentationEdited) {
        	    this._presentationEdited = true;
        	    this.getContainer().find("#framesave")
        	    	.css({color:'black'});
        	}        		
            };
            
            c.prototype._shiftFrame = function(frameIdx, direction) {
        	var newIndex = 0;
        	var frameslength = this._frames.length;
        
        	switch (direction) {
        	case 'left':
        	    if(frameIdx == 0) return false; //already left most position
        	    newIndex = frameIdx - 1;
        	    break;
        	case 'right':
        	    if(frameIdx == frameslength - 1) return false;//already right most position
        	    newIndex = frameIdx - -1; //TODO: It thinks frameIdx is a STRING so 1 + 1 = 11 :( Not sure where this originates. 
        	    break;
        	default:
        	    return false;
        	}
        	this._setPresentationEdited();
        	this._frames.splice(newIndex, 0, this._frames.splice(frameIdx, 1)[0]);
        	this._updateFrames();
        	this._selection.setSelection(newIndex);
        	return true;
            };
        
            c.prototype._setFrameText = function (index, text) {
        	if (!(index in this._frames)) {
        	    return;
        	}
        	var item = this._frames[index];
        	this._frames[index].Text = text;
        	this._updateFrames();
            };
        
            c.prototype._promptSave = function() {
        	var def = Q.defer();
        	var self = this;
        	var options =  {
				Title : 'Save changes?',
				Text : 'The content of this presentation has changed. Save changes?',
				Buttons : {
				    	Cancel : "Don't save",
        				Confirm: "Save"
				}
			    	};
        	app.promptPanel(this, options).then(function(resolved) {
        	       self._saveFrames().then(function() {
        	       def.resolve();
        	   }, function(error) {
        	       def.resolve();
        	       console.log("Error saving: " + error);
        	   });        	    
        	   
        	}, function(rejected) {
        	    console.log("rejected save" + rejected);
        	    def.resolve();
        	});
        	return def.promise;
            };
            
            c.prototype._openEditorDialog = function(frameIdx) {
        	var self = this;
        	var deferred = Q.defer();
        	var opts = {
        		Layout: 'EditorPanel',
        		LayoutOptions: {
        		    Promise: deferred,
        		    InitialText: self._frames[frameIdx].Text
        		}
        	};
        	app.loadPanel('app/panel', $('#Content'), this, opts).then(function(panel) {
        	    panel.run();
        	}, function(error) {
        	    deferred.reject('panelload');
        	});
        
        	deferred.promise.then(function(newText) {
        	    self._setFrameText(frameIdx, newText);
        	    self._setPresentationEdited(); 
        	}, function(cancelled) {
        	    return;
        	});
            };
        
            return c;
        });
