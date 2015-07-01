define([
	'app/layouts/standard',
	'app/layouts/dialog'],
	function (
		layoutStandard,
		layoutDialog
	) {

	var layouts = {};

	layouts.Standard = layoutStandard;
	layouts.Dialog = layoutDialog;

	return layouts;

});