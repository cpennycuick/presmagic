define(['app/listable/listable'], function(Listable) {

	var parent = Listable.prototype;

	var SongListItem = function(name, ID) {
		parent.constructor.call(this);
		this.Name = name;
		this.ID = ID;
	}

	SongListItem.prototype = new Listable();

	return SongListItem;

});