import path from 'node:path';
import storage from '../node_modules/node-persist/src/node-persist.js';
import express from '../node_modules/express/index.js';
import bodyParser from '../node_modules/body-parser/index.js';
import XDGAppPaths from '../node_modules/xdg-app-paths/dist/cjs/mod.cjs.js';
import Database from '../node_modules/better-sqlite3/lib/index.js';
const db = new Database('foobar.db', {});
/*
db.pragma('journal_mode = WAL');
console.log('db');
*/

const xdgAppPaths = XDGAppPaths({ name: 'slp-db' });
const dataDir = xdgAppPaths.data();
const dbPath = path.join(dataDir, 'db.v1');

const PORT = 14507

const handleApi = (...args) => {
	const spec = {
		sessions: () => storage.getItem('SINGLETON/sessions').then(s => s || []),
		config: () => storage.getItem('SINGLETON/config').then(c => c || {}),
		highlights: () => Promise.resolve({highlights: 'xD'})
	};
	return (
		spec[args[0]] ?
			(async () => ({ api: await spec[args[0]]() })) :
			(async () => Promise.resolve(
				{ error: `unknown api call: [ ${JSON.stringify(args)} ]` }
			))
	)();
};

export const launchServer = () => new Promise(async (resolve) => {
	const storageReady = storage.init({
		dir: dbPath,
		stringify: JSON.stringify,
		parse: JSON.parse,
		encoding: 'utf8',
		logging: false,
		ttl: false,
		expiredInterval: 2 * 60 * 1000,
		forgiveParseErrors: false,
		writeQueue: true,
		writeQueueIntervalMs: 1000,
		writeQueueWriteOnlyLast: true,
	});
	const server = express();
	server.get('/is-slp-db', (req, res) => res.json(true));
	server.post('/api', bodyParser.json(), async (req, res) => {
		resultData = await handleApi(req.body);
		res.json(resultData);
	});
	await storageReady;
	server.listen(PORT, () => {
		console.log(`listening on port [ ${PORT} ]`)
		resolve(PORT);
	});
});
