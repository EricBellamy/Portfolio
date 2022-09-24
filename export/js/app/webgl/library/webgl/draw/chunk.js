window.gameInitFunctions["gameInit1"].push(function () {

});

class Chunk {
	pixelData = []; // Stores the block type of each pixel, 0 = air, 1 = block
	pixels = [];

	xWidth = 2;
	yHeight = 2;
	zDepth = 2;
	yLayerLength = 4; // xWidth * zDepth

	xPos = 0;
	yPos = 0;
	zPos = 0;

	pitch = 0;
	yaw = 0;
	modelFront = []; // Where the model is facing calculated from pitch & yaw

	// When instancing, vertex data is generated from 0,0,0.
	// Each instance can have their own offset that translates the vertices before calculating the world position & rotation
	// This should allow us to configure the rotation origin
	// We'll need to factor this offset in to collision detection
	rotationOffset = [];


	// Pixels that do not have face culling or greedy meshing, used for death animation
	// Create this array, then deep clone it into the pixels array and then perform optimization on those
	simplePixels = [];

	// Greedy Measurements
	greedyDimFront = [];
	greedyDimBack = [];
	greedyDimLeft = [];
	greedyDimRight = [];
	greedyDimTop = [];
	greedyDimBottom = [];

	// The WebGL Mesh data
	pixelVertexColorData = [];
	pixelIndiceData = [];
	pixelIndiceDataLen = 0;

	simplePixelVertexColorData = [];
	simplePixelIndiceData = [];
	simplePixelIndiceDataLen = 0;
	constructor(dimensions, blockData = [], colorData = [], waterBottom = -1, waterColor = []) {
		this.waterColor = waterColor;
		this.xPos = 0;
		this.yPos = 0;
		this.zPos = 0;

		this.waterBottom = waterBottom;

		this.xWidth = dimensions[0];
		this.yHeight = dimensions[1];
		this.zDepth = dimensions[2];
		this.yLayerLength = dimensions[0] * dimensions[2]; // the index length of an entire y layer

		this.init = this.init.bind(this);
		this.initPixels = this.initPixels.bind(this);
		this.generatePixelFaceData = this.generatePixelFaceData.bind(this);
		this.calculateFaceCulling = this.calculateFaceCulling.bind(this);

		this.pixelData = [];
		this.colors = [];
		let layerIndex, depthIndex, targetIndex, blockColorIndex, blockColor;
		for(let y = 0; y < this.yHeight; y++){
			layerIndex = y * this.yLayerLength;
			for(let z = 0; z < this.zDepth; z++){
				depthIndex = layerIndex + z * this.xWidth;
				for(let x = 0; x < this.xWidth; x++){
					targetIndex = depthIndex + x;
					blockColorIndex = blockData[targetIndex];
					if(blockColorIndex != 0){
						this.colors.push(colorData[blockColorIndex - 1]);
						this.pixelData.push(1);
					} else {
						this.colors.push(-1);
						this.pixelData.push(0);
					}
				}
			}	
		}

		this.init();

		// Calculates the adjacent pixel information
		this.calculateFaceCulling();

		this.generateNormals();
		this.calculateGreedyFaces();

		this.generateGreedyMesh();
	}

