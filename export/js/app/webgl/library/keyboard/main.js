const KEY_CODES = {
	"esc": "escape",
	"1": "digit1",
	"2": "digit2",
	"3": "digit3",
	"4": "digit4",
	"5": "digit5",
	"6": "digit6",
	"7": "digit7",
	"8": "digit8",
	"9": "digit9",
	"0": "digit0",
	"-": "minus",
	"=": "equal",
	"q": "keyq",
	"w": "keyw",
	"e": "keye",
	"r": "keyr",
	"t": "keyt",
	"y": "keyy",
	"u": "keyu",
	"i": "keyi",
	"o": "keyo",
	"p": "keyp",
	"[": "bracketleft",
	"]": "bracketright",
	"\\": "backslash",
	"a": "keya",
	"s": "keys",
	"d": "keyd",
	"f": "keyf",
	"g": "keyg",
	"h": "keyh",
	"j": "keyj",
	"k": "keyk",
	"l": "keyl",
	";": "semicolon",
	"'": "quote",
	"z": "keyz",
	"x": "keyx",
	"c": "keyc",
	"v": "keyv",
	"b": "keyb",
	"n": "keyn",
	"m": "keym",
	",": "comma",
	".": "period",
	"tab": "tab",
	"shift": "shift",
	"ctrl": "control",
	"alt": "alt",
	"space": "space"
}

const PRIMARY_KEYS = [
	"Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Bksp",
	"Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\",
	"Lock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter",
	"Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift",
	"Ctrl", "Windows", "Alt", "Space", "Alt", "Windows", "Ctrl"
];
const ROW_INDEX_BREAKS = [
	13, 27, 40, 52, 59
];
// Column Arrow Keys function

// primary keys are checked against these arrays in descending order
// when a match is found, it is removed from that array

// 6x size
const KEYS_55 = [
	"Space"
]
// 2.5x
const KEYS_25 = [
	"Shift"
]
// 2x
const KEYS_2 = [
	"Lock", "Shift"
]
// 1.5x
const KEYS_15 = [
	"Bksp", "Tab", "Enter", "Ctrl", "Windows", "Windows", "Alt", "Alt", "Ctrl"
]

// These key types are prevented from having functionality
const DISABLED_KEYS = [
	"bksp", "lock", "enter", "/", "windows"
]
// These keys have left/right appended
const ORIENTATION_KEYS = [
	"shift", "ctrl", "alt"
]

class KeyboardClass {
	PARENT_ELEMENT = false;
	BASE_WIDTH = 0;
	ACTIVE_ELEMENTS = {};
	IDLE_ELEMENTS = [];

