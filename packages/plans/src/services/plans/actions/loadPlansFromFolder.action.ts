import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { getChildDirectoriesFromPath } from '../plans.service';
import { loadPlanFromPath } from './loadPlanFromPath.action';

export const loadPlansFromFolder = ({
  fs,
  path,
  folderId,
}: {
  fs: FS;
  path: string;
  folderId: string;
}): AppThunk => async dispatch => {
  const plansPaths = await getChildDirectoriesFromPath({
    fs,
    path: path,
  });

  await Bluebird.each(plansPaths, async ({ path, slug }) => {
    await dispatch(
      loadPlanFromPath({
        fs,
        path,
        slug,
        folderId,
      })
    );
  });
};
