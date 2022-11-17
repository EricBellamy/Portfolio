document.exitPointerLock = document.exitPointerLock ||
	document.mozExitPointerLock ||
	document.webkitExitPointerLock;

window.disablingPointerLock = false;
class ViewportClass {
	cameraPos = [
		12.232431917267435,
			5.687726473508779,
			5.216216950296382
	];
	cameraFront = [
		-0.6793095686370961,
			-0.13744454603714829,
			-0.7208658035464885
	];
	cameraUp = [0, 1, 0];

	cameraSpeed = 0.1;
	cameraSpeedToggles = [0.05, 0.1, 0.3];
	mouseX = -1333;
	mouseY = 79;
	pitch = -7.900000000000094;
	yaw = -133.30000000000157;
	direction = [
		-0.6793095686370961,
			-0.13744454603714829,
			-0.7208658035464885
	];

	// Mouse sensitivity
	sensitivity = 0.1;

	keydowns = [];
	hasKeys = false;

	pointerLock = false;
	mouseListeners = [];
	positionListeners = [];
	onMouseMove(callback) {
		this.mouseListeners.push(callback);
	}
	onPlayerMove(callback) {
		this.positionListeners.push(callback);
	}
	lastXChange = 1;
	lastYChange = 1;
	mouseMove(event) {
		// Try to stop jerky (unintentional) input events
		// Input can't be more than 10x the previous input
		let xchange, ychange;
		if (event.movementX < 0) {
			xchange = Math.max(event.movementX, Math.abs(this.lastXChange * 20) * -1);
		} else {
			xchange = Math.min(event.movementX, Math.abs(this.lastXChange * 20));
		}
		if (event.movementY < 0) {
			ychange = Math.max(event.movementY, Math.abs(this.lastYChange * 20) * -1);
		} else {
			ychange = Math.min(event.movementY, Math.abs(this.lastYChange * 20));
		}

		this.lastXChange = xchange != 0 ? xchange : 1;
		this.lastYChange = ychange != 0 ? ychange : 1;

		this.mouseX += xchange;
		this.mouseY += ychange;

		this.yaw += xchange * this.sensitivity;
		this.pitch -= ychange * this.sensitivity;

		this.updateCamera();
	}
	updateCamera() {
		// Prevent up/down view from going full circle
		if (this.pitch > 89)
			this.pitch = 89;
		if (this.pitch < -89)
			this.pitch = -89;

		this.direction[0] = Math.cos(radians(this.yaw)) * Math.cos(radians(this.pitch));
		this.direction[1] = Math.sin(radians(this.pitch));
		this.direction[2] = Math.sin(radians(this.yaw)) * Math.cos(radians(this.pitch));
		this.cameraFront = vec3.normalize(this.direction);

		const callbacks = this.mouseListeners;
		for (const callback of callbacks) {
			callback();
		}
	}
	isLocked() {
		return document.pointerLockElement != null;
	}
	requestPointerLock() {
		if (document.pointerLockElement === null) {
			const canvas = window.videogame.canvas;
			canvas.requestPointerLock = canvas.requestPointerLock ||
				canvas.mozRequestPointerLock ||
				canvas.webkitRequestPointerLock;
			canvas.requestPointerLock();
		}
	};
	lockPointer(status = true) {
		if (status != this.pointerLock) {
			// Enable pointer lock
			if (status) {
				window.videogame.canvas.addEventListener("click", this.requestPointerLock, false);
				const pointerTarget = 'pointerlockchange';
				if ("onmozpointerlockchange" in document) {
					pointerTarget = 'mozpointerlockchange';
				}
				document.addEventListener(pointerTarget, function () {
					if (document.pointerLockElement === null) {
						GameLoop.updateTickSpeed("render", 1);
						document.removeEventListener("mousemove", this.mouseMove, false);
					} else {
						window.disablingPointerLock = false;
						GameLoop.updateTickSpeed("render", 60);
						document.addEventListener("mousemove", this.mouseMove, false);
					}
				}.bind(this), false);
			} else {
				windwindow.videogame.canvasow.removeEventListener("click", this.requestPointerLock, false);
				document.exitPointerLock();
			}
		}
	}

