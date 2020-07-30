import git from 'isomorphic-git';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { timestampSeconds } from '../../../utils/time.utils';
import { pullRepo } from '../repos.service';
import { noop, selectByIdOrThrow, updateOne } from '../repos.state';
import { GIT_AUTHOR_NAME } from '../../../shared.constants';

export const saveAndPush = ({
  fs,
  http,
  headers,
  repoId,
  newFilePath,
  commitMessage,
}: Omit<GitParams, 'dir'> & {
  repoId: string;
  newFilePath: string;
  commitMessage: string;
}): AppThunk => async (dispatch, getRootState) => {
  dispatch(
    noop({
      code: '#qiscar',
      message: 'saveAndPush called',
      params: { repoId, newFilePath, commitMessage },
    })
  );

  const repo = selectByIdOrThrow(getRootState(), repoId);

  const dir = repo.path;

  await git.add({ fs, dir, filepath: newFilePath });
  await git.commit({
    fs,
    dir,
    message: commitMessage,
    author: { name: GIT_AUTHOR_NAME },
  });
  await git.push({ fs, http, headers, dir });

  const result = await pullRepo({ fs, http, headers, dir });

  updateOne({
    id: repoId,
    changes: {
      currentHeadCommitHash: result.commitOidAfter,
      lastFetchTimestampSeconds: timestampSeconds(),
    },
  });
};
