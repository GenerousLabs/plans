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
  remote: string;
  credentials?: {
    username?: string;
    password?: string;
    headers?: {
      [x: string]: string;
    };
  };
  path: string;
  lastFetchTimestampSeconds: number;
  currentHeadCommitHash: string;
};

export type YamlRepo = Omit<
  Repo,
  'path' | 'lastFetchTimestampSeconds' | 'currentHeadCommitHash'
>;

// NOTE: This must be kept manually in sync with the Repo type
const repoStringFields = ['id', 'name', 'slug', 'remote'];
const credentialStringFields = ['username', 'password'];
export const isYamlRepo = (repo: any): repo is YamlRepo => {
  // All `repoStringFields` must be a string, and >0 length
  for (const field of repoStringFields) {
    if (typeof repo[field] !== 'string' || repo[field].length === 0) {
      return false;
    }
  }

  if (typeof repo.credentials !== 'undefined') {
    // All `credentialStringFields` if they exist, must be a string and >0 length
    for (const field in credentialStringFields) {
      if (typeof repo[field] !== 'undefined') {
        if (typeof repo[field] !== 'string' || repo[field].length === 0) {
          return false;
        }
      }
    }

    if (typeof repo.credentials.headers !== 'undefined') {
      // If the `headers` property exists, it must have children
      if (Object.keys(repo.credentials).length === 0) {
        return false;
      }

      // All `headers` properties must be a string and >0 length
      for (const field of repo.credentials.headers) {
        if (typeof repo[field] !== 'string' || repo[field].length === 0) {
          return false;
        }
      }
    }
  }

  return true;
};

/**
 * A user is loaded from a repo and contains information the user themselves
 * has shared. For example, their name.
 */
export type User = {
  id: string;
  repoId: string;
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
