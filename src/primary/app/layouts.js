define([
	'app/layouts/standard',
	'app/layouts/dialog',
	'app/layouts/inputdialog'],
	function (
		layoutStandard,
		layoutDialog,
		inputDialog
	) {

	var layouts = {};

	layouts.Standard = layoutStandard;
	layouts.Dialog = layoutDialog;
	layouts.InputDialog = inputDialog;

	return layouts;

});