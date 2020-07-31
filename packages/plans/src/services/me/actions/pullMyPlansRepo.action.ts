import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { cloneOrPullRepo } from '../../git/git.service';
import { rootPathToMyPlansRepoPath } from '../me.service';

export const pullMyPlansRepo = ({
  fs,
  http,
  headers,
  rootPath,
  remote,
}: Omit<GitParams, 'dir'> & {
  rootPath: string;
  remote: string;
}): AppThunk => async dispatch => {
  const myPlansPath = rootPathToMyPlansRepoPath(rootPath);

  // Ensure the repo exists and is up to date
  await cloneOrPullRepo({
    fs,
    http,
    headers,
    dir: myPlansPath,
    remote,
  });

  await dispatch({
    type: 'PLANS/services/me',
    payload: 'My plans repo pulled',
  });
};
