define(['app/layouts/standard', 'style!app/layouts/InputDialog.css'], function (layoutStandard) {

	var _options;
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
				'		<div class="DialogInputs"></div>'+
				'		<div class="DialogButtons"></div>' +
				'	</div>'
				);

		this._$container = $dialog.find('.DialogContent');
		this._$inputs = $dialog.find('.DialogInputs');
		this._$buttons = $dialog.find('.DialogButtons');
		$dialog.find('.DialogCloseButton').click(this.close.bind(this));
		$dialog.find('.DialogTitle').text(this._options.title);
		
		this._inputs = this._options["Inputs"];
		for(var i = 0; i < this._inputs.length; i++) {
			this.addInput(this._inputs[i].Name || "", this._inputs[i].Type || "text", this._inputs[i].Compulsory || true, i);
			this._inputs[i].index = i;
		}
		
		
		this.addButtons(this._options["Buttons"] || {});
		
		this._$cloak.append($dialog);
		this._$root.append(this._$cloak);
		
	};
	
	c.prototype.addInput = function(name, type, compulsory, dataindex) {
		var $input = $('<div>' +
'					<input class ="DialogInput" ' +
'						 type="' + type + '"' +
'						 placeholder="' + name + '"' +
'						 data-index="' + dataindex + '">' +
'					</input>' +
'				</div>');
		this._$inputs.append($input);
	}
	
	//Adds two buttons : confirms and cancel. Confirm button checks that compulsory fields are filled then returns a fulfilled promise
	c.prototype.addButtons = function(buttonOptions) {
	    var self = this;
	    var $cancelButton = $('<button class="InputDialogCancel"></button>');
	    var $confirmButton = $('<button class="InputDialogConfirm"></button>');
	    
	    $cancelButton.text(buttonOptions['Cancel'] || "Cancel");
	    $confirmButton.text(buttonOptions['Confirm'] || "Confirm");
	    
	    
	    $cancelButton.click(this.close.bind(this));
	    $confirmButton.click(this.submit.bind(this));
	    
	    this._$buttons.append($confirmButton)
		.append($cancelButton);
	}

	c.prototype.submit = function() {
	    var successful = true;
	    var returnValues = {};
	    for(var i = 0; i < this._inputs.length; i++) {
		    //Check text in field for dataindex
		    //Highlight field red if no text
		    //
		    var $field = this._$inputs.find("[data-index='" + this._inputs[i].index + "']");
		    console.log($field.val());
		    var value = $field.val();
		    if(value.length < 1 && this._inputs[i].Compulsory) {
			//Highlight field red
			$field.addClass("RedBackground");
			$field.focus(function() {
			    $(this).removeClass("RedBackground");
			    $(this).off(this);
			})
			successful = false;
		    } else {
			returnValues[this._inputs[i].Name] = value;
		    }
	    }
	    if(successful) {
		this._$cloak.remove();
		this.deferredPromise.resolve(returnValues);
	    }
	}
	
	c.prototype.close = function () {
		this._$cloak.remove();
		this.deferredPromise.reject("cancel");
	};
	
	return c;

});
