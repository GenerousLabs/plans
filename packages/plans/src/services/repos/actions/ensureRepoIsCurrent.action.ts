import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { timestampSeconds } from '../../../utils/time.utils';
import { to } from '../../../utils/to.util';
import { cloneOrPullRepo } from '../repos.service';
import { noop, upsertOne } from '../repos.state';
import { getSerializableError } from '../../../utils/errors.utils';

export const ensureRepoIsCurrent = ({
  fs,
  http,
  headers,
  dir,
  remote,
  id,
}: GitParams & { remote: string; id: string }): AppThunk => async dispatch => {
  const updateResponse = await to(
    cloneOrPullRepo({ fs, http, headers, dir, remote })
  );

  if (updateResponse.error) {
    const { error } = updateResponse;
    dispatch(
      noop({
        code: '#DL1pTF',
        message: 'Error updating repo',
        params: {
          dir,
          error: getSerializableError(error),
        },
      })
    );
    return;
  }

  const { result } = updateResponse;

  dispatch(
    upsertOne({
      id,
      path: dir,
      currentHeadCommitHash: result.commitOidAfter,
      lastFetchTimestampSeconds: timestampSeconds(),
    })
  );
};