	init() {
		this.initPixels(this.pixelData, this.pixels, this.colors, this.waterColor);
	}
	initPixels(pixelData, pixels, colors, waterColor) {
		let pixelColor, colorString, colorIndex;

		const yLayerLength = this.yLayerLength;
		const yHeight = this.yHeight;
		const zDepth = this.zDepth;
		const xWidth = this.xWidth;

		let baseIndex = 0;
		let targetIndex = 0;
		let realZ = 0; // Z needs to be translated to the negative based on webgl rendering
		let rgbColor, emissionIntensity;
		for (let y = 0; y < yHeight; y++) {
			for (let z = 0; z < zDepth; z++) {
				realZ = z != 0 ? z * -1 : z;
				baseIndex = y * yLayerLength + z * xWidth;
				for (let x = 0; x < xWidth; x++) {
					targetIndex = baseIndex + x;
					// If it's not air
					if (pixelData[targetIndex] != 0) {
						// Init here to avoid reference issues
						pixelColor = colors[targetIndex];

						let isWater = false;
						const rgba = pixelColor[0];
						if(this.waterColor.length > 0){
							if(rgba[0] === waterColor[0] && rgba[1] === waterColor[1] && rgba[2] === waterColor[2]){
								isWater = true;
							}
						}

						// rgba, emissionIntensity, x,y,z, height
						pixels.push(new Pixel(pixelColor[0], pixelColor[1], x, y, realZ, isWater ? 0.9 : 1));
						// console.log(`${x}, ${y}, ${z}`);
					} else {
						pixels.push(0);
					}
				}
			}
		}
	}
	calculateFaceCulling() {
		const waterBottom = this.waterBottom;
		const yLayerLength = this.yLayerLength;
		const yHeight = this.yHeight;
		const zDepth = this.zDepth;
		const xWidth = this.xWidth;

		const pixels = this.pixels;

		const xWidthM1 = xWidth - 1;
		const yHeightM1 = yHeight - 1;
		const zDepthM1 = zDepth - 1;

		let baseIndex, targetIndex, targetPixel;
		let targetAdjIndex, targetAdjPixel;
		for (let y = 0; y < yHeight; y++) {
			for (let z = 0; z < zDepth; z++) {
				baseIndex = y * yLayerLength + z * xWidth;
				for (let x = 0; x < xWidth; x++) {
					targetIndex = baseIndex + x;

					targetPixel = pixels[targetIndex];
					if (targetPixel) {
						// Front Adjacent
						if (targetPixel.pixelFront === -1) {
							if (z != 0) {
								targetAdjIndex = targetIndex - xWidth;
								targetAdjPixel = pixels[targetAdjIndex];
								if (targetAdjPixel != 0) {
									targetPixel.pixelFront = 1;
									targetPixel.drawFront = 0;
									targetAdjPixel.pixelBack = 1;
									targetAdjPixel.drawBack = 0;
								} else {
									targetPixel.pixelFront = 0;
									targetPixel.drawFront = 1;
								}
							} else {
								targetPixel.pixelFront = 0;
								targetPixel.drawFront = 1;
							}
						}
						// Back Adjacent
						if (targetPixel.pixelBack === -1) {
							if (z != zDepthM1) {
								targetAdjIndex = targetIndex + xWidth;
								targetAdjPixel = pixels[targetAdjIndex];
								if (targetAdjPixel != 0) {
									targetPixel.pixelBack = 1;
									targetPixel.drawBack = 0;
									targetAdjPixel.pixelFront = 1;
									targetAdjPixel.drawFront = 0;
								} else {
									targetPixel.pixelBack = 0;
									targetPixel.drawBack = 1;
								}
							} else {
								targetPixel.pixelBack = 0;
								targetPixel.drawBack = 1;
							}
						}

						// Left Adjacent
						if (targetPixel.pixelLeft === -1) {
							if (x != 0) {
								targetAdjIndex = targetIndex - 1;
								targetAdjPixel = pixels[targetAdjIndex];
								if (targetAdjPixel != 0) {
									targetPixel.pixelLeft = 1;
									targetPixel.drawLeft = 0;
									targetAdjPixel.pixelRight = 1;
									targetAdjPixel.drawRight = 0;
								} else {
									targetPixel.pixelLeft = 0;
									targetPixel.drawLeft = 1;
								}
							} else {
								targetPixel.pixelLeft = 0;
								targetPixel.drawLeft = 1;
							}
						}
						// Right Adjacent
						if (targetPixel.pixelRight === -1) {
							if (x != xWidthM1) {
								targetAdjIndex = targetIndex + 1;
								targetAdjPixel = pixels[targetAdjIndex];
								if (targetAdjPixel != 0) {
									targetPixel.pixelRight = 1;
									targetPixel.drawRight = 0;
									targetAdjPixel.pixelLeft = 1;
									targetAdjPixel.drawLeft = 0;
								} else {
									targetPixel.pixelRight = 0;
									targetPixel.drawRight = 1;
								}
							} else {
								targetPixel.pixelRight = 0;
								targetPixel.drawRight = 1;
							}
						}

						// Top Adjacent
						if (targetPixel.pixelTop === -1) {
							if (y != yHeightM1) {
								targetAdjIndex = targetIndex + yLayerLength;
								targetAdjPixel = pixels[targetAdjIndex];
								if (targetAdjPixel != 0) {
									targetPixel.pixelTop = 1;
									targetPixel.drawTop = 0;
									targetAdjPixel.pixelBottom = 1;
									targetAdjPixel.drawBottom = 0;
								} else {
									targetPixel.pixelTop = 0;
									targetPixel.drawTop = 1;
								}
							} else {
								targetPixel.pixelTop = 0;
								targetPixel.drawTop = 1;
							}
						}
						// Bottom Adjacent
						if (targetPixel.pixelBottom === -1) {
							if (y != 0) {
								targetAdjIndex = targetIndex - yLayerLength;
								targetAdjPixel = pixels[targetAdjIndex];
								if (targetAdjPixel != 0) {
									targetPixel.pixelBottom = 1;
									targetPixel.drawBottom = 0;
									targetAdjPixel.pixelTop = 1;
									targetAdjPixel.drawTop = 0;
								} else {
									targetPixel.pixelBottom = 0;
									targetPixel.drawBottom = 1;
								}
							} else {
								targetPixel.pixelBottom = 0;
								targetPixel.drawBottom = 1;
							}
						}

						// See through models at or below water level for reflections
						if(y < waterBottom){
							// targetPixel.waterBottom = true;
							targetPixel.drawFront = 0;
							targetPixel.drawBack = 0;
							targetPixel.drawLeft = 0;
							targetPixel.drawRight = 0;
							targetPixel.drawBottom = 0;
						}
					}
				}
			}
		}
	}
	generateNormals() {
		const yLayerLength = this.yLayerLength;
		const yHeight = this.yHeight;
		const zDepth = this.zDepth;
		const xWidth = this.xWidth;

		const pixels = this.pixels;

		const xWidthM1 = xWidth - 1;
		const yHeightM1 = yHeight - 1;
		const zDepthM1 = zDepth - 1;

		let baseIndex, targetIndex, targetPixel;
		let targetAdjIndex, targetAdjPixel;

		let referenceBaseIndex, referencePixel;
		let leftRefPixel, rightRefPixel, topRefPixel, bottomRefPixel;

		// const AOIncrease = 0.5;

		performance.mark("StartAO");
		// front/back
		for (let y = 0; y < yHeight; y++) {
			for (let z = 0; z < zDepth; z++) {
				baseIndex = y * yLayerLength + z * xWidth;
				for (let x = 0; x < xWidth; x++) {
					targetIndex = baseIndex + x;

					// When greedy length is found, push it to an array for the side
					targetPixel = pixels[targetIndex];

					if (targetPixel) {
						// front, back, left, right, top, bottom

						if (z != 0 && targetPixel.drawFront) {
							referenceBaseIndex = targetIndex - xWidth;

							// left, right, top, bottom
							const refIndices = [
								referenceBaseIndex - 1,
								referenceBaseIndex + 1,
								referenceBaseIndex + yLayerLength,
								referenceBaseIndex - yLayerLength
							]
							const refPixels = [
								x != 0 ? pixels[refIndices[0]] : undefined,
								x != xWidthM1 ? pixels[refIndices[1]] : undefined, 
								y != yHeightM1 ? pixels[refIndices[2]] : undefined,
								y != 0 ? pixels[refIndices[3]] : undefined
							]

							window.occlusion.front(x,y,z, xWidthM1,yHeightM1,zDepthM1, targetPixel,pixels, refPixels, refIndices, yLayerLength, 1);
						}

						if (z != zDepthM1 && targetPixel.drawBack) {
							referenceBaseIndex = targetIndex + xWidth;

							// left, right, top, bottom
							const refIndices = [
								referenceBaseIndex + 1,
								referenceBaseIndex - 1,
								referenceBaseIndex + yLayerLength,
								referenceBaseIndex - yLayerLength
							]
							const refPixels = [
								x != xWidthM1 ? pixels[refIndices[0]] : undefined,
								x != 0 ? pixels[refIndices[1]] : undefined, 
								y != yHeightM1 ? pixels[refIndices[2]] : undefined,
								y != 0 ? pixels[refIndices[3]] : undefined
							]

							window.occlusion.back(x,y,z, xWidthM1,yHeightM1,zDepthM1, targetPixel,pixels, refPixels, refIndices, yLayerLength, 1);
						}

						if (x != 0 && targetPixel.drawLeft) {
							referenceBaseIndex = targetIndex - 1;

							// Left, right, top, bottom from the reference point
							const refIndices = [
								referenceBaseIndex + xWidth,
								referenceBaseIndex - xWidth,
								referenceBaseIndex + yLayerLength,
								referenceBaseIndex - yLayerLength
							]
							const refPixels = [
								z != zDepthM1 ? pixels[refIndices[0]] : undefined,
								z != 0 ? pixels[refIndices[1]] : undefined, 
								y != yHeightM1 ? pixels[refIndices[2]] : undefined,
								y != 0 ? pixels[refIndices[3]] : undefined
							]

							window.occlusion.left(x,y,z, xWidthM1,yHeightM1,zDepthM1, targetPixel,pixels, refPixels, refIndices, yLayerLength, xWidth);
						}

						if (x != xWidthM1 && targetPixel.drawRight) {
							referenceBaseIndex = targetIndex + 1;

							// Left, right, top, bottom from the reference point
							const refIndices = [
								referenceBaseIndex - xWidth,
								referenceBaseIndex + xWidth,
								referenceBaseIndex + yLayerLength,
								referenceBaseIndex - yLayerLength
							]
							const refPixels = [
								z != 0 ? pixels[refIndices[0]] : undefined,
								z != zDepthM1 ? pixels[refIndices[1]] : undefined, 
								y != yHeightM1 ? pixels[refIndices[2]] : undefined,
								y != 0 ? pixels[refIndices[3]] : undefined
							]

							window.occlusion.right(x,y,z, xWidthM1,yHeightM1,zDepthM1, targetPixel,pixels, refPixels, refIndices, yLayerLength, xWidth);
						}

						if(y != yHeightM1 && targetPixel.drawTop){
							referenceBaseIndex = targetIndex + yLayerLength;

							// Left, right, top, bottom from the reference point
							const refIndices = [
								referenceBaseIndex - 1,
								referenceBaseIndex + 1,
								referenceBaseIndex + xWidth,
								referenceBaseIndex - xWidth
							]
							const refPixels = [
								x != 0 ? pixels[refIndices[0]] : undefined,
								x != xWidthM1 ? pixels[refIndices[1]] : undefined, 
								z != zDepthM1 ? pixels[refIndices[2]] : undefined,
								z != 0 ? pixels[refIndices[3]] : undefined
							]

							window.occlusion.top(x,y,z, xWidthM1,yHeightM1,zDepthM1, targetPixel,pixels, refPixels, refIndices, yLayerLength, 1);
						}

						if(y != 0 && targetPixel.drawBottom){
							referenceBaseIndex = targetIndex - yLayerLength;

							// Left, right, top, bottom from the reference point
							const refIndices = [
								referenceBaseIndex - 1,
								referenceBaseIndex + 1,
								referenceBaseIndex - xWidth,
								referenceBaseIndex + xWidth
							]
							const refPixels = [
								x != 0 ? pixels[refIndices[0]] : undefined,
								x != xWidthM1 ? pixels[refIndices[1]] : undefined, 
								z != 0 ? pixels[refIndices[2]] : undefined,
								z != zDepthM1 ? pixels[refIndices[3]] : undefined
							]

							window.occlusion.bottom(x,y,z, xWidthM1,yHeightM1,zDepthM1, targetPixel,pixels, refPixels, refIndices, yLayerLength, 1);
						}
					}
				}
			}
		}
		performance.mark("EndAO");
		// const aoDuration = performance.measure("measure a to b", "StartAO", "EndAO").duration;
		// console.log(`AO TOOK: ${aoDuration}ms`);
	}
	// Modifies the drawX pixels to be ready for greedy meshing
	calculateGreedyFaces() {
		// Loop through the pixels
		// Mark the start index of the greedy mesh
		// For every face that is the same color, set the related drawFACE to 0
		// When we reach a pixel that is not part of the greedy mesh, calculate the greedy mesh

		// Greedy meshes are calculated horizontally first and then vertically once they reach a stopping pixel
		// Have 3 seperate pixel loops for front/back, left/right, top/bottom
		const yLayerLength = this.yLayerLength;
		const yHeight = this.yHeight;
		const zDepth = this.zDepth;
		const xWidth = this.xWidth;

		const pixels = this.pixels;

		const xWidthM1 = xWidth - 1;
		const yHeightM1 = yHeight - 1;
		const zDepthM1 = zDepth - 1;

		let baseIndex, targetIndex, targetPixel;
		let targetAdjIndex, targetAdjPixel;

		const greedyDimFront = [];
		const greedyDimBack = [];
		const greedyDimLeft = [];
		const greedyDimRight = [];
		const greedyDimTop = [];
		const greedyDimBottom = [];

		let primaryMesh = false;
		let primaryX, primaryY, primaryZ, primaryColorHash, primaryOcclusionHash;
		let secondaryMesh = false;
		let secondaryX, secondaryY, secondaryZ, secondaryColorHash, secondaryOcclusionHash;
		let greedyWidth, greedyHeight;
		// front/back
		for (let y = 0; y < yHeight; y++) {
			for (let z = 0; z < zDepth; z++) {
				baseIndex = y * yLayerLength + z * xWidth;
				for (let x = 0; x < xWidth; x++) {
					targetIndex = baseIndex + x;

					// When greedy length is found, push it to an array for the side
					targetPixel = pixels[targetIndex];

					if (targetPixel) {
						targetAdjIndex = targetIndex + 1;

						if (primaryMesh || targetPixel.drawFront) {
							// Start the mesh point
							if (primaryMesh === false) {
								primaryX = x;
								primaryY = y;
								primaryZ = z;
								primaryColorHash = targetPixel.hash;
								primaryOcclusionHash = targetPixel.occlusionHash;
								primaryMesh = true;
							}
							// Not the end of a row
							if(targetPixel.isFlipped[0] === true){
								primaryMesh = false;
								greedyDimFront.push([1, 1]);
							} else if (x != xWidthM1) {
								targetAdjPixel = pixels[targetAdjIndex];

								// Adjacent pixel can draw the face
								// Adjacent pixel matches the hash
								// targetAdjPixel && targetAdjPixel.isFlipped[2] === false && targetAdjPixel.drawLeft != 0 && primaryColorHash === targetAdjPixel.hash && primaryOcclusionHash[2] === targetAdjPixel.occlusionHash[2]
								if (targetAdjPixel && targetAdjPixel.isFlipped[0] === false && targetAdjPixel.drawFront != 0 && primaryColorHash === targetAdjPixel.hash && primaryOcclusionHash[0] === targetAdjPixel.occlusionHash[0]) {
									targetAdjPixel.drawFront = 0;
								} else {
									primaryMesh = false;
									greedyWidth = x + 1 - primaryX;
									greedyHeight = window.greedy.calculateGreedyFrontFaces(pixels, primaryColorHash, primaryOcclusionHash, primaryX, primaryY + 1, primaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
									greedyDimFront.push([greedyWidth, greedyHeight]);
								}
							} else {
								if (primaryX != x) {
									targetPixel.drawFront = 0;
								}
								primaryMesh = false;
								greedyWidth = x + 1 - primaryX;
								greedyHeight = window.greedy.calculateGreedyFrontFaces(pixels, primaryColorHash, primaryOcclusionHash, primaryX, primaryY + 1, primaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
								greedyDimFront.push([greedyWidth, greedyHeight]);
							}
						}

						if (secondaryMesh || targetPixel.drawBack) {
							// Start the mesh point
							if (secondaryMesh === false) {
								secondaryX = x;
								secondaryY = y;
								secondaryZ = z;
								secondaryColorHash = targetPixel.hash;
								secondaryOcclusionHash = targetPixel.occlusionHash;
								secondaryMesh = true;
							}
							// Not the end of a row
							if(targetPixel.isFlipped[1] === true){
								secondaryMesh = false;
								greedyDimBack.push([1, 1]);
							} else if (x != xWidthM1) {
								targetAdjPixel = pixels[targetAdjIndex];

								// Adjacent pixel can draw the face
								// Adjacent pixel matches the hash
								if (targetAdjPixel && targetAdjPixel.isFlipped[1] === false && targetAdjPixel.drawBack != 0 && secondaryColorHash === targetAdjPixel.hash && secondaryOcclusionHash[1] === targetAdjPixel.occlusionHash[1]) {
									targetAdjPixel.drawBack = 0;
								} else {
									secondaryMesh = false;
									greedyWidth = x + 1 - secondaryX;
									greedyHeight = window.greedy.calculateGreedyBackFaces(pixels, secondaryColorHash, secondaryOcclusionHash, secondaryX, secondaryY + 1, secondaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
									greedyDimBack.push([greedyWidth, greedyHeight]);
								}
							} else {
								if (secondaryX != x) {
									targetPixel.drawBack = 0;
								}
								secondaryMesh = false;
								greedyWidth = x + 1 - secondaryX;
								greedyHeight = window.greedy.calculateGreedyBackFaces(pixels, secondaryColorHash, secondaryOcclusionHash, secondaryX, secondaryY + 1, secondaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
								greedyDimBack.push([greedyWidth, greedyHeight]);
							}
						}
					}
				}
			}
		}

		// Left/Right
		for (let y = 0; y < yHeight; y++) {
			for (let x = 0; x < xWidth; x++) {
				baseIndex = y * yLayerLength + x;
				for (let z = 0; z < zDepth; z++) {
					targetIndex = baseIndex + z * xWidth;
					targetPixel = pixels[targetIndex];

					if (targetPixel) {
						targetAdjIndex = targetIndex + xWidth;
						if (primaryMesh || targetPixel.drawLeft) {
							// Start the mesh point
							if (primaryMesh === false) {
								primaryX = x;
								primaryY = y;
								primaryZ = z;
								primaryColorHash = targetPixel.hash;
								primaryOcclusionHash = targetPixel.occlusionHash;
								primaryMesh = true;
							}
							// Not the end of a row
							if(targetPixel.isFlipped[2] === true){
								primaryMesh = false;
								greedyDimLeft.push([1, 1]);
							} else if (z != zDepthM1) {
								targetAdjPixel = pixels[targetAdjIndex];

								// Adjacent pixel can draw the face
								// Adjacent pixel matches the hash
								if (targetAdjPixel && targetAdjPixel.isFlipped[2] === false && targetAdjPixel.drawLeft != 0 && primaryColorHash === targetAdjPixel.hash && primaryOcclusionHash[2] === targetAdjPixel.occlusionHash[2]) {
									targetAdjPixel.drawLeft = 0;
								} else {
									primaryMesh = false;
									greedyWidth = z + 1 - primaryZ;
									greedyHeight = window.greedy.calculateGreedyLeftFaces(pixels, primaryColorHash, primaryOcclusionHash, primaryX, primaryY + 1, primaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
									greedyDimLeft.push([greedyWidth, greedyHeight]);
								}
							} else {
								if (primaryZ != z) {
									targetPixel.drawLeft = 0;
								}
								primaryMesh = false;
								greedyWidth = z + 1 - primaryZ;
								greedyHeight = window.greedy.calculateGreedyLeftFaces(pixels, primaryColorHash, primaryOcclusionHash, primaryX, primaryY + 1, primaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
								greedyDimLeft.push([greedyWidth, greedyHeight]);
							}
						}

						if (secondaryMesh || targetPixel.drawRight) {
							// Start the mesh point
							if (secondaryMesh === false) {
								secondaryX = x;
								secondaryY = y;
								secondaryZ = z;
								secondaryColorHash = targetPixel.hash;
								secondaryOcclusionHash = targetPixel.occlusionHash;
								secondaryMesh = true;
							}
							// Not the end of a row
							if(targetPixel.isFlipped[3] === true){
								secondaryMesh = false;
								greedyDimRight.push([1, 1]);
							} else if (z != zDepthM1) {
								targetAdjPixel = pixels[targetAdjIndex];

								if (targetAdjPixel && targetAdjPixel.isFlipped[3] === false && targetAdjPixel.drawRight != 0 && secondaryColorHash === targetAdjPixel.hash && secondaryOcclusionHash[3] === targetAdjPixel.occlusionHash[3]) {
									targetAdjPixel.drawRight = 0;
								} else {
									secondaryMesh = false;
									greedyWidth = z + 1 - secondaryZ;
									greedyHeight = window.greedy.calculateGreedyRightFaces(pixels, secondaryColorHash, secondaryOcclusionHash, secondaryX, secondaryY + 1, secondaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
									greedyDimRight.push([greedyWidth, greedyHeight]);
								}
							} else {
								if (secondaryZ != z) {
									targetPixel.drawRight = 0;
								}
								secondaryMesh = false;
								greedyWidth = z + 1 - secondaryZ;
								greedyHeight = window.greedy.calculateGreedyRightFaces(pixels, secondaryColorHash, secondaryOcclusionHash, secondaryX, secondaryY + 1, secondaryZ, yLayerLength, xWidth, yHeight, greedyWidth);
								greedyDimRight.push([greedyWidth, greedyHeight]);
							}
						}
					}
				}
			}
		}

		// Top/Bottom
		for (let y = 0; y < yHeight; y++) {
			for (let z = 0; z < zDepth; z++) {
				baseIndex = y * yLayerLength + z * xWidth;
				for (let x = 0; x < xWidth; x++) {
					targetIndex = baseIndex + x;

					// When greedy length is found, push it to an array for the side
					targetPixel = pixels[targetIndex];

					if (targetPixel) {
						targetAdjIndex = targetIndex + 1;
						if (primaryMesh || targetPixel.drawTop) {
							// Start the mesh point
							if (primaryMesh === false) {
								primaryX = x;
								primaryY = y;
								primaryZ = z;
								primaryColorHash = targetPixel.hash;
								primaryOcclusionHash = targetPixel.occlusionHash;
								primaryMesh = true;
							}
							// Not the end of a row
							if(targetPixel.isFlipped[4] === true){
								primaryMesh = false;
								greedyDimTop.push([1, 1]);
							} else if (x != xWidthM1) {
								targetAdjPixel = pixels[targetAdjIndex];

								// Adjacent pixel can draw the face
								// Adjacent pixel matches the hash
								if (targetAdjPixel && targetAdjPixel.drawTop != 0 && primaryColorHash === targetAdjPixel.hash && primaryOcclusionHash[4] === targetAdjPixel.occlusionHash[4]) {
									targetAdjPixel.drawTop = 0;
								} else {
									primaryMesh = false;
									greedyWidth = x + 1 - primaryX;
									greedyHeight = window.greedy.calculateGreedyTopFaces(pixels, primaryColorHash, primaryOcclusionHash, primaryX, primaryY, primaryZ + 1, yLayerLength, xWidth, zDepth, greedyWidth);
									greedyDimTop.push([greedyWidth, greedyHeight]);
								}
							} else {
								if (primaryX != x) {
									targetPixel.drawTop = 0;
								}
								primaryMesh = false;
								greedyWidth = x + 1 - primaryX;
								greedyHeight = window.greedy.calculateGreedyTopFaces(pixels, primaryColorHash, primaryOcclusionHash, primaryX, primaryY, primaryZ + 1, yLayerLength, xWidth, zDepth, greedyWidth);
								greedyDimTop.push([greedyWidth, greedyHeight]);
							}
						}

						if (secondaryMesh || targetPixel.drawBottom) {
							// Start the mesh point
							if (secondaryMesh === false) {
								secondaryX = x;
								secondaryY = y;
								secondaryZ = z;
								secondaryColorHash = targetPixel.hash;
								secondaryOcclusionHash = targetPixel.occlusionHash;
								secondaryMesh = true;
							}
							// Not the end of a row
							if(targetPixel.isFlipped[5] === true){
								secondaryMesh = false;
								greedyDimBottom.push([1, 1]);
							} else if (x != xWidthM1) {
								targetAdjPixel = pixels[targetAdjIndex];

								// Adjacent pixel can draw the face
								// Adjacent pixel matches the hash
								if (targetAdjPixel && targetAdjPixel.drawBottom != 0 && secondaryColorHash === targetAdjPixel.hash && secondaryOcclusionHash[5] === targetAdjPixel.occlusionHash[5]) {
									targetAdjPixel.drawBottom = 0;
								} else {
									secondaryMesh = false;
									greedyWidth = x + 1 - secondaryX;
									greedyHeight = window.greedy.calculateGreedyBottomFaces(pixels, secondaryColorHash, secondaryOcclusionHash, secondaryX, secondaryY, secondaryZ + 1, yLayerLength, xWidth, zDepth, greedyWidth);
									greedyDimBottom.push([greedyWidth, greedyHeight]);
								}
							} else {
								if (secondaryX != x) {
									targetPixel.drawBottom = 0;
								}
								secondaryMesh = false;
								greedyWidth = x + 1 - secondaryX;
								greedyHeight = window.greedy.calculateGreedyBottomFaces(pixels, secondaryColorHash, secondaryOcclusionHash, secondaryX, secondaryY, secondaryZ + 1, yLayerLength, xWidth, zDepth, greedyWidth);
								greedyDimBottom.push([greedyWidth, greedyHeight]);
							}
						}
					}
				}
			}
		}

		this.greedyDimFront = greedyDimFront;
		this.greedyDimBack = greedyDimBack;
		this.greedyDimLeft = greedyDimLeft;
		this.greedyDimRight = greedyDimRight;
		this.greedyDimTop = greedyDimTop;
		this.greedyDimBottom = greedyDimBottom;
	}
	generatePixelFaceData() {
		this.pixelVertexColorData = [];
		this.pixelIndiceData = [];
		this.pixelIndiceDataLen = 0;

		const pixels = this.pixels;
		const pixelVertexColorData = this.pixelVertexColorData;
		const pixelIndiceData = this.pixelIndiceData;

		const pixelLen = pixels.length;
		let currentIndice = 0;
		let targetPixel;
		for (let a = 0; a < pixelLen; a++) {
			// [0] = verticeColorData, [1] = indices
			targetPixel = pixels[a];
			if (targetPixel) {
				const pixelColors = window.color.generatePixelColors(targetPixel);

				const results = targetPixel.generateFaceData(currentIndice, pixelColors);
				pixelVertexColorData.push(...results[0]);
				pixelIndiceData.push(...results[1]);


				currentIndice = pixelIndiceData[pixelIndiceData.length - 1] + 1;
			}
		}

		this.pixelVertexColorData = new Float32Array(pixelVertexColorData);
		this.pixelIndiceDataLen = pixelIndiceData.length;
		this.pixelIndiceData = new Uint16Array(pixelIndiceData);
	}
	generateGreedyMesh() {
		// Generates the greedy vertex data using the greedy lengths stored for side

		this.pixelVertexColorData = [];
		this.pixelIndiceData = [];
		this.pixelIndiceDataLen = 0;

		const pixels = this.pixels;
		const pixelVertexColorData = this.pixelVertexColorData;
		const pixelIndiceData = this.pixelIndiceData;

		const yLayerLength = this.yLayerLength;
		const yHeight = this.yHeight;
		const zDepth = this.zDepth;
		const xWidth = this.xWidth;

		let baseIndex, targetIndex, targetPixel;

		let indexFront = 0;
		const greedyDimFront = this.greedyDimFront;
		let indexBack = 0;
		const greedyDimBack = this.greedyDimBack;

		let indexLeft = 0;
		const greedyDimLeft = this.greedyDimLeft;
		let indexRight = 0;
		const greedyDimRight = this.greedyDimRight;

		let indexTop = 0;
		const greedyDimTop = this.greedyDimTop;
		let indexBottom = 0;
		const greedyDimBottom = this.greedyDimBottom;

		let targetDim;
		let targetX, targetY, targetZ, targetFaceResults, emission, occlusion, isFlipped;
		let currentIndice = 0;
		// Front/Back, Top/Bottom
		for (let y = 0; y < yHeight; y++) {
			for (let z = 0; z < zDepth; z++) {
				baseIndex = y * yLayerLength + z * xWidth;
				for (let x = 0; x < xWidth; x++) {
					targetIndex = baseIndex + x;

					// When greedy length is found, push it to an array for the side
					targetPixel = pixels[targetIndex];
					targetX = targetPixel.x;
					targetY = targetPixel.y;
					targetZ = targetPixel.z;

					occlusion = targetPixel.occlusion;
					isFlipped = targetPixel.isFlipped;

					if (targetPixel.drawFront) {
						targetDim = greedyDimFront[indexFront];	
						indexFront++;	
						targetFaceResults = window.mesh.generateFrontFace(targetX, targetY, targetZ, targetDim[0], targetDim[1], ...targetPixel.color, targetPixel.intensity, occlusion[0], isFlipped[0], currentIndice);
						pixelVertexColorData.push(...targetFaceResults[0]);
						pixelIndiceData.push(...targetFaceResults[1]);
						currentIndice += 4;
					}
					if (targetPixel.drawBack) {
						targetDim = greedyDimBack[indexBack];
						indexBack++;
						targetFaceResults = window.mesh.generateBackFace(targetX, targetY, targetZ, targetDim[0], targetDim[1], ...targetPixel.color, targetPixel.intensity, occlusion[1], isFlipped[1], currentIndice);
						pixelVertexColorData.push(...targetFaceResults[0]);
						pixelIndiceData.push(...targetFaceResults[1]);
						currentIndice += 4;
					}

					// Top/Bottom
					if (targetPixel.drawTop) {
						targetDim = greedyDimTop[indexTop];
						indexTop++;
						targetFaceResults = window.mesh.generateTopFace(targetX, targetY, targetZ, targetDim[0], targetDim[1], ...targetPixel.color, targetPixel.intensity, occlusion[4], isFlipped[4], currentIndice, targetPixel.height);
						pixelVertexColorData.push(...targetFaceResults[0]);
						pixelIndiceData.push(...targetFaceResults[1]);
						currentIndice += 4;
					}
					if (targetPixel.drawBottom) {
						targetDim = greedyDimBottom[indexBottom];
						indexBottom++;
						targetFaceResults = window.mesh.generateBottomFace(targetX, targetY, targetZ, targetDim[0], targetDim[1], ...targetPixel.color, targetPixel.intensity, occlusion[5], isFlipped[5], currentIndice);
						pixelVertexColorData.push(...targetFaceResults[0]);
						pixelIndiceData.push(...targetFaceResults[1]);
						currentIndice += 4;
					}
				}
			}
		}

		// Left/Right
		for (let y = 0; y < yHeight; y++) {
			for (let x = 0; x < xWidth; x++) {
				baseIndex = y * yLayerLength + x;
				for (let z = 0; z < zDepth; z++) {
					targetIndex = baseIndex + z * xWidth;
					targetPixel = pixels[targetIndex];
					targetX = targetPixel.x;
					targetY = targetPixel.y;
					targetZ = targetPixel.z;

					occlusion = targetPixel.occlusion;
					isFlipped = targetPixel.isFlipped;

					// Left/Right
					if (targetPixel.drawLeft) {
						targetDim = greedyDimLeft[indexLeft];
						indexLeft++;
						targetFaceResults = window.mesh.generateLeftFace(targetX, targetY, targetZ, targetDim[0], targetDim[1], ...targetPixel.color, targetPixel.intensity, occlusion[2], isFlipped[2], currentIndice);
						pixelVertexColorData.push(...targetFaceResults[0]);
						pixelIndiceData.push(...targetFaceResults[1]);
						currentIndice += 4;
					}
					if (targetPixel.drawRight) {
						targetDim = greedyDimRight[indexRight];
						indexRight++;
						targetFaceResults = window.mesh.generateRightFace(targetX, targetY, targetZ, targetDim[0], targetDim[1], ...targetPixel.color, targetPixel.intensity, occlusion[3], isFlipped[3], currentIndice);
						pixelVertexColorData.push(...targetFaceResults[0]);
						pixelIndiceData.push(...targetFaceResults[1]);
						currentIndice += 4;
					}
				}
			}
		}

		this.pixelIndiceDataLen = pixelIndiceData.length;
		this.pixelVertexColorData = new Float32Array(pixelVertexColorData);
		this.pixelIndiceData = new Uint16Array(pixelIndiceData);
	}
	draw() {

	}
}
window.class.Chunk = Chunk;