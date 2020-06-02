import { createSlice } from '@reduxjs/toolkit';

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
    initStarted: state => {
      state.initStarted = true;
    },
    initFinished: state => {
      state.initCompleted = true;
    },
  },
});

export const { initFinished, initStarted } = startupSlice.actions;

export default startupSlice.reducer;
