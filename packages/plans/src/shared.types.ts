import fsNode from 'fs/promises';

export type FS = {
  readdir: typeof fsNode.readdir;
  readFile: typeof fsNode.readFile;
  stat: typeof fsNode.stat;
};
