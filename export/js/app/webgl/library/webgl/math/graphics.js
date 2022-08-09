graphics = {};
graphics.clamp = function (num, min, max){
    const MIN = min || 0;
    const MAX = max || 1;
    return Math.min(Math.max(num, MIN), MAX)
}
graphics.getScreenPosition = function(proj, view, world, model, posOffset, screenWidth, screenHeight){
    const TEST_MATRIX = new Float32Array(16);
    mat4.multiply(TEST_MATRIX, proj, view);
    mat4.multiply(TEST_MATRIX, TEST_MATRIX, world);
    mat4.multiply(TEST_MATRIX, TEST_MATRIX, model);

    const pos = [1.5, 1.5, -1.5];
    const clipCoords = [0, 0, 0, 0];
    clipCoords[0] = posOffset[0] * TEST_MATRIX[0] + posOffset[1] * TEST_MATRIX[4] + posOffset[2] * TEST_MATRIX[8] + TEST_MATRIX[12];
    clipCoords[1] = posOffset[0] * TEST_MATRIX[1] + posOffset[1] * TEST_MATRIX[5] + posOffset[2] * TEST_MATRIX[9] + TEST_MATRIX[13];
    // clipCoords[2] = posOffset[0] * TEST_MATRIX[2] + posOffset[1] * TEST_MATRIX[6] + posOffset[2] * TEST_MATRIX[10] + TEST_MATRIX[14];
    clipCoords[3] = posOffset[0] * TEST_MATRIX[3] + posOffset[1] * TEST_MATRIX[7] + posOffset[2] * TEST_MATRIX[11] + TEST_MATRIX[15];

    const NDC = [0, 0, 0];
    NDC[0] = clipCoords[0] / clipCoords[3];
    NDC[1] = clipCoords[1] / clipCoords[3];
    // NDC[2] = clipCoords[2] / clipCoords[3];

    const screen = [0, 0];
    screen[0] = (screenWidth / 2 * NDC[0]) + (NDC[0] + screenWidth / 2);
    screen[1] = (screenHeight / 2 * NDC[1]) + (NDC[1] + screenHeight / 2);

    // 0 -> 1, [x,y] screen coordinates
    return [screen[0] / screenWidth, screen[1] / screenHeight];
}
graphics.getNormalizedScreenPosition = function(proj, view, world, model, posOffset, screenWidth, screenHeight){
    const TEST_MATRIX = new Float32Array(16);
    mat4.multiply(TEST_MATRIX, proj, view);
    mat4.multiply(TEST_MATRIX, TEST_MATRIX, world);
    mat4.multiply(TEST_MATRIX, TEST_MATRIX, model);

    const pos = [1.5, 1.5, -1.5];
    const clipCoords = [0, 0, 0, 0];
    clipCoords[0] = posOffset[0] * TEST_MATRIX[0] + posOffset[1] * TEST_MATRIX[4] + posOffset[2] * TEST_MATRIX[8] + TEST_MATRIX[12];
    clipCoords[1] = posOffset[0] * TEST_MATRIX[1] + posOffset[1] * TEST_MATRIX[5] + posOffset[2] * TEST_MATRIX[9] + TEST_MATRIX[13];
    // clipCoords[2] = posOffset[0] * TEST_MATRIX[2] + posOffset[1] * TEST_MATRIX[6] + posOffset[2] * TEST_MATRIX[10] + TEST_MATRIX[14];
    clipCoords[3] = posOffset[0] * TEST_MATRIX[3] + posOffset[1] * TEST_MATRIX[7] + posOffset[2] * TEST_MATRIX[11] + TEST_MATRIX[15];

    const NDC = [0, 0, 0];
    NDC[0] = clipCoords[0] / clipCoords[3];
    NDC[1] = clipCoords[1] / clipCoords[3];
    // NDC[2] = clipCoords[2] / clipCoords[3];

    const screen = [0, 0];
    screen[0] = (screenWidth / 2 * NDC[0]) + (NDC[0] + screenWidth / 2);
    screen[1] = (screenHeight / 2 * NDC[1]) + (NDC[1] + screenHeight / 2);

    // 0 -> 1, [x,y] screen coordinates
    return [graphics.clamp(screen[0] / screenWidth, -0.1, 1.1), graphics.clamp(screen[1] / screenHeight, -0.1, 1.1)];
}