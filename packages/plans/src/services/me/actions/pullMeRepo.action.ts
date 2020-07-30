import { AppThunk } from '../../../store';
import { GitParams } from '../../../shared.types';
import { cloneOrPullRepo } from '../../git/git.service';
import { rootPathToMeRepoPath } from '../me.service';

export const pullMeRepo = ({
  fs,
  http,
  headers,
  rootPath,
  meRepoRemote,
}: Omit<GitParams, 'dir'> & {
  rootPath: string;
  meRepoRemote: string;
}): AppThunk => async dispatch => {
  // Ensure the repo exists and is up to date
  await cloneOrPullRepo({
    fs,
    http,
    headers,
    dir: rootPathToMeRepoPath(rootPath),
    remote: meRepoRemote,
  });

  await dispatch({ type: 'PLANS/services/me', payload: 'Me repo pulled' });
};
