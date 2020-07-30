import Bluebird from 'bluebird';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { loadRepos } from '../../me/actions/loadRepos.action';
import { pullMeRepo } from '../../me/actions/pullMeRepo.action';
import { pullRepo } from '../../me/actions/pullRepo.action';
import { selectAllRepos } from '../../me/me.state';
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
    pullMeRepo({
      fs,
      http,
      headers,
      rootPath,
      meRepoRemote,
    })
  );

  await dispatch(loadRepos({ fs, rootPath }));

  const repos = selectAllRepos(getRootState());

  console.log('repos #D9EKOO', repos);

  await Bluebird.each(repos, async repo => {
    try {
      await dispatch(pullRepo({ fs, http, headers, repo }));
    } catch (error) {
      console.error('Error pulling repo #9zmpoA', error);
    }
  });

  console.log('cloned repos #zqIalJ');

  // await Bluebird.each(repos, async repo => {
  //   const { id, path } = repo;

  //   // We do not load plans from our own repo
  //   if (id === ME_REPO_ID) {
  //     return;
  //   }

  //   await dispatch(loadPlansFromRepo({ fs, repoId: id, path: path }));
  // });
};
