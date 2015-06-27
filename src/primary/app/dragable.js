define(function () {

	var lastDraggingEventID = 1;

	return function ($element, $handle, update, reset) {
		var draggingEventID = lastDraggingEventID;
		lastDraggingEventID++;

		var start = {};
		$handle.mousedown(function (event) {
			var pos = $element.position();

			start = {
				mouseX: event.pageX,
				mouseY: event.pageY,
				width: $element.outerWidth(),
				height: $element.outerHeight(),
				top: pos.top,
				left: pos.left
			};

			$(document).bind('mousemove.dragable'+draggingEventID, function (event) {
				update.call(start, event, $element, $handle);
			}).bind('mouseup.dragable'+draggingEventID, function () {
				$(document)
					.unbind('mousemove.dragable'+draggingEventID)
					.unbind('mouseup.dragable'+draggingEventID);

				if (reset) {
					reset.call(start, $element, $handle);
				}
			});
		});
	};

});