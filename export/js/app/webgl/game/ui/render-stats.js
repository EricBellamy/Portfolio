let pointerEles = [];
let fpsCounters = [];
window.gameInitFunctions["postInitEleSetup1"].push(function () {
    pointerEles = document.querySelectorAll('.pointer-lock');
    fpsCounters = document.querySelectorAll('.fps-counter');
    GameLoop.register(function(fps){
        const renderFps = Math.min(fps, GameLoop.renderFps);
        for(const fpsCounter of fpsCounters){
            fpsCounter.innerText = renderFps;
        }

        let pointerString = "LOCKED";
        if (document.pointerLockElement === null) {
            pointerString = "";
        }
        for(const pointerEle of pointerEles){
            pointerEle.innerText = pointerString;
        }
    });
});