function GuidedTask(opts, dispatch) {
	var defaults = {
		position: 2,
		xButton: true,
		buttons: [],
		offset: {
			top:-1.5 * 16,
			left:0
		},
		completeWhen: function() {}
	};
	this.opts = $.extend(defaults, opts);
	this.dispatch = dispatch;
	
	this.name = this.opts.id;
	this.complete = false;
	
	this.popup = guiders.createGuider(this.opts);
	this.listenForCompleteAction();
}
(function() {
	GuidedTask.prototype.getEvent = function(name) {
		return [this.name, name, 'GuidedTask'].join('.');
	};
	GuidedTask.prototype.showHelp = function() {
		guiders.show(this.opts.id);
	};
	GuidedTask.prototype.markAsDone = function(e) {
		this.complete = true;
		this.dispatch.trigger(this.getEvent('Done'));
	};
	GuidedTask.prototype.listenForCompleteAction = function() {
		this.opts.completeWhen(this);
	};
})();

function GuidedTaskList(task_dfns, dispatcher) {
	var self = this;
	
	this.dispatch = dispatcher || $(document);
	this.tasks = task_dfns.map(function(dfn) {
		return new GuidedTask(dfn, self.dispatch);
	});
	this.tasks.forEach(function(task) {
		self.dispatch.bind(task.getEvent('Done'), function() {
			self.showNextTask();
		});
	});
}
(function() {
	GuidedTaskList.prototype.getTaskByName = function(name) {
		return this.tasks.filter(function(task) {
			return (task.opts.id == name ? task : false);
		}).shift();
	};
	GuidedTaskList.prototype.getNextIncompleteTask = function() {
		return this.tasks.filter(function(task) {
			return (task.complete ? false : task);
		}).shift();
	};
	GuidedTaskList.prototype.showNextTask = function() {
		guiders.hideAll();
		var task = this.getNextIncompleteTask();
		if (task) {
			setTimeout(function() {
				task.showHelp();
			}, 1000);
		}
	};
})();
