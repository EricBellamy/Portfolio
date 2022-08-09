window.greedy = {
    calculateGreedyFrontFaces: function (pixels, colorHash, occlusionHash, startingX, startingY, startingZ, yLayerLength, xWidth, yHeight, greedyLength) {
        const rowEnd = startingX + greedyLength;

        let greedyHeight = 1;
        let pixel;
        let rowIsGood;
        for (let y = startingY; y < yHeight; y++) {
            rowIsGood = true;
            for (let x = startingX; x < rowEnd; x++) {
                targetIndex = y * yLayerLength + startingZ * xWidth + x;
                pixel = pixels[targetIndex];
                // TODO :: HAVE TO CHANGE THIS TO "pixel.color"
                if (pixel.drawFront != 1 || pixel.hash != colorHash || pixel.occlusionHash[0] != occlusionHash || pixel.isFlipped[0] === true) {
                    rowIsGood = false;
                    break;
                }
            }
            if (rowIsGood) {
                for (let x = startingX; x < rowEnd; x++) {
                    targetIndex = y * yLayerLength + startingZ * xWidth + x;
                    pixel = pixels[targetIndex];
                    pixel.drawFront = 0;
                }
                greedyHeight++;
            } else {
                break;
            }
        }
        return greedyHeight;
    },
    calculateGreedyBackFaces: function (pixels, colorHash, occlusionHash, startingX, startingY, startingZ, yLayerLength, xWidth, yHeight, greedyLength) {
        const rowEnd = startingX + greedyLength;

        let greedyHeight = 1;
        let pixel;
        let rowIsGood;
        for (let y = startingY; y < yHeight; y++) {
            rowIsGood = true;
            for (let x = startingX; x < rowEnd; x++) {
                targetIndex = y * yLayerLength + startingZ * xWidth + x;
                pixel = pixels[targetIndex];
                if (pixel.drawBack != 1 || pixel.hash != colorHash || pixel.occlusionHash[1] != occlusionHash || pixel.isFlipped[1] === true) {
                    rowIsGood = false;
                    break;
                }
            }
            if (rowIsGood) {
                for (let x = startingX; x < rowEnd; x++) {
                    targetIndex = y * yLayerLength + startingZ * xWidth + x;
                    pixel = pixels[targetIndex];
                    pixel.drawBack = 0;
                }
                greedyHeight++;
            } else {
                break;
            }
        }
        return greedyHeight;
    },
    calculateGreedyLeftFaces: function (pixels, colorHash, occlusionHash, startingX, startingY, startingZ, yLayerLength, xWidth, yHeight, greedyLength) {
        const rowEnd = startingZ + greedyLength;

        let greedyHeight = 1;
        let pixel;
        let rowIsGood;
        for (let y = startingY; y < yHeight; y++) {
            rowIsGood = true;
            for (let z = startingZ; z < rowEnd; z++) {
                targetIndex = y * yLayerLength + z * xWidth + startingX;
                pixel = pixels[targetIndex];
                if (pixel.drawLeft != 1 || pixel.hash != colorHash || pixel.occlusionHash[2] != occlusionHash || pixel.isFlipped[2] === true) {
                    rowIsGood = false;
                    break;
                }
            }
            if (rowIsGood) {
                for (let z = startingZ; z < rowEnd; z++) {
                    targetIndex = y * yLayerLength + z * xWidth + startingX;
                    pixel = pixels[targetIndex];
                    pixel.drawLeft = 0;
                }
                greedyHeight++;
            } else {
                break;
            }
        }
        return greedyHeight;
    },
    calculateGreedyRightFaces: function (pixels, colorHash, occlusionHash, startingX, startingY, startingZ, yLayerLength, xWidth, yHeight, greedyLength) {
        const rowEnd = startingZ + greedyLength;

        let greedyHeight = 1;
        let pixel;
        let rowIsGood;
        for (let y = startingY; y < yHeight; y++) {
            rowIsGood = true;
            for (let z = startingZ; z < rowEnd; z++) {
                targetIndex = y * yLayerLength + z * xWidth + startingX;
                pixel = pixels[targetIndex];
                if (pixel.drawRight != 1 || pixel.hash != colorHash || pixel.occlusionHash[3] != occlusionHash || pixel.isFlipped[3] === true) {
                    rowIsGood = false;
                    break;
                }
            }
            if (rowIsGood) {
                for (let z = startingZ; z < rowEnd; z++) {
                    targetIndex = y * yLayerLength + z * xWidth + startingX;
                    pixel = pixels[targetIndex];
                    pixel.drawRight = 0;
                }
                greedyHeight++;
            } else {
                break;
            }
        }
        return greedyHeight;
    },
    calculateGreedyTopFaces: function (pixels, colorHash, occlusionHash, startingX, startingY, startingZ, yLayerLength, xWidth, zDepth, greedyLength) {
        const rowEnd = startingX + greedyLength;

        let greedyHeight = 1;
        let pixel;
        let rowIsGood;
        for (let z = startingZ; z < zDepth; z++) {
            rowIsGood = true;
            for (let x = startingX; x < rowEnd; x++) {
                targetIndex = startingY * yLayerLength + z * xWidth + x;
                pixel = pixels[targetIndex];
                if (pixel.drawTop != 1 || pixel.hash != colorHash || pixel.occlusionHash[4] != occlusionHash || pixel.isFlipped[4] === true) {
                    rowIsGood = false;
                    break;
                }
            }
            if (rowIsGood) {
                for (let x = startingX; x < rowEnd; x++) {
                    targetIndex = startingY * yLayerLength + z * xWidth + x;
                    pixel = pixels[targetIndex];
                    pixel.drawTop = 0;
                }
                greedyHeight++;
            } else {
                break;
            }
        }
        return greedyHeight;
    },
    calculateGreedyBottomFaces: function (pixels, colorHash, occlusionHash, startingX, startingY, startingZ, yLayerLength, xWidth, zDepth, greedyLength) {
        const rowEnd = startingX + greedyLength;

        let greedyHeight = 1;
        let pixel;
        let rowIsGood;
        for (let z = startingZ; z < zDepth; z++) {
            rowIsGood = true;
            for (let x = startingX; x < rowEnd; x++) {
                targetIndex = startingY * yLayerLength + z * xWidth + x;
                pixel = pixels[targetIndex];
                if (pixel.drawBottom != 1 || pixel.hash != colorHash || pixel.occlusionHash[5] != occlusionHash || pixel.isFlipped[5] === true) {
                    rowIsGood = false;
                    break;
                }
            }
            if (rowIsGood) {
                for (let x = startingX; x < rowEnd; x++) {
                    targetIndex = startingY * yLayerLength + z * xWidth + x;
                    pixel = pixels[targetIndex];
                    pixel.drawBottom = 0;
                }
                greedyHeight++;
            } else {
                break;
            }
        }
        return greedyHeight;
    },
}