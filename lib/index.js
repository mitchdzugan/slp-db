import { launchServer } from './server.js';

const connectServer = async () => {
  const hostname = 'http://localhost';
  const port = await launchServer();
  const baseUrl = `${hostname}:${port}`;
  const url = `${baseUrl}/is-slp-db`;
  const res = await fetch(url);
  const val = await res.json();
  if (val !== true) {
    throw new Error(
      `[ ${url} ] did not return true indicating [ ${baseUrl} ] is not a slp-db server`
    );
  }
  return { hostname, port };
};

export const exec = async () => {
  const { hostname, port } = await connectServer();
  nw.Window.open('index.html', {}, (win) => {
    win.window['slp-db-static'] = {
      hostname,
      port,
    };
  });
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
