import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Plan } from './plans.service';

type PlansState = {
  plans: {
    [slug: string]: Plan;
  };
};

const initialState: PlansState = {
  plans: {},
};

const plansSlice = createSlice({
  name: 'PLANS/plans',
  initialState,
  reducers: {
    remove: (state, action: PayloadAction<{ slug: string }>) => {
      delete state.plans[action.payload.slug];
    },
    upsert: (state, action: PayloadAction<{ plan: Plan }>) => {
      state.plans[action.payload.plan.slug] = action.payload.plan;
    },
  },
});

const { reducer, actions } = plansSlice;

export const { remove, upsert } = actions;
export default reducer;
