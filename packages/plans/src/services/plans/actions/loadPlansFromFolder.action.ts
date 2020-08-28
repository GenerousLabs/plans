import { createAsyncThunk } from '@reduxjs/toolkit';
import Bluebird from 'bluebird';
import { FS } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { getChildDirectoriesFromPath } from '../plans.service';
import { upsertOnePlan } from '../plans.state';
import { loadPlanFromPath } from './loadPlanFromPath.action';

export const loadPlansFromFolder = createAsyncThunk<
  void,
  {
    fs: FS;
    path: string;
    userId: string;
    upsertPlan: typeof upsertOnePlan;
  },
  RootThunkApi
>(
  'PLANS/plans/loadPlansFromFolder',
  async ({ fs, path, userId, upsertPlan }, { dispatch }) => {
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
  }
);
