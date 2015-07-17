/* global chrome */

chrome.app.runtime.onLaunched.addListener(function(launchData) {
	var events = {
		controll: new chrome.Event(),
		output: new chrome.Event()
	};

	chrome.app.window.create('src/primary/primary.html', {
		id: 'ControllWindowID',
		innerBounds: {
			minWidth: 800,
			minHeight: 600
		}
	}, function (createdWindow) {
		createdWindow.contentWindow.onload = function () {
			this.message = {
				receive: events.controll,
				output: events.output
			};
		};

		createdWindow.onClosed.addListener(function () {
			closeRemainingWindows(createdWindow);
		});
	});

	createOutputWindow({}, events);

//	chrome.system.display.getInfo(function (displays) {
//		displays.forEach(function (display) {
//			if (!display.isPrimary) {
//				createOutputWindow(display.bounds, events);
//				return false; // break
//			}
//		});
//	});

});

function createOutputWindow(bounds, events) {
	chrome.app.window.create('src/output/output.html', {
		id: 'OutputWindowID',
		innerBounds: {
			width: 800,
			height: 600
		}
//		frame: 'none',
//		alwaysOnTopWindows: true, // dev
//		outerBounds: bounds,
//		resizable: false
	}, function (createdWindow) {
		createdWindow.contentWindow.onload = function () {
			this.message = {
				receive: events.output,
				controll: events.controll
			};
		};

//		createdWindow.fullscreen();
		createdWindow.onClosed.addListener(function () {
			closeRemainingWindows(createdWindow);
		});
	});
}

function closeRemainingWindows(appWindow) {
	var windows = chrome.app.window.getAll();
	for (var i in windows) {
		if (windows[i].id !== appWindow.id) {
			windows[i].close();
		}
	}
}
