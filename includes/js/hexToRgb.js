window.hexToRgb = function (hexcode) {
	if (hexcode[0] === "#") {
		hexcode = hexcode.substring(1);
	}
	if (hexcode.length === 3) {
		hexcode = `${hexcode[0]}${hexcode[0]}${hexcode[1]}${hexcode[1]}${hexcode[2]}${hexcode[2]}`;
	}
	const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexcode);
	return result ? [
		parseInt(result[1], 16) / 255,
		parseInt(result[2], 16) / 255,
		parseInt(result[3], 16) / 255
	] : [1, 0, 0];
}