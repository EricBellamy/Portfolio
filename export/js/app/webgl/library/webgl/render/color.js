window.color = {
	// Generates color data for a face without normals
	generateFaceColorData: function (r, g, b) {
		return [
			r, g, b,
			r, g, b,
			r, g, b,
			r, g, b
		]
	},
	generatePixelColors: function(pixel){
		return [
			...window.color.generatePixelFront(pixel),
			...window.color.generatePixelBack(pixel),
			...window.color.generatePixelLeft(pixel),
			...window.color.generatePixelRight(pixel),
			...window.color.generatePixelTop(pixel),
			...window.color.generatePixelBottom(pixel)
		]
	},
	generatePixelFront: function(pixel){
		return window.color.generateFaceColorData(pixel.r * 0.9, pixel.g * 0.9, pixel.b * 0.9);
		// return window.color.generateFaceColorData(pixel.r, pixel.g, pixel.b);
	},
	generatePixelBack: function(pixel){
		return window.color.generateFaceColorData(pixel.r * 0.9, pixel.g * 0.9, pixel.b * 0.9);
		// return window.color.generateFaceColorData(pixel.r, pixel.g, pixel.b);
	},
	generatePixelLeft: function(pixel){
		return window.color.generateFaceColorData(pixel.r * 0.8, pixel.g * 0.8, pixel.b * 0.8);
		// return window.color.generateFaceColorData(pixel.r, pixel.g, pixel.b);
	},
	generatePixelRight: function(pixel){
		return window.color.generateFaceColorData(pixel.r * 0.8, pixel.g * 0.8, pixel.b * 0.8);
		// return window.color.generateFaceColorData(pixel.r, pixel.g, pixel.b);
	},
	generatePixelTop: function(pixel){
		return window.color.generateFaceColorData(pixel.r, pixel.g, pixel.b);
	},
	generatePixelBottom: function(pixel){
		return window.color.generateFaceColorData(pixel.r * 0.6, pixel.g * 0.6, pixel.b * 0.6);
		// return window.color.generateFaceColorData(pixel.r, pixel.g, pixel.b);
	},
	// Converts hex to rgb
	hex: function(hexcode) {
		if(hexcode[0] === "#"){
			hexcode = hexcode.substring(1);
		}
		if(hexcode.length === 3){
			hexcode = `${hexcode[0]}${hexcode[0]}${hexcode[1]}${hexcode[1]}${hexcode[2]}${hexcode[2]}`;
		}
		const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexcode);
		return result ? [
			parseInt(result[1], 16) / 255,
			parseInt(result[2], 16) / 255,
			parseInt(result[3], 16) / 255
		] : [1, 0, 0];
	},
	rgb: function(){

	},
	int: function(){

	}
}

// window.color.red = window.color.hex("ff0000");
window.palette = {
	stone: window.color.hex("fffade"),
	grass: window.color.hex("14cc14"),
	water: window.color.hex("0000ff"),
	tree_trunk: window.color.hex("6e4000"),
	tree_leaves: window.color.hex("017301"),

	iron: window.color.hex("111"),
	lantern: window.color.hex("bbbb02"),

	flower_stem: window.color.hex("027a02"),
	flower_core: window.color.hex("ffff00"),
	flower_core2: window.color.hex("ff5722"),
	flower_petal: window.color.hex("ff5722"),

	flower_petal2: window.color.hex("fafafa"),
	flower_petal3: window.color.hex("ba68c8"),
	flower_petal4: window.color.hex("00e5ff"),


	grass1: window.color.hex("2c632d"),
	grass2: window.color.hex("3e8e41"),
	grass3: window.color.hex("3aa53e"),
	grass4: window.color.hex("93c757"),

	gray: window.color.hex("999"),
	purple: window.color.hex("cc66ff"),
	sunlight: window.color.hex("ff9100"),
	moonlight: window.color.hex("b8efff"),




	white: window.color.hex("fafafa"),
	white2: window.color.hex("eeeeee"),
	white3: window.color.hex("bdbdbd"),
	white4: window.color.hex("9e9e9e"),

	black: window.color.hex("757575"),
	black2: window.color.hex("616161"),
	black3: window.color.hex("424242"),
	black4: window.color.hex("212121"),

	brown: window.color.hex("99521f"),
	brown2: window.color.hex("7d3816"),
	brown3: window.color.hex("692f12"),
	brown4: window.color.hex("58260f"),

	green: window.color.hex("93c757"),
	green2: window.color.hex("7fb83d"),
	green3: window.color.hex("3e8e41"),
	green4: window.color.hex("2c632d"),

	lightblue: window.color.hex("00e5ff"),
	lightblue2: window.color.hex("00bdd6"),
	lightblue3: window.color.hex("00838f"),
	lightblue4: window.color.hex("006366"),

	blue: window.color.hex("304ffe"),
	blue2: window.color.hex("115dd0"),
	blue3: window.color.hex("0d47a1"),
	blue4: window.color.hex("1a227e"),

	pink: window.color.hex("df40fb"),
	pink2: window.color.hex("ba68c8"),
	pink3: window.color.hex("9b27b0"),
	pink4: window.color.hex("691b9a"),

	pinkred: window.color.hex("ff4081"),
	pinkred2: window.color.hex("f50056"),
	pinkred3: window.color.hex("d81b60"),
	pinkred4: window.color.hex("c2185b"),

	red: window.color.hex("ff1745"),
	red2: window.color.hex("ff5050"),
	red3: window.color.hex("d32f2f"),
	red4: window.color.hex("b71c1c"),

	orange: window.color.hex("ff5622"),
	orange2: window.color.hex("f4511e"),
	orange3: window.color.hex("e64a19"),
	orange4: window.color.hex("bf360c"),

	yellow: window.color.hex("ffff00"),
	yellow2: window.color.hex("ffea00"),
	yellow3: window.color.hex("ffd600"),
	yellow4: window.color.hex("fbc12d"),
}