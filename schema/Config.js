import Realm from 'realm';

export default class Config extends Realm.Object {
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
