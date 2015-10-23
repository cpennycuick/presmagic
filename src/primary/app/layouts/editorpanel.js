define(['app/layouts/standard', 'style!app/layouts/EditorPanel.css'], function (layoutStandard) {

	//var _options;
	var deferredPromise;
	var $body = $(document.body);
		
	var c = function ($root, options, parent) {
		layoutStandard.prototype.constructor.call(this, $body, options);		
		this._options = options;
		this.deferredPromise = options["Promise"];
	};
	
	c.prototype = new layoutStandard();

	c.prototype.wrap = function () {
	
	    this._$cloak = $('<div class="Cloak"></div>');
		
		var $dialog = $(
				'	<div class="Dialog">'+
				'		<div class="DialogCloseButton icon icon-cross"></div>'+
				'		<div class="DialogTitle"></div>' +
				'		<textarea class="EditorPanel"></textarea>' +
				'		<div class="DialogButtons"></div>' +
				'	</div>'
				);

		this._$container = $dialog.find('.DialogContent');
		this._$editorpanel = $dialog.find('.EditorPanel');
		this._$buttons = $dialog.find('.DialogButtons');
				
		$dialog.find('.DialogCloseButton').click(this.close.bind(this));
		$dialog.find('.DialogTitle').text(this._options.Title || "Input");
		
		this.addButtons(this._options["Buttons"] || {});
		this._$editorpanel.text(this._options['InitialText'] || "Blank");
		
		
		this._$cloak.append($dialog);
		this._$root.append(this._$cloak);
		
	};
	
	
	//Adds two buttons : confirms and cancel.
	c.prototype.addButtons = function(buttonOptions) {
	    var self = this;
	    var $cancelButton = $('<button class="dialog"></button>');
	    var $confirmButton = $('<button class="dialog"></button>');
	    
	    $cancelButton.text(buttonOptions['Cancel'] || "Cancel");
	    $confirmButton.text(buttonOptions['Confirm'] || "Confirm");
	    
	    
	    $cancelButton.click(this.close.bind(this));
	    $confirmButton.click(this.submit.bind(this));
	    
	    this._$buttons.append($confirmButton)
		.append($cancelButton);
	}

	c.prototype.submit = function() {	    
	    var text = this._$editorpanel.val();
	    this._$cloak.remove();
	    this.deferredPromise.resolve(text);	   
	}
	
	c.prototype.close = function () {
		this._$cloak.remove();
		this.deferredPromise.reject("cancel");
	};
	
	return c;

});
