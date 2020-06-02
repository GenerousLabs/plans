import Bluebird from 'bluebird';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { to } from '../../../utils/to.util';
import { ensureRepoIsCurrent } from './ensureRepoIsCurrent.action';
import {
  getConnectionsFromRepo,
  rootPathToMeRepoPath,
  rootPathToRepoPath,
} from '../repos.service';
import { noop, upsertOne } from '../repos.state';

export const pullMeAndConnectionRepos = ({
  fs,
  http,
  headers,
  rootPath,
  meRepoRemote,
}: Omit<GitParams, 'dir'> & {
  rootPath: string;
  meRepoRemote: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#FmqCCM',
      message: 'init() start',
      params: { rootPath },
    })
  );

  const mePath = rootPathToMeRepoPath({ rootPath });

  await dispatch(
    ensureRepoIsCurrent({
      fs,
      http,
      headers,
      dir: mePath,
      remote: meRepoRemote,
      id: 'me',
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

  const repos = connectionsResponse.result;

  await Bluebird.each(repos, async repo => {
    // TODO Implement the use of `repo.credentials`
    const { id, folder: repoFolder, remote } = repo;

    const dir = rootPathToRepoPath({ rootPath, repoFolder });

    dispatch(
      upsertOne({
        ...repo,
        path: dir,
        lastFetchTimestampSeconds: 0,
        currentHeadCommitHash: '',
      })
    );

    await dispatch(
      ensureRepoIsCurrent({
        fs,
        http,
        headers,
        dir,
        remote,
        id,
      })
    );
  });
};

export const cloneOrPullMeRepo = () => {};
