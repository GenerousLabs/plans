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
 * A repo represents the connection between users. A shared space that two (or
 * potentially in the future, more than two) people can share things.
 */
export type Repo = {
  id: string;
  name: string;
  folder: string;
  remote: string;
  credentials?: {
    username?: string;
    password?: string;
    headers?: {
      [x: string]: string;
    };
  };
};

export type Plan = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  descriptionMarkdown: string;
};
