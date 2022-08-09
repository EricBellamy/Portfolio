class ModelManager {
    data = {
        "window": {
            size: [5, 5, 1],
            pixels: [
                1,1,1,1,1,
                1,1,1,1,1,
                1,1,1,1,1,
                1,1,1,1,1,
                1,1,1,1,1,
            ]
        },
        "cube": {
            size: [3, 3, 3],
            pixels: [
                1, 1, 1,
                1, 1, 1,
                1, 1, 1,

                1, 1, 1,
                1, 1, 1,
                1, 1, 1,

                1, 1, 1,
                1, 1, 1,
                1, 1, 1,
            ]
        },
        "water": {
            size: [9, 1, 6],
            pixels: [
                0,0,0,0,0,0,0,0,0,
                0,0,1,1,1,1,1,0,0,
                0,0,0,0,0,1,1,1,0,
                0,0,0,0,0,0,1,0,0,
                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
            ]
        },
        "duck": {
            size: [4, 7, 7],
            pixels: [
                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                0,1,1,0,
                0,1,1,0,
                0,1,1,0,
                0,0,0,0,

                0,0,0,0,
                0,1,1,0,
                1,1,1,1,
                1,1,1,1,
                1,1,1,1,
                1,1,1,1,
                0,1,1,0,

                0,0,0,0,
                0,1,1,0,
                1,1,1,1,
                1,1,1,1,
                1,1,1,1,
                1,1,1,1,
                0,1,1,0,

                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                0,1,1,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,

                0,2,2,0,
                1,1,1,1,
                1,1,1,1,
                1,1,1,1,
                0,1,1,0,
                0,0,0,0,
                0,0,0,0,

                0,0,0,0,
                3,1,1,3,
                1,1,1,1,
                1,1,1,1,
                0,1,1,0,
                0,0,0,0,
                0,0,0,0,

                0,0,0,0,
                0,0,0,0,
                0,1,1,0,
                0,1,1,0,
                0,0,0,0,
                0,0,0,0,
                0,0,0,0,
            ]
        },
        "bench": {
            size: [16, 4, 8],
            pixels: [
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,

                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,

                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,

                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            ]
        },
        "boots": {
            size: [8, 3, 5],
            pixels: [
                0,1,1,1,1,1,1,0,
                1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,
                0,1,1,1,1,1,1,0,

                0,2,2,2,2,2,2,0,
                2,2,2,2,2,2,2,2,
                2,2,2,2,2,2,2,2,
                2,2,2,2,2,2,2,2,
                0,2,2,2,2,2,2,0,

                0,0,2,2,2,2,0,0,
                0,2,2,2,2,2,2,0,
                0,2,2,2,2,2,2,0,
                0,2,2,2,2,2,2,0,
                0,0,2,2,2,2,0,0,
            ]
        },
        "grass": {
            size: [13,7,9],
            pixels: [
                0,0,0,0,0,0,0,0,0,0,0,0,1,
                0,0,0,0,0,0,1,0,0,0,0,0,0,
                0,1,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,1,0,0,0,0,0,0,0,
                1,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,0,0,0,1,
                0,0,0,0,0,0,1,0,0,0,0,0,0,
                0,1,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,1,0,0,0,0,0,0,0,
                2,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,0,0,0,1,
                0,0,0,0,0,0,1,0,0,0,0,0,1,
                0,2,0,0,0,0,0,0,0,0,0,0,0,
                0,2,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,2,0,
                0,0,0,0,0,2,0,0,0,0,0,0,0,
                3,0,0,0,0,3,0,0,0,0,0,0,0,
                3,0,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,2,0,0,0,0,0,2,
                0,0,0,0,0,0,2,0,0,0,0,0,0,
                0,4,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,3,0,
                0,0,0,0,0,0,0,0,0,0,0,3,0,
                0,0,0,0,0,3,0,0,0,0,0,0,0,
                4,0,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,3,
                0,0,0,0,0,0,3,0,0,0,0,0,3,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,4,0,
                0,0,0,0,0,3,0,0,0,0,0,4,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,3,0,0,0,0,0,4,
                0,0,0,0,0,0,3,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,4,0,0,0,0,0,0,0,
                0,0,0,0,0,4,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,4,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,4,0,0,0,0,0,0,0,
            ]
        },
        "long_grass": {
            size: [14,9,10],
            pixels: [
                0,0,0,0,0,0,0,0,1,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                0,0,0,0,1,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,1,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                0,0,0,0,1,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,2,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,2,
                0,0,0,0,2,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,2,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,2,
                0,0,0,0,2,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,3,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,3,
                0,0,0,0,3,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,3,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,3,
                0,0,0,0,3,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,3,3,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,3,3,
                0,0,0,3,3,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,3,3,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,3,3,
                0,0,0,3,3,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,3,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,3,0,
                0,0,0,3,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,3,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,3,0,
                0,0,0,3,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,3,3,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,3,3,0,
                0,0,3,3,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,3,3,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,3,3,0,
                0,0,3,3,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,3,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,3,0,0,
                0,0,3,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,3,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,3,0,0,
                0,0,3,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,4,4,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,4,4,0,0,
                0,4,4,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,4,4,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,4,4,0,0,
                0,4,4,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,4,4,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,4,4,0,0,0,
                4,4,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,4,4,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,4,4,0,0,0,
                4,4,0,0,0,0,0,0,0,0,0,0,0,0,
            ]
        },
        "flower": {
            size: [7,2,4],
            pixels: [
                0,0,0,0,0,0,0,
                0,0,0,0,0,1,0,
                0,1,0,0,0,0,0,
                0,0,0,0,0,0,0,

                0,0,0,0,0,3,0,
                0,3,0,0,3,2,3,
                3,2,3,0,0,3,0,
                0,3,0,0,0,0,0,
            ]
        },
        "multiflower": {
            size: [16,3,12],
            pixels: [
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,4,0,0,0,0,0,0,0,0,6,0,0,0,
                0,0,4,2,4,0,0,0,0,0,0,6,2,6,0,0,
                0,0,0,4,0,0,0,0,0,0,0,0,6,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,5,2,5,0,0,0,0,0,0,
                0,3,0,0,0,0,0,0,5,0,0,0,0,0,0,0,
                3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,
                0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,3,
                0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,
            ]
        },
        "lantern": {
            size: [5, 8, 5],
            pixels: [
                1,1,1,1,1,
                1,2,2,2,1,
                1,2,2,2,1,
                1,2,2,2,1,
                1,1,1,1,1,

                1,0,0,0,1,
                0,2,2,2,0,
                0,2,2,2,0,
                0,2,2,2,0,
                1,0,0,0,1,

                1,0,0,0,1,
                0,2,2,2,0,
                0,2,2,2,0,
                0,2,2,2,0,
                1,0,0,0,1,

                1,0,0,0,1,
                0,2,2,2,0,
                0,2,2,2,0,
                0,2,2,2,0,
                1,0,0,0,1,

                1,0,0,0,1,
                0,2,2,2,0,
                0,2,2,2,0,
                0,2,2,2,0,
                1,0,0,0,1,

                1,0,0,0,1,
                0,2,2,2,0,
                0,2,2,2,0,
                0,2,2,2,0,
                1,0,0,0,1,

                1,1,1,1,1,
                1,2,2,2,1,
                1,2,2,2,1,
                1,2,2,2,1,
                1,1,1,1,1,

                0,0,0,0,0,
                0,1,1,1,0,
                0,1,1,1,0,
                0,1,1,1,0,
                0,0,0,0,0,
            ]
        },
        "scene": {
            size: [9, 8, 6],
            pixels: [
                0,0,0,0,0,0,0,0,0,
                0,0,0,1,1,1,0,0,0,
                0,0,1,1,1,1,1,1,0,
                0,1,1,1,1,1,1,0,0,
                0,0,1,1,1,0,0,0,0,
                0,0,0,0,0,0,0,0,0,

                0,0,0,1,1,1,1,0,0,
                0,1,1,1,1,1,1,1,0,
                1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,0,
                0,1,1,1,1,1,1,0,0,
                0,0,0,1,1,0,0,0,0,

                0,0,2,2,2,2,2,2,0,
                0,2,0,0,0,0,0,2,2,
                2,2,2,2,2,0,0,0,2,
                2,2,2,2,2,2,0,2,2,
                2,2,2,2,2,2,2,2,0,
                0,0,2,2,2,0,0,0,0,

                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,4,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,0,0,2,2,0,0,0,0,

                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,4,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                5,5,5,0,0,0,0,0,0,
                5,4,5,0,0,0,0,0,0,
                5,5,5,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,5,0,0,0,0,0,0,0,
                5,4,5,0,0,0,0,0,0,
                0,5,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,

                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,5,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
                0,0,0,0,0,0,0,0,0,
            ]
        },
        "pixel": {
            size: [1, 1, 1],
            pixels: [
                1
            ]
        }
    }
    group_linked_models = {}
    group_attributes = {}

    // The model chunk data
    model_chunks = {}

    // Stores position, colors, isEnabled 
    model_config = {
        // "cube"
    }
    constructor() {
        // Initialize the model data vertices
        this.initColorCounts();
    }
    setup(gl, ext, vertexBuffer, indexBuffer) {
        this.gl = gl;
        this.ext = ext;
        this.vertexBuffer = vertexBuffer;
        this.indexBuffer = indexBuffer;
    }
    initColorCounts() {
        for (const MODEL_NAME in this.data) {
            if (this.data[MODEL_NAME].colorCount === undefined) {
                let colorCount = 1;
                for (const PIXEL_COLORDEX of this.data[MODEL_NAME].pixels) {
                    if (colorCount < PIXEL_COLORDEX) {
                        colorCount = PIXEL_COLORDEX;
                    }
                }
                this.data[MODEL_NAME].colorCount = colorCount;
            }
        }
    }
    register(MODEL_NAME, data) {
        if (this.attributes[MODEL_NAME] === undefined) {
            this.data[MODEL_NAME] = data;
            this.attributes[MODEL_NAME] = [];
        }
    }
    rebuildAttributes(GROUP_NAME) {
        const model_instances = this.model_config[GROUP_NAME];
        if (model_instances) {
            const TARGET_MODEL = this.group_attributes[GROUP_NAME];

            let enabledModels = 0;
            for (const instance_key in model_instances) {
                if (model_instances[instance_key].enabled) {
                    enabledModels++;
                }
            }

            TARGET_MODEL.enabledModels = enabledModels
            TARGET_MODEL.matrices = [];
            TARGET_MODEL.matrices_data = [];
            TARGET_MODEL.alpha = [];
            
            this.rebuildMatrix(GROUP_NAME);
        }
    }
    rebuildMatrix(GROUP_NAME){
        const TARGET_MODEL = this.group_attributes[GROUP_NAME];
        
        if (TARGET_MODEL === undefined || TARGET_MODEL.enabledModels === 0) {
            // Probably clear the instance binds somewhere in this function before re-setting them
            return;
        }
        // Create the matrix data buffer (1d array)
        const matrixData = new Float32Array(TARGET_MODEL.enabledModels * 16);
        const model_instances = this.model_config[GROUP_NAME];

        let TARGET_INSTANCE;
        let matrixCount = 0;
        const newMatrices = [];
        for (const instance_key in model_instances) {
            TARGET_INSTANCE = model_instances[instance_key];
            if (TARGET_INSTANCE.enabled) {
                // Initiate the matrix
                TARGET_INSTANCE.matrix = new Float32Array(
                    matrixData.buffer,
                    matrixCount * 16 * 4,
                    16);
                matrixCount++;

                mat4.translation(...TARGET_INSTANCE.pos, TARGET_INSTANCE.matrix);
                mat4.zRotate(TARGET_INSTANCE.matrix, TARGET_INSTANCE.pitch, TARGET_INSTANCE.matrix);
                mat4.yRotate(TARGET_INSTANCE.matrix, TARGET_INSTANCE.yaw, TARGET_INSTANCE.matrix);

                if(TARGET_INSTANCE.scale === 0.1){
                    mat4.scale(TARGET_INSTANCE.matrix, 0.1, 0.1, 0.1, TARGET_INSTANCE.matrix);
                }

                newMatrices.push(TARGET_INSTANCE.matrix);
            }
        }


        // Attach the matrix data
        TARGET_MODEL.matrices = newMatrices;
        TARGET_MODEL.matrices_data = matrixData;
    }
    updatePosition(GROUP_NAME, INSTANCE_NAME, position){
        this.model_config[GROUP_NAME][INSTANCE_NAME].pos = position;
    }
    get(GROUP_NAME) {
        return this.group_attributes[GROUP_NAME];
    }
    link(GROUP_NAME, params) {
        if (this.group_linked_models[GROUP_NAME] === undefined) {
            this.group_linked_models[GROUP_NAME] = params.model;
            const groupModelData = this.initGroupModel(GROUP_NAME, params.model, params.colors, params.waterBottom, params.waterColor);
            this.initGroupAttributes(GROUP_NAME, params.model, groupModelData);
        } else {
            console.error(`[link] Group name "${GROUP_NAME}" already in use.`);
        }
    }
    initGroupModel(GROUP_NAME, MODEL_NAME, MODEL_COLORS, waterBottom, waterColor) {
        // Bright red if the user forgot a color
        if (MODEL_COLORS.length === 0) {
            MODEL_COLORS.push([palette.red, 3]);
        }
        // Stretch the last color to the rest of the required color indices
        if (MODEL_COLORS.length < this.data[MODEL_NAME].colorCount) {
            const baseLength = MODEL_COLORS.length - 1;
            const countDiff = this.data[MODEL_NAME].colorCount - (baseLength + 1);
            for (let a = 0; a < countDiff; a++) {
                MODEL_COLORS.push(MODEL_COLORS[baseLength]);
            }
        }
        const FINAL_COLORS = [];
        for (let a = 0; a < MODEL_COLORS.length; a++) {
            FINAL_COLORS.push([
                [...MODEL_COLORS[a][0], MODEL_COLORS[a][1]], // rgba
                MODEL_COLORS[a][2] != undefined ? MODEL_COLORS[a][2] : 0 // emissionIntensity
            ]);
        }

        // Create the chunk with the formatted colors
        return new window.class.Chunk(this.data[MODEL_NAME].size, this.data[MODEL_NAME].pixels, FINAL_COLORS, waterBottom, waterColor);
    }
    initGroupAttributes(GROUP_NAME, MODEL_NAME, MODEL_DATA) {
        if (this.group_attributes[GROUP_NAME] === undefined) {
            this.group_attributes[GROUP_NAME] = {
                data: MODEL_DATA,
                colorCount: 3,
                matrices: [],
                colors: [],
                alpha: []
            }
        }
    }
    new(GROUP_NAME, params, REBUILD = true) {
        // pos, colors
        if (this.model_config[GROUP_NAME] === undefined) {
            this.model_config[GROUP_NAME] = {};
        }

        // Create the model instance
        this.model_config[GROUP_NAME][params.name] = {
            name: params.name,
            pos: params.pos || [0, 0, 0],
            pitch: params.pitch || 0,
            yaw: params.yaw || 0,
            scale: params.scale || 1,
            enabled: params.enabled != undefined ? params.enabled : true
        };
        if (REBUILD && params.enabled != false) {
            this.rebuildAttributes(GROUP_NAME);
        }
    }
    rebuild(GROUP_NAME) {
        this.rebuildAttributes(GROUP_NAME);
        // const TARGET_MODEL = this.group_attributes[GROUP_NAME];

        // Generate the colors here for every vertice
        // this.generateColors(TARGET_MODEL, TARGET_MODEL.data, TARGET_MODEL.instance_colors);
    }
    buffer(GROUP_NAME) {
        const model = this.group_attributes[GROUP_NAME];

        if (model) {
            const gl = this.gl;
            model.matrixBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, model.matrixBuffer);
            // just allocate the buffer
            gl.bufferData(gl.ARRAY_BUFFER, model.matrices_data.byteLength, gl.DYNAMIC_DRAW);
        } else {
            // console.error(`[buffer] Can't buffer group: "${GROUP_NAME}". Doesn't exist.`);
        }
    }
    draw(GROUP_NAME, matrixAttribLocation) {
        const model = this.group_attributes[GROUP_NAME];

        if (model) {
            const gl = this.gl;
            const ext = this.ext;
            // Bind the sun matrices
            gl.bindBuffer(gl.ARRAY_BUFFER, model.matrixBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, model.matrices_data);

            // set all 4 attributes for matrix
            for (let i = 0; i < 4; ++i) {
                const loc = matrixAttribLocation + i;
                gl.enableVertexAttribArray(loc);
                // note the stride and offset
                const offset = i * 16;  // 4 floats per row, 4 bytes per float
                gl.vertexAttribPointer(
                    loc,              // location
                    4,                // size (num values to pull from buffer per iteration)
                    gl.FLOAT,         // type of data in buffer
                    false,            // normalize
                    4 * 16,   // stride, num bytes to advance to get to next set of values
                    offset,           // offset in buffer
                );
                // this line says this attribute only changes for each 1 instance
                ext.vertexAttribDivisorANGLE(loc, 1);
            }


            // Vertex data
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);



            // Instance data
            gl.bufferData(gl.ARRAY_BUFFER, model.data.pixelVertexColorData, gl.STATIC_DRAW);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.data.pixelIndiceData, gl.STATIC_DRAW);

            ext.drawArraysInstancedANGLE(
                gl.TRIANGLES,
                0,             // offset
                model.data.pixelVertexColorData.length / 12,   // num vertices per instance
                model.matrices.length,  // num instances
            );
        } else {
            // console.error(`[draw] Can't draw model group: "${GROUP_NAME}". Doesn't exist.`);
        }
    }
}
window.gameInitFunctions["varSetup1"].push(function () {
    window.model = new ModelManager();
});

