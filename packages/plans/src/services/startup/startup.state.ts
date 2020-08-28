import { createSlice } from '@reduxjs/toolkit';

export const REDUCER_KEY = 'startup' as const;

type StartupState = {
  initStarted: boolean;
  initCompleted: boolean;
};

const initialState: StartupState = {
  initStarted: false,
  initCompleted: false,
};

const startupSlice = createSlice({
  name: 'PLANS/startup',
  initialState,
  reducers: {
    initStarted: (state) => {
      state.initStarted = true;
    },
    initFinished: (state) => {
      state.initCompleted = true;
    },
  },
});

export const { initFinished, initStarted } = startupSlice.actions;

export default startupSlice.reducer;
