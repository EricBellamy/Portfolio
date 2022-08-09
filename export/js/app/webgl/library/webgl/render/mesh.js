window.mesh = {
	// Stores relevant functions to creating meshes
	// rendering faces
	// generating final webgl render data
	generateFrontFace: function (x, y, z, width = 1, height = 1, r,g,b,a, emissionIntensity, occlusion, isFlipped, currentIndiceLen) {
		r *= 0.9;
		g *= 0.9;
		b *= 0.9;
		if (isFlipped) {
			// pos, normals, r,g,b,a, emissionIntensity, occlusion
			return [[
				x, y + height, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[3],
				x, y, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[0],
				x + width, y, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[1],

				x + width, y + height, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[2],
				x, y + height, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[3],
				x + width, y, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[1],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		} else {
			return [[
				x, y, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[0],
				x + width, y, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[1],
				x + width, y + height, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[2],

				x, y + height, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[3],
				x, y, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[0],
				x + width, y + height, z, 0, 0, 1, r,g,b,a, emissionIntensity, occlusion[2],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		}
	},
	generateBackFace: function (x, y, z, width = 1, height = 1, r,g,b,a, emissionIntensity, occlusion, isFlipped, currentIndiceLen) {
		r *= 0.9;
		g *= 0.9;
		b *= 0.9;
		if (isFlipped) {
			return [[
				x + width, y, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[0],
				x, y, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[1],
				x, y + height, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[2],

				x + width, y + height, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[3],
				x + width, y, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[0],
				x, y + height, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[2],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		} else {
			return [[
				x, y, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[1],
				x, y + height, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[2],
				x + width, y + height, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[3],

				x + width, y, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[0],
				x, y, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[1],
				x + width, y + height, z - 1, 0, 0, -1, r,g,b,a, emissionIntensity, occlusion[3],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		}
	},
	generateLeftFace: function (x, y, z, width = 1, height = 1, r,g,b,a, emissionIntensity, occlusion, isFlipped, currentIndiceLen) {
		r *= 0.8;
		g *= 0.8;
		b *= 0.8;
		if (isFlipped) {
			return [[
				x, y + height, z - width, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x, y, z - width, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x, y, z, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[1],

				x, y + height, z, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[2],
				x, y + height, z - width, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x, y, z, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[1],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		} else {
			return [[
				x, y, z - width, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x, y, z, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[1],
				x, y + height, z, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[2],

				x, y + height, z - width, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x, y, z - width, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x, y + height, z, -1, 0, 0, r,g,b,a, emissionIntensity, occlusion[2],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		}
	},
	generateRightFace: function (x, y, z, width = 1, height = 1, r,g,b,a, emissionIntensity, occlusion, isFlipped, currentIndiceLen) {
		r *= 0.8;
		g *= 0.8;
		b *= 0.8;
		if (isFlipped) {
			return [[
				x + 1, y + height, z, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x + 1, y, z, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x + 1, y, z - width, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[1],

				x + 1, y + height, z - width, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[2],
				x + 1, y + height, z, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x + 1, y, z - width, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[1],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		} else {
			return [[
				x + 1, y, z, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x + 1, y, z - width, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[1],
				x + 1, y + height, z - width, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[2],

				x + 1, y + height, z, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x + 1, y, z, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x + 1, y + height, z - width, 1, 0, 0, r,g,b,a, emissionIntensity, occlusion[2],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		}
	},
	generateTopFace: function (x, y, z, width = 1, height = 1, r,g,b,a, emissionIntensity, occlusion, isFlipped, currentIndiceLen, pixelHeight = 1) {
		if (isFlipped) {
			return [[
				x, y + pixelHeight, z - height, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x, y + pixelHeight, z, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x + width, y + pixelHeight, z, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[1],

				x + width, y + pixelHeight, z - height, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[2],
				x, y + pixelHeight, z - height, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x + width, y + pixelHeight, z, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[1],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		} else {
			return [[
				x, y + pixelHeight, z, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x + width, y + pixelHeight, z, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[1],
				x + width, y + pixelHeight, z - height, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[2],

				x, y + pixelHeight, z - height, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x, y + pixelHeight, z, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x + width, y + pixelHeight, z - height, 0, 1, 0, r,g,b,a, emissionIntensity, occlusion[2],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		}
	},
	generateBottomFace: function (x, y, z, width = 1, height = 1, r,g,b,a, emissionIntensity, occlusion, isFlipped, currentIndiceLen) {
		r *= 0.6;
		g *= 0.6;
		b *= 0.6;
		if (isFlipped) {
			return [[
				x + width, y, z, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[2],
				x, y, z, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x, y, z - height, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[0],

				x + width, y, z - height, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[1],
				x + width, y, z, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[2],
				x, y, z - height, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[0],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		} else {
			return [[
				x, y, z, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x, y, z - height, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[0],
				x + width, y, z - height, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[1],

				x + width, y, z, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[2],
				x, y, z, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[3],
				x + width, y, z - height, 0, -1, 0, r,g,b,a, emissionIntensity, occlusion[1],
			], [
				currentIndiceLen, currentIndiceLen + 1, currentIndiceLen + 2,
				currentIndiceLen, currentIndiceLen + 2, currentIndiceLen + 3
			]];
		}
	}
}