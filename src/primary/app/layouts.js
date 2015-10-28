define([
	'app/layouts/standard',
	'app/layouts/dialog',
	'app/layouts/confirmdialog'],
	function (
		layoutStandard,
		layoutDialog,
		layoutConfirmDialog
	) {

	var layouts = {};

	layouts.Standard = layoutStandard;
	layouts.Dialog = layoutDialog;
	layouts.ConfirmDialog = layoutConfirmDialog;

	return layouts;

});