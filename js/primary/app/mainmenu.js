define(['style!css/mainmenu'], function () {

	function Menu() {
		this._items = [];
	}

	Menu.prototype.add = function (name, setupFn) {
		var item = new MenuItem(name);

		if ($.isFunction(setupFn)) {
			setupFn.call(item);
		}

		this._items.push(item);
	};

	Menu.prototype.render = function () {
		var $menu = $('<ul id="MainMenuList"></ul>');

		this._items.forEach(function (item) {
			$menu.append(item.render());
		});

		this._setupEvents($menu);

		return $menu;
	}

	Menu.prototype._setupEvents = function ($menu) {
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

	Menu.prototype._closeAll = function ($root) {
		$root.find('.Open').removeClass('Open');
		$('body').off('click.topmenu');
	}

	Menu.prototype._openMenu = function ($root, $li) {
		$li.addClass('Open');

		$('body').on('click.topmenu', function (event) {
			if (!$.contains($root[0], event.target)) {
				closeAll($root);
			}
		});
	}

	function MenuItem(name) {
		this._name = name;
		this._groups = [];
	}

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

	return Menu;

});
