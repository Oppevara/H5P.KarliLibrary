function make_eventable(obj) {
	obj.eventable_events = {};
	obj.add_event_listener = function(name, callback) {
		if (!(name in this.eventable_events)) this.eventable_events[name] = [];
		this.eventable_events[name].push(callback);
	};
	obj.raise_event = function(name, args) {
		if (!(name in this.eventable_events)) return;
		for (var i = 0; i < this.eventable_events[name].length; i++) {
			this.eventable_events[name][i](args);
		}
	};
}