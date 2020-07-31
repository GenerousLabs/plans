import {
  combineReducers,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { REDUX_ROOT_KEY } from '../../shared.constants';
import { Repo, Plan } from '../../shared.types';
import { RootState } from '../../store';

export const REDUCER_KEY = 'me' as const;

const reposKey = 'repos' as const;
const myPlansKey = 'myPlans' as const;

const getState = (state: RootState) => state[REDUX_ROOT_KEY][REDUCER_KEY];
const getReposState = (state: RootState) => getState(state)[reposKey];
const getMyPlansState = (state: RootState) => getState(state)[myPlansKey];

const reposAdapter = createEntityAdapter<Repo>();
const myPlansAdapter = createEntityAdapter<Plan>();

const reposSlice = createSlice({
  name: 'PLANS/me/repos',
  initialState: reposAdapter.getInitialState(),
  reducers: {
    addManyRepos: reposAdapter.addMany,
    updateOneRepo: reposAdapter.updateOne,
  },
});

const myPlansSlice = createSlice({
  name: 'PLANS/me/myPlans',
  initialState: myPlansAdapter.getInitialState(),
  reducers: {
    upsertOneMyPlan: myPlansAdapter.upsertOne,
  },
});

export const { addManyRepos, updateOneRepo } = reposSlice.actions;
export const { upsertOneMyPlan } = myPlansSlice.actions;

// Wrap the repos slice in a parent reducer so we can choose to store more state
// at the me level if we want to
const reducer = combineReducers({
  [reposKey]: reposSlice.reducer,
  [myPlansKey]: myPlansSlice.reducer,
});

export default reducer;

const reposSelectors = reposAdapter.getSelectors();

export const selectAllRepos = (state: RootState) =>
  reposSelectors.selectAll(getReposState(state));
export const selectRepoById = (state: RootState, id: string) =>
  reposSelectors.selectById(getReposState(state), id);
export const selectRepoByIdOrThrow = (state: RootState, id: string) => {
  const repo = selectRepoById(state, id);
  if (typeof repo === 'undefined') {
    throw new Error('Failed to find repo. #JjSJfP');
  }
  return repo;
};

const myPlansSelectors = myPlansAdapter.getSelectors();

export const selectAllMyPlans = (state: RootState) =>
  myPlansSelectors.selectAll(getMyPlansState(state));
export const selectMyPlanById = (state: RootState, id: string) =>
  myPlansSelectors.selectById(getMyPlansState(state), id);
export const selectMyPlanByIdOrThrow = (state: RootState, id: string) => {
  const plan = selectMyPlanById(state, id);
  if (typeof plan === 'undefined') {
    throw new Error('Failed to find my plan #9Jyb5m');
  }
  return plan;
};
