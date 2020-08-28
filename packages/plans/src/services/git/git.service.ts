import Bluebird from 'bluebird';
import git from 'isomorphic-git';
import mkdirp from 'mkdirp';
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
  // This is a bit of a hack. If the directory exists, we assume that the repo
  // has already been cloned. This is obviously fragile.
  if (!(await doesDirectoryExist({ fs, path: dir }))) {
    // NOTE: We need to cast `fs` to any here because our FS spec doesn't
    // include the non promised versions, which `mkdirp()` uses.
    await mkdirp(dir, { fs: fs as any });
    return cloneRepo({ fs, http, headers, dir, remote });
  }
  // TODO: Check if directory is a git repo, abort if not
  else {
    return pullRepo({ fs, http, headers, dir });
  }
};

export const commitAndPushFiles = async ({
  fs,
  http,
  headers,
  dir,
  author,
  relativeFilePaths,
  message,
}: GitParams & { relativeFilePaths: string[]; message: string }): Promise<{
  success: boolean;
  committed: boolean;
  pushed: boolean;
}> => {
  const changes = await Bluebird.map(relativeFilePaths, async filepath => {
    const status = await git.status({ fs, dir, filepath });
    return status !== 'unmodified';
  });

  // If none of the files specified have any changes, there's nothing to do, so
  // we abort now
  if (!changes.some(v => v)) {
    return { success: true, committed: false, pushed: false };
  }

  await Bluebird.each(relativeFilePaths, filepath => {
    return git.add({ fs, dir, filepath });
  });

  await git.commit({ fs, dir, author, message });

  await git.push({ fs, dir, http, headers, remote: 'origin' });

  return { success: true, committed: true, pushed: true };
};
