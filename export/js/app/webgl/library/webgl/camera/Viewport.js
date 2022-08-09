document.exitPointerLock = document.exitPointerLock ||
	document.mozExitPointerLock ||
	document.webkitExitPointerLock;
class ViewportClass {
	cameraPos = [
		13.33995313142832,
		7.465956531269107,
		8.269640630156431
	];
	cameraFront = [
		-0.5913179177292563,
		-0.1598811876918364,
		-0.7904309748451059
	];
	cameraUp = [0, 1, 0];

	cameraSpeed = 0.1;
	cameraSpeedToggles = [0.05, 0.1, 0.3];
	mouseX = -1268;
	mouseY = 92;
	pitch = -9.20000000000009;
	yaw = -126.8;
	direction = [
		-0.5913179177292563,
		-0.1598811876918364,
		-0.7904309748451059
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
	isLocked = false;
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
				window.addEventListener("click", this.requestPointerLock, false);
				const pointerTarget = 'pointerlockchange';
				if ("onmozpointerlockchange" in document) {
					pointerTarget = 'mozpointerlockchange';
				}
				document.addEventListener(pointerTarget, function () {
					if (document.pointerLockElement === null) {
						document.removeEventListener("mousemove", this.mouseMove, false);
					} else {
						document.addEventListener("mousemove", this.mouseMove, false);
					}
				}.bind(this), false);
			} else {
				window.removeEventListener("click", this.requestPointerLock, false);
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
		tired.storage.set("Viewport", saveState);
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
});
window.gameInitFunctions["gameInit1"].push(function () {
	keyboard.register({
		name: "FWD",
		code: "keyw",
		down: function () {
			Viewport.keydown("w");
		},
		up: function () {
			Viewport.keyup("w");
		}
	});
	keyboard.register({
		name: "LEFT",
		code: "keya",
		down: function () {
			Viewport.keydown("a");
		},
		up: function () {
			Viewport.keyup("a");
		}
	});
	keyboard.register({
		name: "BWD",
		code: "keys",
		down: function () {
			Viewport.keydown("s");
		},
		up: function () {
			Viewport.keyup("s");
		}
	});
	keyboard.register({
		name: "RIGHT",
		code: "keyd",
		down: function () {
			Viewport.keydown("d");
		},
		up: function () {
			Viewport.keyup("d");
		}
	});
	keyboard.register({
		name: "Up",
		code: "space",
		down: function () {
			Viewport.keydown("space");
		},
		up: function () {
			Viewport.keyup("space");
		}
	});
	keyboard.register({
		name: "Down",
		code: "shiftleft",
		down: function () {
			Viewport.keydown("shift");
		},
		up: function () {
			Viewport.keyup("shift");
		}
	});
	keyboard.register({
		name: "Camera Speed",
		code: "keyz",
		down: function () {
			const cameraSpeedLen = Viewport.cameraSpeedToggles.length;
			const speedIndex = Viewport.cameraSpeedToggles.indexOf(Viewport.cameraSpeed);
			Viewport.cameraSpeed = Viewport.cameraSpeedToggles[(speedIndex + 1) % cameraSpeedLen];
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