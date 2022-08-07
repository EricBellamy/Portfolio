global.__rootdir = __dirname;

const fs = require('fs-extra');
const html = require('./library/html.js');

async function BUILD_HTML(){
	global.__currentbuild = { updated: {} };
	__currentbuild.created_at = new Date().getTime();

	const LOADED_FILE = await html.load({}, "index.html");

	fs.ensureDirSync('dist');
	fs.writeFileSync('dist/index.html', LOADED_FILE.html);
}

async function BUILD_EXPORTS(){
	// Process images
	// Process css
	// Process js
	// Copy all other files
}

async function build(){
	await BUILD_EXPORTS();
	await BUILD_HTML();
}

build();