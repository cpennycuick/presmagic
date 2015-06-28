define(['app/component'], function (appComponent) {

	var parentClass = appComponent;
	var parent = parentClass.prototype;

	var c = function () {
		parent.constructor.call(this, 'Main', '0.1', [
			'Chris; @cpennycuick'
		]);
	};

	c.prototype = new parentClass();

	c.prototype.register = function () {
		loadMainMenu();
		
		app.loadPanel('components/main/mainpanel', $('#Content'))
		.then(function () {
			console.log('Main Panel');
		});
	};

	function loadMainMenu () {
		require(['app/mainmenu'], function (MainMenu) {
			var menu = new MainMenu();
			setupMenu(menu);

			$('#MainMenu').append(menu.render());
		});
	}

	function setupMenu(menu) {
		menu.add('File', function () {
			this.add('Application', function () {
				this.add('Preferences');
				this.add('Exit', null, function () {
					chrome.app.window.current().close();
				});
			});
			this.add('Advanced', function () {
				this.add('Stage Display');
				this.add('Remote Control');
			});
		});

		menu.add('Media', function () {
			this.add('Video', function () {
				this.add('Load File');
			});
		});

		menu.add('Help', function () {
			this.add('Help', function () {
				this.add('Contents');
				this.add('About');
			});
		});
	}

	return c;

});
