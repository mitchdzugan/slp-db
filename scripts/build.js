import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';

const buildCmd = (i, o) => (
	`esbuild ${i} --bundle --outfile=${o} --format=cjs --platform=node`
)

const toCompile = [
	'index.js',
	'lib/index.js',
];
const toCopy = [
	'package.json',
	'index.html', 
	'scripts/package.js',
	'node_modules/realm/index.node.js',
	'node_modules/realm/generated/ts/realm.node',
	'node_modules/realm/dist/bundle.node.js',
	'node_modules/xdg-app-paths/dist/cjs/mod.cjs.js'
];

const root = '/home/mitch/Projects/slp-db/';

for (const relPath of toCopy) {
	const inPath = path.join(root, relPath);
	const content = await fs.readFile(inPath, 'utf8');
	const outPath = path.join(root, "nwjs-build", relPath);
	const outDir = path.dirname(outPath);
	await fs.mkdir(outDir, { recursive: true });
	await fs.writeFile(outPath, content);
}

for (const relPath of toCompile) {
	const inPath = path.join(root, relPath);
	const outPath = path.join(root, "nwjs-build", relPath);
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
