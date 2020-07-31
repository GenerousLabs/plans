import Bluebird from 'bluebird';
import { ME_REPO_ID } from '../../../shared.constants';
import { GitParams } from '../../../shared.types';
import { AppThunk } from '../../../store';
import { loadPlanFromPath } from '../../plans/actions/loadPlanFromPath.action';
import { getChildDirectoriesFromPath } from '../../plans/plans.service';
import { rootPathToMyPlansPath } from '../me.service';
import { upsertOneMyPlan } from '../me.state';

export const loadMyPlans = ({
  fs,
  rootPath,
}: Pick<GitParams, 'fs'> & {
  rootPath: string;
}): AppThunk => async dispatch => {
  const myPlansPath = rootPathToMyPlansPath({ rootPath });
  const userId = ME_REPO_ID;

  const plansPaths = await getChildDirectoriesFromPath({
    fs,
    path: myPlansPath,
  });

  await Bluebird.each(plansPaths, async ({ path, slug }) => {
    await dispatch(
      loadPlanFromPath({
        fs,
        path,
        slug,
        userId,
        upsertPlan: upsertOneMyPlan,
      })
    );
  });
};