	constructor() {
		this.keydown = this.keydown.bind(this);
		this.keyup = this.keyup.bind(this);

		this.lockPointer = this.lockPointer.bind(this);
		this.requestPointerLock = this.requestPointerLock.bind(this);
		this.mouseMove = this.mouseMove.bind(this);

		this.onMouseMove = this.onMouseMove.bind(this);
		this.onPlayerMove = this.onPlayerMove.bind(this);

		// Load the local storage
		this.load();

		this.updateCamera();
	}
	getCenter() {
		return [this.cameraPos[0] + this.cameraFront[0], this.cameraPos[1] + this.cameraFront[1], this.cameraPos[2] + this.cameraFront[2]];
	}
	calculateCenter(cameraPos, cameraFront) {
		return [cameraPos[0] + cameraFront[0], cameraPos[1] + cameraFront[1], cameraPos[2] + cameraFront[2]];
	}
	// Saves the state to local storage
	save() {
		const saveState = {
			cameraPos: this.cameraPos,
			cameraFront: this.cameraFront,
			cameraSpeed: this.cameraSpeed,
			cameraSpeedToggles: this.cameraSpeedToggles,
			mouseX: this.mouseX,
			mouseY: this.mouseY,
			pitch: this.pitch,
			yaw: this.yaw,
			direction: this.direction,
		}
		console.log(saveState);
		// tired.storage.set("Viewport", saveState);
	}
	load() {
		let saveState = tired.storage.get("Viewport");
		if (saveState) {
			saveState = JSON.parse(saveState);
			for (const saveKey in saveState) {
				if (this[saveKey] != undefined) {
					this[saveKey] = saveState[saveKey];
				}
			}
		}
	}
	// forwards, right, backwards, left
	// 0 -> 3
	keydown(keycode) {
		this.keydowns.push(keycode);
		this.hasKeys = true;
	}
	keyup(keycode) {
		const keyIndex = this.keydowns.indexOf(keycode);
		if (keyIndex != -1) {
			this.keydowns.splice(keyIndex, 1);
			if (this.keydowns.length === 0) {
				this.hasKeys = false;
			}
		}
	}
	// Called inside of render loop
	next() {
		if (this.hasKeys) {
			const movementSpeed = this.cameraSpeed;
			const cameraFront = this.cameraFront;
			const cameraUp = this.cameraUp;

			let posUpdate = false;
			const keys = this.keydowns;
			for (const key of keys) {
				switch (key) {
					case "w":
						this.cameraPos = vec3.add(this.cameraPos, vec3.multiplyInt(movementSpeed, cameraFront));
						posUpdate = true;
						break;
					case "a":
						this.cameraPos = vec3.subtract(this.cameraPos, vec3.multiplyInt(movementSpeed, vec3.normalize(vec3.cross(cameraFront, cameraUp))));
						posUpdate = true;
						break;
					case "s":
						this.cameraPos = vec3.subtract(this.cameraPos, vec3.multiplyInt(movementSpeed, cameraFront));
						posUpdate = true;
						break;
					case "d":
						this.cameraPos = vec3.add(this.cameraPos, vec3.multiplyInt(movementSpeed, vec3.normalize(vec3.cross(cameraFront, cameraUp))));
						posUpdate = true;
						break;
					case "shift":
						this.cameraPos[1] -= movementSpeed;
						posUpdate = true;
						break;
					case "space":
						this.cameraPos[1] += movementSpeed;
						posUpdate = true;
						break;
				}
			}

			if (posUpdate) {
				const callbacks = this.positionListeners;
				for (const callback of callbacks) {
					callback();
				}
			}
		}
	}
}
window.gameInitFunctions["varSetup1"].push(function () {
	window.Viewport = new ViewportClass();
	Viewport.lockPointer();

	Viewport.requestPointerLock();
});


