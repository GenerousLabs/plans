import { createAsyncThunk } from '@reduxjs/toolkit';
import { FS } from '../../../shared.types';
import { getPackageState, RootThunkApi } from '../../../store';
import { readConfigFromFile } from '../config.service';
import { ConfigState, setConfig } from '../config.state';

export const loadConfig = createAsyncThunk<
  ConfigState,
  { fs: FS; configFilePath: string },
  RootThunkApi
>(
  'PLANS/config/loadConfig',
  async ({ fs, configFilePath }, { dispatch, getState }) => {
    const config = await readConfigFromFile({ fs, configFilePath });

    await dispatch(setConfig(config));

    return getPackageState(getState()).config;
  }
);
