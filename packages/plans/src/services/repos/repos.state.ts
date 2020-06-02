import {
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { getLocalState, RootState } from '../../store';

export const REDUCER_KEY = 'repos' as const;

const getState = (state: RootState) => getLocalState(state)[REDUCER_KEY];

type Repo = {
  id: string;
  path: string;
  lastFetchTimestampSeconds: number;
  currentHeadCommitHash: string;
  connectionName: string;
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

const reposSelectors = reposAdapter.getSelectors();

export const selectAll = (state: RootState) =>
  reposSelectors.selectAll(getState(state));
