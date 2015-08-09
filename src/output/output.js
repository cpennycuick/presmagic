define(function () {

	var renderer = PIXI.autoDetectRenderer(800, 600, {
//		antialias: true
	});

	var stage = new PIXI.Container();

	return {
		init: function () {
			$(function () {
				message.receive.addListener(runActions);
				document.body.appendChild(renderer.view);

				init();

				requestAnimationFrame(run);
			});
		}
	};

	function run() {
		renderer.render(stage);

		var children = stage.children.slice();
		for (var i = 0; i < children.length; i++) {
			if (children[i].update) {
				children[i].update();
			}
		}

		requestAnimationFrame(run);
	}

	function runActions(actions) {
		for (var i in actions) {
			console.log(actions[i]);
			switch (actions[i].inst) {
				case DI.A.Text.Add.INST:
					showText(actions[i].prop.Text);
					break;
			}

			// TODO run queued actions in promise of completed parent action
			if (actions[i].queue && actions[i].queue.length) {
				runActions(actions[i].queue);
			}
		}
	};

	function init() {
		textElements = 0;

		window.onresize = function () {
			renderer.resize(window.innerWidth, window.innerHeight);
		};
		window.onresize();
	}

	var activeText = null;
	var textElements = 0;
	function showText(text) {
		if (!text || !text.length) {
			fadeOut(activeText).then(function () {
				if ((--textElements) <= 1) {
					activeText = null;
				}
			});

			return;
		}

		var element = createText(text);
		element.alpha = 0;

		if (activeText) {
			fadeOut(activeText).then(function () {
				if ((--textElements) <= 1) {
					fadeIn(activeText);
				}
			});
		} else {
			fadeIn(element);
		}

		activeText = element;
		textElements += 1;

		renderer.render(stage);

		var bounds = element.getLocalBounds();
		element.x = renderer.width / 2 - bounds.width / 2;
		element.y = renderer.height / 2 - bounds.height / 2;
	};

	function fadeIn(element) {
		element.alpha = 0;

		var dfd = Q.defer();
		element.update = function () {
			element.alpha += 0.05;

			if (element.alpha >= 1) {
				element.alpha = 1;
				element.update = null;
				dfd.resolve();
			}
		};

		return dfd.promise;
	}

	function fadeOut(element) {
		var dfd = Q.defer();
		element.update = function () {
			element.alpha -= 0.05;

			if (element.alpha <= 0) {
				element.alpha = 0;
				element.update = null;
				stage.removeChild(element);
				dfd.resolve();
			}
		};

		return dfd.promise;
	}

	function createText(text) {
		var element = new PIXI.Text(text, {
			font: '48px Arial',
			fill: '#FFFFFF',
			align: 'center',
			strokeThickness: 4,
			wordWrap: true,
			wordWrapWidth: renderer.width - 20
		});

		stage.addChild(element);

		return element;
	}

});
