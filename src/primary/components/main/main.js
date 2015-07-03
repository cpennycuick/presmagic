define(['components/main/mainmenubuilder'], function (MainMenuBuilder) {

	var parentClass = app.classes.Component;
	var parent = parentClass.prototype;
	
	var c = function () {
		parent.constructor.call(this);

		this._mainMenuBuilder = new MainMenuBuilder();
	};

	c.prototype = new parentClass();
	
	c.prototype.getInfo = function () {
		return c.buildInfo('Main', '0.1', ['Chris; @cpennycuick'],
			'This is the core component which adds all the base features to the application.'
		);
	};

	c.prototype.register = function () {
		setupMenu(this._mainMenuBuilder);
	};

	c.prototype.load = function () {
		renderMenu(this._mainMenuBuilder);

		return app.loadPanel('components/main/mainpanel', $('#Content'))
			.then(function (panel) {
				panel.run();
			});
	};

	function setupMenu(menu) {
		menu.add('File', function () {
			this.add('Application', function () {
				this.add('Exit', null, function () {
					chrome.app.window.current().close();
				});
			});
		});

		menu.add('Help', function () {
			this.add('Help', function () {
				this.add('Components', null, function () {
					app.loadPanel('components/main/componentslist', $('#Content'))
						.then(function (panel) {
							panel.run();
						});
				});
			});
		});
	}

	function renderMenu(menu) {
		$('#MainMenu').append(menu.render());
	}

	return c;

});
