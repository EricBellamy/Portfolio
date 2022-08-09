return {
    init: function (ENGINE, WORLD, gl, program) {
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

        this.textureHdrLocation = gl.getUniformLocation(program, "hdr_texture");
        this.textureSize = new Float32Array([ENGINE.CANVAS_WIDTH / 2, ENGINE.CANVAS_HEIGHT / 2]);
        this.blurWeight = new Float32Array([0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216]);
    },
    use: function (ENGINE, WORLD, gl, program) {
        this.positionAttribLocation = gl.getAttribLocation(program, 'vertex_position');

        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        // Set weights
        this.weightLocation = gl.getUniformLocation(program, "weight");
        gl.uniform1fv(this.weightLocation, this.blurWeight);

        // Set texture size
        this.textureSizeLocation = gl.getUniformLocation(program, "textureSize");
        gl.uniform2fv(this.textureSizeLocation, this.textureSize);

        // Horizontal Pointer
        this.horizontalLocation = gl.getUniformLocation(program, "horizontal");
    },
    draw: function (ENGINE, WORLD, gl, program, textures, framebuffer) {
        let horizontal = 0;
        let opposite;

        const framebuffers = [framebuffer.gaussian_bloom0, framebuffer.gaussian_bloom1];
        const amount = 10;
        for (let a = 0; a < amount; a++) {
            opposite = horizontal === 0 ? 1 : 0;
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[horizontal]);
            gl.uniform1i(this.horizontalLocation, horizontal);
            if (a === 0) {
                gl.bindTexture(gl.TEXTURE_2D, textures.hdr);
            } else {
                gl.bindTexture(gl.TEXTURE_2D, opposite === 0 ? textures.gaussian_bloom0 : textures.gaussian_bloom1);
            }
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            horizontal = opposite;
        }
    },
    clean: function (ENGINE, WORLD, gl, program) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },
}