define(['dexie'], function (Dexie) {
	Dexie.Promise.on('error', function (e) {
		console.error('Dixie:', e);
	});

	var db = new Dexie('presmagic');

	db.delete();

	db.version(1).stores({
		presentation: "++ID,&Name",
		frame: "++ID,PresentationID,Group,Text"
	});

	db.open();

	db.transaction('rw', [db.presentation, db.frame], function () {
		db.presentation.add({Name: "Cornerstone"}).then(function (result) {
			debugger;
		});
		db.presentation.add({Name: "Forever Reign"}).then(function () {
			debugger;
		});
	});

	return db;

});
