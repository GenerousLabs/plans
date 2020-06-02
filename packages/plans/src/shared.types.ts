import fs from 'fs';
import { HttpClient } from 'isomorphic-git';

export type FS = {
  promises: {
    readFile: typeof fs.promises.readFile;
    writeFile: typeof fs.promises.writeFile;
    unlink: typeof fs.promises.unlink;
    readdir: typeof fs.promises.readdir;
    mkdir: typeof fs.promises.mkdir;
    rmdir: typeof fs.promises.rmdir;
    stat: typeof fs.promises.stat;
    lstat: typeof fs.promises.lstat;
    readlink?: typeof fs.promises.readlink;
    symlink?: typeof fs.promises.symlink;
    chmod?: typeof fs.promises.chmod;
  };
};

export type Headers = {
  [x: string]: string;
};

export type GitParams = {
  fs: FS;
  http: HttpClient;
  headers?: Headers;
  dir: string;
};

/**
 * A connection object that links the root user's me repository to another
 * repository that is shared with another person.
 */
export type Connection = {
  id: string;
  name: string;
  folder: string;
};
export type Repo = {
  id: string;
  folder: string;
  remote: string;
  credentials?: {
    username?: string;
    password?: string;
    headers?: {
      [x: string]: string;
    };
  };
  connections: Connection[];
};
