import { createSlice } from '@reduxjs/toolkit';
import { AppThunk } from '../../store';

// const config = {
//   rootRepoUrl: window.localStorage.getItem("rootRepoUrl") || "",
//   rootRepoUser: window.localStorage.getItem("rootRepoUser") || "",
//   rootRepoPass: window.localStorage.getItem("rootRepoPass") || "",
// };

type StorageState = {
  empty: boolean;
  initStarted: boolean;
  initFinished: boolean;
};

const initialState: StorageState = {
  empty: true,
  initStarted: false,
  initFinished: false,
};

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    initStart: state => {
      state.initStarted = true;
    },
    initFinish: state => {
      state.initFinished = true;
    },
  },
});

export const { initStart, initFinish } = storageSlice.actions;

export const init = (): AppThunk => async dispatch => {
  dispatch(initStart());

  // await git.clone()
  // await git.pull()

  dispatch(initFinish());
};

export default storageSlice.reducer;
