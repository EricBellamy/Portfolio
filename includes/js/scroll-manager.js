class ScrollManager {
	checkpointTops = [];
	checkpointHeights = [];
	count = 0;
	constructor(){
		this.updateCheckpoints();
	}
	updateCheckpoints(){
		this.checkpoints = document.querySelectorAll(".scroll-checkpoint");

		const tops = [];
		for(const checkpoint of this.checkpoints){
			this.updateCheckpointBounds(checkpoint);
			tops.push(checkpoint.top);
		}
		this.checkpointTops = tops;
		this.checkpointTopsLen = this.checkpointTops.length;

		const heights = [];
		let lastVal = 0;
		for(const top of tops){
			heights.push(top - lastVal);
			lastVal = top;
		}
		heights.push(document.body.scrollHeight - lastVal);
		this.count = heights.length;
		this.checkpointHeights = heights;
	}
	updateCheckpointBounds(checkpoint) {
		checkpoint.bounds = checkpoint.getBoundingClientRect();
		checkpoint.top = window.scrollY + checkpoint.bounds.y;
	}
	getCheckpointHeight(checkpointIndex){
		return this.checkpointHeights[checkpointIndex];
	}
	getCheckpointIndex(scrollValue){
		for(let a = this.checkpointTopsLen - 1; 0 <= a; a--){
			if(this.checkpointTops[a] < scrollValue) return a + 1;
		}
		return 0;
	}
	getCheckpoint(checkpointIndex){
		return this.checkpoints[checkpointIndex];
	}
	getCount(){
		return this.count;
	}
}

window.scrollManager = new ScrollManager();