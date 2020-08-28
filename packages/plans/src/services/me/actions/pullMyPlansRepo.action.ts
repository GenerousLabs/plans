import { createAsyncThunk } from '@reduxjs/toolkit';
import { GitParams } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { cloneOrPullRepo } from '../../git/git.service';
import { rootPathToMyPlansRepoPath } from '../me.service';

export const pullMyPlansRepo = createAsyncThunk<
  void,
  Omit<GitParams, 'dir'> & {
    rootPath: string;
    remote: string;
  },
  RootThunkApi
>(
  'PLANS/me/pullMyPlans',
  async ({ fs, http, headers, rootPath, remote }, { dispatch }) => {
    const myPlansPath = rootPathToMyPlansRepoPath(rootPath);

    // Ensure the repo exists and is up to date
    await cloneOrPullRepo({
      fs,
      http,
      headers,
      dir: myPlansPath,
      remote,
    });

    await dispatch({
      type: 'PLANS/services/me',
      payload: 'My plans repo pulled',
    });
  }
);
