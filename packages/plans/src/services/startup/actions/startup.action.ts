import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import { join } from 'path';
import { CONFIG_FILENAME, ME_REPO_FOLDER } from '../../../shared.constants';
import { GitParams } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { loadConfig } from '../../config/actions/loadConfig.action';
import { loadMyPlans } from '../../me/actions/loadMyPlans.action';
import { loadRepos } from '../../me/actions/loadRepos.action';
import { pullMeRepo } from '../../me/actions/pullMeRepo.action';
import { pullMyPlansRepo } from '../../me/actions/pullMyPlansRepo.action';
import { RootConfig } from '../startup.service';
import { initFinished, initStarted } from '../startup.state';

export const startup = createAsyncThunk<
  void,
  Omit<GitParams, 'dir' | 'headers'> & {
    rootConfig: RootConfig;
  },
  RootThunkApi
>('PLANS/startup', async ({ fs, http, rootConfig }, { dispatch }) => {
  const { path: rootPath, meRepoRemote, meRepoHeaders: headers } = rootConfig;

  await dispatch(initStarted());

  await dispatch(
    pullMeRepo({
      fs,
      http,
      headers,
      rootPath,
      meRepoRemote,
    })
  );

  const configFilePath = join(rootPath, ME_REPO_FOLDER, CONFIG_FILENAME);

  const result = await dispatch(loadConfig({ fs, configFilePath }));

  // NOTE: `unwrapResult()` will throw if `loadConfig()` resolved with an
  // error. This means the execution will stop at this point if loading config
  // failed. This is what we want.
  const { plans_remote } = unwrapResult(result);

  await dispatch(
    pullMyPlansRepo({
      fs,
      http,
      headers,
      rootPath,
      remote: plans_remote,
    })
  );

  await dispatch(loadMyPlans({ fs, rootPath }));

  await dispatch(loadRepos({ fs, http, headers, rootPath }));

  await dispatch(initFinished());
});
