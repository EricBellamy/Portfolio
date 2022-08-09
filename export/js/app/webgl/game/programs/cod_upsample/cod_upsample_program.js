return {
    init: function(ENGINE, WORLD, gl, program){
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
    use: function(ENGINE, WORLD, gl, program){
        this.positionAttribLocation = gl.getAttribLocation(program, 'vertex_position');
        ENGINE.ext.vertexAttribDivisorANGLE(this.positionAttribLocation, 0);

        this.textureSizeLocation = gl.getUniformLocation(program, "textureSize");

        gl.bindBuffer(gl.ARRAY_BUFFER, this.screenQuadVBO);
        gl.enableVertexAttribArray(this.positionAttribLocation);
        gl.vertexAttribPointer(this.positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

        this.smallTextureLocation = gl.getUniformLocation(program, "small_texture");
        this.largeTextureLocation = gl.getUniformLocation(program, "large_texture");
        this.upsampleLocation = gl.getUniformLocation(program, "upsample");
        gl.uniform1i(this.upsampleLocation, 0);

        gl.uniform1i(this.smallTextureLocation, 0);
        gl.uniform1i(this.largeTextureLocation, 1);
    },
    draw: function(ENGINE, WORLD, gl, program, textures, framebuffer){
        const framebufferLen = framebuffer.cod_upsample.length;
        for(let mipLevel = framebufferLen - 1; mipLevel > 0; mipLevel--){
            gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.cod_upsample[mipLevel - 1]);
            if(mipLevel != 0){
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, textures.cod_upsample[mipLevel][0]);
            } else {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, textures.cod_downsample1[mipLevel][0]);
            }

            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, textures.cod_downsample1[mipLevel - 1][0]);

            // Set viewport to bigger size
            ENGINE.setViewportSize(textures.cod_downsample1[mipLevel - 1][1]); // set viewport to larger
            gl.uniform2fv(this.textureSizeLocation, textures.cod_downsample1[mipLevel - 1][1]);

            gl.clear(ENGINE.GL_CLEARBIT);
            // I'll need to bind a uniform for which texture layer is the target
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    },
    clean: function(ENGINE, WORLD, gl, program){
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },
}