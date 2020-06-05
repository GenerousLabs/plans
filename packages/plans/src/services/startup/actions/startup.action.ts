import Bluebird from 'bluebird';
import { ME_REPO_ID } from '../../../constants';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { loadPlansFromRepo } from '../../plans/actions/loadPlansFromRepo.action';
import { pullMeAndConnectionRepos } from '../../repos/actions/pullMeAndConnectionRepos.action';
import { selectAll } from '../../repos/repos.state';
import { RootConfig } from '../startup.service';

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

  const repos = selectAll(getRootState());

  await Bluebird.each(repos, async repo => {
    const { id, path } = repo;

    // We do not load plans from our own repo
    if (id === ME_REPO_ID) {
      return;
    }

    await dispatch(loadPlansFromRepo({ fs, repoId: id, path: path }));
  });
};
