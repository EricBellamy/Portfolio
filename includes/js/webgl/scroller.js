// scroll-checkpoint
class BlockScroller {
	ELEMENT_HEIGHT = window.innerHeight;
	constructor(startCheckpoint, endCheckpoint) {
		this.startCheckpoint = startCheckpoint;
		this.endCheckpoint = endCheckpoint;

		this.resize();
	}

	updateProfessionalColor() {
		window.BlockScrollEngine.updateStartColor([...window.hexToRgb(PROFESSIONAL_ITEM.color), 1]);
		window.BlockScrollEngine.updateEndColor([...window.hexToRgb(NEXT_PROFESSIONAL_ITEM.color), 1]);
		window.BlockScrollEngine.updateClearColor([...window.hexToRgb(NEXT_PROFESSIONAL_ITEM.color), 1]);
	}
	updateProfessionalIndex(NEW_INDEX) {
		if (PROFESSIONAL_ITEM_INDEX != NEW_INDEX) {
			if (0 <= NEW_INDEX && NEW_INDEX < professionalItems.length) {
				PROFESSIONAL_ITEM_INDEX = NEW_INDEX;
				PROFESSIONAL_ITEM = professionalItems[PROFESSIONAL_ITEM_INDEX];
				if (NEW_INDEX != professionalItems.length - 1) NEXT_PROFESSIONAL_ITEM = professionalItems[PROFESSIONAL_ITEM_INDEX + 1];
				else NEXT_PROFESSIONAL_ITEM = professionalItems[PROFESSIONAL_ITEM_INDEX];
				this.updateProfessionalColor();
			}
		}
	}

	resize(){
		this.updateProfessionalIndex(0);

		this.active(0);
	}

	LAST_DIFF = -1;
	update() {
		const diff = Math.max(0, window.scrollY - this.startCheckpoint.top);
		if (diff != this.LAST_DIFF) {
			this.LAST_DIFF = diff;
			this.active(diff);
		}
	}
	active(scrollPixels) {
		const professionalProgress = scrollPixels / this.ELEMENT_HEIGHT;
		const professionalIndex = Math.min(professionalItems.length - 1, Math.floor(professionalProgress));

		// Update the professional item
		this.updateProfessionalIndex(professionalIndex);

		const normalizedDiff = professionalProgress - professionalIndex;
		const scrollProgress = window.squareRows * normalizedDiff;

		window.BlockScrollEngine.program.updateProgress(scrollProgress);
		window.BlockScrollEngine.program.draw();
	}
}

// Personal Elements


let PROFESSIONAL_ITEM_INDEX;
let PROFESSIONAL_ITEM, NEXT_PROFESSIONAL_ITEM;
const professionalItems = [
	{
		color: "111",
		// color: "d6bc7a",
		date: "2022 - Present",
		title: "Tipsybartender",
		description: "Taking over tipsy was an unexpected dream. It's been an interesting journey in learning how to manage a website revolving around search traffic.",
		src: "tipsybartender.png"
	},
	{
		color: "242335",
		date: "2019 - 2021",
		title: "Tipsybartender",
		description: "Brought on to help overhaul their website design, kept on to make general updates. Recently helped migrate the frontend to Gatsby.",
		src: "tipsybartender.png"
	},
	{
		color: "1A78BC",
		date: "2020",
		title: "FBE Superfam",
		description: "A patreon like tiered subscription service created for the React Social Media group.",
		src: "fbesuperfam.png"
	},
	{
		color: "202020",
		date: "2020",
		title: "Oscar Akermo",
		description: "A tattoo course web product. The goal was to create an optimal frontend pair with facebook ads as the primary traffic source.",
		src: "oscarakermo.png"
	},
	{
		color: "111111",
		date: "2020",
		title: "Tipsy Exclusive",
		description: "A subscription product created for the tipsybartender social media group.",
		src: "tipsyexclusive.png"
	},
]

function initBlockScroller() {
	window.BlockScrollEngine = new BlockScrollerEngine(document.querySelector("canvas#scroller"));

	window.blockScroller = new BlockScroller(window.scrollManager.getCheckpoint(0), window.scrollManager.getCheckpoint(1));

	// document.addEventListener("scroll", tired.debounce(function () {
	// 	window.blockScroller.update();
	// }, 1000 / 60, {
	// 	leading: true,
	// 	maxWait: 1000 / 60
	// }));
}
initBlockScroller();