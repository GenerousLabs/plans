import {
  createSlice,
  createEntityAdapter,
  createAction,
} from '@reduxjs/toolkit';

type Repo = {
  id: string;
  path: string;
  lastFetchTimestampSeconds: number;
  currentHeadCommitHash: string;
};

const reposAdapter = createEntityAdapter<Repo>();

const reposSlice = createSlice({
  name: 'PLANS/repos',
  initialState: reposAdapter.getInitialState(),
  reducers: {
    upsertOne: reposAdapter.upsertOne,
    removeOne: reposAdapter.removeOne,
  },
});

export const { upsertOne, removeOne } = reposSlice.actions;

export default reposSlice.reducer;

export const noop = createAction(
  'PLANS/repos/noop',
  ({
    code,
    message,
    params,
  }: {
    code: string;
    message?: string;
    params?: any;
  }) => {
    return {
      payload: {
        code,
        message,
        params,
      },
    };
  }
);
