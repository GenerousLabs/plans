import { createAsyncThunk } from '@reduxjs/toolkit';
import Bluebird from 'bluebird';
import { ME_REPO_ID } from '../../../shared.constants';
import { GitParams } from '../../../shared.types';
import { getPackageState, RootThunkApi } from '../../../store';
import { loadPlanFromPath } from '../../plans/actions/loadPlanFromPath.action';
import { getChildDirectoriesFromPath } from '../../plans/plans.service';
import { getPathToMyPlansFolder } from '../me.service';
import { upsertOneMyPlan } from '../me.state';

export const loadMyPlans = createAsyncThunk<
  void,
  Pick<GitParams, 'fs'> & {
    rootPath: string;
  },
  RootThunkApi
>('PLANS/me/loadMyPlans', async ({ fs, rootPath }, { dispatch, getState }) => {
  const { my_username } = getPackageState(getState()).config;

  const myPlansFolderPath = getPathToMyPlansFolder({
    rootPath,
    myUsername: my_username,
  });

  const plansPaths = await getChildDirectoriesFromPath({
    fs,
    path: myPlansFolderPath,
  });

  await Bluebird.each(plansPaths, async ({ path, slug }) => {
    await dispatch(
      loadPlanFromPath({
        fs,
        path,
        slug,
        userId: ME_REPO_ID,
        upsertPlan: upsertOneMyPlan,
      })
    );
  });
});
