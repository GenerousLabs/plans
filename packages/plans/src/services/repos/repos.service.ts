import git from 'isomorphic-git';
import yaml from 'js-yaml';
import { join } from 'path';
import { GitParams, Repo } from '../../shared.types';
import { doesDirectoryExist, doesFileExist } from '../../utils/fs.utils';

const PATH_TO_ME_REPO = 'me';
const CONNECTIONS_FILE_NAME = 'connections.yaml';
const CONNECTIONS_FOLDER_NAME = 'connections';

const author = {
  name: 'plans',
};

export const rootPathToMeRepoPath = ({ rootPath }: { rootPath: string }) => {
  return join(rootPath, PATH_TO_ME_REPO);
};

export const rootPathToUserRepoPath = ({
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

export const getConnectionsFromRepo = async ({
  fs,
  dir,
}: Pick<GitParams, 'fs' | 'dir'>) => {
  const path = addConnectionFileNameToPath({ path: dir });

  if (!doesFileExist({ fs, path })) {
    throw new Error('Connections file not found. #jQrd0p');
  }

  const contents = await fs.promises.readFile(path, { encoding: 'utf8' });

  const data: Repo[] = yaml.safeLoad(contents);

  // TODO Ensure that `data` conforms to our desired schema

  return data;
};
