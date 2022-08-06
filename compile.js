global.__rootdir = __dirname;

const fs = require('fs-extra');
const html = require('./library/html.js');

async function build(){
	global.__currentbuild = { updated: {} };
	__currentbuild.created_at = new Date().getTime();

	const LOADED_FILE = await html.load({}, "index.html");

	fs.ensureDirSync('dist');
	fs.writeFileSync('dist/index.html', LOADED_FILE.html);
}

build();