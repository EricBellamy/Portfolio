function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}

let DRAW_FRAME = 0;
class Engine {
    canvas = false;
    gl = false;
    GL_CLEARBIT;
    CLEAR_RGB = [0, 0, 0];
    LIGHT_RGB = [1, 1, 1];
    // sunshaft
    RENDER_MODE = "reflections";
    DEBUG_MIP_LEVEL = 0;

    constructor() {
        const loadedGL = this.initContext();
        if (!loadedGL) {
            throw new Error("Your browser does not support WebGL");
        }

        this.draw = this.draw.bind(this);

        this.initGlConfig();
        this.setViewportRatio(1);

        this.program = window.program;
        this.world = new WorldManager(this.gl, this.ext);
        this.world.size(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        this.program.setup(this, this.world, this.gl);
        this.program.mode(this.RENDER_MODE);
        // this.program.render();
    }
    initContext() {
        this.canvas = window.videogame.canvas;
        this.CANVAS_WIDTH = window.innerWidth * window.RESOLUTION_SCALE;
        // this.CANVAS_HEIGHT = window.innerHeight * 0.5;
		this.CANVAS_HEIGHT = this.CANVAS_WIDTH * 0.5625;
		
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        // , stencil: true
        this.gl = this.canvas.getContext('webgl', { alpha: false, premultipliedAlpha: false, stencil: true });

        if (!this.gl) {
            return false;
        }
        this.gl.viewport(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

        this.ext = this.gl.getExtension('ANGLE_instanced_arrays');
        if (!this.ext) {
            console.log("Browser does not support ANGLE_instanced_arrays");
            return false;
        }
        return true;
    }
    initGlConfig() {
        const gl = this.gl;
        this.GL_CLEARBIT = gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT;
        gl.clearColor(...this.CLEAR_RGB, 1.0);
        // gl.colorMask(true, true, true, false);
        gl.clear(this.GL_CLEARBIT);
        gl.enable(this.gl.DEPTH_TEST); //Combined with below does back faced culling relatively efficiently

        gl.enable(gl.STENCIL_TEST);
        gl.stencilOp(
            gl.KEEP,     // what to do if the stencil test fails
            gl.KEEP,     // what to do if the depth test fails
            gl.REPLACE,  // what to do if both tests pass
        );
        // Everything should pass
        gl.stencilFunc(
            gl.ALWAYS,    // the test
            1,            // reference value
            0xFF,         // mask
        );
        gl.stencilMask(0xFF);


        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Default is CCW && gl.FRONT
        gl.enable(this.gl.CULL_FACE);
        this.toggleFrontFace(false);
    }

    // WebGL doesn't have border drawing so let's just swap the front face and reveal the faces that should be culled.
    frontFace = false;
    toggleFrontFace(frontFace) {
        this.frontFace = frontFace != undefined ? frontFace : this.frontFace;
        if (this.frontFace) {
            this.frontFace = false;
            this.gl.frontFace(this.gl.CW);
        } else {
            this.frontFace = true;
            this.gl.frontFace(this.gl.CCW);
        }
    }
    setViewportRatio(ratio = 1) {
        const newWidth = (window.innerWidth * RESOLUTION_SCALE) * ratio;
        // const newHeight = (window.innerHeight * 0.5) * ratio;
		const newHeight = newWidth * 0.5625;

        this.CANVAS_WIDTH = newWidth;
        this.CANVAS_HEIGHT = newHeight;
        this.gl.viewport(0, 0, newWidth, newHeight);
    }
    setViewportSize(dims) {
        // console.log(`[SETTING] WIDTH: ${dims[0]}, HEIGHT: ${dims[1]}`);
        this.CANVAS_WIDTH = dims[0];
        this.CANVAS_HEIGHT = dims[1];
        this.gl.viewport(0, 0, dims[0], dims[1]);
    }
    programMode(newMode) {
        this.RENDER_MODE = newMode;
    }
    draw() {
        DRAW_FRAME++;
        const gl = this.gl;
        if (this.RENDER_MODE != this.program.RENDER_MODE) {
            this.program.mode(this.RENDER_MODE);
        }
        // if(DRAW_FRAME === 1){
        //     this.program.render();
        // }
        this.program.render();
    }
}

window.gameInitFunctions["gameInit2"].push(function () {
    window.program = new ProgramManager();
    window.program.register("scene", { scene: { params: [0, false] } });
    window.program.register("hdr", { scene: { params: [1, true] }, hdr: { params: [0, false] } });
    window.program.register("bloom", {
        scene: {
            params: [1, true],
        },
        hdr: {
            params: [1, true, 0.5]
        },
        cod_downsample: {
            params: [2, false, 0.25, true],
            links: ["hdr"]
        },
        cod_upsample: {
            params: [1, false, 0.25, true],
            links: ["hdr", "cod_downsample"]
        },
        blend: {
            params: [],
            links: ["scene", "cod_upsample"]
        }
    });
    window.program.register("sunshaft", {
        scene: {
            params: [1, true],
        },
        hdr: {
            params: [1, true, 0.5]
        },
        sunhdr: {
            params: [1, true, 0.5]
        },
        sunshaft: {
            params: [1, true, 0.5],
            links: ["sunhdr"]
        },
        cod_downsample: {
            params: [2, false, 0.25, true],
            links: ["hdr"]
        },
        cod_upsample: {
            params: [1, false, 0.25, true],
            links: ["hdr", "cod_downsample"]
        },
        sunblend: {
            params: [1, false, 0.5],
            links: ["cod_upsample", "sunshaft"]
        },
        blend: {
            params: [],
            links: ["scene", { input: { base: "sunblend" }, output: { base: "cod_upsample" } }]
        }
    });

    window.program.register("reflections", {
        scene: {
            params: [1, true],
        },
        hdr: {
            params: [1, true, 0.5]
        },
        sunhdr: {
            params: [1, true, 0.5]
        },
        reflection: {
            params: [1, true, 0.25]
        },
        waterhdr: {
            params: [1, true, 1.0],
            links: ["reflection"]
        },
        sunshaft: {
            params: [1, true, 0.5],
            links: ["sunhdr"]
        },
        cod_downsample: {
            params: [2, false, 0.25, true],
            links: ["hdr"]
        },
        cod_upsample: {
            params: [1, false, 0.25, true],
            links: ["hdr", "cod_downsample"]
        },
        sunblend: {
            params: [1, false, 0.5],
            links: ["cod_upsample", "sunshaft"]
        },
        blend: {
            params: [],
            links: ["scene", "waterhdr", { input: { base: "sunblend" }, output: { base: "cod_upsample" } }]
        }
    });

    window.program.register("gaussian_bloom", {
        scene: {
            params: [1, true],
        },
        hdr: {
            params: [1, true, 0.5]
        },
        gaussian_bloom: {
            params: [2, false, 0.5],
            links: ["hdr"]
        },
        blend: {
            params: [],
            links: ["scene", { input: { base: "gaussian_bloom", index: 1 }, output: { base: "cod_upsample" } }]
        }
    });
    window.program.register("debug_downsample", {
        scene: {
            params: [1, true],
        },
        hdr: {
            params: [1, true, 0.5]
        },
        cod_downsample: {
            params: [2, false, 0.25, true],
            links: ["hdr"]
        },
        debug_mip: {
            params: [0, false],
            links: [{ input: { base: "cod_downsample", index: 1 }, output: { base: "debug_texture" } }]
        },
    });
    window.program.register("debug_upsample", {
        scene: {
            params: [1, true],
        },
        hdr: {
            params: [1, true, 0.5]
        },
        cod_downsample: {
            params: [2, false, 0.25, true],
            links: ["hdr"]
        },
        cod_upsample: {
            params: [1, false, 0.25, true],
            links: ["hdr", "cod_downsample"]
        },
        debug_mip: {
            params: [0, false],
            links: [{ input: { base: "cod_upsample" }, output: { base: "debug_texture" } }]
        },
    });
    window.program.load(function () {
        window.engine = new Engine(false);
        GameLoop.RENDER.register("webgl", window.engine.draw);
    });

    keyboard.register({
        name: "FPS",
        code: "keyl",
        down: function () {
            let newTickSpeed = 0;
            switch (GameLoop.renderFps) {
                case 60:
                    newTickSpeed = 25;
                    break;
                case 25:
                    newTickSpeed = 10;
                    break;
                case 10:
                    newTickSpeed = 2;
                    break;
                case 2:
                    newTickSpeed = 60;
                    break;
            }
            GameLoop.updateTickSpeed("render", newTickSpeed);
        }
    });

    keyboard.register({
        name: "Face",
        code: "keyk",
        down: function () {
            engine.toggleFrontFace();
        }
    });

    keyboard.register({
        name: "Scene",
        code: "digit1",
        down: function () {
            window.engine.programMode("scene");
        }
    });
    keyboard.register({
        name: "HDR",
        code: "digit2",
        down: function () {
            window.engine.programMode("hdr");
        }
    });
    keyboard.register({
        name: "Bloom",
        code: "digit3",
        down: function () {
            window.engine.programMode("bloom");
        }
    });
    keyboard.register({
        name: "Shaft",
        code: "digit4",
        down: function () {
            window.engine.programMode("sunshaft");
        }
    });
    // keyboard.register({
    //     name: "Gauss",
    //     code: "digit5",
    //     down: function () {
    //         window.engine.programMode("gaussian_bloom");
    //     }
    // });
    keyboard.register({
        name: "DWN Sample",
        code: "digit9",
        down: function () {
            window.engine.programMode("debug_downsample");
        }
    });
    keyboard.register({
        name: "UP Sample",
        code: "digit0",
        down: function () {
            window.engine.programMode("debug_upsample");
        }
    });

    keyboard.register({
        name: "-Mip",
        code: "minus",
        down: function () {
            window.engine.DEBUG_MIP_LEVEL = window.engine.DEBUG_MIP_LEVEL != 0 ? window.engine.DEBUG_MIP_LEVEL - 1 : 0;
        }
    });
    keyboard.register({
        name: "+Mip",
        code: "equal",
        down: function () {
            // window.engine.DEBUG_LEVEL
            window.engine.DEBUG_MIP_LEVEL = window.engine.DEBUG_MIP_LEVEL != 5 ? window.engine.DEBUG_MIP_LEVEL + 1 : 5;
        }
    });
});