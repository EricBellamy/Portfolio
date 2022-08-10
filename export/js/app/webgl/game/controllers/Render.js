// Controls all the WebGL rendering
window.RESOLUTION_SCALE = 1;
class RenderClass {
    constructor() {
        this.register = this.register.bind(this);
        this.disable = this.disable.bind(this);
        this.enable = this.enable.bind(this);
    }
    // 
    init() {
		
    }

    callbacks = {}
    callbackStates = {};
    callbackKeys = [];
    register(id, callback){
        if(this.callbacks[id] === undefined){
            this.callbacks[id] = callback;
            this.callbackStates[id] = true;
            this.callbackKeys = Object.keys(this.callbackStates);
        }
    }
    // Enables a registered callback
    enable(id){
        if(this.callbackStates[id]){
            this.callbackStates[id] = true;
        }
    }
    // Disables a registered callback
    disable(id){
        if(this.callbackStates[id]){
            this.callbackStates[id] = false;
        }
    }
    // Called whenever a game tick occurs
    next() {
        Viewport.next();

        // Run the render hooks
        const callbacks = this.callbacks;
        const callbackStates = this.callbackStates;
        const keys = this.callbackKeys;
        for(const key of keys){
            if(callbackStates[key] === true){
                callbacks[key]();
            }
        }
    }
}

window.videogame = {};
window.videogame.canvas = document.getElementById('webgl-game');
const CANVAS_BOUNDS = window.videogame.canvas.getBoundingClientRect();
window.videogame.CANVAS_WIDTH = CANVAS_BOUNDS.width;
window.videogame.CANVAS_HEIGHT = CANVAS_BOUNDS.height;
window.gameInitFunctions["preInitEleSetup1"].push(function () {
    
});