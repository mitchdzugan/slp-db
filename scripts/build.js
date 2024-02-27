import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';
import * as url from 'url'; 
import { rimraf } from 'rimraf'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const buildCmd = (i, o) => (
	`esbuild ${i} --bundle --outfile=${o} --format=cjs --platform=node`
)

const toCompile = [
	'app.js',
	'index.js',
	'dist/index.css',
	'lib/app.js',
	'lib/index.js',
	'lib/server.js',
	'lib/ui.js',
];
const toCopy = [
	'package.json',
	'index.html',
	'scripts/package.js',
	'node_modules/better-sqlite3/lib/index.js',
	'node_modules/better-sqlite3/build/Release/better_sqlite3.node',
	'node_modules/body-parser/index.js',
	'node_modules/body-parser/lib/read.js',
	'node_modules/body-parser/lib/types/json.js',
	'node_modules/body-parser/lib/types/raw.js',
	'node_modules/body-parser/lib/types/text.js',
	'node_modules/body-parser/lib/types/urlencoded.js',
	'node_modules/express/index.js',
	'node_modules/express/lib/application.js',
	'node_modules/express/lib/express.js',
	'node_modules/express/lib/request.js',
	'node_modules/express/lib/response.js',
	'node_modules/express/lib/utils.js',
	'node_modules/express/lib/view.js',
	'node_modules/express/lib/middleware/init.js',
	'node_modules/express/lib/middleware/query.js',
	'node_modules/express/lib/router/index.js',
	'node_modules/express/lib/router/layer.js',
	'node_modules/express/lib/router/route.js',
	'node_modules/preact/dist/preact.min.js',
	'node_modules/preact/compat/dist/compat.mjs',
	'node_modules/preact/hooks/dist/hooks.js',
	'node_modules/mutative/dist/mutative.esm.mjs',
	'node_modules/node-persist/src/node-persist.js',
	'node_modules/node-persist/src/local-storage.js',
	'node_modules/nw-programmatic-folder-select/index.js',
	'node_modules/xdg-app-paths/dist/cjs/mod.cjs.js',
];

const root = path.join(__dirname, '..');
const buildDir = path.join(root, 'nwjs-build');

await rimraf(buildDir);
await fs.mkdir(buildDir, { recursive: true });

for (const relPath of toCopy) {
	const inPath = path.join(root, relPath);
	const content = await fs.readFile(inPath, 'utf8');
	let outPath = path.join(buildDir, relPath);
	if (outPath.endsWith('better_sqlite3.node')) {
		outPath = outPath.replace('node_modules\\better-sqlite3\\', '');
		outPath = outPath.replace('node_modules/better-sqlite3/', '');
	}
	const outDir = path.dirname(outPath);
	await fs.mkdir(outDir, { recursive: true });
	await fs.writeFile(outPath, content);
}

for (const relPath of toCompile) {
	const inPath = path.join(root, relPath);
	const outPath = path.join(buildDir, relPath);
	const outDir = path.dirname(outPath);
	await fs.mkdir(outDir, { recursive: true });
	await new Promise((done) => {
		exec(buildCmd(inPath, outPath), (error, stdout, stderr) => {
			if (stdout) {
				console.log(stdout.toString('utf8'))
			}
			if (stderr) {
				console.error(stderr.toString('utf8'))
			}
			error && process.exit(error)
			done();
		});
	});
}
