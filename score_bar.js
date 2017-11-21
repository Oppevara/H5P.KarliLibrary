function score_bar(observe_el) {
	this.observe_el = observe_el;
	this.el = build("div", "score_bar");
	this.el_bar = build("div", "bar", this.el);
	this.el_bar_color = build("div", "color", this.el_bar);
	this.el_inner = build("div", "inner", this.el);
	this.el_score = build("div", "val_score", this.el_inner, 0);
	this.el_total = build("div", "val_total", this.el_inner, 0);
	this.el_show = build("div", "button show", this.el, "Show solution");
	this.el_check = build("div", "button check", this.el, "Check");
	this.el_retry = build("div", "button retry", this.el, "Retry");

	this.el_star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	this.el_star.setAttribute("class", "star");
	this.el_inner.appendChild(this.el_star);
	this.el_star.innerHTML = '<path class="star_path" d="M61.36,22.8,49.72,34.11l2.78,16a2.6,2.6,0,0,1,.05.64c0,.85-.37,1.6-1.33,1.6A2.74,2.74,0,0,1,49.94,52L35.58,44.41,21.22,52a2.93,2.93,0,0,1-1.28.37c-.91,0-1.33-.75-1.33-1.6,0-.21.05-.43.05-.64l2.78-16L9.8,22.8A2.57,2.57,0,0,1,9,21.25c0-1,1-1.33,1.81-1.49l16.07-2.35L34.09,2.83c.27-.59.85-1.33,1.55-1.33s1.28.69,1.55,1.33l7.21,14.57,16.07,2.35c.75.11,1.81.53,1.81,1.49A3.07,3.07,0,0,1,61.36,22.8Z"></path>';

	this.count = function() {

	}.bind(this);

	this.check = function() {
		var checkables = this.observe_el.querySelectorAll("[data-score_correct]");
		for (var i = 0; i < checkables.length; i++) {
			var checkable = checkables[i];
			
		}
	}.bind(this);

	this.reset = function() {
		var resettables = this.observe_el.querySelectorAll("[data-score_reset]");
		for (var i = 0; i < resettables.length; i++) {
			this.reset_callbacks[resettables[i].getAttribute("data-score_reset")](resettables[i]);
		}
	}.bind(this);

	this.reset_callbacks = [];

	this.set_observable = function(el, reset_callback) {
		el.setAttribute("data-score_answered", false);
		el.setAttribute("data-score_correct", false);
		var reset_id = this.reset_callbacks.length;
		el.setAttribute("data-score_reset", reset_id);
		this.reset_callbacks[reset_id] = reset_callback;
	}.bind(this);

	this.refresh_bar = function() {
		if (this.total === 0) return;
		var fraction = this.score / this.total;
		this.el_bar_color.style.width = fraction * 100 + "%";
	}.bind(this);

	this.refresh = function() {
		this.refresh_bar();
		this.star = this.mode === "check" && this.score == this.total;
	}.bind(this);

	this.el_check.addEventListener("click", function() {
		this.mode = "check";
		this.score = 0;
		setTimeout(this.check, 0);
	}.bind(this));

	this.el_retry.addEventListener("click", function() {
		this.mode = "count";
		this.score = 0;
		setTimeout(this.reset, 0);
	}.bind(this));

	Object.defineProperty(this, "star", {
		"get" : function() {
			return this.el.hasAttribute("data-star");
		}.bind(this),
		"set" : function(v) {
			if (v) {
				this.el.setAttribute("data-star", "");
			} else {
				this.el.removeAttribute("data-star");
			}
		}.bind(this),
	});

	Object.defineProperty(this, "score", {
		"get" : function() {
			return parseInt(this.el_score.innerHTML);
		}.bind(this),
		"set" : function(v) {
			this.el_score.innerHTML = v;
			this.refresh();
		}.bind(this)
	});

	Object.defineProperty(this, "total", {
		"get" : function() {
			return parseInt(this.el_total.innerHTML);
		}.bind(this),
		"set" : function(v) {
			this.el_total.innerHTML = v;
			this.refresh();
		}.bind(this)
	});

	Object.defineProperty(this, "mode", {
		"get" : function() {
			return this.el.getAttribute("data-mode");
		}.bind(this),
		"set" : function(v) {
			this.el.setAttribute("data-mode", v);
		}.bind(this)
	});

	this.mode = "count";
	this.score = 0;
	this.total = 0;
	this.star = false;
}




