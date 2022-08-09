const fs = require('fs-extra');
const webp = require('webp-converter');

const { minify } = require("terser");
const CleanCSS = require('clean-css');
const minifyCSS = new CleanCSS();

function getFileType(FILE_PATH) {
	const parts = FILE_PATH.split(".");
	if (1 < parts.length) return parts[1];
	return '';
}

function READ_DIR_FILES(CURRENT_PATH, RELATIVE_PATH, FILES) {
	const items = fs.readdirSync(CURRENT_PATH);
	for (const item of items) {
		const ITEM_PATH = `${CURRENT_PATH}/${item}`;
		const RELATIVE_ITEM_PATH = `${RELATIVE_PATH}/${item}`;

		const stat = fs.statSync(ITEM_PATH);
		if (stat.isDirectory()) {
			READ_DIR_FILES(ITEM_PATH, RELATIVE_ITEM_PATH, FILES);
		} else {
			const file_type = getFileType(item);
			FILES[RELATIVE_ITEM_PATH] = {
				type: file_type,
				modified: stat.mtimeMs,
			}
		}
	}
	return FILES;
}

module.exports = {
	build: async function (EXPORT_PATH) {
		const files = READ_DIR_FILES(EXPORT_PATH, "", {});

		let LAST_BUILD;

		try { LAST_BUILD = JSON.parse(fs.readFileSync('dist/build.json')); }
		catch (err) { LAST_BUILD = {}; }

		// Process images
		for (const file_key in files) {
			const file = files[file_key];
			const LAST_BUILD_FILE = LAST_BUILD[file_key];

			// Check if the file has been modified since last build
			if (LAST_BUILD_FILE === undefined || LAST_BUILD_FILE.modified != file.modified) {
				const INPUT_PATH = `${EXPORT_PATH}${file_key}`;
				const noFileTypePath = file_key.substring(0, file_key.lastIndexOf('.'));
				const OUTPUT_DIR = `dist${file_key.substring(0, file_key.lastIndexOf("/"))}`;
				fs.ensureDirSync(OUTPUT_DIR);

				console.log(`Building ${INPUT_PATH} for export.`);

				switch (file.type) {
					case 'png':
						const OUTPUT_PATH = `dist${noFileTypePath}.webp`;

						await webp.cwebp(`${EXPORT_PATH}/${file_key}`, OUTPUT_PATH, "-q 80", logging = "-v");
						break;
					case "js":
						const jsContents = fs.readFileSync(INPUT_PATH, 'utf8');

						let jsResult;
						try {
							jsResult = await minify(jsContents);
						} catch(err){
							jsResult = jsContents;
						}

						// Minified
						// fs.writeFileSync(`dist${noFileTypePath}.js`, jsResult.code);
						// Non-Minified
						fs.writeFileSync(`dist${noFileTypePath}.js`, jsContents);
						break;
					case "css":
						const cssContents = fs.readFileSync(INPUT_PATH, 'utf8');

						let cssResult;
						try {
							cssResult = minifyCSS.minify(cssContents);
							cssResult = cssResult.styles;
						} catch(err){
							cssResult = cssContents;
						}

						fs.writeFileSync(`dist${noFileTypePath}.css`, cssResult);
						break;
					default:
						// Copy all other files
						fs.copyFileSync(INPUT_PATH, `dist${file_key}`);
						break;
				}
			}
		}

		fs.writeFileSync('dist/build.json', JSON.stringify(files));
	}
}