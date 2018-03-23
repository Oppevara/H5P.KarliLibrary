var build = function(tag_name, class_name, parent, data) {
	var el;
	switch (tag_name) {
		case "custom_dropdown":
			el = build_dropdown(data);
			break;
		case "custom_checkbox":
			el = build_checkbox(data);
			break;
		default:
			el = document.createElement(tag_name);
			if (data !== undefined) el.innerHTML = data;
	}
	if (class_name !== undefined) el.className = class_name;
	if (parent !== undefined) parent.appendChild(el);
	
	return el;
};

var build_checkbox = function(label) {
	var el = build("label", undefined, undefined, label);
	var cb = build("input", undefined, el);
	cb.type = "checkbox";
	return el;
}

var build_dropdown = function(options) {
	var el = build("select");
	if (options === undefined || options === null) return el;

	if (options.constructor === [].constructor) {
		for (var i = 0; i < options.length; i++) {
			build("option", undefined, el, options[i]).value = options[i];
		}
	}

	var indices = {};
	if (options.constructor === {}.constructor) {
		for (var key in options) {
			indices[key] = Object.keys(indices).length;
			build("option", undefined, el, options[key]).value = key;
		}
	}

	if (Object.keys(options).length > 0) {
		el.children[0].selected = true;
	}

	
	el.addEventListener("change", function(e) {
		var selected_value = e.target.children[e.target.selectedIndex].value;
		var ev = new CustomEvent("changed", {"detail" : selected_value});
		el.dispatchEvent(ev);
	});

	el.set_value = function(v) {
		el.children[indices[v]].selected = true;
	};

	return el;
}

build_radio_menu = function(choices, default_choice, callback) {
	var name = random_string();
	var div = build("div", "radio_menu");
	div.setAttribute("data-selected", "");
	for (var i = 0; i < choices.length; i++) {
		var label = build("label", undefined, div, choices[i]);
		var radio = build("input", undefined, label);
		radio.type = "radio";
		radio.value = choices[i];
		radio.name = name;
		if (default_choice !== undefined && default_choice == choices[i]) {
			radio.setAttribute("checked", "");
			div.setAttribute("data-selected", choices[i]);
		}
		radio.addEventListener("click", (function(choice) { return function(e) { div.setAttribute("data-selected", choice); callback(choice); } })(choices[i]));
	}
	return div;
};

function stop_propagation(e) {
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}

find_root_element = function(el) {
	while (el.parentElement !== null) el = el.parentElement;
	return el;
}

var random_string = function(n) {
	n = n || 10;
	var palette = "abcdefghijklmnopqrstuvwxyzABCDEFGhIJKLMNOPQRSTuVWXYZ0123456789";
	var s = "";
	for (var i = 0; i < n; i++) {
		var sel = Math.floor(Math.random() * palette.length);
		s += palette[sel];
	}
	return s;
};

var h5p_get_data_obj = function(s) {
	if (s === undefined) return undefined;
	if (s.length > 0 && (s[0] == "[" || s[0] == "{")) {
		return h5p_get_data_obj_v0(s);
	}

	if (s.length >= 3 && s.substring(0, 3) == "v1_") {
		return h5p_get_data_obj_v1(s);
	}

	console.log("Corrputed or unknown data format");
	return undefined;
};



var h5p_get_data_str = function(o) {
	return h5p_get_data_str_v1(o);
}

var h5p_get_data_obj_v1 = function(s) {
	return JSON.parse(atob(s.substring(3)));
}

var h5p_get_data_str_v1 = function(o) {
	if (o === undefined) return undefined;
	return "v1_" + btoa(JSON.stringify(o));
};


//	for historic reference
var h5p_get_data_obj_v0 = function(s) {
	s = s.replace(new RegExp(/&quot;/, 'g'), "\"");
	s = s.replace(new RegExp(/&lt;/, 'g'), "<");
	s = s.replace(new RegExp(/&gt;/, 'g'), ">");
	console.log(s);
	return JSON.parse(s);
}

var h5p_get_data_str_v0 = function(o) {
	if (o === undefined) return undefined;
	return JSON.stringify(o);
}

var h5p_resize_all_instances = function() {
	if (!("H5P" in window)) {
		console.log("Can't find h5p object");
		return;
	}
	for (var i = 0; i < H5P.instances.length; i++) {
		H5P.trigger(H5P.instances[i], 'resize');
	}
}

//	xml help

function xml_to_doc(xml) {
	return (new DOMParser()).parseFromString(xml, "application/xml");
}

function doc_to_xml(doc) {
	return (new XMLSerializer()).serializeToString(doc);
}