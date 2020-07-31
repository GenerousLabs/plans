import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import {
  reducer as plansReducer,
  REDUX_ROOT_KEY as plansKey,
  startup,
  LightningFS,
  http,
} from "plans";

const fs = new LightningFS("domd", { wipe: false });

export const store = configureStore({
  reducer: {
    [plansKey]: plansReducer,
  },
});

const start = async () => {
  try {
    // await fs.promises.mkdir("/p", { recursive: true });

    store.dispatch(
      startup({
        fs,
        http,
        rootConfig: {
          meRepoRemote: "http://localhost:8174/me.git",
          path: "/p",
        },
      })
    );
  } catch (error) {
    console.error("Error during plans startup #wCZVo0", error);
  }
};
start();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