const appDisplayKeys = {
	fwd: document.querySelector('.key[data-value="w"]'),
	bwd: document.querySelector('.key[data-value="s"]'),
	left: document.querySelector('.key[data-value="a"]'),
	right: document.querySelector('.key[data-value="d"]'),
	up: document.querySelector('.key[data-value="space"]'),
	down: document.querySelector('.key[data-value="shift"]'),
	sunleft: document.querySelector('.key[data-value="<"]'),
	sunright: document.querySelector('.key[data-value=">"]'),
	hotkeys: document.querySelector('.key[data-value="o"]'),

	one: document.querySelector('.key[data-value="1"]'),
	two: document.querySelector('.key[data-value="2"]'),
	three: document.querySelector('.key[data-value="3"]'),
	four: document.querySelector('.key[data-value="4"]'),
	five: document.querySelector('.key[data-value="5"]'),
	six: document.querySelector('.key[data-value="6"]'),
};
let currentIndex = 1;
function toggleSceneKey(index, newValue = true) {
	if (newValue) {
		toggleSceneKey(currentIndex, false);
		currentIndex = index;
	}

	if (index === 1) appDisplayKeys.one.classList.toggle('active', newValue);
	else if (index === 2) appDisplayKeys.two.classList.toggle('active', newValue);
	else if (index === 3) appDisplayKeys.three.classList.toggle('active', newValue);
	else if (index === 4) appDisplayKeys.four.classList.toggle('active', newValue);
	else if (index === 5) appDisplayKeys.five.classList.toggle('active', newValue);
	else if (index === 6) appDisplayKeys.six.classList.toggle('active', newValue);
}
toggleSceneKey(1);


window.gameInitFunctions["gameInit1"].push(function () {
	keyboard.register({
		name: "FWD",
		code: "keyw",
		down: function () {
			if (Viewport.isLocked()) {
				Viewport.keydown("w");
				appDisplayKeys.fwd.classList.toggle('active', true);
			}
		},
		up: function () {
			Viewport.keyup("w");
			appDisplayKeys.fwd.classList.toggle('active', false);
		}
	});
	keyboard.register({
		name: "LEFT",
		code: "keya",
		down: function () {
			if (Viewport.isLocked()) {
				Viewport.keydown("a");
				appDisplayKeys.left.classList.toggle('active', true);
			}
		},
		up: function () {
			Viewport.keyup("a");
			appDisplayKeys.left.classList.toggle('active', false);
		}
	});
	keyboard.register({
		name: "BWD",
		code: "keys",
		down: function () {
			if (Viewport.isLocked()) {
				Viewport.keydown("s");
				appDisplayKeys.bwd.classList.toggle('active', true);
			}
		},
		up: function () {
			Viewport.keyup("s");
			appDisplayKeys.bwd.classList.toggle('active', false);
		}
	});
	keyboard.register({
		name: "RIGHT",
		code: "keyd",
		down: function () {
			if (Viewport.isLocked()) {
				Viewport.keydown("d");
				appDisplayKeys.right.classList.toggle('active', true);
			}
		},
		up: function () {
			Viewport.keyup("d");
			appDisplayKeys.right.classList.toggle('active', false);
		}
	});
	keyboard.register({
		name: "Up",
		code: "space",
		press: function (event) {
			if (Viewport.isLocked()) {
				event.preventDefault();
			}
		},
		down: function (event) {
			if (Viewport.isLocked()) {
				Viewport.keydown("space");
				appDisplayKeys.up.classList.toggle('active', true);

				// If we're pointer locked
				event.preventDefault();
			}
		},
		up: function () {
			Viewport.keyup("space");
			appDisplayKeys.up.classList.toggle('active', false);
		}
	});
	keyboard.register({
		name: "Down",
		code: "shiftleft",
		down: function () {
			if (Viewport.isLocked()) {
				Viewport.keydown("shift");
				appDisplayKeys.down.classList.toggle('active', true);
			}
		},
		up: function () {
			Viewport.keyup("shift");
			appDisplayKeys.down.classList.toggle('active', false);
		}
	});
	keyboard.register({
		name: "Camera Speed",
		code: "keyz",
		down: function () {
			if (Viewport.isLocked()) {
				const cameraSpeedLen = Viewport.cameraSpeedToggles.length;
				const speedIndex = Viewport.cameraSpeedToggles.indexOf(Viewport.cameraSpeed);
				Viewport.cameraSpeed = Viewport.cameraSpeedToggles[(speedIndex + 1) % cameraSpeedLen];
			}
		}
	});
	keyboard.register({
		name: "Save Camera",
		code: "keyp",
		down: function () {
			Viewport.save();
		}
	});
});