define([
	'app/layouts/standard',
	'app/layouts/dialog',
	'app/layouts/inputdialog',
	'app/layouts/editorpanel'],
	function (
		layoutStandard,
		layoutDialog,
		inputDialog,
		editorPanel
	) {

	var layouts = {};

	layouts.Standard = layoutStandard;
	layouts.Dialog = layoutDialog;
	layouts.InputDialog = inputDialog;
	layouts.EditorPanel = editorPanel;

	return layouts;

});