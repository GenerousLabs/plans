import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { getChildDirectoriesFromPath } from '../plans.service';
import { upsertOnePlan } from '../plans.state';
import { loadPlanFromPath } from './loadPlanFromPath.action';

export const loadPlansFromFolder = ({
  fs,
  path,
  userId,
  upsertPlan,
}: {
  fs: FS;
  path: string;
  userId: string;
  upsertPlan: typeof upsertOnePlan;
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
        userId,
        upsertPlan,
      })
    );
  });
};
