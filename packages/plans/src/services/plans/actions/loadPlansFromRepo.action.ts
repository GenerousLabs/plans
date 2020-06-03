import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import {
  findFirstPlansDirectory,
  getPlanPathsFromPlansFolder,
} from '../plans.service';
import { noop, upsertOneFolder } from '../plans.state';
import { loadPlanFromPath } from './loadPlanFromPath.action';

export const loadPlansFromRepo = ({
  fs,
  repoId,
  path,
}: {
  fs: FS;
  repoId: string;
  path: string;
}): AppThunk => async dispatch => {
  dispatch(
    noop({
      code: '#wi9aR7',
      message: 'loadPlansFromRepo called',
      params: { repoId, path },
    })
  );

  const plansPath = await findFirstPlansDirectory({
    fs,
    repoPath: path,
    // TODO We need to get the user's real folder name here
    myUsername: 'alice',
  });

  // If the user does not have a `plans` folder, there's nothing to do here.
  if (typeof plansPath === 'undefined') {
    dispatch(
      noop({
        code: '#nMlg40',
        message: 'loadUserPlansAction directory not found',
        params: { repoId, path },
      })
    );
    return;
  }

  const planFolderId = plansPath.path;

  await dispatch(
    upsertOneFolder({
      id: planFolderId,
      repoId,
      folder: plansPath.slug,
    })
  );

  const plansPaths = await getPlanPathsFromPlansFolder({
    fs,
    path: plansPath.path,
  });

  await Bluebird.each(plansPaths, async ({ path, slug }) => {
    await dispatch(
      loadPlanFromPath({
        fs,
        path,
        slug,
        planFolderId,
      })
    );
  });

  dispatch(
    noop({
      code: '#i0W2Yp',
      message: 'loadUserPlansAction finished',
      params: {
        userId: repoId,
        userDirectoryPath: path,
        plansPaths,
      },
    })
  );
};
