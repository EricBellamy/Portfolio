window.tired.element = {
	inView: function(ele){
		const bounds = ele.getBoundingClientRect();
		const windowHeight = window.innerHeight;

		// If below
		return bounds.top < windowHeight && 0 < bounds.top + bounds.height;
	}
}