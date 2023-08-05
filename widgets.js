function generic_create(parent, class_name, tag)
{
	/** Head object. */
	const head     = document.createElement(tag ? tag : 'div');
	head.className = class_name;
	parent.appendChild(head);

	/** Nested objects. */
	head.click_actions   = {};
	head.hold_actions    = {};
	head.release_actions = {};
	head.keydown_actions = {};

	/** Methods. */
	head.render = function(val) { head.style.background = val };

	head.set_background = function(val) { head.style.background = val };

	head.set_text = function(val) { head.innerHTML = val };

	head.set_size = function(val) {
		if (val)
			head.style.fontSize = val + 'em'
	};

	head.set_direction = function(
	    val) { head.style.flexDirection = (val == 'h') ? 'row' : 'column' };

	head.onclick = function(e) {
		e.stopPropagation();

		for (const key in head.click_actions)
			head.click_actions[key]();
	};

	head.onkeydown = function(e) {
		e.stopPropagation();

		for (const key in head.keydown_actions)
			head.keydown_actions[key](e.key);
	};

	const hold_event =
	    function(e) {
		e.stopPropagation();

		console.log("hold " + e.type);
		for (const key in head.hold_actions)
			head.hold_actions[key]();
	}

	const release_event = function(e) {
		e.stopPropagation();

		console.log("release " + e.type);
		for (const key in head.release_actions)
			head.release_actions[key]();
	};

	/* Fix for mobile devices. */
	if (!head.ontouchstart)
		head.onmousedown = hold_event;
	else
		head.ontouchstart = hold_event;

	if (!head.ontouchend)
		head.onmouseup = release_event;
	else
		head.ontouchend = release_event;

	return head;
};

function field_create(parent)
{
	/** Head object. */
	const head = generic_create(parent, 'field', 'input');
	head.type  = 'text';

	/** Methods. */
	head.set_type  = function(val) { head.type = val };
	head.set_min   = function(val) { head.min = val };
	head.set_max   = function(val) { head.max = val };
	head.set_step  = function(val) { head.step = val };
	head.set_value = function(val) { head.value = val };

	return head;
};

function text_create(parent)
{
	/** Head object. */
	const head = generic_create(parent, 'text');

	return head;
};

function container_create(parent)
{
	/** Head object. */
	const head = generic_create(parent, 'lay');

	return head;
};

function pane_create(parent)
{
	/** Head object. */
	const head = generic_create(parent, 'pane');

	/** Nested objects. */
	head.caption = generic_create(head, 'pane_capt');
	head.text    = text_create(head.caption);
	head.toolbar = generic_create(head.caption, 'pane_tool');
	head.content = container_create(head);

	/** Modified classes. */
	head.text.className    = 'pane_text';
	head.content.className = 'pane_cont';

	return head;
};

function popup_create(parent)
{
	/** Head object. */
	const head = generic_create(parent, 'blur');

	/** Private objects. */
	const popup = pane_create(head);

	/** Nested objects. */
	head.caption = popup.caption;
	head.text    = popup.text;
	head.content = popup.content;

	/** Modified classes. */
	popup.classList.add('popup');

	return head;
};

function button_create(parent)
{
	/** Head object. */
	const head = text_create(parent);

	/** Modified classes. */
	head.className = 'button';

	return head;
};

function checkbox_create(parent)
{
	/** Head object. */
	const head = button_create(parent);

	/** Methods. */
	head.set_state = function(state) {
		head.state = state;

		if (state) {
			head.set_background('#113311');
			head.set_text('&#10003');
		} else {
			head.set_background('#331111');
			head.set_text('&#10007');
		};
	};

	head.click_actions.default_action =
	    function() { head.set_state(!head.state); }

	    head.set_state(head.state);
	return head;
};

function manual_input_create(parent)
{
	/** Head object. */
	const head = popup_create(document.body);
	head.text.set_text('Ввести значення');

	/** Nested objects. */
	head.field  = field_create(head.content);
	head.button = button_create(head.content);
	head.button.set_text('Встановити');

	/** Methods. */
	head.button.click_actions.default_action = function() { head.remove() };

	head.field.keydown_actions.default_action = function(key) {
		if (key === 'Enter')
			head.button.onclick();
	};

	return head;
};

function regulator_create(parent)
{
	/** Head object. */
	const head = container_create(parent);
	head.set_direction('h');

	/** Private objects. */
	var digits = 2;
	var format = 'numeric';
	var min	   = 0;
	var max	   = 0;
	var step   = 0;
	var value  = 0;

	var timer = 0;
	var accel = 1;
	var dir	  = 1;

	/** Nested objects. */
	head.decrement = button_create(head);
	head.decrement.set_text('<');
	head.value     = button_create(head);
	head.increment = button_create(head);
	head.increment.set_text('>');

	/** Modified classes. */
	head.classList.add('regulator');

	/** Methods. */
	head.on_change = function() {};

	head.get_value = function() { return value };

	head.set_min   = function(val) { min = val };
	head.set_max   = function(val) { max = val };
	head.set_step  = function(val) { step = val };
	head.set_value = function(val) {
		value = parseFloat(val);

		/** Validate bounds. */
		if (value > max)
			value = max;

		if (value < min)
			value = min;

		/** Display text depend on format. */
		if (format == 'percentage')
			head.value.set_text((value * 100).toFixed(digits) +
					    '%');
		else
			head.value.set_text(value.toFixed(digits));
	};

	head.set_format = function(fmt) {
		format = fmt;
		head.set_value(value);
	};

	head.manual_input = function() {
		const input = manual_input_create(head);

		input.field.set_type('number');
		input.field.set_min(min);
		input.field.set_max(max);
		input.field.set_step(step);
		input.field.set_value(value.toFixed(digits));

		input.button.click_actions.set_value = function() {
			head.set_value(input.field.value);
			head.on_change();
		};
	};

	head.accelerate = function() {
		head.set_value(value + step * dir);

		timer = setInterval(function() {
			accel += 0.5;
			clearInterval(timer);
			head.accelerate();
		}, 1000 / accel);
	};

	head.increment.hold_actions.default_action = function() {
		dir = 1;
		head.accelerate();
	};

	head.increment.release_actions.default_action = function() {
		clearInterval(timer);
		accel = 1;
		head.on_change();
	};

	head.decrement.hold_actions.default_action = function() {
		dir = -1;
		head.accelerate();
	};

	head.decrement.release_actions.default_action = function() {
		clearInterval(timer);
		accel = 1;
		head.on_change();
	};

	head.value.click_actions.default_action =
	    function() { head.manual_input() };

	return head;
};

function firmware_updater_create(parent, version)
{
	var update_firmware = pane_create(parent);
	update_firmware.text.set_text('Оновленя прошивки');

	// update_firmware.content.style.flexDirection = "column";
	// update_firmware.style.flex = "100%";

	update_firmware.content.set_text(
	    '\
		<iframe name= "hidden-iframe" style= "display: none;"></iframe>\
		<form method= "post" enctype= "multipart/form-data" target = "hidden-iframe" action = "update" style= "display:contents">\
			' +
	    version +
	    '<input type= "file" class = "layout" id= "file" name= "file">\
			<button class = "button">Підтвердити</button>\
		</form>');
};

function loading_create(parent)
{
	return generic_create(parent, 'lds-dual-ring');
};
