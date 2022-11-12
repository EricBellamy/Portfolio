const VERTEX_SHADER = `
precision mediump float;

attribute vec2 vertex_position;

varying vec2 tex_coords;
const vec2 scale = vec2(0.5, 0.5);

void main()
{
    tex_coords  = vertex_position * scale + scale;
    gl_Position = vec4(vertex_position, 0.0, 1.0);
}
        `;
const FRAGMENT_SHADER = `
precision mediump float;

varying vec2 tex_coords;

uniform vec2 canvasStep;

uniform vec4 startColor;
uniform vec4 endColor;
uniform float progress;
uniform float transitionLength;
uniform float transitionVal;
uniform float transitionWidthVal;

void main()
{
    float xPos = tex_coords.x / canvasStep.x;
    float yPos = tex_coords.y / canvasStep.y;
    float xBase = floor(xPos);
    float yBase = floor(yPos);

    float progressDiff = progress - yBase - (xBase / 3.0);

    if(progressDiff > transitionLength){
        gl_FragColor = endColor;
    } else if(progressDiff > 0.0) {
        float distanceFromProgress = progressDiff * 0.75;

        if(distanceFromProgress < 0.0){
            gl_FragColor = startColor;
        } else if(distanceFromProgress < 1.0){
            gl_FragColor = mix(startColor, endColor, distanceFromProgress);
        } else {
            gl_FragColor = endColor;
        }
    } else {
        gl_FragColor = startColor;
    }
}
        `;
class BlockScrollerGLProgram {
	gl;
	shaders = {
		vertex: null,
		fragment: null
	}
	source = {
		vertex: null,
		fragment: null,
	}
	progress = 0;
	startColor;
	endColor;
	updateProgress(value) {
		this.progress = value;
	}
	constructor(ENGINE, vertexShader, fragmentShader) {
		this.gl = ENGINE.gl;
		this.GL_CLEARBIT = this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT;
		this.source.vertex = vertexShader;
		this.source.fragment = fragmentShader;

		this.initShaders();
		this.linkProgram();
		this.gl.useProgram(this.program);
	}
	initShaders() {
		// Used to render the HDR texture & scene texture
		this.createShader("vertex");
		this.createShader("fragment");

		this.program = this.gl.createProgram();
		this.useShaders();
	}
	createShader(shaderType) {
		if (this.shaders[shaderType] === null) {
			const gl = this.gl;
			if (shaderType === "vertex") {
				this.shaders[shaderType] = gl.createShader(gl.VERTEX_SHADER);
			} else {
				this.shaders[shaderType] = gl.createShader(gl.FRAGMENT_SHADER);
			}
			//Fills the vertex shader with our code
			gl.shaderSource(this.shaders[shaderType], this.source[shaderType]);

			gl.compileShader(this.shaders[shaderType]);
			if (!gl.getShaderParameter(this.shaders[shaderType], gl.COMPILE_STATUS)) {
				console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(this.shaders[shaderType]));
				return;
			}
		}
	}
	useShaders() {
		this.gl.attachShader(this.program, this.shaders.vertex);
		this.gl.attachShader(this.program, this.shaders.fragment);
	}
	linkProgram() {
		const gl = this.gl;
		const program = this.program;
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
	init() {
		const gl = this.gl;
		this.screenQuadVBO = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			1.0, 1.0,
			-1.0, 1.0,
			-1.0, -1.0,

			-1.0, -1.0,
			1.0, -1.0,
			1.0, 1.0
		]), gl.STATIC_DRAW);
	}
	use() {
		const gl = this.gl;
		this.positionAttribLocation = gl.getAttribLocation(this.program, 'vertex_position');

		this.canvasStepUniformLocation = gl.getUniformLocation(this.program, 'canvasStep');
		this.startColorUniformLocation = gl.getUniformLocation(this.program, 'startColor');
		this.endColorUniformLocation = gl.getUniformLocation(this.program, 'endColor');
		this.progressUniformLocation = gl.getUniformLocation(this.program, 'progress');
		this.transitionLengthUniformLocation = gl.getUniformLocation(this.program, 'transitionLength');
		this.transitionValUniformLocation = gl.getUniformLocation(this.program, 'transitionVal');
		this.transitionWidthValUniformLocation = gl.getUniformLocation(this.program, 'transitionWidthVal');

		gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
		gl.enableVertexAttribArray(this.positionAttribLocation);
		gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

		let squareCount = 10;
		if (window.innerWidth < 500) {
			squareCount = 4;
		} else if (window.innerWidth < 600) {
			squareCount = 5;
		} else if (window.innerWidth < 800) {
			squareCount = 6;
		} else if (window.innerWidth < 1200) {
			squareCount = 8;
		}

		const squareSize = (window.innerWidth / squareCount);
		const squareNormalWidth = (100 / (window.innerWidth / squareSize)) / 100;
		const squareNormalHeight = (100 / (window.innerHeight / squareSize)) / 100;

		const transitionLength = 2;
		const transitionVal = 1.0 / (transitionLength - 1.0);
		gl.uniform1f(this.transitionLengthUniformLocation, transitionLength);
		gl.uniform1f(this.transitionValUniformLocation, transitionVal);
		gl.uniform1f(this.transitionWidthValUniformLocation, transitionVal / 10.0);

		window.squareSize = squareSize;
		window.verticalSquares = Math.ceil(window.innerHeight / squareSize);
		window.squareRows = window.verticalSquares + transitionLength + 2;

		gl.uniform2fv(this.canvasStepUniformLocation, [squareNormalWidth, squareNormalHeight]);
	}
	draw() {
		const gl = this.gl;
		gl.clear(this.GL_CLEARBIT);

		gl.uniform1f(this.progressUniformLocation, this.progress);
		gl.uniform4fv(this.startColorUniformLocation, [...this.startColor]);
		gl.uniform4fv(this.endColorUniformLocation, [...this.endColor]);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}

	updateStartColor(RGBA) {
		this.startColor = RGBA;
	}
	updateEndColor(RGBA) {
		this.endColor = RGBA;
	}
}

