define(function () {

	Dexie.Promise.on('error', function (e) {
		console.error('Dixie:', e);
	});

	app.db = new Dexie('presmagic');

//	app.db.delete();

	app.db.version(1).stores({
		presentation: "++ID,&Name",
		frame: "++ID,PresentationID,Group,Text"
	});

	app.db.open();

//	app.db.transaction('rw', [app.db.presentation, app.db.frame], function () {
//		app.db.presentation.add({Name: "Cornerstone"}).then(function (id) {
//			app.db.frame.add({PresentationID: id, Text: "Christ alone; cornerstone"});
//			app.db.frame.add({PresentationID: id, Text: "Weak made strong in the Saviour's love"});
//			app.db.frame.add({PresentationID: id, Text: "Through the storm, He is Lord"});
//			app.db.frame.add({PresentationID: id, Text: "Lord of all"});
//		});
//		app.db.presentation.add({Name: "Forever Reign"}).then(function (id) {
//			app.db.frame.add({PresentationID: id, Text: "Oh, I'm running to Your arms"});
//			app.db.frame.add({PresentationID: id, Text: "I'm running to Your arms"});
//			app.db.frame.add({PresentationID: id, Text: "The riches of your love"});
//			app.db.frame.add({PresentationID: id, Text: "Will always be enough"});
//			app.db.frame.add({PresentationID: id, Text: "Nothing compares to Your embrace"});
//			app.db.frame.add({PresentationID: id, Text: "Light of the world forever reign"});
//		});
//	});

	return app.db;

});
