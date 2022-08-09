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

        // this.blurWeight = new Float32Array([0.22, 0.19, 0.12, 0.05, 0.016]);
        this.blurWeight = new Float32Array([0.22, 0.19, 0.12, 0.05, 0.016]);
    },
    use: function (ENGINE, WORLD, gl, program) {
        this.positionAttribLocation = gl.getAttribLocation(program, 'vertex_position');
        ENGINE.ext.vertexAttribDivisorANGLE(this.positionAttribLocation, 0); // Make sure divisors are clear

        this.textureSizeLocation = gl.getUniformLocation(program, "textureSize");
        this.horizontalLocation = gl.getUniformLocation(program, "horizontal");

        this.weightLocation = gl.getUniformLocation(program, "weight");
        gl.uniform1fv(this.weightLocation, this.blurWeight);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    },
    draw: function (ENGINE, WORLD, gl, program, textures, framebuffer) {
        const framebuffers = [framebuffer.cod_downsample0, framebuffer.cod_downsample1];
        const framebufferLen = framebuffers[0].length;
        for (let mipLevel = 0; mipLevel < framebufferLen; mipLevel++) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[0][mipLevel]);

            if (mipLevel != 0) {
                gl.bindTexture(gl.TEXTURE_2D, textures.cod_downsample0[mipLevel - 1][0]);
            } else {
                gl.bindTexture(gl.TEXTURE_2D, textures.hdr);
            }

            ENGINE.setViewportSize(textures.cod_downsample0[mipLevel][1]);
            gl.uniform2fv(this.textureSizeLocation, textures.cod_downsample0[mipLevel][1]);

            gl.uniform1i(this.horizontalLocation, 0);
            gl.clear(ENGINE.GL_CLEARBIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);



            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[1][mipLevel]);
            gl.bindTexture(gl.TEXTURE_2D, textures.cod_downsample0[mipLevel][0]);
            // Change bloom direction and re-run
            gl.uniform1i(this.horizontalLocation, 1);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    },
    clean: function (ENGINE, WORLD, gl, program) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    },
}