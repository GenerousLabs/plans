import git from 'isomorphic-git';
import yaml from 'js-yaml';
import { join } from 'path';
import { GitParams } from '../../shared.types';
import { doesFileExist } from '../../utils/fs.utils';

const PATH_TO_ME_REPO = 'me';
const CONNECTIONS_FILE_NAME = 'connections.yaml';
const CONNECTIONS_FOLDER_NAME = 'connections';

/**
 * A connection object that links the root user's me repository to another
 * repository that is shared with another person.
 */
export type Connection = {
  id: string;
  name: string;
  repoFolder: string;
  credentials?: {
    username?: string;
    password?: string;
    headers?: {
      [x: string]: string;
    };
  };
};

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

export const updateRepo = async ({ fs, http, headers, dir }: GitParams) => {
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

  const contents = await fs.promises.readFile(path, { encoding: 'utf-8' });

  const data: Connection[] = yaml.safeLoad(contents);

  return data;
};
