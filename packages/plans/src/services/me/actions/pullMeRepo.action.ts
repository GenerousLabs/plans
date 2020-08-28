import { createAsyncThunk } from '@reduxjs/toolkit';
import { GitParams } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { cloneOrPullRepo } from '../../git/git.service';
import { rootPathToMeRepoPath } from '../me.service';

export const pullMeRepo = createAsyncThunk<
  void,
  Omit<GitParams, 'dir'> & {
    rootPath: string;
    meRepoRemote: string;
  },
  RootThunkApi
>(
  'PLANS/me/pullMeRepo',
  async ({ fs, http, headers, rootPath, meRepoRemote }, { dispatch }) => {
    // Ensure the repo exists and is up to date
    await cloneOrPullRepo({
      fs,
      http,
      headers,
      dir: rootPathToMeRepoPath(rootPath),
      remote: meRepoRemote,
    });

    await dispatch({ type: 'PLANS/services/me', payload: 'Me repo pulled' });
  }
);
