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
    },
    use: function (ENGINE, WORLD, gl, program) {
        this.positionAttribLocation = gl.getAttribLocation(program, 'vertex_position');
        ENGINE.ext.vertexAttribDivisorANGLE(this.positionAttribLocation, 0);


        this.lightPositionUniformLocation = gl.getUniformLocation(program, 'light_position');
        const lightScreenCoord = graphics.getScreenPosition(WORLD.projMatrix, WORLD.viewMatrix, WORLD.worldMatrix, window.model.get("sun").matrices[0], [1.5, 1.5, -1.5], ENGINE.CANVAS_WIDTH, ENGINE.CANVAS_HEIGHT);
        gl.uniform2fv(this.lightPositionUniformLocation, lightScreenCoord);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    },
    draw: function (ENGINE, WORLD, gl, program, textures, framebuffer) {
        this.textureSizeLocation = gl.getUniformLocation(program, "textureSize");
        gl.uniform2fv(this.textureSizeLocation, [ENGINE.CANVAS_WIDTH, ENGINE.CANVAS_HEIGHT]);

        // console.log(framebuffer);
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.sunshaft);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures.sunhdr);

        gl.clear(ENGINE.GL_CLEARBIT);

        // Draw 6 vertexes => 2 triangles:
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    clean: function (ENGINE, WORLD, gl, program) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },
}