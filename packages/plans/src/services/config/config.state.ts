import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Config } from './config.service';

export const REDUCER_KEY = 'config' as const;

export type ConfigState = Omit<Config, 'private_token'>;
type ConfigStateKey = keyof ConfigState;

const initialState: ConfigState = {
  my_username: '',
  sharing_token: '',
  plans_remote: '',
};

const configSlice = createSlice({
  name: 'PLANS/config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigState>) => {
      for (const prop in state) {
        state[prop as ConfigStateKey] = action.payload[prop as ConfigStateKey];
      }
      state.sharing_token = action.payload.sharing_token;
      state.plans_remote = action.payload.plans_remote;
    },
  },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
