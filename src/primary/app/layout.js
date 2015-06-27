define([
	'app/layout/standard',
	'app/layout/dialog'],
	function (
		layoutStandard,
		layoutDialog
	) {

	var layouts = {};

	layouts.Standard = layoutStandard;
	layouts.Dialog = layoutDialog;

	return layouts;

});