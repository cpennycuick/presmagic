chrome.app.runtime.onLaunched.addListener(function(launchData) {
	chrome.app.window.create('src/primary/primary.html', {
		id: 'ControllWindowID',
		innerBounds: {
			minWidth: 800,
			minHeight: 600
		}
	}, function (createdWindow) {
		createdWindow.onClosed.addListener(function () {
			closeRemainingWindows(createdWindow);
		});
	});

	chrome.system.display.getInfo(function (displays) {
		displays.forEach(function (display) {
			if (!display.isPrimary) {
				createOutputWindow(display.bounds);
				return false; // break
			}
		});
	});

});

function createOutputWindow(bounds) {
	chrome.app.window.create('src/output/output.html', {
		id: 'OutputWindowID',
		innerBounds: {
			width: 800,
			height: 600
		},
//		frame: 'none',
//		alwaysOnTopWindows: true, // dev
//		outerBounds: bounds,
//		resizable: false
	}, function (createdWindow) {
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
