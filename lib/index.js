import path from 'node:path';
console.log('a');
// import Realm from '../node_modules/realm/dist/bundle.node.js';
console.log('b');
import XDGAppPaths from '../node_modules/xdg-app-paths/dist/cjs/mod.cjs.js';
console.log('c');
// import Config from '../schema/Config.js';

/*
class Config extends Realm.Object {
  static schema = {
    name: "Config",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
      slp_root: "string",
      video_root: "string",
      slp_bin: "string",
      ffmpeg_bin: "string",
      slp_ids: "string[]",
    },
    primaryKey: "_id",
  }
}
*/

const xdgAppPaths = XDGAppPaths({ name: 'slp-db' });
const dataDir = xdgAppPaths.data();
const dbPath = path.join(dataDir, 'v1');

export const exec = async () => {
  // const realm = await Realm.open({ schema: [Config], path: dbPath });
  // const configs = await realm.objects(Config);
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
};
