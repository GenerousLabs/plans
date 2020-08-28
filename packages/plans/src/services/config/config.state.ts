import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const REDUCER_KEY = 'config' as const;

type ConfigState = {
  sharing_key: string;
  my_plans_remote: string;
};

const initialState: ConfigState = {
  sharing_key: '',
  my_plans_remote: '',
};

const configSlice = createSlice({
  name: 'PLANS/config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigState>) => {
      state.my_plans_remote = action.payload.my_plans_remote;
      state.sharing_key = action.payload.sharing_key;
    },
  },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
