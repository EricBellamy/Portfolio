INSTANCE_COUNT = 4;
class WorldManager {
    HAS_POSITION_UPDATE = false;
    constructor(gl, ext) {
        // The earth
        window.model.link("earth", {
            model: "scene",
            colors: [
                [palette.stone, 1, 0],
                [palette.grass, 1, 0],
                [palette.water, 1, 0],
                [palette.tree_trunk, 1, 0],
                [palette.tree_leaves, 1, 0],
            ]
        });
        window.model.new("earth", {
            name: `earth`,
            pos: [0, 0, 0],
            pitch: 0,
            yaw: 0,
            alpha: 1
        }, false);
        window.model.rebuild("earth");

        // The earth
        window.model.link("waterearth", {
            model: "scene",
            colors: [
                [palette.stone, 1, 0],
                [palette.grass, 1, 0],
                [palette.water, 1, 0],
                [palette.tree_trunk, 1, 0],
                [palette.tree_leaves, 1, 0],
            ],
            waterBottom: 3
        });
        window.model.new("waterearth", {
            name: `waterearth`,
            pos: [0, 0, 0],
            pitch: 0,
            yaw: 0,
            alpha: 1
        }, false);
        window.model.rebuild("waterearth");

        // The water
        window.model.link("water", {
            model: "water",
            colors: [
                [palette.blue, 1, 0],
            ],
            waterBottom: 1,
            waterColor: palette.blue
        });
        window.model.new("water", {
            name: `water`,
            pos: [0, 2, 0],
            pitch: 0,
            yaw: 0,
            alpha: 1
        }, false);
        window.model.rebuild("water");



        // The lantern glowy core
        window.model.link("lantern_core", {
            model: "lantern_core",
            colors: [
                [palette.lantern, 1, 0.5],
            ]
        });
        window.model.new("lantern_core", {
            name: `lantern_core`,
            pos: [5.25, 3, -3.25],
            pitch: 0,
            yaw: 0,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("lantern_core");

		// The lantern glowy core
        window.model.link("lantern_frame", {
            model: "lantern_frame",
            colors: [
                [palette.iron, 1, 0],
            ]
        });
        window.model.new("lantern_frame", {
            name: `lantern_frame`,
            pos: [5.25, 3, -3.25],
            pitch: 0,
            yaw: 0,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("lantern_frame");


        // Grass
        window.model.link("grass", {
            model: "grass",
            colors: [
                [palette.grass1, 1, 0],
                [palette.grass2, 1, 0],
                [palette.grass3, 1, 0],
                [palette.grass4, 1, 0],
            ]
        });
        window.model.new("grass", {
            name: `grass`,
            pos: [7.25, 3, -1.1],
            pitch: 0,
            yaw: 0,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("grass");

        // Grass
        window.model.link("long_grass", {
            model: "long_grass",
            colors: [
                [palette.grass1, 1, 0],
                [palette.grass2, 1, 0],
                [palette.grass3, 1, 0],
                [palette.grass4, 1, 0],
            ]
        });
        window.model.new("long_grass", {
            name: `long_grass`,
            pos: [2, 3, -2],
            pitch: 0,
            yaw: 0,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("long_grass");


        // Flower
        window.model.link("flower", {
            model: "flower",
            colors: [
                [palette.flower_stem, 1, 0],
                [palette.flower_core, 1, 0],
                [palette.flower_petal, 1, 0],
            ]
        });
        window.model.new("flower", {
            name: `flower`,
            pos: [5.25, 3, -0.25],
            pitch: 0,
            yaw: 0,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("flower");


        // Multi Flower
        window.model.link("multiflower", {
            model: "multiflower",
            colors: [
                [palette.flower_stem, 1, 0],
                [palette.flower_core2, 1, 0],

                [palette.flower_petal2, 1, 0],
                [palette.flower_petal3, 1, 0],
                [palette.flower_petal4, 1, 0],
                [palette.flower_core, 1, 0],
            ]
        });
        window.model.new("multiflower", {
            name: `multiflower`,
            pos: [8, 3, -3.2],
            pitch: 0,
            yaw: 1.5708,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("multiflower");

        // The sun
        window.model.link("sun", {
            model: "cube",
            colors: [
                [palette.sunlight, 1, 0.4]
            ]
        });
        window.model.new("sun", {
            name: `sun`,
            pos: window.sunPosition,
            pitch: 0,
            yaw: 0,
            alpha: 1
        }, false);
        window.model.rebuild("sun");
		updateSun();

        // Yellow Duck
        window.model.link("duck", {
            model: "duck",
            colors: [
                [palette.yellow2, 1, 0],
                [palette.orange, 1, 0],
                [palette.black4, 1, 0],
            ]
        });
        window.model.new("duck", {
            name: `duck`,
            pos: [6.3, 2.8, -2.15],
            pitch: 0,
            yaw: 0,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("duck");

        // White Duck
        window.model.link("duck_white", {
            model: "duck",
            colors: [
                [palette.white, 1, 0],
                [palette.orange, 1, 0],
                [palette.black4, 1, 0],
            ]
        });
        window.model.new("duck_white", {
            name: `duck_white`,
            pos: [3, 2.8, -1.3],
            pitch: 0,
            yaw: 1.5708,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("duck_white");



        // Boots
        window.model.link("bench", {
            model: "bench",
            colors: [
                [palette.brown, 1, 0],
            ]
        });
        window.model.new("bench", {
            name: `bench`,
            pos: [3.2, 3, -3.2],
            pitch: 0,
            yaw: 0,
            alpha: 1,
            scale: 0.1,
        }, false);
        window.model.rebuild("bench");



        // Boots
        // window.model.link("boots", {
        //     model: "boots",
        //     colors: [
        //         [palette.black4, 1, 0],
        //         [palette.blue, 1, 0],
        //     ]
        // });
        // window.model.new("boots", {
        //     name: `boots`,
        //     pos: [3.4, 4, -3.2],
        //     pitch: 0,
        //     yaw: 0,
        //     alpha: 1,
        //     scale: 0.1,
        // }, false);
        // window.model.new("boots", {
        //     name: `boots2`,
        //     pos: [4.1, 4, -3.2],
        //     pitch: 1,
        //     yaw: 0,
        //     alpha: 1,
        //     scale: 0.1,
        // }, false);
        // window.model.rebuild("boots");


        // The moon
        // window.model.link("moon", {
        //     model: "cube",
        //     colors: [
        //         [palette.moonlight, 1, 0.5]
        //     ]
        // });
        // window.model.new("moon", {
        //     name: `moon`,
        //     pos: [-10, 0, -10],
        //     pitch: 0,
        //     yaw: 0,
        //     alpha: 1
        // }, false);
        // window.model.rebuild("moon");


        this.gl = gl;
        this.ext = ext;
        this.GL_CLEARBIT = gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT;

        Viewport.onMouseMove(function () {
            this.HAS_POSITION_UPDATE = true;
        }.bind(this));
        Viewport.onPlayerMove(function () {
            this.HAS_POSITION_UPDATE = true;
        }.bind(this));
    }
    // Probably replace render with renderBlocks, renderOutlines, renderTransparent
    render() {
        window.model.draw("earth", this.matrixAttribLocation);
        this.renderDecor();
    }
    renderDecor(){
        window.model.draw("duck", this.matrixAttribLocation);
        window.model.draw("duck_white", this.matrixAttribLocation);
        window.model.draw("bench", this.matrixAttribLocation);

        window.model.draw("boots", this.matrixAttribLocation);

		window.model.draw("lantern_frame", this.matrixAttribLocation);

        window.model.draw("flower", this.matrixAttribLocation);
        window.model.draw("multiflower", this.matrixAttribLocation);
        window.model.draw("grass", this.matrixAttribLocation);
        window.model.draw("long_grass", this.matrixAttribLocation);
    }
	lightRender(){
		window.model.draw("lantern_core", this.matrixAttribLocation);
	}
	debugLightRender(){
		window.model.draw("lantern_core", this.matrixAttribLocation, true);
	}
    sunRender(){
        window.model.draw("sun", this.matrixAttribLocation);
    }
    moonRender(){
        // TODO :: Implement this later
        window.model.draw("moon", this.matrixAttribLocation);
    }
    renderWaterEarth(){
        window.model.draw("waterearth", this.matrixAttribLocation);
        this.renderDecor();
    }
    waterRender(){
        window.model.draw("water", this.matrixAttribLocation);
    }
    initInstances() {
        const gl = this.gl;
        const ext = this.ext;

        window.model.buffer("earth");
        window.model.buffer("waterearth");
        window.model.buffer("duck");
        window.model.buffer("duck_white");

        window.model.buffer("bench");
        window.model.buffer("boots");

        window.model.buffer("lantern_core");
		window.model.buffer("lantern_frame");
        window.model.buffer("flower");
        window.model.buffer("multiflower");
        window.model.buffer("grass");
        window.model.buffer("long_grass");
        window.model.buffer("sun");

        window.model.buffer("water");
        // window.model.buffer("moon");
    }
    initBuffers(program) {
        const gl = this.gl;
        // Create a buffer, mount it and saturate it
        this.boxVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.boxVertexBufferObject);

        this.boxIndexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.boxIndexBufferObject);

        window.model.setup(gl, this.ext, this.boxVertexBufferObject, this.boxIndexBufferObject);

        this.initInstances();
    }
    initWorld(program) {
        this.worldMatrix = new Float32Array(16);
        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);
        this.IDENTITY_MATRIX = new Float32Array(16);

        mat4.identity(this.IDENTITY_MATRIX);
        mat4.identity(this.worldMatrix);

        this.lightMatrix = new Float32Array([1, 1, 1]);
    }
    initLocations(program) {
        const gl = this.gl;

        // 9 input values
        this.positionAttribLocation = gl.getAttribLocation(program, 'vert_position');
        this.normalAttribLocation = gl.getAttribLocation(program, 'vert_normal');

        this.rgbaAttribLocation = gl.getAttribLocation(program, 'vert_rgba');
        this.emissionAttribLocation = gl.getAttribLocation(program, 'vert_emission');

        this.occlusionAttribLocation = gl.getAttribLocation(program, 'vert_occlusion');

        this.matrixAttribLocation = gl.getAttribLocation(program, 'mInstance');


        this.matViewUniformLocation = gl.getUniformLocation(program, 'mView');
        this.matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
        this.matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');

        this.cameraPosUniformLocation = gl.getUniformLocation(program, 'cameraPos');
        gl.uniform3fv(this.cameraPosUniformLocation, Viewport.cameraPos);
        
        gl.uniformMatrix4fv(this.matWorldUniformLocation, this.gl.FALSE, this.worldMatrix);
    }
    updateWorld(program, inverse = false) {
        const gl = this.gl;

        // position: x, y, z		target: x,y,z
        this.updateViewMatrix(inverse);
        this.updateProjectionMatrix();

        const lightPosLocation = gl.getUniformLocation(program, 'light_position');
        // gl.uniform3fv(this.lightPosLocation, new Float32Array([50 * Math.sin(DRAW_FRAME / 15), 15 * Math.cos(DRAW_FRAME / 15), 50 * Math.cos(DRAW_FRAME / 15)]));
        gl.uniform3fv(lightPosLocation, new Float32Array(window.sunPosition));
    }
    size(width, height) {
        this.CANVAS_WIDTH = width;
        this.CANVAS_HEIGHT = height;
    }
    updateViewMatrix(inverse = false) {
        let cameraUp;
        let cameraPos;
        let cameraCenter;
        if(inverse === true){
            cameraUp = [0, -1, 0];
            cameraPos = JSON.parse(JSON.stringify(Viewport.cameraPos));
            const cameraFront = JSON.parse(JSON.stringify(Viewport.cameraFront));
            cameraPos[1] = -(cameraPos[1] - 2.9) + 2.9;
            cameraFront[1] = -cameraFront[1];

            cameraCenter = Viewport.calculateCenter(cameraPos, cameraFront);
        } else {
            cameraUp = Viewport.cameraUp;
            cameraPos = Viewport.cameraPos;
            cameraCenter = Viewport.getCenter();
        }
        mat4.lookAt(this.viewMatrix, cameraPos, cameraCenter, cameraUp);
        this.gl.uniformMatrix4fv(this.matViewUniformLocation, this.gl.FALSE, this.viewMatrix);
    }
    updateProjectionMatrix() {
        mat4.perspective(this.projMatrix, glMatrix.toRadian(45), this.CANVAS_WIDTH / this.CANVAS_HEIGHT, 0.1, 1000.0);
        this.gl.uniformMatrix4fv(this.matProjUniformLocation, this.gl.FALSE, this.projMatrix);
    }
}