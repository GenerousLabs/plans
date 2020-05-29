import git from 'isomorphic-git';
import { join } from 'path';
import { GitParams } from '../../shared.types';

const PATH_TO_ME_REPO = 'me';

const author = {
  name: 'plans',
};

export const rootPathToMeRepoPath = ({ rootPath }: { rootPath: string }) => {
  return join(rootPath, PATH_TO_ME_REPO);
};

export const getCurrentCommit = async ({
  fs,
  dir,
}: GitParams & { dir: string }) => {
  const status = await git.log({ fs, dir, depth: 1 });

  if (status.length === 0) {
    throw new Error('No log found. #kzBW9C');
  }

  return status[0];
};

export const updateRepo = async ({
  fs,
  http,
  headers,
  dir,
}: GitParams & {
  dir: string;
}) => {
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
