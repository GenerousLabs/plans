import Bluebird from 'bluebird';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { to } from '../../../utils/to.util';
import { ensureRepoIsCurrent } from './ensureRepoIsCurrent.action';
import {
  getConnectionsFromRepo,
  rootPathToMeRepoPath,
  rootPathToConnectionRepoPath,
} from '../repos.service';
import { noop, upsertOne } from '../repos.state';
import { ME_REPO_ID, ME_REPO_FOLDER } from '../../../constants';

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
  await dispatch(
    noop({
      code: '#FmqCCM',
      message: 'init() start',
      params: { rootPath },
    })
  );

  const mePath = rootPathToMeRepoPath({ rootPath });

  await dispatch(
    upsertOne({
      id: ME_REPO_ID,
      name: 'me',
      folder: ME_REPO_FOLDER,
      remote: meRepoRemote,
      path: mePath,
      currentHeadCommitHash: '',
      lastFetchTimestampSeconds: 0,
    })
  );

  await dispatch(
    ensureRepoIsCurrent({
      fs,
      http,
      headers,
      dir: mePath,
      remote: meRepoRemote,
      id: ME_REPO_ID,
    })
  );

  const connectionsResponse = await to(
    getConnectionsFromRepo({ fs, dir: mePath })
  );
  if (connectionsResponse.error) {
    const { error } = connectionsResponse;
    await dispatch(
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

    const dir = rootPathToConnectionRepoPath({ rootPath, repoFolder });

    await dispatch(
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
