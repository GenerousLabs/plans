import {
  createSlice,
  createEntityAdapter,
  combineReducers,
  createAction,
} from '@reduxjs/toolkit';
import { Plan, Message } from './plans.service';

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
  plans: plansSlice.reducer,
  messages: messagesSlice.reducer,
});

export default reducer;
