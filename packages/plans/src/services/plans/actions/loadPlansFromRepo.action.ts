import { createAsyncThunk } from '@reduxjs/toolkit';
import Bluebird from 'bluebird';
import { FS, Repo } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import {
  addPlansFolderToPath,
  getChildDirectoriesFromPath,
} from '../plans.service';
import { addOneUser, noop, upsertOnePlan } from '../plans.state';
import { loadPlansFromFolder } from './loadPlansFromFolder.action';

export const loadPlansFromRepo = createAsyncThunk<
  void,
  {
    fs: FS;
    repo: Pick<Repo, 'id' | 'path'>;
  },
  RootThunkApi
>('PLANS/plans/loadPlansFromRepo', async ({ fs, repo }, { dispatch }) => {
  const { id: repoId, path } = repo;

  dispatch(
    noop({
      code: '#wi9aR7',
      message: 'loadPlansFromRepo called',
      params: { repoId, path },
    })
  );

  const plansPath = addPlansFolderToPath({ path });

  const userFolders = await getChildDirectoriesFromPath({
    fs,
    path: plansPath,
  });

  await Bluebird.each(userFolders, async userFolder => {
    const { slug, path } = userFolder;

    // TODO Load user data from index file here
    const userId = path;

    await dispatch(
      addOneUser({
        id: userId,
        repoId,
        name: 'Name Coming Soon',
        slug,
        description: 'Will be loaded soon',
        path,
      })
    );

    await dispatch(
      loadPlansFromFolder({ fs, path, userId, upsertPlan: upsertOnePlan })
    );
  });

  dispatch(
    noop({
      code: '#i0W2Yp',
      message: 'loadUserPlansAction finished',
      params: {
        repoId,
        path,
        plansPath,
        userFolders,
      },
    })
  );
});
