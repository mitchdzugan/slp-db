import path from 'path';
import Realm from 'realm';
import XDGAppPaths from 'xdg-app-paths';
import Config from '../schema/Config.js';

const xdgAppPaths = XDGAppPaths({ name: 'slp-db' });
const dataDir = xdgAppPaths.data();
const dbPath = path.join(dataDir, 'v1');

export const exec = async () => {
  const realm = await Realm.open({ schema: [Config], path: dbPath });
  const configs = await realm.objects(Config);
  let config = null;
  for (const dbConfig of configs) {
    if (config) {
      await realm.write(() => { realm.delete(dbConfig); });
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
    await realm.write(() => { realm.create(Config, config) });
  }
  console.log(JSON.stringify(config));
  setTimeout(() => {
    nw.Window.open('index.html', {}, function(win) {
      console.log(win);
    });
  }, 5000);
};
