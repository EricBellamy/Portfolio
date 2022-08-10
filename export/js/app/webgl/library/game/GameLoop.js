if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
}
class GameLoopClass {
    state = false;

    // Game Controllers
    GAME = new GameClass();
    RENDER = new RenderClass();
    UI = new UIClass();

    // The last tick time
    last = 0;

    // The delta count for the current second
    fpsFrameTime = 0;
    fps = 0; // The individual frame time for the current second

    // The delta counts for each tick type
    gameFrameTime = 0;
    renderFrameTime = 0;
    uiFrameTime = 0;

    // The minimum delta for each tick type
    gameFrameMinimum = 0;
    renderFrameMinimum = 0;
    uiFrameMinimum = 0;

    gameFps = 1;
    renderFps = 1;
    uiFps = 1;
    constructor() {
        this.start = this.start.bind(this);
        this.run = this.run.bind(this);
        this.next = this.next.bind(this);

        this.gameFrameMinimum = 1000 / this.gameFps; // 20 tps
        this.renderFrameMinimum = 1000 / this.renderFps; // 60 tps
        this.uiFrameMinimum = 1000 / this.uiFps; // 10 tps
    }
    init() {
        this.GAME.init();
        this.RENDER.init();
        this.UI.init();
    }
    start() {
        this.state = true;
        requestAnimationFrame(this.run);
    }
    stop() {
        this.state = false;
    }
    updateTickSpeed(frameType, newTicksPerSecond) {
        if (this[`${frameType}FrameMinimum`] != undefined) {
            this[`${frameType}Fps`] = newTicksPerSecond;
            this[`${frameType}FrameMinimum`] = 1000 / newTicksPerSecond;
        }
    }
    callbacks = [];
    // Registers a state listener that gets passed info about the loop runtime
    register(callback){
        this.callbacks.push(callback);
    }
    next(){
        const callbacks = this.callbacks;
        for(const callback of callbacks){
            callback(this.fps);
        }
    }
    run(now) {
        const frameTime = now - this.last;
        this.last = now;

        this.fpsFrameTime += frameTime;
        if (this.fpsFrameTime > 500) {
            this.fpsFrameTime = 0;
            this.fps = Math.floor(1000 / frameTime);
            this.next();
        }

        const fps = this.fps;

        this.gameFrameTime += frameTime;
        this.renderFrameTime += frameTime;
        this.uiFrameTime += frameTime;

        if (this.gameFrameMinimum < this.gameFrameTime) {
            this.gameFrameTime = 0;
            this.GAME.next();
        }
        if (this.renderFrameMinimum < this.renderFrameTime) {
            this.renderFrameTime = 0;
            this.RENDER.next();
            window.keyboard.activateHolds();
        }
        if (this.uiFrameMinimum < this.uiFrameTime) {
            this.uiFrameTime = 0;
            this.UI.next(fps);
        }

        if (this.state) {
            requestAnimationFrame(this.run);
        }
    }
}
let GameLoop;
window.gameInitFunctions["varSetup1"].push(function () {
    GameLoop = new GameLoopClass();
});