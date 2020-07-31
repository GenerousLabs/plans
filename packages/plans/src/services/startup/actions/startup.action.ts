import Bluebird from 'bluebird';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { loadRepos } from '../../me/actions/loadRepos.action';
import { pullMeRepo } from '../../me/actions/pullMeRepo.action';
import { pullRepo } from '../../me/actions/pullRepo.action';
import { selectAllRepos } from '../../me/me.state';
import { loadPlansFromRepo } from '../../plans/actions/loadPlansFromRepo.action';
import { RootConfig } from '../startup.service';
import { initFinished, initStarted } from '../startup.state';
import { loadMyPlans } from '../../me/actions/loadMyPlans.action';
import { pullMyPlansRepo } from '../../me/actions/pullMyPlansRepo.action';

export const startup = ({
  fs,
  http,
  rootConfig,
}: Omit<GitParams, 'dir' | 'headers'> & {
  rootConfig: RootConfig;
}): AppThunk => async (dispatch, getRootState) => {
  const { path: rootPath, meRepoRemote, meRepoHeaders: headers } = rootConfig;

  await dispatch(initStarted());

  await dispatch(
    pullMeRepo({
      fs,
      http,
      headers,
      rootPath,
      meRepoRemote,
    })
  );

  await dispatch(
    pullMyPlansRepo({
      fs,
      http,
      headers,
      rootPath,
      // TODO Load my plans remote from me repo somewhere
      remote: 'http://localhost:8174/alice.git',
    })
  );

  await dispatch(loadMyPlans({ fs, rootPath }));

  await dispatch(loadRepos({ fs, rootPath }));

  const repos = selectAllRepos(getRootState());

  await Bluebird.each(repos, async (repo) => {
    try {
      await dispatch(pullRepo({ fs, http, headers, repo }));
      await dispatch(loadPlansFromRepo({ fs, repo }));
    } catch (error) {
      console.error('Error pulling repo or loading plans #9zmpoA', error);
    }
  });

  await dispatch(initFinished());
};
