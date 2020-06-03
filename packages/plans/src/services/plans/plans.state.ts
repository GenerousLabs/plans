import {
  combineReducers,
  createAction,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { REDUX_ROOT_KEY } from '../../constants';
import { Plan, PlanFolder } from '../../shared.types';
import { RootState } from '../../store';
import { Message } from './services/messages/messages.service';

export const REDUCER_KEY = 'plans' as const;

const getState = (state: RootState) => state[REDUX_ROOT_KEY][REDUCER_KEY];

const foldersAdapter = createEntityAdapter<PlanFolder>();

const foldersSlice = createSlice({
  name: 'PLANS/plans/folders',
  initialState: foldersAdapter.getInitialState(),
  reducers: {
    upsertOneFolder: foldersAdapter.upsertOne,
    upsertManyFolders: foldersAdapter.upsertMany,
    removeOneFolder: foldersAdapter.removeOne,
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

const messagesAdapter = createEntityAdapter<Message>();

const messagesSlice = createSlice({
  name: 'PLANS/plans/messages',
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    upsertOneMessage: messagesAdapter.upsertOne,
    upsertManyMessages: messagesAdapter.upsertMany,
    removeOneMessage: messagesAdapter.removeOne,
  },
});

export const {
  upsertOnePlan,
  upsertManyPlans,
  removeOnePlan,
} = plansSlice.actions;
export const {
  upsertOneMessage,
  upsertManyMessages,
  removeOneMessage,
} = messagesSlice.actions;
export const {
  upsertOneFolder,
  upsertManyFolders,
  removeOneFolder,
} = foldersSlice.actions;

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
  folders: foldersSlice.reducer,
  plans: plansSlice.reducer,
  messages: messagesSlice.reducer,
});

export default reducer;

const plansSelectors = plansAdapter.getSelectors();
const messagesSelectors = messagesAdapter.getSelectors();

export const selectAllPlans = (state: RootState) =>
  plansSelectors.selectAll(getState(state).plans);
export const selectPlanById = (state: RootState, id: string) =>
  plansSelectors.selectById(getState(state).plans, id);
export const selectAllMessages = (state: RootState) =>
  messagesSelectors.selectAll(getState(state).messages);
export const selectMessagesById = (state: RootState, id: string) =>
  messagesSelectors.selectById(getState(state).messages, id);
export const selectMessagesByPlanId = (state: RootState, planId: string) =>
  messagesSelectors
    .selectAll(getState(state).messages)
    .filter(message => message.planId === planId);
