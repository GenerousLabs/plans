import {
  combineReducers,
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
  name: 'PLANS/me/repos',
  initialState: reposAdapter.getInitialState(),
  reducers: {
    addManyRepos: reposAdapter.addMany,
    updateOneRepo: reposAdapter.updateOne,
  },
});

export const { addManyRepos, updateOneRepo } = reposSlice.actions;

// Wrap the repos slice in a parent reducer so we can choose to store more state
// at the me level if we want to
const reducer = combineReducers({
  repos: reposSlice.reducer,
});

export default reducer;

const reposSelectors = reposAdapter.getSelectors();

export const selectAllRepos = (state: RootState) =>
  reposSelectors.selectAll(getState(state));
export const selectRepoById = (state: RootState, id: string) =>
  reposSelectors.selectById(getState(state), id);
export const selectRepoByIdOrThrow = (state: RootState, id: string) => {
  const repo = selectRepoById(state, id);
  if (typeof repo === 'undefined') {
    throw new Error('Failed to find repo. #JjSJfP');
  }
  return repo;
};
