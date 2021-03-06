define(['style!mainmenu'], function () {

	var itemIndex = 0;

	app.MainMenuBuilder = function () {
		this._items = [];
	};

	app.MainMenuBuilder.prototype.add = function (name, priority, setupFn) {
		var item = new MenuItem(name, Math.min(99, Math.max(0, priority)));

		if ($.isFunction(setupFn)) {
			setupFn.call(item);
		}

		this._items.push(item);
	};

	app.MainMenuBuilder.prototype.render = function () {
		var $menu = $('<ul id="MainMenuList"></ul>');

		this._items.sort(function (itemA, itemB) {
			return (itemA.priority() - itemB.priority())
			 || (itemA.index() - itemB.index());
		});

		this._items.forEach(function (item) {
			$menu.append(item.render());
		});

		this._setupEvents($menu);

		return $menu;
	}

	app.MainMenuBuilder.prototype._setupEvents = function ($menu) {
		var self = this;

		$menu.on('click', 'li > .Item',  function () {
			var $li = $(this).parent();
			var isOpen = $li.is('.Open');

			self._closeAll($menu);

			if (!isOpen) {
				self._openMenu($menu, $li);
			}

			return false;
		});

		$menu.on('click', '.SubMenu > .Group > ul > li',  function () {
			self._closeAll($menu);
			return false;
		});
	};

	app.MainMenuBuilder.prototype._closeAll = function ($root) {
		$root.find('.Open').removeClass('Open');
		$('body').off('click.topmenu');
	}

	app.MainMenuBuilder.prototype._openMenu = function ($root, $li) {
		$li.addClass('Open');

		var self = this;
		$('body').on('click.topmenu', function (event) {
			if (!$.contains($root[0], event.target)) {
				self._closeAll($root);
			}
		});
	}

	function MenuItem(name, priority) {
		this._name = name;
		this._priority = priority;
		this._index = itemIndex++;
		this._groups = [];
	}

	MenuItem.prototype.priority = function () {
		return this._priority;
	};

	MenuItem.prototype.index = function () {
		return this._index;
	};

	MenuItem.prototype.add = function (name, setupFn) {
		var group = new MenuGroup(name);

		if ($.isFunction(setupFn)) {
			setupFn.call(group);
		}

		this._groups.push(group);
	};

	MenuItem.prototype.render = function () {
		var $item = $('<li><div class="Item"><div class="Text"></div></div><div class="SubMenu"></div></li>');
		$item.find('.Item .Text').text(this._name);

		this._groups.sort(function (groupA, groupB) {
			return groupA.getName().localeCompare(groupB.getName());
		});

		var $submenu = $item.find('.SubMenu');
		this._groups.forEach(function (group) {
			$submenu.append(group.render());
		});

		return $item;
	};

	function MenuGroup (name) {
		this._name = name;
		this._items = [];
	}

	MenuGroup.prototype.getName = function () {
		return this._name;
	};

	MenuGroup.prototype.add = function (name, icon, action) {
		this._items.push({
			name: name,
			icon: icon,
			action: action
		});
	};

	MenuGroup.prototype.render = function () {
		var $group = $('<div class="Group"><div class="GroupText"></div><ul></ul></div>');
		$group.find('.GroupText').text(this._name);

		var $list = $group.find('ul');
		this._items.forEach(function (item) {
			$list.append(this._renderItem(item));
		}, this);

		return $group;
	};

	MenuGroup.prototype._renderItem = function (item) {
		var $item = $('<li><div class="Icon"></div><div class="Text"></div></li>');

		$item.find('.Text').text(item.name);
		// TODO icon

		if ($.isFunction(item.action)) {
			$item.click(item.action);
		}

		return $item;
	};

	return app.MainMenuBuilder;

});
