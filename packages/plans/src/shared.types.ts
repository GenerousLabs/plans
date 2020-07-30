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

export type Repo = {
  id: string;
  name: string;
  slug: string;
  path: string;
  remote: string;
  credentials?: {
    username?: string;
    password?: string;
    headers?: {
      [x: string]: string;
    };
  };
  lastFetchTimestampSeconds: number;
  currentHeadCommitHash: string;
};

/**
 * A user is loaded from a repo and contains information the user themselves
 * has shared. For example, their name.
 */
export type User = {
  id: string;
  name: string;
  slug: string;
  description: string;
  path: string;
};

export type Plan = {
  id: string;
  userId: string;
  slug: string;
  path: string;
  name: string;
  description: string;
};
