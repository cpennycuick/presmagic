define(function () {

	var renderer = PIXI.autoDetectRenderer(800, 600);
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
		requestAnimationFrame(run);
	}

	function handleEvent(eventType) {
		if (eventType === 'ShowText') {
			showText(arguments[1]);
		} else {
			console.log(arguments);
		}
	};

	var basicText;
	function init() {
		basicText = new PIXI.Text('', {
			font: '48px Calibri',
			fill: '#FFFFFF',
//			stroke: '#FF0000',
//			strokeThickness: 4,
			wordWrap: true,
			wordWrapWidth: 600
		});
		basicText.x = 10;
		basicText.y = 10;

//		var blurFilter = new PIXI.filters.BlurFilter();
//		blurFilter.blur = 20;
//		blurFilter.passes = 4;
//
//		basicText.filters = [blurFilter];

		stage.addChild(basicText);
	}

	function showText(text) {
		console.log(text);
		basicText.text = text;
	};

});
