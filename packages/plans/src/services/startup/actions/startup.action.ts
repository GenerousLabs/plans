import { GitParams } from '../../../shared.types';
import { AppThunk, getLocalState } from '../../../store';
import { pullMeAndConnectionRepos } from '../../repos/actions/pullMeAndConnectionRepos.action';
import { RootConfig } from '../startup.service';
import { selectAll } from '../../repos/repos.state';
import Bluebird from 'bluebird';
import { loadPlansFromUserPath } from '../../plans/actions/loadPlansFromUserPath.action';

export const startup = ({
  fs,
  http,
  rootConfig,
}: Omit<GitParams, 'dir' | 'headers'> & {
  rootConfig: RootConfig;
}): AppThunk => async (dispatch, getRootState) => {
  const { path: rootPath, meRepoRemote, meRepoHeaders: headers } = rootConfig;

  await dispatch(
    pullMeAndConnectionRepos({
      fs,
      http,
      headers,
      rootPath,
      meRepoRemote,
    })
  );

  const state = getLocalState(getRootState());

  const repos = selectAll(state.repos);

  Bluebird.each(repos, async repo => {
    const { id, path } = repo;
    await dispatch(
      loadPlansFromUserPath({ fs, userId: id, userDirectoryPath: path })
    );
  });
};
