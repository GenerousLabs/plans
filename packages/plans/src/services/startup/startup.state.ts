import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { REDUX_ROOT_KEY } from '../../constants';

export const REDUCER_KEY = 'startup' as const;

type StartupState = {
  initStarted: boolean;
  initCompleted: boolean;
  myUsername?: string;
};

const initialState: StartupState = {
  initStarted: false,
  initCompleted: false,
  myUsername: 'alice',
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
    setUsername: (state, action: PayloadAction<string>) => {
      state.myUsername = action.payload;
    },
  },
});

export const { initFinished, initStarted } = startupSlice.actions;

export default startupSlice.reducer;

export const getMyUsername = (state: RootState) =>
  state[REDUX_ROOT_KEY][REDUCER_KEY].myUsername;
export const getMyUsernameOrThrow = (state: RootState) => {
  const myUsername = getMyUsername(state);
  if (typeof myUsername !== 'string') {
    throw new Error('Failed to get my username. #4Qv0OI');
  }
  return myUsername;
};
