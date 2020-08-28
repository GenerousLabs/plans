import { createAsyncThunk } from '@reduxjs/toolkit';
import { join } from 'path';
import slugify from 'slugify';
import { ME_REPO_ID } from '../../../shared.constants';
import { FS, Plan } from '../../../shared.types';
import { RootDispatch, RootState } from '../../../store';
import { loadPlansFromFolder } from '../../plans/actions/loadPlansFromFolder.action';
import { writePlanToDisk } from '../../plans/plans.service';
import { rootPathToMyPlansPath } from '../me.service';
import { upsertOneMyPlan } from '../me.state';

export const createNewMyPlan = createAsyncThunk<
  void,
  {
    fs: FS;
    rootPath: string;
    plan: Pick<Plan, 'description' | 'name'>;
  },
  {
    dispatch: RootDispatch;
    state: RootState;
  }
>('PLANS/me/createNewMyPlan', async ({ fs, plan, rootPath }, { dispatch }) => {
  const slug = slugify(plan.name, { lower: true });
  const planWithSlug = { ...plan, slug };

  const myPlansPath = rootPathToMyPlansPath({ rootPath });
  const planFolderPath = join(myPlansPath, slug);

  // This is a very cheap, very dirty validation check. It would make sense to
  // greatly improve this.
  if (planWithSlug.name.length === 0 || planWithSlug.slug.length === 0) {
    throw new Error('Unknown error. #Q7dm0A');
  }

  await writePlanToDisk({
    fs,
    folderPath: planFolderPath,
    plan: planWithSlug,
  });

  // TODO: Commit and push

  await dispatch(
    loadPlansFromFolder({
      fs,
      path: planFolderPath,
      userId: ME_REPO_ID,
      upsertPlan: upsertOneMyPlan,
    })
  );
});
