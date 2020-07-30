import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { loadRepos } from '../../me/actions/loadRepos';
import { pullMeRepo } from '../../me/actions/pullMeRepo.action';
import { RootConfig } from '../startup.service';

export const startup = ({
  fs,
  http,
  rootConfig,
}: Omit<GitParams, 'dir' | 'headers'> & {
  rootConfig: RootConfig;
}): AppThunk => async dispatch => {
  const { path: rootPath, meRepoRemote, meRepoHeaders: headers } = rootConfig;

  await dispatch(
    pullMeRepo({
      fs,
      http,
      headers,
      rootPath,
      meRepoRemote,
    })
  );

  const repos = await dispatch(loadRepos({ fs, rootPath }));

  console.log('repos #D9EKOO', repos);

  // await Bluebird.each(repos, async repo => {
  //   const { id, path } = repo;

  //   // We do not load plans from our own repo
  //   if (id === ME_REPO_ID) {
  //     return;
  //   }

  //   await dispatch(loadPlansFromRepo({ fs, repoId: id, path: path }));
  // });
};
