import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const REDUCER_KEY = 'config' as const;

type ConfigState = {
  sharing_token: string;
  plans_remote: string;
};

const initialState: ConfigState = {
  sharing_token: '',
  plans_remote: '',
};

const configSlice = createSlice({
  name: 'PLANS/config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigState>) => {
      state.sharing_token = action.payload.sharing_token;
      state.plans_remote = action.payload.plans_remote;
    },
  },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
