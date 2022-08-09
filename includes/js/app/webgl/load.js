window.startInitFunctions = {
	"varSetup1": [],
	"varSetup2": [],
	"preInitEleSetup1": [],
	"preInitEleSetup2": [],
	"gameInit1": [],
	"gameInit2": [],
	"postInitEleSetup1": [],
	"postInitEleSetup2": [],
};
window.gameInitFunctions = {
	"varSetup1": [],
	"varSetup2": [],
	"preInitEleSetup1": [],
	"preInitEleSetup2": [],
	"gameInit1": [],
	"gameInit2": [],
	"postInitEleSetup1": [],
	"postInitEleSetup2": [],
};

window.runFunctions = function (baseName, baseFunctionsName = "gameInitFunctions") {
	let functions, functionLen;
	const baseFunctions = window[baseFunctionsName];
	functions = baseFunctions[`${baseName}1`];
	for (let subFunction of functions) {
		subFunction();
	}

	functions = baseFunctions[`${baseName}2`];
	for (let subFunction of functions) {
		subFunction();
	}
}
window.runStartFunctions = function (baseName) {
	window.runFunctions(baseName, "startInitFunctions");
}
window.runGameFunctions = function (baseName) {
	window.runFunctions(baseName, "gameInitFunctions");
}

// This is called once the resources are ready
window.start = async function () {
	// GameLoop.measuredRefreshRate = 60;
	// await GameLoop.asyncMeasureRefreshRate();
	GameLoop.start();
}

window.loaded = async function () {
	window.runGameFunctions("varSetup");
	window.runGameFunctions("preInitEleSetup");
	window.runGameFunctions("gameInit");
	window.runGameFunctions("postInitEleSetup");

	GameLoop.init();
	window.start();
}

function immediate(count = 0, maxCount = 1) {
	tired.load([
		"./js/app/webgl/LoadFiles.js",
		"./js/app/webgl/LoadingGrid.js"
	], {
		callback: function () {
			window.runStartFunctions("varSetup");
			window.runStartFunctions("preInitEleSetup");
			window.runStartFunctions("gameInit");
			window.runStartFunctions("postInitEleSetup");

			count++;
		}
	});
}

immediate();