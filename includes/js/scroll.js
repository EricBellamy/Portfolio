const debouncedDisablePointerLock = window.tired.debounce(function(){
	window.disablingPointerLock = true;
	document.exitPointerLock();
}, 500);
const lowPerformanceScroll = window.tired.debounce(function(){
	if(!window.disablingPointerLock && document.pointerLockElement != null) {
		debouncedDisablePointerLock();
	}

	// Check if heavy things are in view
	if(window.videogame && window.videogame.canvas){
		const inView = window.tired.element.inView(window.videogame.canvas);
		// Check if canvas is in screen
		if(inView && !GameLoop.state && inView) {
			GameLoop.start();
		} else if(!inView && GameLoop.state) {
			GameLoop.stop();
		}
	}
}, 100, {
	maxWait: 100
});

window.addEventListener("scroll", lowPerformanceScroll);