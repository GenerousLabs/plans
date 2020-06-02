import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { pullMeAndConnectionRepos } from '../../repos/actions/pullMeAndConnectionRepos.action';
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
    pullMeAndConnectionRepos({
      fs,
      http,
      headers,
      rootPath,
      meRepoRemote,
    })
  );

  // TODO Add plans init action here
  await dispatch({ type: 'loadPlansFromAllRepos' });
};
