import {
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { REDUX_ROOT_KEY } from '../../shared.constants';
import { Repo } from '../../shared.types';
import { RootState } from '../../store';

export const REDUCER_KEY = 'repos' as const;

const getState = (state: RootState) => state[REDUX_ROOT_KEY][REDUCER_KEY];

const reposAdapter = createEntityAdapter<Repo>();

const reposSlice = createSlice({
  name: 'PLANS/repos',
  initialState: reposAdapter.getInitialState(),
  reducers: {
    upsertOne: reposAdapter.upsertOne,
    updateOne: reposAdapter.updateOne,
    removeOne: reposAdapter.removeOne,
  },
});

export const { upsertOne, updateOne, removeOne } = reposSlice.actions;

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
export const selectById = (state: RootState, id: string) =>
  reposSelectors.selectById(getState(state), id);
export const selectByIdOrThrow = (state: RootState, id: string) => {
  const repo = selectById(state, id);
  if (typeof repo === 'undefined') {
    throw new Error('Failed to find repo. #JjSJfP');
  }
  return repo;
};
