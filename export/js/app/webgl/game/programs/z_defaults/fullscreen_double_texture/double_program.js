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

        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        this.textureSceneLocation = gl.getUniformLocation(program, "scene_texture");
        this.textureHdrLocation = gl.getUniformLocation(program, "hdr_texture");

        gl.uniform1i(this.textureSceneLocation, 0);
        gl.uniform1i(this.textureHdrLocation, 1);
    },
    draw: function (ENGINE, WORLD, gl, program, textures, framebuffer) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures.scene);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures.cod_upsample[0][0]);

        gl.clear(ENGINE.GL_CLEARBIT);

        // Draw 6 vertexes => 2 triangles:
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    clean: function (ENGINE, WORLD, gl, program) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },
}