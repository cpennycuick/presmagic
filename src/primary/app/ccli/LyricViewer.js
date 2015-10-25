define(['text!app/ccli/CCLISearchTemplate.html', 'style!app/ccli/CCLISearchPanelStyle.css'], 
	function (templateHTML) {

    var parentClass = app.Panel;
    var parent = parentClass.prototype;

    var template = new app.Template(templateHTML);

    var c = function ($container, options) {
	parent.constructor.call(this, $container, {
	    Layout: 'Dialog',
	    LayoutOptions: options
	});

	this._lyrics = options.songLyrics || "";
	this._songTitle = options.songTitle || "";
    };

    c.prototype = new parentClass();

    c.prototype._prepare = function () {
	parent._prepare.call(this);
	var self = this;

	template.get('LyricViewer')
	.appendTo(this.getContainer());

	self.$('.LyricViewSongContent').append(self._lyrics);
	self.$('.LyricViewSongTitle').prepend(self._songTitle);
    };

    return c;
});
