define(function () {

	var templates = {};
	var $empty = $();

	var c = function (templateHTML) {
		if (templateHTML in templates) {
			this._$templates = templates[templateHTML];
			return;
		}

		this._$templates = {};

		var self = this;
		$(templateHTML).filter('[data-template]').each(function () {
			var $this = $(this);
			var name = $this.attr('data-template');
			self._$templates[name] = $this;
		});

		templates[templateHTML] = self._$templates;
	};

	c.prototype.get = function (template, filter) {
		if (!(template in this._$templates)) {
			return $empty;
		}

		var $template = this._$templates[template];

		if (filter) {
			$template = $template.find(filter);
		}

		return $template.clone();;
	};

	return c;

});
