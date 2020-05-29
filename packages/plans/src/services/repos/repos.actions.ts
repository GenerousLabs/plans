import { GitParams } from '../../shared.types';
import { AppThunk } from '../../store';
import { noop, upsertOne } from './repos.state';
import { rootPathToMeRepoPath, updateRepo } from './repos.service';
import { to } from '../../utils/to.util';

export const init = ({
  fs,
  http,
  headers,
  rootPath,
}: GitParams & {
  rootPath: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#FmqCCM',
      message: 'init() start',
      params: { rootPath },
    })
  );

  const mePath = rootPathToMeRepoPath({ rootPath });

  const updateResponse = await to(
    updateRepo({ fs, http, headers, dir: mePath })
  );

  if (updateResponse.error) {
    const { error } = updateResponse;
    dispatch(
      noop({
        code: '#DL1pTF',
        message: 'Error updating me repo',
        params: {
          mePath,
          error: { code: (error as any).code, message: error.message },
        },
      })
    );
    return;
  }

  const { result } = updateResponse;

  dispatch(
    upsertOne({
      id: 'root',
      path: mePath,
      currentHeadCommitHash: result.commitOidAfter,
      lastFetchTimestampSeconds: Math.round(Date.now() / 1e3),
    })
  );

  /**
   * - Find the connections file
   * - Parse it
   * - Get the list of local repos
   *   - Push the data into redux
   * - Iterate over each repo
   *   - Pull it
   *   - Trigger the plans scan
   */
};
