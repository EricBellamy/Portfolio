// Controls all the WebGL rendering
window.RESOLUTION_SCALE = 1;
class RenderClass {
    constructor() {
        this.updateResolution = this.updateResolution.bind(this);
        this.register = this.register.bind(this);
        this.disable = this.disable.bind(this);
        this.enable = this.enable.bind(this);
    }
    // 
    init() {
        this.updateResolution();
    }
    updateResolution(){
        // TODO :: Implement this
        // window.videogame.canvas.width = window.innerWidth * this.RESOLUTION_SCALE;
        // window.videogame.canvas.height = window.innerHeight * this.RESOLUTION_SCALE;
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

window.gameInitFunctions["preInitEleSetup1"].push(function () {
    window.videogame = {};
    window.videogame.canvas = document.getElementById('webgl-game');
});