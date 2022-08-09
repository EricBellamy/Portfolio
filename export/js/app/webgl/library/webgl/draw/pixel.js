// front, back, left, right, top, bottom
class Pixel {
	x = 0;
	y = 0;
	z = 0;

	// The color index in the instance uniform
	color = 0;

	// front, back, left, right, top, bottom
	occlusion = [
		[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]
	]
	occlusionHash = [
		"0|0|0|0", "0|0|0|0", "0|0|0|0", "0|0|0|0", "0|0|0|0", "0|0|0|0"
	]
	isFlipped = [false, false, false, false, false, false];

	// Should we be drawing the face? (Greedy)
	drawFront = 1;
	drawBack = 1;
	drawLeft = 1;
	drawRight = 1;
	drawTop = 1;
	drawBottom = 1;

	// Is there a pixel in X direction?
	pixelFront = -1;
	pixelBack = -1;
	pixelLeft = -1;
	pixelRight = -1;
	pixelTop = -1;
	pixelBottom = -1;

	constructor(rgba, emissionIntensity, x, y, z, height = 1) {
		this.color = rgba;
		this.intensity = emissionIntensity;
		this.height = height;

		this.x = x;
		this.y = y;
		this.z = z;

		// Used in greedy meshing
		this.hash = rgba.join("|") + `|${emissionIntensity}`;
	}
}