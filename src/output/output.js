define(function () {

	var renderer = PIXI.autoDetectRenderer(800, 600, {
		antialias: true
	});

	var stage = new PIXI.Container();

	return {
		init: function () {
			$(function () {
				message.receive.addListener(handleEvent);
				document.body.appendChild(renderer.view);

				init();

				requestAnimationFrame(run);
			});
		}
	};

	function run() {
		renderer.render(stage);
		runUpdateCallbacks();
		requestAnimationFrame(run);
	}

	var onUpdateCallbacks;
	function onUpdate(fn) {
		onUpdateCallbacks.push(fn);
	}
	function runUpdateCallbacks() {
		if (!onUpdateCallbacks.length) {
			return;
		}

		var onUpdateCallbacksCopy = onUpdateCallbacks.slice();
		onUpdateCallbacks = [];

		for (var i =0; i < onUpdateCallbacksCopy.length; i++) {
			onUpdateCallbacksCopy[i]();
		}
	}

	function handleEvent(eventType) {
		console.log(arguments);
		if (eventType === 'ShowText') {
			showText(arguments[1]);
		}
	};

	var currentText;
	function init() {
		onUpdateCallbacks = [];

		window.onresize = function () {
			renderer.resize(window.innerWidth, window.innerHeight);
		};
		window.onresize();
	}

	function showText(text) {
		if (!text || !text.length) {
			fadeOut(currentText, function () {
				currentText = null;
			});

			return;
		}

		var element = createText(text);

//		element.visible = false;
		element.alpha = 0;

		onUpdate(function () {
			var bounds = element.getLocalBounds();
			element.x = renderer.width / 2 - bounds.width / 2;
			element.y = renderer.height / 2 - bounds.height / 2;

			if (currentText) {
				fadeOut(currentText, function () {
					fadeIn(element);
				});
			} else {
				fadeIn(element);
			}

			currentText = element;
		});
	};

	function fadeIn(element, doneFn) {
		var fadeInc = 0.1;
		if ((element.alpha + fadeInc) >= 1) {
			doneFn && doneFn();
			return;
		}

		element.alpha += fadeInc;
		onUpdate(function () {
			fadeIn(element, doneFn);
		});
	}

	function fadeOut(element, doneFn) {
		var fadeInc = 0.1;
		if ((element.alpha - fadeInc) < 0) {
			doneFn && doneFn();
			return;
		}

		element.alpha -= fadeInc;
		onUpdate(function () {
			fadeOut(element, doneFn);
		});
	}

	function createText(text) {
		var element = new PIXI.Text(text, {
			font: '48px Calibri',
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
