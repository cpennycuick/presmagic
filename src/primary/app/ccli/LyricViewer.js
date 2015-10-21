define(['text!app/ccli/CCLISearchTemplate.html', 'style!app/ccli/CCLISearchPanelStyle.css'], function (templateHTML) {
	
	for(var i = 0; i < arguments.length; i++) {
		console.log(arguments[i]);
	}
	
	var parentClass = app.Panel;
	var parent = parentClass.prototype;

	var template = new app.Template(templateHTML);
	
	var c = function ($container, options) {
	    for(var i = 0; i < arguments.length; i++){
		console.log(arguments[i]);
	    }

		parent.constructor.call(this, $container, {
			Layout: 'Dialog',
			LayoutOptions: options
		});
	};

	c.prototype = new parentClass();

	c.prototype._prepare = function () {
		parent._prepare.call(this);
		var self = this;
		template.get('LyricViewer')
			.appendTo(this.getContainer());
		
		//searchdata defined and set by songselectui function which launches this panel//
		
		self.$('.LyricViewSongTitle').prepend(self.searchdata.getName());
		self.$('.LyricViewSongContent').addClass("SpinnerDiv");
		self.searchdata.previewLyrics().then(function(lyrics) {
			self.$('.LyricViewSongContent').removeClass("SpinnerDiv").append(lyrics);
		}, function (error) {
			self._errorState(error);
		});		
	};
	
	c.prototype._errorState = function(error) {
		var self = this;
		var $contentDiv = self.$('.LyricViewSongContent').parent();
		//$contentDiv.empty();
		
		switch (error) {
			
			case "loggedout":
				console.log("Not logged in");
				//TEMP!
				songSelectLogin("info@rcbc.org.au", "rcbcmedia").then(function(org) {
					console.log("Logged in as: " + org);
					$contentDiv.addClass("ErrorDiv");
					$contentDiv.append("We were logged out, logged back in(<br>");
					$contentDiv.append("Please try loading this preview again");
					$contentDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
					$contentDiv.find('.LyricViewSongContent').removeClass("SpinnerDiv");
				}, function(error) {
					$contentDiv.addClass("ErrorDiv");
					$contentDiv.append("Invalid username/password :(<br>");
					$contentDiv.append("Please can I have a inputbox that ");
					$contentDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
					$contentDiv.find('.LyricViewSongContent').removeClass("SpinnerDiv");
				});
				break;
			case "connection":				
				$contentDiv.addClass("ErrorDiv");
				$contentDiv.find('.LyricViewSongContent').removeClass("SpinnerDiv");
				$contentDiv.append("Failed to load lyrics :(<br>");
				$contentDiv.append("Check your connection status and try again");
				$contentDiv.append("<div class='ErrorIcon icon icon-sad'></div>");
				break;
			default:
				break;
		}
	}

	return c;
});
