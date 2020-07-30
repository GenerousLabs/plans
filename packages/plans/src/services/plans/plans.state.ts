import {
  combineReducers,
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { REDUX_ROOT_KEY } from '../../shared.constants';
import { Plan, User } from '../../shared.types';
import { RootState } from '../../store';

export const REDUCER_KEY = 'plans' as const;

const getState = (state: RootState) => state[REDUX_ROOT_KEY][REDUCER_KEY];

const usersAdapter = createEntityAdapter<User>();

const usersSlice = createSlice({
  name: 'PLANS/plans/users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    addOneUser: usersAdapter.addOne,
    addManyUsers: usersAdapter.addMany,
  },
});

const plansAdapter = createEntityAdapter<Plan>();

const plansSlice = createSlice({
  name: 'PLANS/plans/plans',
  initialState: plansAdapter.getInitialState(),
  reducers: {
    upsertOnePlan: plansAdapter.upsertOne,
    upsertManyPlans: plansAdapter.upsertMany,
    removeOnePlan: plansAdapter.removeOne,
  },
});

export const {
  upsertOnePlan,
  upsertManyPlans,
  removeOnePlan,
} = plansSlice.actions;
export const { addManyUsers, addOneUser } = usersSlice.actions;

export const noop = createAction(
  'PLANS/plans/noop',
  ({
    code,
    message,
    params,
  }: {
    code: string;
    message?: string;
    params: any;
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

const reducer = combineReducers({
  users: usersSlice.reducer,
  plans: plansSlice.reducer,
});

export default reducer;

const foldersSelectors = usersAdapter.getSelectors();
const plansSelectors = plansAdapter.getSelectors();

export const selectAllUsers = (state: RootState) =>
  foldersSelectors.selectAll(getState(state).users);
export const selectUserById = (state: RootState, id: string) =>
  foldersSelectors.selectById(getState(state).users, id);
export const selectUserByIdOrThrow = (state: RootState, id: string) => {
  const folder = foldersSelectors.selectById(getState(state).users, id);
  if (typeof folder === 'undefined') {
    throw new Error('Failed to find user #d4q7YM');
  }
  return folder;
};

export const selectAllPlans = (state: RootState) =>
  plansSelectors.selectAll(getState(state).plans);
export const selectPlanById = (state: RootState, id: string) =>
  plansSelectors.selectById(getState(state).plans, id);
