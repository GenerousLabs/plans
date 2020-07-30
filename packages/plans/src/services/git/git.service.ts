import git from 'isomorphic-git';
import { PLANS_AUTHOR } from '../../shared.constants';
import { GitParams } from '../../shared.types';
import { doesDirectoryExist } from '../../utils/fs.utils';

export const getCurrentCommit = async ({
  fs,
  dir,
}: Pick<GitParams, 'fs' | 'dir'>) => {
  const status = await git.log({ fs, dir, depth: 1 });

  if (status.length === 0) {
    throw new Error('No log found. #kzBW9C');
  }

  return status[0];
};

export const pullRepo = async ({ fs, http, headers, dir }: GitParams) => {
  const commitBefore = await getCurrentCommit({ fs, dir });

  try {
    await git.pull({
      fs,
      http,
      headers,
      dir,
      author: PLANS_AUTHOR,
    });
  } catch (error) {
    console.error('pull #snOHUF', error);
    throw error;
  }

  const commitAfter = await getCurrentCommit({ fs, dir });

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
  const commitAfter = await getCurrentCommit({ fs, dir });
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
    await fs.promises.mkdir(dir, { recursive: true });
    return cloneRepo({ fs, http, headers, dir, remote });
  }
  // TODO: Check if directory is a git repo, abort if not
  else {
    return pullRepo({ fs, http, headers, dir });
  }
};