const sunOffset = 10;
window.sunFrame = 0;
window.sunPosition = [0,sunOffset, -sunOffset];
window.calculateSunPosition = function(){
    window.sunPosition = [sunOffset * Math.sin(window.sunFrame / 30), sunOffset * Math.cos(window.sunFrame / 30), -sunOffset * Math.cos(window.sunFrame / 30)];
}
window.gameInitFunctions["gameInit2"].push(function () {
    keyboard.register({
        name: "Sun Left",
        code: "comma",
        down: function () {
            window.sunFrame++;
            window.calculateSunPosition();
            window.model.updatePosition("sun", "sun", window.sunPosition);
            window.model.rebuildMatrix("sun");
        },
        hold: function(){
            window.sunFrame++;
            window.calculateSunPosition();
            window.model.updatePosition("sun", "sun", window.sunPosition);
            window.model.rebuildMatrix("sun");
        }
    });
    keyboard.register({
        name: "Sun Right",
        code: "period",
        down: function () {
            window.sunFrame--;
            window.calculateSunPosition();
            window.model.updatePosition("sun", "sun", window.sunPosition);
            window.model.rebuildMatrix("sun");
        },
        hold: function(){
            window.sunFrame--;
            window.calculateSunPosition();
            window.model.updatePosition("sun", "sun", window.sunPosition);
            window.model.rebuildMatrix("sun");
        }
    });
});