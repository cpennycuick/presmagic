define(function () {

	function DI () {}

	DI.Transaction = function () {
		this._actions = [];
	};

	DI.Transaction.prototype.add = function (action) {
		this._actions.push(action);
		return this;
	};

	DI.Transaction.prototype.commit = function () {
		var actions = [];
		for (var i = 0; i < this._actions.length; i++) {
			actions.push(this._actions[i].output());
		}

		DI.External.send(actions);
	};

	DI.Action = function (instruction, defaults, id) {
		var properties = defaults;

		if (id === undefined) {
			id = DI.Action.generateID();
		}

		this.getID = function () {
			return id;
		};

		var inTransaction = false;
		if (currentTransaction) {
			currentTransaction.add(this);
			inTransaction = true;
		}

		this.set = function (setProperties) {
			// TODO improve so that only defaults can be updated
			// and new properties can not be added
			$.extend(properties, setProperties);
		};

		var sent = false;
		this.send = function () {
			if (sent || inTransaction) {
				return;
			}

			sent = true;
			DI.External.send([this.output()]);
		};

		this.inTransaction = function () {
			return inTransaction;
		};

		var queuedActions = [];
		this.queue = function (action) {
			queuedActions.push(action);
			return action;
		};

		this.output = function () {
			var output = {
				id: id,
				inst: instruction,
				prop: $.extend({}, properties)
			};

			if (queuedActions.length) {
				output.queue = [];
				for (var i in queuedActions) {
					output.queue.push(queuedActions[i].output());
				}
			}

			return output;
		};
	};

	var uniqueID = 1;
	DI.Action.generateID = function () {
		return uniqueID++;
	};

	DI.Action.create = function (instruction, defaults) {
		function Action (properties) {
			var action = new DI.Action(instruction, defaults);
			action.set(properties);
			return action;
		};

		Action.INST = instruction;

		return Action;
	};

	DI.Action.createWithID = function (instruction, defaults) {
		function Action (id, properties) {
			var action = new DI.Action(instruction, defaults, id);
			action.set(properties);
			return action;
		};

		Action.INST = instruction;

		return Action;
	};

	DI.A = {};
	DI.A.All = {
		Remove: DI.Action.createWithID('All/Remove', {
			ID: null
		})
	};
	DI.A.Text = {
		Add: DI.Action.create('Text/Add', {
			Text: null,
			Opacity: 1
		}),
		Animate: DI.Action.createWithID('Text/Animate', {
			Duration: 1000,
			Opacity: 1
		})
	};

	DI.External = {};
	DI.External.A = DI.A;

	DI.External.send = function (actions) {
		// TODO serialise action
		// use system to send serialised action to output

		message.output.dispatch(actions);
	};

	var currentTransaction = null;
	DI.External.startTransaction = function () {
		if (!currentTransaction) {
			currentTransaction = new DI.Transaction();
		}
	};

	DI.External.commitTransaction = function () {
		if (currentTransaction) {
			currentTransaction.commit();
			currentTransaction = null;
		}
	};

	return window.DI = DI.External;

});
