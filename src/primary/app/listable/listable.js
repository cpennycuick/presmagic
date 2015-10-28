define(function() {

	var Listable = function() {

	};

	Listable.prototype.onAdd = function(list) {
		console.log("Added " + list)
	};

	Listable.prototype.onSelect = function(list) {
		console.log("Selected");
	};

	Listable.prototype.onUnselect = function(list) {
		console.log("UnSelected");
	};

	Listable.prototype.onRemove = function(list) {
		console.log("Removed");
	};

	return Listable;

});