chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('window_primary.html', {
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
		for (var i in displays) {
			var display = displays[i];
			if (!display.isPrimary) {
				chrome.app.window.create('window_output.html', {
					id: 'OutputWindowID',
					innerBounds: {
						width: 800,
						height: 600
					},
//					frame: 'none',
//					alwaysOnTopWindows: true,
//					outerBounds: display.bounds,
					resizable: false
				}, function (createdWindow) {
//					createdWindow.fullscreen();
//					createdWindow.onClosed.addListener(function () {
//						closeRemainingWindows(createdWindow);
//					});
				});

				break;
			}
		}
	});

});

function closeRemainingWindows(appWindow) {
	var windows = chrome.app.window.getAll();
	for (var i in windows) {
		if (windows[i].id != appWindow.id) {
			windows[i].close();
		}
	}
}
