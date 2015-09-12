define(function () {

	var parentClass = app.Component;
	var parent = parentClass.prototype;

	var c = function () {
		parent.constructor.call(this, 'Core');
	};

	c.prototype = new parentClass();

	c.prototype.getInfo = function () {
		return this.buildInfo('0.1', ['Chris; @cpennycuick'],
			'This is the core component which adds all the base features to the application.'
		);
	};

	c.prototype.register = function () {
		app.event.bind(app.EVENT_APPLICATION_SETUP_MAINMENU, function (data) {
			addToMainMenu(data.MainMenu);
		});
	};

	c.prototype.load = function () {
		return app.loadPanel('components/core/rootpanel', $('#Content'))
			.then(function (panel) {
				panel.run();
			});
	};

	function addToMainMenu(menu) {
		
		menu.add('Output', 80, function () {
			this.add('Output Controls', function () {
				this.add('Toggle Output Window', null, function () {
					var output = chrome.app.window.get("OutputWindowID");

					if(output.visible) {
						output.hide();
					}
					else {
						output.show();
					}

					output.visible = !output.visible;
					
				});
			});
		});

		menu.add('Help', 99, function () {
			this.add('Help', function () {
				this.add('Components', null, function () {
					app.loadPanel('components/core/componentslist', $('#Content'))
						.then(function (panel) {
							panel.run();
						}).done();
				});
			});
		});
	}

	return c;

});
