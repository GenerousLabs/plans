import { createAsyncThunk } from '@reduxjs/toolkit';
import { GitParams, Repo } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { timestampSeconds } from '../../../utils/time.utils';
import { cloneOrPullRepo, getCurrentCommit } from '../../git/git.service';
import { updateOneRepo } from '../me.state';

export const pullRepo = createAsyncThunk<
  void,
  Omit<GitParams, 'dir'> & {
    repo: Pick<Repo, 'id' | 'path' | 'remote'>;
  },
  RootThunkApi
>('PLANS/me/pullRepo', async ({ fs, http, headers, repo }, { dispatch }) => {
  const { id, path: dir, remote } = repo;

  await cloneOrPullRepo({ fs, http, headers, dir, remote });

  const commit = await getCurrentCommit({ fs, dir });

  dispatch(
    updateOneRepo({
      id,
      changes: {
        lastFetchTimestampSeconds: timestampSeconds(),
        currentHeadCommitHash: commit.oid,
      },
    })
  );
});
