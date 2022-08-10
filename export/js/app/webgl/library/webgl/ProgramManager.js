class ProgramManager {
    programs = {};
    instructions = {};
    sources = {};
    modes = {};
    RENDER_MODE = false;
    currentModePrograms = [];
    initializedPrograms = [];
    constructor() { }
    initProgram(MODE_KEY, key, instruction) {
        if (this.programs[MODE_KEY] === undefined) {
            this.programs[MODE_KEY] = {};
        }
        this.programs[MODE_KEY][key] = instruction;
    }
    initSource(MODE_KEY, key, instruction) {
        if (this.sources[key] === undefined) {
            this.sources[key] = {};
        }
        if (this.instructions[MODE_KEY] === undefined) this.instructions[MODE_KEY] = {};
        this.instructions[MODE_KEY][key] = instruction;
    }
    load(callback, count = 0, maxCount) {
        maxCount = Object.keys(this.sources).length;
        for (const key in this.sources) {
            tired.load([
                `/js/app/webgl/game/programs/${key}/${key}_program.js`,
                `/js/app/webgl/game/programs/${key}/${key}_vertex.hlsl`,
                `/js/app/webgl/game/programs/${key}/${key}_fragment.hlsl`,
            ], {
                callback: function () {
                    count++;

                    const program = this.sources[key];
                    program.functions = window.tired.load.files[`/js/app/webgl/game/programs/${key}/${key}_program.js`];
                    program.source = {
                        vertex: window.tired.load.files[`/js/app/webgl/game/programs/${key}/${key}_vertex.hlsl`],
                        fragment: window.tired.load.files[`/js/app/webgl/game/programs/${key}/${key}_fragment.hlsl`]
                    }

                    if (count === maxCount) {
                        callback();
                    }
                }.bind(this)
            });
        }
    }
    register(MODE_KEY, instructions) {
        for (const key in instructions) {
            this.initSource(MODE_KEY, key, instructions[key]);

            this.modes[MODE_KEY] === undefined ? this.modes[MODE_KEY] = [] : undefined;
            this.modes[MODE_KEY].push(key);
        }
    }
    setup(ENGINE, WORLD, gl) {
        this.ENGINE = ENGINE;
        this.WORLD = WORLD;
        this.gl = gl;
    }
    mode(MODE_KEY) {
        this.RENDER_MODE = MODE_KEY;
        this.currentModePrograms = this.modes[MODE_KEY];

        delete this.programs;
        this.programs = {};

        // Initialize this mode if needed
        let source, target, instructions;
        for (const PROGRAM_KEY of this.currentModePrograms) {
            source = this.sources[PROGRAM_KEY];
            instructions = this.instructions[MODE_KEY][PROGRAM_KEY];

            this.programs[PROGRAM_KEY] = {
                name: PROGRAM_KEY,
                params: instructions.params,
                source: source.source,
                shaders: {},
                textures: {},
                framebuffers: {}
            };
            target = this.programs[PROGRAM_KEY];

            if (instructions.links) target.links = instructions.links;

            target.init = source.functions.init.bind(target);
            target.use = source.functions.use.bind(target);
            target.draw = source.functions.draw.bind(target);
            target.clean = source.functions.clean.bind(target);

            this.createProgram(target, ...target.params);
            this.gl.useProgram(target.program);
        }

        let linkProgram, linkFramebuffers;
        let linkInputBase, linkInputString, linkOutputString, linkInputProgram;
        for (const PROGRAM_KEY of this.currentModePrograms) {
            target = this.programs[PROGRAM_KEY];

            if (target.links) {
                for (const LINK_KEY of target.links) {
                    // If we're routing the link
                    if (typeof LINK_KEY != "string") {
                        linkInputBase = LINK_KEY.input.base;
                        linkInputProgram = this.programs[linkInputBase];
                        linkInputString = `${linkInputBase}${LINK_KEY.input.index != undefined ? LINK_KEY.input.index : ""}`;
                        linkOutputString = `${LINK_KEY.output.base}${LINK_KEY.output.index != undefined ? LINK_KEY.output.index : ""}`;
                        
                        target.framebuffers[linkOutputString] = linkInputProgram.framebuffers[linkInputString];
                        target.textures[linkOutputString] = linkInputProgram.textures[linkInputString];
                    } else { // String link
                        linkProgram = this.programs[LINK_KEY];
                        linkFramebuffers = linkProgram.framebufferCount;
                        if (linkFramebuffers === 1) {
                            target.framebuffers[LINK_KEY] = linkProgram.framebuffers[LINK_KEY];
                            target.textures[LINK_KEY] = linkProgram.textures[LINK_KEY];
                        } else if (linkFramebuffers === 2) {
                            // If this has mip levels
                            if (linkProgram.params[3] === true) {
                                target.framebuffers[`${LINK_KEY}0`] = linkProgram.framebuffers[`${LINK_KEY}0`];
                                target.framebuffers[`${LINK_KEY}1`] = linkProgram.framebuffers[`${LINK_KEY}1`];

                                target.textures[`${LINK_KEY}0`] = linkProgram.textures[`${LINK_KEY}0`];
                                target.textures[`${LINK_KEY}1`] = linkProgram.textures[`${LINK_KEY}1`];
                            } else {
                                console.log("HEY WE'VE NEVER TESTED THIS - 2 FRAMEBUFFERS NO MIP LEVELS");
                            }
                        }
                    }
                }
            }

            this.gl.useProgram(target.program);
            target.init(this.ENGINE, this.WORLD, this.gl, target.program);
        }
    }
    render() {
        if (this.RENDER_MODE != false) {
            let target;
            for (const PROGRAM_KEY of this.currentModePrograms) {
                target = this.programs[PROGRAM_KEY];
                this.ENGINE.setViewportRatio(target.params[2]);
                this.gl.useProgram(target.program);
                target.use(this.ENGINE, this.WORLD, this.gl, target.program);
                target.draw(this.ENGINE, this.WORLD, this.gl, target.program, target.textures, target.framebuffers);
                target.clean(this.ENGINE, this.WORLD, this.gl, target.program);
            }
        }
    }
    createMipProgram(PROGRAM, FRAMEBUFFER_INDEX, startingWidth, startingHeight) {
        const gl = this.gl;
        const maxLevels = 7;
        const textures = [];

        const TARGET_KEY = FRAMEBUFFER_INDEX != undefined ? `${PROGRAM.name}${FRAMEBUFFER_INDEX}` : PROGRAM.name;

        // OpenGL ES doesn't support manual mip levels, we'll just create an array of textures
        for (let mipLevel = 0; mipLevel < maxLevels; mipLevel++) {
            // Create the framebuffer texture
            const mipTexture = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, mipTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                startingWidth, startingHeight, 0,
                gl.RGBA, gl.UNSIGNED_BYTE, null);

            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            textures.push([mipTexture, [startingWidth, startingHeight]]);

            if (startingWidth < 5 || startingHeight < 5) {
                break;
            }
            startingWidth = Math.floor(startingWidth / 2);
            startingHeight = Math.floor(startingHeight / 2);
        }

        const framebuffers = [];
        const textureLen = textures.length;

        for (let a = 0; a < textureLen; a++) {
            // Create and bind the framebuffer
            const mipFramebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, mipFramebuffer);

            // attach the texture as the first color attachment
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, textures[a][0], 0);

            framebuffers.push(mipFramebuffer);
        }

        PROGRAM.textures[TARGET_KEY] = textures;
        PROGRAM.framebuffers[TARGET_KEY] = framebuffers;
    }
    createFramebuffer(PROGRAM, FRAMEBUFFER_INDEX, ATTACH_DEPTH, textureWidth, textureHeight) {
        const gl = this.gl;

        let targetKey = PROGRAM.name;
        // "scene" + index
        if (FRAMEBUFFER_INDEX != undefined) {
            targetKey += FRAMEBUFFER_INDEX;
        }

        // Create the texture
        if (PROGRAM.textures[targetKey] === undefined) {
            // Create the framebuffer texture
            PROGRAM.textures[targetKey] = gl.createTexture();

            gl.bindTexture(gl.TEXTURE_2D, PROGRAM.textures[targetKey]);
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat,
                textureWidth, textureHeight, border,
                format, type, data);

            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        // Create the framebuffer and attach the texture
        if (PROGRAM.framebuffers[targetKey] === undefined) {
            // Create and bind the framebuffer
            PROGRAM.framebuffers[targetKey] = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, PROGRAM.framebuffers[targetKey]);

            // attach the texture as the first color attachment
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, PROGRAM.textures[targetKey], 0);

            if (ATTACH_DEPTH) {
                const depthBuffer = gl.createRenderbuffer();
                gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);

                // make a depth buffer and the same size as the targetTexture
                gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, textureWidth, textureHeight);
                gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
            }
        }
    }
    
    useShaders(PROGRAM) {
        this.gl.attachShader(PROGRAM.program, PROGRAM.shaders.vertex);
        this.gl.attachShader(PROGRAM.program, PROGRAM.shaders.fragment);
    }
    
    createShader(PROGRAM, shaderType) {
        if (PROGRAM.shaders[shaderType] === undefined) {
            const gl = this.gl;
            if (shaderType === "vertex") {
                PROGRAM.shaders[shaderType] = gl.createShader(gl.VERTEX_SHADER);
            } else {
                PROGRAM.shaders[shaderType] = gl.createShader(gl.FRAGMENT_SHADER);
            }
            //Fills the vertex shader with our code
            gl.shaderSource(PROGRAM.shaders[shaderType], PROGRAM.source[shaderType]);

            gl.compileShader(PROGRAM.shaders[shaderType]);
            if (!gl.getShaderParameter(PROGRAM.shaders[shaderType], gl.COMPILE_STATUS)) {
                console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(PROGRAM.shaders[shaderType]));
                return;
            }
        }
    }
    
    initShaders(PROGRAM) {
        const gl = this.gl;

        // Used to render the HDR texture & scene texture
        this.createShader(PROGRAM, "vertex");
        this.createShader(PROGRAM, "fragment");

        PROGRAM.program = gl.createProgram();
        this.useShaders(PROGRAM);
    }
    
    // Bind textures to a program
    linkProgramTextures(PROGRAM_KEY, TEXTURE_KEYS) {
        const PROGRAM_TEXTURES = {};
        for (const TEXTURE_KEY of TEXTURE_KEYS) {
            PROGRAM_TEXTURES[TEXTURE_KEY] = this.textures[TEXTURE_KEY];
        }
        window.programs_old[PROGRAM_KEY].textures = PROGRAM_TEXTURES;
    }
    
    linkProgram(PROGRAM) {
        const gl = this.gl;
        const program = PROGRAM.program;
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ERROR linking program!', gl.getProgramInfoLog(program));
            return;
        }
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', gl.getProgramInfoLog(program));
            return;
        }
    }
    createProgram(PROGRAM, framebufferCount = 0, ATTACH_DEPTH = false, textureSizeRatio = 1, isMipTexture) {
        // Creates & uses the shaders. Creates the program
        this.initShaders(PROGRAM);
        this.linkProgram(PROGRAM);

        const textureWidth = Math.floor((window.videogame.CANVAS_WIDTH * RESOLUTION_SCALE) * textureSizeRatio);
        // const textureHeight = Math.floor((window.innerHeight * 0.5) * textureSizeRatio);
		const textureHeight = textureWidth * 0.5625;

        if (isMipTexture === true) {
            if (framebufferCount === 2) {
                this.createMipProgram(PROGRAM, 0, textureWidth, textureHeight);
                this.createMipProgram(PROGRAM, 1, textureWidth, textureHeight);
            } else {
                this.createMipProgram(PROGRAM, undefined, textureWidth, textureHeight);
            }
        } else if (framebufferCount === 1) {
            this.createFramebuffer(PROGRAM, undefined, ATTACH_DEPTH, textureWidth, textureHeight);
        } else if (framebufferCount === 0) {
            PROGRAM.framebuffers = {};
            PROGRAM.framebuffers[PROGRAM.name] = null;
        } else if (framebufferCount === 2) {
            this.createFramebuffer(PROGRAM, 0, ATTACH_DEPTH, textureWidth, textureHeight);
            this.createFramebuffer(PROGRAM, 1, ATTACH_DEPTH, textureWidth, textureHeight);
        }
        PROGRAM.framebufferCount = framebufferCount;
    }
}