class BlockScrollerEngine {
	canvas = false;
	gl = false;
	GL_CLEARBIT;
	// CLEAR_RGB = [...window.color.hex("111"), 1];

	constructor(canvas) {
		this.canvas = canvas;
		const loadedGL = this.initContext();
		if (!loadedGL) {
			throw new Error("Your browser does not support WebGL");
		}

		this.initGlConfig();
		this.setViewportRatio(1);

		this.program = new BlockScrollerGLProgram(this, VERTEX_SHADER, FRAGMENT_SHADER);

		this.updateStartColor([...window.hexToRgb("fff"), 1]);
		this.updateEndColor([...window.hexToRgb("111"), 1]);
		this.updateClearColor([...window.hexToRgb("111"), 1]);

		this.program.init();
		this.program.use();
	}
	initContext() {
		this.CANVAS_WIDTH = window.innerWidth * 0.5;
		this.CANVAS_HEIGHT = window.innerHeight * 0.5;
		this.canvas.width = this.CANVAS_WIDTH;
		this.canvas.height = this.CANVAS_HEIGHT;
		this.gl = this.canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });

		if (!this.gl) {
			return false;
		}
		this.gl.viewport(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
		return true;
	}
	initGlConfig() {
		const gl = this.gl;
		this.GL_CLEARBIT = gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT;
		// gl.clearColor(...this.CLEAR_RGB);
		gl.clear(this.GL_CLEARBIT);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		// Default is CCW && gl.FRONT
		gl.enable(this.gl.CULL_FACE);
		this.gl.frontFace(this.gl.CCW);
	}
	setViewportRatio(ratio = 1) {
		const newWidth = window.innerWidth * 0.5;
		const newHeight = window.innerHeight * 0.5;

		this.CANVAS_WIDTH = newWidth;
		this.CANVAS_HEIGHT = newHeight;
		this.gl.viewport(0, 0, newWidth, newHeight);
	}
	setViewportSize(dims) {
		this.CANVAS_WIDTH = dims[0];
		this.CANVAS_HEIGHT = dims[1];
		this.gl.viewport(0, 0, dims[0], dims[1]);
	}
	programMode(newMode) {
		this.RENDER_MODE = newMode;
	}
	updateStartColor(RGBA) {
		this.program.updateStartColor(RGBA);
	}
	updateEndColor(RGBA) {
		this.program.updateEndColor(RGBA);
	}
	updateClearColor(RGBA) {
		this.gl.clearColor(...RGBA);
	}
	hide(){
		this.canvas.style.opacity = 0;
	}
	show(){
		this.canvas.style.opacity = 1;
	}
}