	key_codes = [];
	primary_keys = [];
	keys_55 = [];
	keys_25 = [];
	keys_2 = [];
	keys_15 = [];
	disabled_keys = [];
	ROW_INDEX_BREAKS = [];
	constructor() {
		this.init = this.init.bind(this);
		this.toggle = this.toggle.bind(this);
		this.show = this.show.bind(this);
		this.hide = this.hide.bind(this);
		this.generateElement = this.generateElement.bind(this);
		this.initListener = this.initListener.bind(this);
		this.register = this.register.bind(this);
		this.keydown = this.keydown.bind(this);
		this.keyup = this.keyup.bind(this);

		this.init();
		this.initStyles();
		this.generateElement();

		window.tired.resize.events.push(function () {
			this.releaseAllKeys();
			this.initStyles();
			this.updateKeyPositions();
			this.updateIdleActions();
		}.bind(this));

		window.addEventListener('blur', function () {
			this.releaseAllKeys();
		}.bind(this));
	}
	init() {
		this.key_codes = KEY_CODES;
		this.primary_keys = PRIMARY_KEYS;
		this.keys_55 = JSON.parse(JSON.stringify(KEYS_55));
		this.keys_25 = JSON.parse(JSON.stringify(KEYS_25));
		this.keys_2 = JSON.parse(JSON.stringify(KEYS_2));
		this.keys_15 = JSON.parse(JSON.stringify(KEYS_15));
		this.disabled_keys = DISABLED_KEYS;
		this.ROW_INDEX_BREAKS = ROW_INDEX_BREAKS;

		this.initListener();
	}
	displayState = false;
	toggle() {
		this.PARENT_ELEMENT.classList.toggle("active");
		this.displayState = !this.displayState;
		if (this.displayState) {
			this.updateKeyPositions();
		}
	}
	show() {
		this.PARENT_ELEMENT.classList.toggle("active", true);
		this.displayState = true;
		if (this.displayState) {
			this.updateKeyPositions();
		}
	}
	hide() {
		this.PARENT_ELEMENT.classList.toggle("active", false);
		this.displayState = false;
	}
	initListener() {
		document.addEventListener("keypress", function (event) {
			this.keypress(event.code.toLowerCase(), event);
		}.bind(this), false);
		document.addEventListener("keydown", function (event) {
			this.keydown(event.code.toLowerCase(), event);
		}.bind(this), false);
		document.addEventListener("keyup", function (event) {
			this.keyup(event.code.toLowerCase());
		}.bind(this));
	}
	pressActions = {};
	downActions = {};
	holdActions = {};
	upActions = {};
	actions = [];
	register(params) {
		if ((params.down === undefined && params.up === undefined) || params.name === undefined) {
			return false;
		}
		// name, downCallback, keycode, upCallback, id
		const newAction = {
			...params,
			idle: false
		};
		newAction.id = newAction.id ? newAction.id : params.name.toLowerCase().replace(/\s/g, '');
		if (params.code) {
			// TODO :: CHECK IF NAME IS IN LOCAL STORAGE KEYCODES, OVERRIDE KEYCODE IF EXISTS
			const keycode = params.code.toLowerCase();
			if (newAction.press) {
				this.pressActions[keycode] = newAction.press;
			}
			if (newAction.down) {
				this.downActions[keycode] = newAction.down;
			}
			if (newAction.hold) {
				this.holdActions[keycode] = newAction.hold;
			}
			if (newAction.up) {
				this.upActions[keycode] = newAction.up;
			}
		} else {
			newAction.idle = true;
		}
		this.generateActionElement(newAction);
		this.updateIdleActions();
		this.actions.push(newAction);
		return true;
	}
	// Translates this action to an available idle key
	updateIdleActions() {
		let idleCount = 0;
		for (let action of this.actions) {
			if (action.idle === true) {
				const idleElement = this.IDLE_ELEMENTS[idleCount];
				this.snapElementToAction(action.element, idleElement);
				idleCount++;
			}
		}
	}
	snapElementToAction(actionElement, targetInfo) {
		targetInfo.element.classList.toggle("occupied", true);
		actionElement.style.top = `${targetInfo.y}px`;
		actionElement.style.left = `${targetInfo.x}px`;
		actionElement.style.width = `${targetInfo.width}px`;
		actionElement.dataset.x = targetInfo.x;
		actionElement.dataset.y = targetInfo.y;
	}
	snapAction(action, code) {
		const targetInfo = this.ACTIVE_ELEMENTS[code];
		if (targetInfo) {
			if (targetInfo.action) {
				targetInfo.action.idle = true;
				delete targetInfo.action.code;
				targetInfo.action = undefined;
				this.updateIdleActions();
			}

			action.code = code;
			if (action.down) {
				this.downActions[code] = action.down;
			}
			if (action.hold) {
				this.holdActions[code] = action.hold;
			}
			if (action.up) {
				this.upActions[code] = action.up;
			}

			targetInfo.action = action;
			this.snapElementToAction(action.element, targetInfo);
			return true;
		}
		return false;
	}
	calculateSnapTarget(action, mouseX, mouseY) {
		// Calculate if we can snap to a nearby active element
		const startingCode = action.code;
		let endCode;

		const active_elements = this.ACTIVE_ELEMENTS;
		const active_keys = Object.keys(active_elements);
		for (let a = 0; a < active_keys.length; a++) {
			const element_key = active_keys[a];
			const actionInfo = active_elements[element_key];

			// If we're <20% away horizontally
			if (actionInfo.x < mouseX && mouseX < (actionInfo.x + actionInfo.width)) {
				if (actionInfo.y < mouseY && mouseY < (actionInfo.y + actionInfo.height)) {
					endCode = element_key;
					break;
				}
			}
		}
		if (endCode) {
			if (startingCode) {
				delete this.downActions[startingCode];
				delete this.holdActions[startingCode];
				delete this.upActions[startingCode];
				delete this.ACTIVE_ELEMENTS[startingCode].action;
			}
			action.idle = false;
			this.snapAction(action, endCode);
			return;
		}

		const idleBounds = this.SPARE_HOTKEYS_ELEMENT.getBoundingClientRect();
		if (action.idle === false) {
			if (idleBounds.x < mouseX && mouseX < (idleBounds.x + idleBounds.width)) {
				if (idleBounds.y < mouseY && mouseY < (idleBounds.y + idleBounds.height)) {
					delete this.downActions[startingCode];
					delete this.holdActions[startingCode];
					delete this.upActions[startingCode];
					delete this.ACTIVE_ELEMENTS[startingCode].action;
					action.idle = true;
					this.updateIdleActions();
					return;
				}
			}
		}

		// Otherwise revert to original position
		const defaultX = action.element.dataset.x;
		const defaultY = action.element.dataset.y;
		action.element.style.top = `${defaultY}px`;
		action.element.style.left = `${defaultX}px`;
	}
	generateActionElement(action) {
		const element = tired.html.create(`<div class="hotkey action"><div class="hotkey-label">${action.name}</div></div>`);
		dragElement(element, function (x, y) {
			this.calculateSnapTarget(action, x, y);
		}.bind(this));
		action.element = element;
		// Try to add to the active section
		if (action.code) {
			const wasAdded = this.snapAction(action, action.code);
			action.idle = !wasAdded;
		}
		this.HOTKEY_ACTIONS.appendChild(action.element);
	}
	releaseAllKeys() {
		for (let down_code in this.downActions) {
			const action = this.downActions[down_code];
			action.keydown = false;
			this.ACTIVE_ELEMENTS[down_code]?.action?.element?.classList.toggle("active", false);
		}
	}
	keypress(code, event) {
		const action = this.pressActions[code];
		if (action) action(event);
	}
	keydown(code, event) {
		const action = this.downActions[code];
		if (action && action.keydown != true) {
			this.ACTIVE_ELEMENTS[code]?.action?.element?.classList.toggle("active", true);
			action.keydown = true;
			action(event);
		}
	}
	keyup(code) {
		// Reset the keydown limiter
		const downAction = this.downActions[code];
		if (downAction) {
			downAction.keydown = false;
		}
		const action = this.upActions[code];
		this.ACTIVE_ELEMENTS[code]?.action?.element?.classList.toggle("active", false);
		if (action) {
			action();
		}
	}
	activateHolds() {
		for (const action_key in this.holdActions) {
			if (this.downActions[action_key].keydown) {
				this.holdActions[action_key]();
			}
		}
	}
	initStyles() {
		// rows contain 14.5x keys
		const rowKeyLen = 14.5;
		const windowWidth = window.videogame.CANVAS_WIDTH;


		let horizontalPadding = 20;
		let fontSize = 9;
		let borderPadding = 5;

		if (windowWidth > 800) {
			horizontalPadding = 40;
			fontSize = 14;
			borderPadding = 10;
		} else if (windowWidth > 700) {
			horizontalPadding = 20;
			fontSize = 12;
			borderPadding = 10;
		} else if (windowWidth > 600) {
			horizontalPadding = 20;
			fontSize = 12;
			borderPadding = 8;
		} else if (windowWidth > 500) {
			horizontalPadding = 20;
			fontSize = 11;
			borderPadding = 6;
		} else if (windowWidth > 400) {
			fontSize = 10;
		}

		// Check screen width to determine baseWidth
		this.BASE_WIDTH = Math.min(Math.floor(((windowWidth - horizontalPadding) / rowKeyLen) * 100) / 100, 60);
		// this.BASE_WIDTH = windowWidth;
		const styles = `
		.hotkey-container {
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			font-size: ${fontSize}px;
			display: none;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			font-family: Helvetica;
		}
		.hotkey-container:before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #000;
			opacity: 0.5;
			z-index: -1;
		}
		.hotkey-container.active {
			display: flex;
		}
		.hotkey-actions {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}
		.hotkeys, .spare-hotkeys {
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: ${borderPadding}px;
			margin: 0 auto;
		}
		.hotkeys:before, .spare-hotkeys:before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #000;
			border-radius: 4px;
			opacity: 0.7;
			z-index: -1;
		}
		.hotkey-container .hotkey-row {
			display: flex;
			background: #aaa;
		}
		.hotkey-container .hotkey {
			position: relative;
			width: ${this.BASE_WIDTH}px;
			height: ${this.BASE_WIDTH}px;
			background: #fff;
			word-wrap: break-word;
		}
		.hotkeys .hotkey.key55 {
			width: ${this.BASE_WIDTH * 5.5}px;
		}
		.hotkeys .hotkey.key25 {
			width: ${this.BASE_WIDTH * 2.5}px;
		}
		.hotkeys .hotkey.key2 {
			width: ${this.BASE_WIDTH * 2}px;
		}
		.hotkeys .hotkey.key15 {
			width: ${this.BASE_WIDTH * 1.5}px;
		}
		.hotkey-container .hotkey:before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border: 1px solid #aaa;
		}
		.hotkeys .hotkey .hotkey-label {
			position: relative;
			z-index: 5;
			padding: 5px;
			font-weight: 700;
			color: #333;
		}
		.hotkey.action {
			position: absolute;
			top: 0;
			left: 0;
			background: #ffae0d;
			color: #fff;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			font-weight: 700;
			font-size: ${fontSize - 2}px;
			text-transform: uppercase;
			z-index: 10;
		}
		.hotkey.action.active {
			background: #ff760d;
		}
		.hotkey-container .hotkey.action:before {
			border-color: #ff9e0d;
		}

		.spare-hotkeys {
			margin-top: ${this.BASE_WIDTH / 8}px;
		}
		.spare-hotkeys .hotkey:before {
			border: 1px solid #000000aa;
		}
		.spare-hotkeys .hotkey {
			background: #aaa;
		}
		`;

		const existingStyles = document.querySelector("#HOTKEY_STYLES");
		if (existingStyles) {
			document.body.removeChild(existingStyles);
		}
		document.body.appendChild(tired.html.create(`<style id="HOTKEY_STYLES">${styles}</style>`))
	}
	getKeyInfo(PRIMARY_KEY) {
		let specialIndex = this.keys_55.indexOf(PRIMARY_KEY);
		let className = "hotkey";
		let keySize = 1;
		if (specialIndex != -1) {
			this.keys_55.splice(specialIndex, 1);
			className += " key55";
			keySize = 5.5;
		} else {
			specialIndex = this.keys_25.indexOf(PRIMARY_KEY);
			if (specialIndex != -1) {
				this.keys_25.splice(specialIndex, 1);
				className += " key25";
				keySize = 2.5;
			} else {
				specialIndex = this.keys_2.indexOf(PRIMARY_KEY);
				if (specialIndex != -1) {
					this.keys_2.splice(specialIndex, 1);
					className += " key2";
					keySize = 2;
				} else {
					specialIndex = this.keys_15.indexOf(PRIMARY_KEY);
					if (specialIndex != -1) {
						this.keys_15.splice(specialIndex, 1);
						className += " key15";
						keySize = 1.5;
					}
				}
			}
		}
		if (this.disabled_keys.indexOf(PRIMARY_KEY) != -1) {
			className += " disabled";
		}
		return [className, keySize];
	}
	generateElement() {
		const fixedEle = tired.html.create(`<div class="hotkey-container noselect"></div>`);
		const containerEle = tired.html.create(`<div class="hotkeys"></div>`);
		const primaryKeyLen = this.primary_keys.length;

		const SEEN_ORIENTATION_KEYS = [];
		let rowEle = tired.html.create(`<div class="hotkey-row"></div>`);
		for (let a = 0; a < primaryKeyLen; a++) {
			const PRIMARY_KEY = this.primary_keys[a];
			const LOWER_KEY = PRIMARY_KEY.toLowerCase();
			const keyInfo = this.getKeyInfo(PRIMARY_KEY);
			const keyClass = keyInfo[0];
			const keySize = keyInfo[1];
			const keyEle = tired.html.create(`<div class="${keyClass}" data-size="${keySize}"><div class="hotkey-label">${PRIMARY_KEY}</div></div>`);
			rowEle.appendChild(keyEle);

			let KEY_CODE = KEY_CODES[LOWER_KEY];
			if (KEY_CODE) {
				// Add left/right for special keys
				if (ORIENTATION_KEYS.indexOf(LOWER_KEY) != -1) {
					const ORIENTATION_SIDE = SEEN_ORIENTATION_KEYS.indexOf(LOWER_KEY) === -1 ? "left" : "right";
					SEEN_ORIENTATION_KEYS.push(LOWER_KEY);
					KEY_CODE += ORIENTATION_SIDE;
				}

				this.ACTIVE_ELEMENTS[KEY_CODE] = {
					element: keyEle
				};
			}

			if (this.ROW_INDEX_BREAKS.indexOf(a) != -1) {
				containerEle.appendChild(rowEle);
				rowEle = tired.html.create(`<div class="hotkey-row"></div>`);
			}
		}


		// Create a tray for unassigned actions
		const actionRows = 3;
		const actionKeyLen = 14;
		const actionContainerEle = tired.html.create(`<div class="spare-hotkeys"></div>`);
		for (let a = 0; a < actionRows; a++) {
			const actionRowEle = tired.html.create(`<div class="hotkey-row"></div>`);
			for (let b = 0; b < actionKeyLen; b++) {
				const idleKey = tired.html.create(`<div class="hotkey spare-hotkey"></div>`);
				actionRowEle.appendChild(idleKey);
				this.IDLE_ELEMENTS.push({
					element: idleKey,
					oversize: 0
				});
			}
			actionContainerEle.appendChild(actionRowEle);
		}


		this.HOTKEY_ACTIONS = tired.html.create(`<div class="hotkey-actions"></div>`);

		fixedEle.appendChild(containerEle);
		fixedEle.appendChild(actionContainerEle);
		fixedEle.appendChild(this.HOTKEY_ACTIONS);
		document.body.appendChild(fixedEle);

		this.updateKeyPositions();

		this.PARENT_ELEMENT = fixedEle;
		this.HOTKEYS_ELEMENT = containerEle;
		this.SPARE_HOTKEYS_ELEMENT = actionContainerEle;
	}
	updateKeyPositions() {
		// Active Blanks
		const active_elements = this.ACTIVE_ELEMENTS;
		for (const element_key in active_elements) {
			const targetEle = active_elements[element_key].element;
			const bounds = targetEle.getBoundingClientRect();
			const widthMultiplier = parseFloat(targetEle.dataset.size) - 1;
			active_elements[element_key].width = bounds.width;
			active_elements[element_key].height = bounds.height;
			active_elements[element_key].x = bounds.x;
			active_elements[element_key].originX = bounds.x + (bounds.width / 2);
			active_elements[element_key].y = bounds.y;
			active_elements[element_key].originY = bounds.y + (bounds.height / 2);
			active_elements[element_key].oversize = widthMultiplier;

			if (active_elements[element_key].action) {
				this.snapElementToAction(active_elements[element_key].action.element, active_elements[element_key]);
			}
		}

		// Idle Blanks
		const idle_elements = this.IDLE_ELEMENTS;
		for (const idle_key of idle_elements) {
			const bounds = idle_key.element.getBoundingClientRect();
			idle_key.width = bounds.width;
			idle_key.height = bounds.height;
			idle_key.x = bounds.x;
			idle_key.y = bounds.y;
		}

		// Registered Keys
	}
}

window.gameInitFunctions["varSetup1"].push(function () {
	window.tired.resize.watch(2);
	window.keyboard = new KeyboardClass();

	keyboard.register({
		name: "Hotkey Editor",
		code: "keyo",
		down: function () {
			window.keyboard.toggle();

			appDisplayKeys.hotkeys.classList.toggle('active', true);
		},
		up: function () {
			appDisplayKeys.hotkeys.classList.toggle('active', false);
		}
	});
});