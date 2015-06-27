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
		app.loadPanel('components/main/mainpanel', $('#Content'))
		.then(function () {
			console.log('Main Panel');
		});
	};

	return c;

});
