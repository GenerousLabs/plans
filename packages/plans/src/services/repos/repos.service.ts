import git from 'isomorphic-git';
import { join } from 'path';
import { GitParams, Repo } from '../../shared.types';
import { doesDirectoryExist } from '../../utils/fs.utils';

const PATH_TO_ME_REPO = 'me';
const CONNECTIONS_FILE_NAME = 'connections.yaml';
const CONNECTIONS_FOLDER_NAME = 'connections';

const author = {
  name: 'plans',
};

export const rootPathToMeRepoPath = ({ rootPath }: { rootPath: string }) => {
  return join(rootPath, PATH_TO_ME_REPO);
};

export const rootPathToConnectionRepoPath = ({
  rootPath,
  repoFolder,
}: {
  rootPath: string;
  repoFolder: string;
}) => {
  return join(rootPath, CONNECTIONS_FOLDER_NAME, repoFolder);
};

export const getCurrentCommit = async ({ fs, dir }: GitParams) => {
  const status = await git.log({ fs, dir, depth: 1 });

  if (status.length === 0) {
    throw new Error('No log found. #kzBW9C');
  }

  return status[0];
};

export const pullRepo = async ({ fs, http, headers, dir }: GitParams) => {
  const commitBefore = await getCurrentCommit({ fs, http, dir });

  try {
    await git.pull({
      fs,
      http,
      headers,
      dir,
      author,
    });
  } catch (error) {
    console.error('pull #snOHUF', error);
    throw error;
  }

  const commitAfter = await getCurrentCommit({ fs, http, dir });

  return {
    commitOidBefore: commitBefore.oid,
    commitOidAfter: commitAfter.oid,
  };
};

export const cloneRepo = async ({
  fs,
  http,
  headers,
  dir,
  remote,
}: GitParams & { remote: string }) => {
  await git.clone({ fs, http, headers, dir, url: remote });
  const commitAfter = await getCurrentCommit({ fs, http, dir });
  return {
    commitOidBefore: '',
    commitOidAfter: commitAfter.oid,
  };
};

export const cloneOrPullRepo = async ({
  fs,
  http,
  headers,
  dir,
  remote,
}: GitParams & { remote: string }) => {
  if (!(await doesDirectoryExist({ fs, path: dir }))) {
    await fs.promises.mkdir(dir);
    return cloneRepo({ fs, http, headers, dir, remote });
  }
  // TODO: Check if directory is a git repo, abort if not
  else {
    return pullRepo({ fs, http, headers, dir });
  }
};

export const addConnectionFileNameToPath = ({ path }: { path: string }) => {
  return join(path, CONNECTIONS_FILE_NAME);
};

const repoStringFields = ['id', 'name', 'folder', 'remote'];
const credentialStringFields = ['username', 'password'];
export const isRepo = (repo: any): repo is Repo => {
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
