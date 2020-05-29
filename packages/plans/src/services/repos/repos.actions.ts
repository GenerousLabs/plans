import Bluebird from 'bluebird';
import { GitParams } from '../../shared.types';
import { AppThunk } from '../../store';
import { getSerializableError } from '../../utils/errors.utils';
import { to } from '../../utils/to.util';
import { loadPlansFromUserPath } from '../plans/plans.actions';
import {
  Connection,
  getConnectionsFromRepo,
  rootPathToMeRepoPath,
  rootPathToUserRepoPath,
  updateRepo,
} from './repos.service';
import { noop, upsertOne } from './repos.state';
import { timestampSeconds } from '../../utils/time.utils';

export const updateUserRepo = ({
  fs,
  http,
  headers,
  rootPath,
  connection,
}: Omit<GitParams, 'dir'> & {
  rootPath: string;
  connection: Connection;
}): AppThunk => async dispatch => {
  const { id, repoFolder } = connection;

  const dir = rootPathToUserRepoPath({ rootPath, repoFolder });

  const updateResponse = await to(updateRepo({ fs, http, headers, dir }));

  if (updateResponse.error) {
    const { error } = updateResponse;
    dispatch(
      noop({
        code: '#zwDZDP',
        message: 'Error updating user repo',
        params: {
          error: getSerializableError(error),
          dir,
          id,
        },
      })
    );
    return;
  }

  const { result } = updateResponse;

  dispatch(
    upsertOne({
      id,
      currentHeadCommitHash: result.commitOidAfter,
      lastFetchTimestampSeconds: timestampSeconds(),
      path: dir,
    })
  );

  await dispatch(
    loadPlansFromUserPath({ fs, userId: id, userDirectoryPath: dir })
  );
};

export const init = ({
  fs,
  http,
  headers,
  rootPath,
}: Omit<GitParams, 'dir'> & {
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
      lastFetchTimestampSeconds: timestampSeconds(),
    })
  );

  const connectionsResponse = await to(
    getConnectionsFromRepo({ fs, dir: mePath })
  );
  if (connectionsResponse.error) {
    const { error } = connectionsResponse;
    dispatch(
      noop({
        code: '#l85nXL',
        message: 'Error loading connections',
        params: { error, mePath },
      })
    );
    return;
  }

  const connections = connectionsResponse.result;

  await Bluebird.each(connections, async connection => {
    await dispatch(
      updateUserRepo({
        fs,
        http,
        headers,
        rootPath,
        connection,
      })
    );
  });

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
