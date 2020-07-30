import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { reducer as plansReducer, REDUX_ROOT_KEY as plansKey } from "plans";
import counterReducer from "./features/counter/counterSlice";

export const store = configureStore({
  reducer: {
    [plansKey]: plansReducer,
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
