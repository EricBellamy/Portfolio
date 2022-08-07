class LoadingGrid {
	RESOURCES = {};
	RESOURCE_COLORS = {};
	RESOURCE_DATA = {};
	GRID_POINTERS = {};
	constructor(RESOURCES, RESOURCE_COLORS, RESOURCE_DATA) {
		this.RESOURCES = RESOURCES;
		this.RESOURCE_COLORS = RESOURCE_COLORS;
		this.RESOURCE_DATA = RESOURCE_DATA;

		this.generate = this.generate.bind(this);
		this.load = this.load.bind(this);
		this.install = this.install.bind(this);
	}
	// Generates the HTML
	generate() {
		const parent = document.querySelector("#loadingGrid");

		let itemCount = 0;
		let newGridColumn = tired.html.create("<div class='grid-column'></div>");
		for (const RESOURCE_KEY in this.RESOURCES) {
			for (const TARGET_RESOURCE of this.RESOURCES[RESOURCE_KEY]) {
				if (itemCount % 4 === 0) {
					parent.appendChild(newGridColumn);
					newGridColumn = tired.html.create("<div class='grid-column'></div>");
				}
				itemCount++;
				const newGridItem = tired.html.create("<div class='grid-item'></div>");

				newGridColumn.appendChild(newGridItem);
				this.GRID_POINTERS[TARGET_RESOURCE] = newGridItem;
			}
		}
		parent.appendChild(newGridColumn);
	}
	// Starts loading the resources
	load(callback, errors = 0, GRID_POINTERS, RESOURCE_DATA) {
		GRID_POINTERS = this.GRID_POINTERS;
		RESOURCE_DATA = this.RESOURCE_DATA;

		for (const RESOURCE_KEY in this.RESOURCES) {
			for (const TARGET_RESOURCE of this.RESOURCES[RESOURCE_KEY]) {
				switch (RESOURCE_KEY) {
					case "scripts":
					case "styling":
						tired.load(TARGET_RESOURCE, {
							callback: function (color, result) {
								if (result.status) {
									GRID_POINTERS[this].className = "grid-item loaded";
									GRID_POINTERS[this].style.background = `#${color}`;

									delete GRID_POINTERS[this];

									if (Object.keys(GRID_POINTERS).length === 0) {
										return callback(errors);
									}
								} else {
									errors++;
									delete GRID_POINTERS[this];
									if (Object.keys(GRID_POINTERS).length === 0) {
										return callback(errors);
									}
								}
							}.bind(TARGET_RESOURCE, this.RESOURCE_COLORS[RESOURCE_KEY])
						});
						break;
					case "icons":
						LAZY_LOADER.loadSVG(TARGET_RESOURCE, function (RESOURCE_KEY, color, svgEle) {
							GRID_POINTERS[this].className = "grid-item loaded";
							GRID_POINTERS[this].style.background = `#${color}`;

							delete GRID_POINTERS[this];

							RESOURCE_DATA[RESOURCE_KEY][this] = svgEle;

							if (Object.keys(GRID_POINTERS).length === 0) {
								return callback(errors);
							}
						}.bind(TARGET_RESOURCE, RESOURCE_KEY, this.RESOURCE_COLORS[RESOURCE_KEY]));
						break;
				}
			}
		}
	}
	install() {
		const RESOURCE_ICONS = this.RESOURCE_DATA["icons"];
		for (const TARGET_ICON in RESOURCE_ICONS) {
			const foundHTMLTargets = document.querySelectorAll(`div.svg[src="${TARGET_ICON}"]`);
			for (const TARGET_ELE of foundHTMLTargets) {
				LAZY_LOADER.applySVG(TARGET_ELE, RESOURCE_ICONS[TARGET_ICON].cloneNode(true));
			}
		}
	}
}

window.startInitFunctions["preInitEleSetup1"].push(function () {
	window.LoadingGrid = new LoadingGrid(LOAD_RESOURCES, LOAD_RESOURCE_COLORS, LOAD_RESOURCE_DATA);
	window.LoadingGrid.generate();
});
window.startInitFunctions["postInitEleSetup2"].push(function () {
	window.LoadingGrid.load(function () {
		// Install the SVGs
		window.LoadingGrid.install();
		window.loaded();
	})
});