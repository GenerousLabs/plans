import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { getChildDirectoriesFromPath } from '../plans.service';
import { loadPlanFromPath } from './loadPlanFromPath.action';
import { upsertOnePlan } from '../plans.state';

export const loadPlansFromFolder = ({
  fs,
  path,
  userId,
}: {
  fs: FS;
  path: string;
  userId: string;
}): AppThunk => async (dispatch) => {
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
        userId,
        upsertPlan: upsertOnePlan,
      })
    );
  });
};
