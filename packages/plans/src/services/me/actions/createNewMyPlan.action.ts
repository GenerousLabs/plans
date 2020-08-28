import { createAsyncThunk } from '@reduxjs/toolkit';
import { trimStart } from 'lodash';
import { join } from 'path';
import slugify from 'slugify';
import {
  GIT_AUTHOR_NAME,
  ME_REPO_ID,
  MY_PLANS_FOLDER,
} from '../../../shared.constants';
import { GitParams, Plan } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { commitAndPushFiles } from '../../git/git.service';
import { loadPlansFromFolder } from '../../plans/actions/loadPlansFromFolder.action';
import { writePlanToDisk } from '../../plans/plans.service';
import { rootPathToMyPlansPath } from '../me.service';
import { upsertOneMyPlan } from '../me.state';

export const createNewMyPlan = createAsyncThunk<
  void,
  Omit<GitParams, 'dir'> & {
    rootPath: string;
    plan: Pick<Plan, 'description' | 'name'>;
  },
  RootThunkApi
>(
  'PLANS/me/createNewMyPlan',
  async ({ fs, http, headers, plan, rootPath }, { dispatch }) => {
    const slug = slugify(plan.name, { lower: true });
    const planWithSlug = { ...plan, slug };

    const myPlansPath = rootPathToMyPlansPath({ rootPath });

    // This is a very cheap, very dirty validation check. It would make sense to
    // greatly improve this.
    if (planWithSlug.name.length === 0 || planWithSlug.slug.length === 0) {
      throw new Error('Unknown error. #Q7dm0A');
    }

    const newPlanIndexPath = await writePlanToDisk({
      fs,
      plansFolderPath: myPlansPath,
      plan: planWithSlug,
    });

    // Get the relative path from the repo root
    const dir = join(rootPath, MY_PLANS_FOLDER);
    const relativePath = trimStart(newPlanIndexPath.substr(dir.length), '/');

    await commitAndPushFiles({
      fs,
      http,
      headers,
      dir,
      relativeFilePaths: [relativePath],
      message: 'Added plan',
      author: {
        name: GIT_AUTHOR_NAME,
      },
    });

    await dispatch(
      loadPlansFromFolder({
        fs,
        path: myPlansPath,
        userId: ME_REPO_ID,
        upsertPlan: upsertOneMyPlan,
      })
    );
  }
);
