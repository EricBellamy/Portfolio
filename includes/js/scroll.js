const debouncedDisablePointerLock = window.tired.debounce(function () {
	window.disablingPointerLock = true;
	document.exitPointerLock();
}, 500);
const lowPerformanceScroll = window.tired.debounce(function () {
	if (!window.disablingPointerLock && document.pointerLockElement != null) {
		debouncedDisablePointerLock();
	}

	// Check if heavy things are in view
	if (window.videogame && window.videogame.canvas) {
		const inView = window.tired.element.inView(window.videogame.canvas);
		// Check if canvas is in screen
		if (inView && !GameLoop.state && inView) {
			GameLoop.start();
		} else if (!inView && GameLoop.state) {
			GameLoop.stop();
		}
	}
}, 100, {
	maxWait: 100
});

const introSection = document.querySelector("#intro");
const contactSection = document.querySelector("#contact");
const quoteEle = document.querySelector("#quote");

const windowHeight = window.innerHeight;
let LAST_PAGE_SECTION = -1;
const highPerformanceScroll = window.tired.debounce(function () {
	let pageSection = 0;

	pageSection = window.scrollManager.getCheckpointIndex(window.scrollY);

	// console.log("LAST PAGE SECTION: " + LAST_PAGE_SECTION);
	// console.log("THE PAGE SECTION: " + pageSection);

	if (window.distortionScroller) {
		switch (pageSection) {
			case 0:
				if (LAST_PAGE_SECTION != 0) {
					if(LAST_PAGE_SECTION != -1){
						window.distortionScroller._amount = 1;
						window.distortionScroller._cutOff = 1;
					}

					console.log("UPDATE DISTORTION MODE 0");
					updateDistortionMode(0);

					window.distortionScroller.start();

					window.BlockScrollEngine.show();
					window.blockScroller.update();

					introSection.style.opacity = 1;
				}

				// Start of page
				break;
			case 1:
				if (LAST_PAGE_SECTION != 1) {
					console.log("1 :: UPDATING DISTORTION SCROLL");
					window.distortionScroller._amount = 1;
					window.distortionScroller._cutOff = 1;

					window.distortionScroller._renderLogic("scroll.js-1");
					window.distortionScroller.stop();

					// Make sure the block scroller is showing
					window.BlockScrollEngine.show();

					introSection.style.opacity = 0;
				}

				// Professional items
				window.blockScroller.update();
				break;
			case 2:
				if (LAST_PAGE_SECTION != 2) {
					window.BlockScrollEngine.hide();
					window.blockScroller.update();

					if (LAST_PAGE_SECTION != 3) {
						updateDistortionMode(1);

						window.distortionScroller._amount = 0;
						window.distortionScroller._cutOff = 0;
						window.distortionScroller._renderLogic("scroll.js-2");
					}

					window.distortionScroller.start();

					introSection.style.opacity = 1;
				}

				// console.log("STARTING!");
				// Personal items
				break;
			case 3:
				// Contact
				// updateDistortionMode(1);
				// window.distortionScroller.start();

				if (LAST_PAGE_SECTION === -1) {
					console.log("UPDATE DISTORTION MODE 3");
					updateDistortionMode(1);

					window.distortionScroller._amount = 1;
					window.distortionScroller._cutOff = 1;
					window.BlockScrollEngine.hide();

					window.distortionScroller._renderLogic("scroll.js-3");
					window.distortionScroller.start();
				}

				break;
		}
		LAST_PAGE_SECTION = pageSection;
	}
}, 16, {
	leading: true,
	maxWait: 16
});
window.addEventListener("scroll", function () {
	lowPerformanceScroll();
	highPerformanceScroll();
});