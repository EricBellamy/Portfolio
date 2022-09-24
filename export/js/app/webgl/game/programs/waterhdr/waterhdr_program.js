return {
    init: function (ENGINE, WORLD, gl, program) {
        WORLD.initWorld(program);
        WORLD.initLocations(program);

        // Bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, WORLD.boxVertexBufferObject);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, WORLD.boxIndexBufferObject);

        this.isWaterLocation = gl.getUniformLocation(program, 'is_water');
        this.textureSize = new Float32Array([ENGINE.CANVAS_WIDTH, ENGINE.CANVAS_HEIGHT]);
    },
    use: function (ENGINE, WORLD, gl, program) {
        WORLD.initLocations(program);

        // Bind the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, WORLD.boxVertexBufferObject);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, WORLD.boxIndexBufferObject);

        // Vertex Position
        gl.enableVertexAttribArray(WORLD.positionAttribLocation);
        gl.vertexAttribPointer(
            WORLD.positionAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            0 // Offset from the beginning of a single vertex to this attribute
        );

        // Normals
        gl.enableVertexAttribArray(WORLD.normalAttribLocation);
        gl.vertexAttribPointer(
            WORLD.normalAttribLocation, // Attribute location
            3, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        // Color Index
        gl.enableVertexAttribArray(WORLD.rgbaAttribLocation);
        gl.vertexAttribPointer(
            WORLD.rgbaAttribLocation, // Attribute location
            4, // Number of elements per attribute
            gl.FLOAT, // Type of elements
            gl.FALSE,
            12 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
            6 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
        );

        WORLD.updateWorld(program);

        // Set texture size
        this.textureSizeLocation = gl.getUniformLocation(program, "textureSize");
        gl.uniform2fv(this.textureSizeLocation, this.textureSize);

        this.drawFrameLocation = gl.getUniformLocation(program, "drawFrame");
        gl.uniform1f(this.drawFrameLocation, DRAW_FRAME);
    },
    draw: function (ENGINE, WORLD, gl, program, textures, framebuffer) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.waterhdr);
		// gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clear(ENGINE.GL_CLEARBIT);

        // Bind the reflection texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures.reflection);

        gl.uniform1f(this.isWaterLocation, 0);
        WORLD.render();
        gl.uniform1f(this.isWaterLocation, 1);
		WORLD.waterRender();
		gl.uniform1f(this.isWaterLocation, 0);


		// gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    },
    clean: function (ENGINE, WORLD, gl, program) {
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
    },
}