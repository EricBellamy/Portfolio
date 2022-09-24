const AOIncrease = 0.33;
function isFlippedQuad(a00, a01, a11, a10) {
    return (a00 + a11) > (a01 + a10);
}
function inverseIsFlippedQuad(a00, a01, a11, a10) {
    return (a00 + a11) < (a01 + a10);
}

// Checks if we can expand horizontally or vertically
function greedyDirection(a00, a01, a11, a10) {
    let directions = [false, false];
    // Check if these points are lined
    if (a00 === a01 && a11 === a10) {
        // Horizontal
        directions[0] = true;
    }
    if (a00 === a10 && a11 === a01) {
        // Vertical
        directions[0] = true;
    }
    return directions;
}
window.occlusion = {
    front: function (x, y, z, xWidthM1, yHeightM1, zDepthM1, targetPixel, pixels, refPixels, refIndices, verticalOffset, horizontalOffset) {
        const occlusion = targetPixel.occlusion[0];

        // Bottom left (left & bottom)
        if (refPixels[0] && refPixels[3]) occlusion[0] = 1;
        // Bottom right (right & bottom)
        if (refPixels[1] && refPixels[3]) occlusion[1] = 1;
        // Top right (right & top)
        if (refPixels[1] && refPixels[2]) occlusion[2] = 1;
        // Top left (left & top)
        if (refPixels[0] && refPixels[2]) occlusion[3] = 1;


        // Bottom left
        if (occlusion[0] != 1) {
            if (refPixels[0]) { // Left
                occlusion[0] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[0] += AOIncrease;
            }
            // Bottom left
            if (x != 0 && pixels[refIndices[3] - horizontalOffset]) {
                occlusion[0] += AOIncrease;
            }
        }
        // Top left
        if (occlusion[3] != 1) {
            if (refPixels[0]) { // Left
                occlusion[3] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[3] += AOIncrease;
            }
            // Top left
            if (x != 0 && pixels[refIndices[2] - horizontalOffset]) {
                occlusion[3] += AOIncrease;
            }
        }

        // Bottom right
        if (occlusion[1] != 1) {
            if (refPixels[1]) { // Right
                occlusion[1] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[1] += AOIncrease;
            }
            // Bottom left
            if (x != xWidthM1 && pixels[refIndices[3] + horizontalOffset]) {
                occlusion[1] += AOIncrease;
            }
        }
        // Top right
        if (occlusion[2] != 1) {
            if (refPixels[1]) { // Right
                occlusion[2] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[2] += AOIncrease;
            }
            // Top left
            if (x != xWidthM1 && pixels[refIndices[2] + horizontalOffset]) {
                occlusion[2] += AOIncrease;
            }
        }

        if (isFlippedQuad(...occlusion)) targetPixel.isFlipped[0] = true;
        targetPixel.occlusionHash[0] = occlusion.join("|");
    },
    back: function (x, y, z, xWidthM1, yHeightM1, zDepthM1, targetPixel, pixels, refPixels, refIndices, verticalOffset, horizontalOffset) {
        const occlusion = targetPixel.occlusion[1];

        // Bottom left (left & bottom)
        if (refPixels[0] && refPixels[3]) occlusion[0] = 1;
        // Bottom right (right & bottom)
        if (refPixels[1] && refPixels[3]) occlusion[1] = 1;
        // Top right (right & top)
        if (refPixels[1] && refPixels[2]) occlusion[2] = 1;
        // Top left (left & top)
        if (refPixels[0] && refPixels[2]) occlusion[3] = 1;

        // Bottom left
        if (occlusion[0] != 1) {
            if (refPixels[0]) { // Left
                occlusion[0] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[0] += AOIncrease;
            }
            // Bottom left
            if (x != xWidthM1 && pixels[refIndices[3] + horizontalOffset]) {
                occlusion[0] += AOIncrease;
            }
        }
        // Top left
        if (occlusion[3] != 1) {
            if (refPixels[0]) { // Left
                occlusion[3] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[3] += AOIncrease;
            }
            // Top left
            if (x != xWidthM1 && pixels[refIndices[2] + horizontalOffset]) {
                occlusion[3] += AOIncrease;
            }
        }

        // Bottom right
        if (occlusion[1] != 1) {
            if (refPixels[1]) { // Right
                occlusion[1] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[1] += AOIncrease;
            }
            // Bottom right
            if (x != 0 && pixels[refIndices[3] - horizontalOffset]) {
                occlusion[1] += AOIncrease;
            }
        }
        // Top right
        if (occlusion[2] != 1) {
            if (refPixels[1]) { // Right
                occlusion[2] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[2] += AOIncrease;
            }
            // Top right
            if (x != 0 && pixels[refIndices[2] - horizontalOffset]) {
                occlusion[2] += AOIncrease;
            }
        }
        if (inverseIsFlippedQuad(...occlusion)) targetPixel.isFlipped[1] = true;
        targetPixel.occlusionHash[1] = occlusion.join("|");
    },
    // left, right, top, bottom
    // refPixels

    // left, right, top, bottom
    // refIndices
    left: function (x, y, z, xWidthM1, yHeightM1, zDepthM1, targetPixel, pixels, refPixels, refIndices, verticalOffset, horizontalOffset) {
        const occlusion = targetPixel.occlusion[2];

        // Bottom left (left & bottom)
        if (refPixels[0] && refPixels[3]) occlusion[0] = 1;
        // Bottom right (right & bottom)
        if (refPixels[1] && refPixels[3]) occlusion[1] = 1;
        // Top right (right & top)
        if (refPixels[1] && refPixels[2]) occlusion[2] = 1;
        // Top left (left & top)
        if (refPixels[0] && refPixels[2]) occlusion[3] = 1;


        // Bottom left
        if (occlusion[0] != 1) {
            if (refPixels[0]) { // Left
                occlusion[0] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[0] += AOIncrease;
            }
            // Bottom left
            if (z != zDepthM1 && pixels[refIndices[3] + horizontalOffset]) {
                occlusion[0] += AOIncrease;
            }
        }
        // Top left
        if (occlusion[3] != 1) {
            if (refPixels[0]) { // Left
                occlusion[3] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[3] += AOIncrease;
            }
            // Top left
            if (z != zDepthM1 && pixels[refIndices[2] + horizontalOffset]) {
                occlusion[3] += AOIncrease;
            }
        }

        // Bottom right
        if (occlusion[1] != 1) {
            if (refPixels[1]) { // Right
                occlusion[1] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[1] += AOIncrease;
            }
            // Bottom left
            if (z != 0 && pixels[refIndices[3] - horizontalOffset]) {
                occlusion[1] += AOIncrease;
            }
        }
        // Top right
        if (occlusion[2] != 1) {
            if (refPixels[1]) { // Right
                occlusion[2] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[2] += AOIncrease;
            }
            // Top left
            if (z != 0 && pixels[refIndices[2] - horizontalOffset]) {
                occlusion[2] += AOIncrease;
            }
        }

        if (isFlippedQuad(...occlusion)) targetPixel.isFlipped[2] = true;
        targetPixel.occlusionHash[2] = occlusion.join("|");
    },
    right: function (x, y, z, xWidthM1, yHeightM1, zDepthM1, targetPixel, pixels, refPixels, refIndices, verticalOffset, horizontalOffset) {
        const occlusion = targetPixel.occlusion[3];

        // Bottom left (left & bottom)
        if (refPixels[0] && refPixels[3]) occlusion[0] = 1;
        // Bottom right (right & bottom)
        if (refPixels[1] && refPixels[3]) occlusion[1] = 1;
        // Top right (right & top)
        if (refPixels[1] && refPixels[2]) occlusion[2] = 1;
        // Top left (left & top)
        if (refPixels[0] && refPixels[2]) occlusion[3] = 1;


        // Bottom left
        if (occlusion[0] != 1) {
            if (refPixels[0]) { // Left
                occlusion[0] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[0] += AOIncrease;
            }
            // Bottom left
            if (z != 0 && pixels[refIndices[3] - horizontalOffset]) {
                occlusion[0] += AOIncrease;
            }
        }
        // Top left
        if (occlusion[3] != 1) {
            if (refPixels[0]) { // Left
                occlusion[3] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[3] += AOIncrease;
            }
            // Top left
            if (z != 0 && pixels[refIndices[2] - horizontalOffset]) {
                occlusion[3] += AOIncrease;
            }
        }

        // Bottom right
        if (occlusion[1] != 1) {
            if (refPixels[1]) { // Right
                occlusion[1] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[1] += AOIncrease;
            }
            // Bottom left
            if (z != zDepthM1 && pixels[refIndices[3] + horizontalOffset]) {
                occlusion[1] += AOIncrease;
            }
        }
        // Top right
        if (occlusion[2] != 1) {
            if (refPixels[1]) { // Right
                occlusion[2] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[2] += AOIncrease;
            }
            // Top left
            if (z != zDepthM1 && pixels[refIndices[2] + horizontalOffset]) {
                occlusion[2] += AOIncrease;
            }
        }

        if (isFlippedQuad(...occlusion)) targetPixel.isFlipped[3] = true;
        targetPixel.occlusionHash[3] = occlusion.join("|");
    },
    top: function (x, y, z, xWidthM1, yHeightM1, zDepthM1, targetPixel, pixels, refPixels, refIndices, verticalOffset, horizontalOffset) {
        const occlusion = targetPixel.occlusion[4];

        // Bottom left (left & bottom)
        if (refPixels[0] && refPixels[3]) occlusion[0] = 1;
        // Bottom right (right & bottom)
        if (refPixels[1] && refPixels[3]) occlusion[1] = 1;
        // Top right (right & top)
        if (refPixels[1] && refPixels[2]) occlusion[2] = 1;
        // Top left (left & top)
        if (refPixels[0] && refPixels[2]) occlusion[3] = 1;


        // Bottom left
        if (occlusion[0] != 1) {
            if (refPixels[0]) { // Left
                occlusion[0] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[0] += AOIncrease;
            }
            // Bottom left
            if (z != 0 && x != 0 && pixels[refIndices[3] - horizontalOffset]) {
                occlusion[0] += AOIncrease;
            }
        }
        // Top left
        if (occlusion[3] != 1) {
            if (refPixels[0]) { // Left
                occlusion[3] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[3] += AOIncrease;
            }
            // Top left
            if (z != zDepthM1 && x != 0 && pixels[refIndices[2] - horizontalOffset]) {
                occlusion[3] += AOIncrease;
            }
        }

        // Bottom right
        if (occlusion[1] != 1) {
            if (refPixels[1]) { // Right
                occlusion[1] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[1] += AOIncrease;
            }
            // Bottom left
            if (z != 0 && x != xWidthM1 && pixels[refIndices[3] + horizontalOffset]) {
                occlusion[1] += AOIncrease;
            }
        }
        // Top right
        if (occlusion[2] != 1) {
            if (refPixels[1]) { // Right
                occlusion[2] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[2] += AOIncrease;
            }
            // Top left
            if (z != zDepthM1 && x != xWidthM1 && pixels[refIndices[2] + horizontalOffset]) {
                occlusion[2] += AOIncrease;
            }
        }

        if (isFlippedQuad(...occlusion)) targetPixel.isFlipped[4] = true;
        targetPixel.occlusionHash[4] = occlusion.join("|");
    },
    bottom: function (x, y, z, xWidthM1, yHeightM1, zDepthM1, targetPixel, pixels, refPixels, refIndices, verticalOffset, horizontalOffset) {
        const occlusion = targetPixel.occlusion[5];

        // Bottom left (left & bottom)
        if (refPixels[0] && refPixels[3]) occlusion[0] = 1;
        // Bottom right (right & bottom)
        if (refPixels[1] && refPixels[3]) occlusion[1] = 1;
        // Top right (right & top)
        if (refPixels[1] && refPixels[2]) occlusion[2] = 1;
        // Top left (left & top)
        if (refPixels[0] && refPixels[2]) occlusion[3] = 1;

        // Bottom left
        if (occlusion[0] != 1) {
            if (refPixels[0]) { // Left
                occlusion[0] += AOIncrease;
            } else if (refPixels[3]) { // Bottom
                occlusion[0] += AOIncrease;
            }
            // Bottom left
            if (z != zDepthM1 && x != 0 && pixels[refIndices[3] - horizontalOffset]) {
                occlusion[0] += AOIncrease;
            }
        }
        // Top left
        if (occlusion[3] != 1) {
            if (refPixels[0]) { // Left
                occlusion[3] += AOIncrease;
            } else if (refPixels[2]) { // Top
                occlusion[3] += AOIncrease;
            }
            // Top left
            if (z != 0 && x != 0 && pixels[refIndices[2] - horizontalOffset]) {
                occlusion[3] += AOIncrease;
            }
        }
        // Bottom right
        if(occlusion[1] != 1){
            if(refPixels[1]){ // Right
                occlusion[1] += AOIncrease;
            } else if(refPixels[3]){ // Bottom
                occlusion[1] += AOIncrease;
            }
            // Bottom right
            if(z != zDepthM1 && x != xWidthM1 && pixels[refIndices[3] + horizontalOffset]){
                occlusion[1] += AOIncrease;
            }
        }
        // Top right
        if(occlusion[2] != 1){
            if(refPixels[1]){ // Right
                occlusion[2] += AOIncrease;
            } else if(refPixels[2]){ // Top
                occlusion[2] += AOIncrease;
            }
            // Top right
            if(z != 0 && x != xWidthM1 && pixels[refIndices[2] + horizontalOffset]){
                occlusion[2] += AOIncrease;
            }
        }

        if (inverseIsFlippedQuad(...occlusion)) targetPixel.isFlipped[5] = true;
        targetPixel.occlusionHash[5] = occlusion.join("|");
    },
}