import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import {
  findFirstPlansDirectory,
  getPlanPathsFromUserDirectory,
} from '../plans.service';
import { noop } from '../plans.state';
import { loadPlanFromPath } from './loadPlanFromPath.action';

export const loadPlansFromUserPath = ({
  fs,
  userId,
  userDirectoryPath,
}: {
  fs: FS;
  userId: string;
  userDirectoryPath: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#wi9aR7',
      message: 'loadUserPlansAction called',
      params: { userName: userId, userDirectoryPath },
    })
  );

  const plansPath = await findFirstPlansDirectory({
    fs,
    repoPath: userDirectoryPath,
    // TODO We need to get the user's real folder name here
    myUsername: 'alice',
  });

  // If the user does not have a `plans` folder, there's nothing to do here.
  if (plansPath.length === 0) {
    dispatch(
      noop({
        code: '#nMlg40',
        message: 'loadUserPlansAction directory not found',
        params: { userId, userDirectoryPath },
      })
    );
    return;
  }

  const plansPaths = await getPlanPathsFromUserDirectory({
    fs,
    path: plansPath,
  });

  await Bluebird.each(plansPaths, async ({ path, slug }) => {
    await dispatch(
      loadPlanFromPath({
        fs,
        path,
        slug,
        userId,
      })
    );
  });

  dispatch(
    noop({
      code: '#i0W2Yp',
      message: 'loadUserPlansAction finished',
      params: {
        userId,
        userDirectoryPath,
        plansPaths,
      },
    })
  );
};
