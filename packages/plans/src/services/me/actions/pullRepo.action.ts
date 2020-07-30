import { GitParams, Repo } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { cloneOrPullRepo, getCurrentCommit } from '../../git/git.service';
import { updateOneRepo } from '../me.state';
import { timestampSeconds } from '../../../utils/time.utils';

export const pullRepo = ({
  fs,
  http,
  headers,
  repo,
}: Omit<GitParams, 'dir'> & {
  repo: Pick<Repo, 'id' | 'path' | 'remote'>;
}): AppThunk => async (dispatch) => {
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
};
