import path from 'node:path';
import storage from '../node_modules/node-persist/src/node-persist.js';
import XDGAppPaths from '../node_modules/xdg-app-paths/dist/cjs/mod.cjs.js';

const xdgAppPaths = XDGAppPaths({ name: 'slp-db' });
const dataDir = xdgAppPaths.data();
const dbPath = path.join(dataDir, 'db.v1');

export const exec = async () => {
  nw.Window.open('index.html', {});
  /*
  await storage.init({
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
  const configs = [];
  let config = null;
  for (const dbConfig of configs) {
    if (config) {
      // await realm.write(() => { realm.delete(dbConfig); });
    } else {
      config = config || dbConfig;
    }
  }
  config = config || {
    slp_root: "~/Slippi",
    video_root: "~/Videos",
    slp_bin: "slippi",
    ffmpeg_bin: "ffmpeg",
  };
  if (!config._id) {
    // await realm.write(() => { realm.create(Config, config) });
  }
  console.log(JSON.stringify(config));
  setTimeout(() => {
    nw.Window.open('index.html', {}, function(win) {
      console.log(win);
    });
  }, 1000);
  */
};
