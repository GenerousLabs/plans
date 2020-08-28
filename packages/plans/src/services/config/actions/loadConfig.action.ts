import { createAsyncThunk } from '@reduxjs/toolkit';
import { FS } from '../../../shared.types';
import { RootThunkApi } from '../../../store';
import { readConfigFromFile } from '../config.service';
import { setConfig } from '../config.state';

export const loadConfig = createAsyncThunk<
  { plans_remote: string },
  { fs: FS; configFilePath: string },
  RootThunkApi
>(
  'PLANS/config/loadConfig',
  async ({ fs, configFilePath }, { dispatch, getState }) => {
    const config = await readConfigFromFile({ fs, configFilePath });

    await dispatch(setConfig(config));

    const plans_remote = getState().__plans.config.plans_remote;

    return { plans_remote };
  }
);
