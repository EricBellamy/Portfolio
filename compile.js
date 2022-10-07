global.__rootdir = __dirname;

const fs = require('fs-extra');
const html = require('./library/html.js');

const exporter = require('./exports.js');

const WIDGETS = ["webgl"];

async function BUILD_HTML() {
	global.__currentbuild = { updated: {} };
	__currentbuild.created_at = new Date().getTime();

	const LOADED_FILE = await html.load({}, "index.html");

	fs.ensureDirSync('dist');
	fs.writeFileSync('dist/index.html', LOADED_FILE.html);

	for (WIDGET_NAME of WIDGETS) {
		const LOADED_WIDGET = await html.load({}, `widgets/${WIDGET_NAME}.html`);

		fs.ensureDirSync('dist');
		fs.writeFileSync(`dist/${WIDGET_NAME}.html`, LOADED_WIDGET.html);
	}
}


const EXPORT_PATH = "export";
async function build() {
	await exporter.build(EXPORT_PATH);
	await BUILD_HTML();
}

build();