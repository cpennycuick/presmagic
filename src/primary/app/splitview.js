define(function () {

    var Split = function (panel, value, valueType, dragable, primary, orientation) {
		if (!arguments.length) {
			return;
		}

        this._value = value;
        this._valueType = valueType;
		this._dragable = dragable;
        this._primary = (
			primary === Split.PRIMARY_TWO
			? Split.PRIMARY_TWO
			: Split.PRIMARY_ONE
		);
		this._orientation = (
			orientation === Split.ORIENTATION_HORIZONTAL
			? Split.ORIENTATION_HORIZONTAL
			: Split.ORIENTATION_VERTICAL
		);

        this._result = null;

        var $container = panel.getContainer();
		$container.addClass('SplitViewContainer');
        this._$one = $('<div />').appendTo($container);
		this._$div = $('<div />').appendTo($container);
        this._$two = $('<div />').appendTo($container);

		this._setupDivider();

        panel.bind(app.EVENT_PANEL_RESIZE, this._resize.bind(this));
    };

	Split.PRIMARY_ONE = 'One';
	Split.PRIMARY_TWO = 'Two';
	Split.VALUE_TYPE_FIXED = 'Fixed';
	Split.VALUE_TYPE_PERCENT = 'Percent';
	Split.ORIENTATION_HORIZONTAL = 'Horizontal';
	Split.ORIENTATION_VERTICAL = 'Vertical';

    Split.prototype.getContainerOne = function () {
        return this._$one;
    };

    Split.prototype.getContainerTwo = function () {
        return this._$two;
    };

    Split.prototype._resize = function (data) {
		var result = this._calcResult(data.Width, data.Height);

		if (this._resultChanged(result)) {
			this._$one.css(result.One);
			this._$two.css(result.Two);
		}
	};

    Split.prototype._calcResult = function (totalWidth, totalHeight) {
        var result = this._result;

        if (!result) {
            result = {
                One : {
                    width: totalWidth + 'px',
                    height: totalHeight + 'px'
                },
                Two : {
                    width: totalWidth + 'px',
                    height: totalHeight + 'px'
                }
            };
        }

		if (this._orientation === Split.ORIENTATION_HORIZONTAL) {
			this._updateResultProperty(result, totalHeight, 'height');
		} else {
			this._updateResultProperty(result, totalWidth, 'width');
		}

        return result;
    };

    Split.prototype._updateResultProperty = function (result, totalValue, prop) {
        if (this._valueType === Split.VALUE_TYPE_FIXED) {
            if (this._primary === Split.PRIMARY_ONE) {
                result.One[prop] = (this._value - 2) + 'px';
                result.Two[prop] = (totalValue - this._value - 2) + 'px';
            } else {
                result.One[prop] = (totalValue - this._value) + 'px';
                result.Two[prop] = (this._value - 2) + 'px';
            }
        } else {
            if (this._primary === Split.PRIMARY_ONE) {
				var fixedValue = Math.round(totalValue * this._value / 100);
                result.One[prop] = (fixedValue - 2) + 'px';
                result.Two[prop] = (totalValue - fixedValue - 2) + 'px';
            } else {
				var fixedValue = Math.round(totalValue * this._value / 100);
                result.One[prop] = (totalValue - fixedValue - 2) + 'px';
                result.Two[prop] = (fixedValue - 2) + 'px';
            }
        }
    };

    Split.prototype._resultChanged = function (result) {
        return (
			!this._result
            || result.One.width !== this._result.One.width
            || result.One.height !== this._result.One.height
            || result.Two.width !== this._result.Two.width
            || result.Two.height !== this._result.Two.height
        );
    };

	Split.prototype._setupDivider = function () {
		var $container = this._$div.parent()
			.addClass(this._orientation)

		this._$div
			.addClass('Divider')
			.addClass(this._orientation);

		if (!this._dragable) {
			return;
		}

		var eventName = 'mousemove.divider' + (Math.ceil(Math.random() * 8999) + 1000);


		var dividerOnDrag = this._dividerOnDrag.bind(this);
		this._$div
			.addClass('Draggable')
			.mousedown(function (mouseDownEvent) {
				$container.addClass('Dragging');

				var position = $container.position();
				var container = {
					top: position.top,
					left: position.left,
					width: $container.outerWidth(),
					height: $container.outerHeight()
				};
				var offset = {
					top: mouseDownEvent.offsetY,
					left: mouseDownEvent.offsetX
				};

				$container.bind(eventName, function (moveEvent) {
					dividerOnDrag(container, offset, moveEvent);
				});
			});

		$container
			.mouseup(function () {
				$container.removeClass('Dragging');
				$container.unbind(eventName);
			});
	};

	Split.prototype._dividerOnDrag = function (container, offset, event) {
		if (this._orientation === Split.ORIENTATION_HORIZONTAL) {
			this._value = this._getNewValue(container.height, event.pageY - container.top - offset.top);
		} else {
			this._value = this._getNewValue(container.width, event.pageX - container.left - offset.left);
		}

		this._resize({
			Width: container.width,
			Height: container.height
		});
	};

	Split.prototype._getNewValue = function (totalValue, newValue) {
		newValue += 2;

		if (this._valueType === Split.VALUE_TYPE_FIXED) {
			if (this._primary = Split.PRIMARY_ONE) {
				return this._contain(newValue, totalValue);
			} else {
				return this._contain(totalValue - newValue, totalValue);
			}
		} else {
			if (this._primary = Split.PRIMARY_ONE) {
				return this._contain(Math.round(newValue / totalValue * 100), 100);
			} else {
				return this._contain(Math.round((totalValue - newValue) / totalValue * 100), 100);
			}
		}
	};

	Split.prototype._contain = function (value, max) {
		return Math.min(Math.max(value, 0), max);
	};

    var h = function (panel, value, valueType, dragable, primary) {
        Split.prototype.constructor.call(this, panel, value, valueType, dragable, primary, Split.ORIENTATION_HORIZONTAL);
    };
	h.prototype = new Split();

    var v = function (panel, value, valueType, dragable, primary) {
        Split.prototype.constructor.call(this, panel, value, valueType, dragable, primary, Split.ORIENTATION_VERTICAL);
    };
	v.prototype = new Split();

    return {
        Horizontal: h,
        Vertical: v
    };

});
